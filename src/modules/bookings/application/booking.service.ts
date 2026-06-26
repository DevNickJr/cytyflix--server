import crypto from "crypto";
import { Booking, PaymentStatus, BookingStatus } from "../domain/booking";
import { BookingRepository } from "../contracts/booking.interfaces";
import { CreateBookingDTO } from "../contracts/booking.schemas";
import { UserRepository, RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { initializeTransaction, verifyWebhookSignature } from "@/infrastructure/payments/paystack";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import { BOOKING_CONFIRMED, BOOKING_CANCELLED, BookingConfirmedPayload, BookingCancelledPayload } from "@/infrastructure/messaging/events";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { bookingConfirmedClientEmail, bookingConfirmedAgentEmail, bookingCancelledEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";

const BOOKING_AMOUNT = 5000; // NGN 5,000 per booking

export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async createBooking(clientId: string, dto: CreateBookingDTO) {
    const agent = await this.userRepo.findById(dto.agentId);
    if (!agent) throw new CustomError("Agent not found", 404);
    if (agent.role !== RolesEnum.AGENT) throw new CustomError("User is not a verified agent", 400);

    if (clientId === dto.agentId) {
      throw new CustomError("You cannot book yourself", 400);
    }

    const client = await this.userRepo.findById(clientId);
    if (!client) throw new CustomError("Client not found", 404);

    const reference = `BKG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const booking = new Booking(
      crypto.randomUUID(),
      clientId,
      dto.agentId,
      (dto.propertyId === "any" || !dto.propertyId) ? null : dto.propertyId,
      BOOKING_AMOUNT,
      reference,
      PaymentStatus.PENDING,
      BookingStatus.PENDING,
      false,
      false,
      dto.scheduledDate,
      dto.scheduledTime,
      dto.notes,
    );
    const saved = await this.bookingRepo.create(booking);


    const paymentData = await initializeTransaction(
      client.email,
      BOOKING_AMOUNT,
      reference,
      { bookingId: saved.id, clientId, agentId: dto.agentId, type: 'BOOKING' },
    );

    return {
      booking: saved,
      authorization_url: paymentData.authorization_url,
      reference: paymentData.reference,
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.log("Invalid webhook signature. Webhook allowed for testing.", {
        rawBody,
        signature,
      });
      throw new CustomError("Invalid webhook signature", 400);
    }

    const event = JSON.parse(rawBody);

    console.log({
      events: event.event,
      reference: event.data.reference,
      amount: event.data.amount,
      status: event.data.status,
    })
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      console.log({
        data: event.data,
      })
      const booking = await this.bookingRepo.findByPaymentReference(reference);
      if (!booking) {
        console.error("Booking not found for reference:", reference);
        return;
      };

      booking.paymentStatus = PaymentStatus.PAID;
      booking.bookingStatus = BookingStatus.CONFIRMED;
      await this.bookingRepo.update(booking);

      // Look up client and agent for event data
      const client = await this.userRepo.findById(booking.clientId);
      const agent = await this.userRepo.findById(booking.agentId);
      const clientName = client?.profile ? `${client.profile.firstName} ${client.profile.lastName}`.trim() : "Client";
      const agentName = agent?.profile ? `${agent.profile.firstName} ${agent.profile.lastName}`.trim() : "Agent";

      const payload: BookingConfirmedPayload = {
        bookingId: booking.id,
        clientId: booking.clientId,
        clientName,
        clientEmail: client?.email || "",
        agentId: booking.agentId,
        agentName,
        agentEmail: agent?.email || "",
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        bookingReference: booking.paymentReference,
      };
      console.log("RabbitMQ connected:", rabbitMQ.isConnected());

      if (rabbitMQ.isConnected()) {
        publishEvent("booking.confirmed", {
          type: BOOKING_CONFIRMED,
          payload: payload as unknown as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Fallback: direct notification + email calls
        await notificationService.createNotification({
          userId: booking.clientId,
          type: "system",
          title: "Booking Confirmed",
          message: "Your payment was successful. Your booking has been confirmed.",
          metadata: { bookingId: booking.id },
        });
        await notificationService.createNotification({
          userId: booking.agentId,
          type: "system",
          title: "New Booking",
          message: `You have a new booking from ${clientName}.`,
          metadata: { bookingId: booking.id },
        });

        try {
          const clientTemplate = bookingConfirmedClientEmail({
            clientName,
            agentName,
            scheduledDate: booking.scheduledDate,
            scheduledTime: booking.scheduledTime,
            bookingReference: booking.paymentReference,
          });
          await sendEmail({ to: client?.email || "", ...clientTemplate });

          const agentTemplate = bookingConfirmedAgentEmail({
            agentName,
            clientName,
            clientEmail: client?.email || "",
            scheduledDate: booking.scheduledDate,
            scheduledTime: booking.scheduledTime,
            bookingReference: booking.paymentReference,
          });
          await sendEmail({ to: agent?.email || "", ...agentTemplate });
        } catch (emailError) {
          console.error("Fallback email send failed:", emailError);
        }
      }
    }
  }

  async confirmMeeting(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError("Booking not found", 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError("You are not a participant of this booking", 403);
    }

    if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
      throw new CustomError("Booking is not in confirmed status", 400);
    }

    if (userId === booking.clientId) {
      booking.clientConfirmed = true;
    } else {
      booking.agentConfirmed = true;
    }

    if (booking.clientConfirmed && booking.agentConfirmed) {
      booking.bookingStatus = BookingStatus.COMPLETED;
      booking.expiresAt = new Date(new Date(booking.scheduledDate + " " + booking.scheduledTime).getTime() + 48 * 60 * 60 * 1000);
    }

    return this.bookingRepo.update(booking);
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError("Booking not found", 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError("You are not a participant of this booking", 403);
    }

    if (booking.bookingStatus === BookingStatus.COMPLETED) {
      throw new CustomError("Cannot cancel a completed booking", 400);
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    const updated = await this.bookingRepo.update(booking);

    // Publish booking cancelled event
    const client = await this.userRepo.findById(booking.clientId);
    const agent = await this.userRepo.findById(booking.agentId);
    const clientName = client?.profile ? `${client.profile.firstName} ${client.profile.lastName}`.trim() : "Client";
    const agentName = agent?.profile ? `${agent.profile.firstName} ${agent.profile.lastName}`.trim() : "Agent";

    const payload: BookingCancelledPayload = {
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName,
      clientEmail: client?.email || "",
      agentId: booking.agentId,
      agentName,
      agentEmail: agent?.email || "",
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      bookingReference: booking.paymentReference,
      cancelledBy: userId,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent("booking.cancelled", {
        type: BOOKING_CANCELLED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Fallback: direct notifications + email
      const otherPartyId = userId === booking.clientId ? booking.agentId : booking.clientId;
      const cancellerName = userId === booking.clientId ? clientName : agentName;
      await notificationService.createNotification({
        userId: otherPartyId,
        type: "system",
        title: "Booking Cancelled",
        message: `Your booking with ${cancellerName} has been cancelled.`,
        metadata: { bookingId: booking.id },
      });

      try {
        const clientTemplate = bookingCancelledEmail({
          recipientName: clientName,
          otherPartyName: agentName,
          bookingReference: booking.paymentReference,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
        });
        await sendEmail({ to: client?.email || "", ...clientTemplate });

        const agentTemplate = bookingCancelledEmail({
          recipientName: agentName,
          otherPartyName: clientName,
          bookingReference: booking.paymentReference,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
        });
        await sendEmail({ to: agent?.email || "", ...agentTemplate });
      } catch (emailError) {
        console.error("Fallback email send failed:", emailError);
      }
    }

    return updated;
  }

  async getMyBookings(userId: string, role: "client" | "agent", page: number, limit: number) {
    if (role === "agent") {
      return this.bookingRepo.findByAgentId(userId, page, limit);
    }
    return this.bookingRepo.findByClientId(userId, page, limit);
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError("Booking not found", 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError("You are not a participant of this booking", 403);
    }

    return booking;
  }

  async autoRelease() {
    const expired = await this.bookingRepo.findExpiredBookings();
    for (const booking of expired) {
      booking.bookingStatus = BookingStatus.COMPLETED;
      booking.expiresAt = new Date(new Date(booking.scheduledDate + " " + booking.scheduledTime).getTime() + 48 * 60 * 60 * 1000);
      await this.bookingRepo.update(booking);
    }
    return { processed: expired.length };
  }
}
