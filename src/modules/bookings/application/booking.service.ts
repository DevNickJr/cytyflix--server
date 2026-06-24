import crypto from "crypto";
import { Booking, PaymentStatus, BookingStatus } from "../domain/booking";
import { BookingRepository } from "../contracts/booking.interfaces";
import { CreateBookingDTO } from "../contracts/booking.schemas";
import { UserRepository, RolesEnum } from "@/modules/users/contracts/user.interfaces";
import { NotificationService } from "@/modules/notifications/application/notification.service";
import { initializeTransaction, verifyWebhookSignature } from "@/infrastructure/payments/paystack";
import CustomError from "@/shared/utils/custom-error";

const BOOKING_AMOUNT = 5000; // NGN 5,000 per booking

export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationService: NotificationService,
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
      dto.propertyId,
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
      throw new CustomError("Invalid webhook signature", 400);
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const booking = await this.bookingRepo.findByPaymentReference(reference);
      if (!booking) return;

      booking.paymentStatus = PaymentStatus.PAID;
      booking.bookingStatus = BookingStatus.CONFIRMED;
      await this.bookingRepo.update(booking);

      await this.notificationService.createNotification({
        userId: booking.clientId,
        type: "system",
        title: "Booking Confirmed",
        message: "Your payment was successful. Your booking has been confirmed.",
        metadata: { bookingId: booking.id },
      });

      await this.notificationService.createNotification({
        userId: booking.agentId,
        type: "system",
        title: "New Booking",
        message: "You have a new booking from a client.",
        metadata: { bookingId: booking.id },
      });
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
      booking.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
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
    return this.bookingRepo.update(booking);
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
      booking.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      await this.bookingRepo.update(booking);
    }
    return { processed: expired.length };
  }
}
