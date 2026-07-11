import crypto from "crypto";
import { RentPayment, RentPaymentStatus } from "../domain/rent-payment";
import { RentPaymentRepository } from "../contracts/rent-payment.interfaces";
import { CreateRentPaymentDTO } from "../contracts/rent-payment.schemas";
import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { WalletService } from "@/modules/wallets/application/wallet.service";
import { initializeTransaction, verifyWebhookSignature } from "@/infrastructure/payments/paystack";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { rentPaymentReceivedEmail, rentMoveInConfirmedEmail, rentReleasedEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";

export class RentPaymentService {
  constructor(
    private readonly rentPaymentRepo: RentPaymentRepository,
    private readonly userRepo: UserRepository,
    private readonly walletService: WalletService,
  ) {}

  private async getParticipantNames(tenantId: string, ownerId: string) {
    const tenant = await this.userRepo.findById(tenantId);
    const owner = await this.userRepo.findById(ownerId);
    const tenantName = tenant?.profile ? `${tenant.profile.firstName} ${tenant.profile.lastName}`.trim() : "Tenant";
    const ownerName = owner?.profile ? `${owner.profile.firstName} ${owner.profile.lastName}`.trim() : "Owner";
    return { tenant, owner, tenantName, ownerName };
  }

  async create(tenantId: string, dto: CreateRentPaymentDTO) {
    const owner = await this.userRepo.findById(dto.ownerId);
    if (!owner) throw new CustomError("Property owner not found", 404);

    if (tenantId === dto.ownerId) {
      throw new CustomError("You cannot pay rent to yourself", 400);
    }

    const tenant = await this.userRepo.findById(tenantId);
    if (!tenant) throw new CustomError("Tenant not found", 404);

    const reference = `RENT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const payment = new RentPayment(
      crypto.randomUUID(),
      dto.propertyId,
      tenantId,
      dto.ownerId,
      dto.amount,
      reference,
      "pending",
      RentPaymentStatus.PENDING,
      new Date(dto.moveInDate),
    );

    const saved = await this.rentPaymentRepo.create(payment);

    const paymentData = await initializeTransaction(
      tenant.email,
      dto.amount,
      reference,
      { rentPaymentId: saved.id, tenantId, ownerId: dto.ownerId, type: "RENT_PAYMENT" },
    );

    return {
      rentPayment: saved,
      authorization_url: paymentData.authorization_url,
      reference: paymentData.reference,
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      throw new CustomError("Invalid webhook signature", 400);
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      if (!reference.startsWith("RENT-")) return;

      const payment = await this.rentPaymentRepo.findByPaymentReference(reference);
      if (!payment) {
        console.error("Rent payment not found for reference:", reference);
        return;
      }

      if (payment.paymentStatus === "paid") return;

      payment.paymentStatus = "paid";
      payment.status = RentPaymentStatus.PAID;
      // Auto-release 3 days after move-in date
      const moveIn = new Date(payment.moveInDate);
      payment.expiresAt = new Date(moveIn.getTime() + 3 * 24 * 60 * 60 * 1000);
      await this.rentPaymentRepo.update(payment);

      const { tenant, owner, tenantName, ownerName } = await this.getParticipantNames(payment.tenantId, payment.ownerId);

      // Notify owner
      if (rabbitMQ.isConnected()) {
        publishEvent("rent.payment_received", {
          type: "rent.payment_received",
          payload: {
            rentPaymentId: payment.id,
            tenantId: payment.tenantId,
            tenantName,
            tenantEmail: tenant?.email || "",
            ownerId: payment.ownerId,
            ownerName,
            ownerEmail: owner?.email || "",
            amount: payment.amount,
            moveInDate: payment.moveInDate,
            paymentReference: payment.paymentReference,
          },
          timestamp: new Date().toISOString(),
        });
      } else {
        await notificationService.createNotification({
          userId: payment.ownerId,
          type: "system",
          title: "Rent Payment Received",
          message: `${tenantName} has paid NGN ${payment.amount.toLocaleString()} in rent. The funds are held in escrow until move-in confirmation.`,
          metadata: { rentPaymentId: payment.id },
        });
        await notificationService.createNotification({
          userId: payment.tenantId,
          type: "system",
          title: "Rent Payment Successful",
          message: `Your rent payment of NGN ${payment.amount.toLocaleString()} is in escrow. Confirm move-in after you move in.`,
          metadata: { rentPaymentId: payment.id },
        });

        try {
          const template = rentPaymentReceivedEmail({
            ownerName,
            tenantName,
            amount: payment.amount,
            moveInDate: payment.moveInDate,
            paymentReference: payment.paymentReference,
          });
          await sendEmail({ to: owner?.email || "", ...template });
        } catch (emailError) {
          console.error("Fallback email send failed:", emailError);
        }
      }
    }
  }

  async confirmMoveIn(paymentId: string, tenantId: string) {
    const payment = await this.rentPaymentRepo.findById(paymentId);
    if (!payment) throw new CustomError("Rent payment not found", 404);

    if (payment.tenantId !== tenantId) {
      throw new CustomError("Only the tenant can confirm move-in", 403);
    }

    if (payment.status !== RentPaymentStatus.PAID) {
      throw new CustomError("Payment is not in a confirmable state", 400);
    }

    payment.status = RentPaymentStatus.MOVE_IN_CONFIRMED;
    payment.tenantConfirmed = true;
    payment.confirmedAt = new Date();
    await this.rentPaymentRepo.update(payment);

    // Credit owner wallet immediately
    await this.walletService.creditWallet(
      payment.ownerId,
      payment.amount,
      `RENT-CREDIT-${payment.id}`,
      `Rent payment from tenant`,
      { rentPaymentId: payment.id, tenantId: payment.tenantId },
    );

    payment.status = RentPaymentStatus.RELEASED;
    payment.releasedAt = new Date();
    const updated = await this.rentPaymentRepo.update(payment);

    const { owner, tenantName, ownerName } = await this.getParticipantNames(payment.tenantId, payment.ownerId);

    if (rabbitMQ.isConnected()) {
      publishEvent("rent.move_in_confirmed", {
        type: "rent.move_in_confirmed",
        payload: {
          rentPaymentId: payment.id,
          tenantId: payment.tenantId,
          tenantName,
          ownerId: payment.ownerId,
          ownerName,
          ownerEmail: owner?.email || "",
          amount: payment.amount,
          paymentReference: payment.paymentReference,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: payment.ownerId,
        type: "system",
        title: "Move-In Confirmed — Payment Released",
        message: `${tenantName} confirmed move-in. NGN ${payment.amount.toLocaleString()} has been released to your wallet.`,
        metadata: { rentPaymentId: payment.id },
      });

      try {
        const template = rentMoveInConfirmedEmail({
          ownerName,
          tenantName,
          amount: payment.amount,
          paymentReference: payment.paymentReference,
        });
        await sendEmail({ to: owner?.email || "", ...template });
      } catch (emailError) {
        console.error("Fallback email send failed:", emailError);
      }
    }

    return updated;
  }

  async dispute(paymentId: string, tenantId: string) {
    const payment = await this.rentPaymentRepo.findById(paymentId);
    if (!payment) throw new CustomError("Rent payment not found", 404);

    if (payment.tenantId !== tenantId) {
      throw new CustomError("Only the tenant can dispute this payment", 403);
    }

    if (payment.status !== RentPaymentStatus.PAID) {
      throw new CustomError("Payment cannot be disputed in its current state", 400);
    }

    payment.status = RentPaymentStatus.DISPUTED;
    return this.rentPaymentRepo.update(payment);
  }

  async getMyPayments(userId: string, role: "tenant" | "owner", page: number, limit: number) {
    if (role === "owner") {
      return this.rentPaymentRepo.findByOwnerId(userId, page, limit);
    }
    return this.rentPaymentRepo.findByTenantId(userId, page, limit);
  }

  async getPayment(paymentId: string, userId: string) {
    const payment = await this.rentPaymentRepo.findById(paymentId);
    if (!payment) throw new CustomError("Rent payment not found", 404);

    if (payment.tenantId !== userId && payment.ownerId !== userId) {
      throw new CustomError("You are not a participant of this rent payment", 403);
    }

    return payment;
  }

  async autoRelease() {
    const expired = await this.rentPaymentRepo.findExpiredPayments();
    for (const payment of expired) {
      payment.status = RentPaymentStatus.RELEASED;
      payment.tenantConfirmed = true;
      payment.releasedAt = new Date();
      await this.rentPaymentRepo.update(payment);

      try {
        await this.walletService.creditWallet(
          payment.ownerId,
          payment.amount,
          `RENT-CREDIT-${payment.id}`,
          `Rent auto-release payment`,
          { rentPaymentId: payment.id, tenantId: payment.tenantId, autoRelease: true },
        );

        const { owner, tenantName, ownerName } = await this.getParticipantNames(payment.tenantId, payment.ownerId);

        await notificationService.createNotification({
          userId: payment.ownerId,
          type: "system",
          title: "Rent Payment Auto-Released",
          message: `NGN ${payment.amount.toLocaleString()} from ${tenantName} has been auto-released to your wallet.`,
          metadata: { rentPaymentId: payment.id },
        });

        try {
          const template = rentReleasedEmail({
            ownerName,
            tenantName,
            amount: payment.amount,
            paymentReference: payment.paymentReference,
          });
          await sendEmail({ to: owner?.email || "", ...template });
        } catch {}
      } catch (error) {
        console.error(`Failed to credit wallet for auto-release rent payment ${payment.id}:`, error);
      }
    }
    return { processed: expired.length };
  }
}
