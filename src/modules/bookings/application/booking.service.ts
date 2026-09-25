import crypto from 'crypto';
import { Booking, PaymentStatus, BookingStatus } from '../domain/booking';
import { BookingRepository } from '../contracts/booking.interfaces';
import {
  CreateBookingDTO,
  UpdateBookingScheduleDTO,
} from '../contracts/booking.schemas';
import {
  UserRepository,
  RolesEnum,
} from '@/modules/users/contracts/user.interfaces';
import { WalletService } from '@/modules/wallets/application/wallet.service';
import {
  initializeTransaction,
  verifyWebhookSignature,
} from '@/infrastructure/payments/paystack';
import { rabbitMQ } from '@/infrastructure/messaging/rabbitmq';
import { publishEvent } from '@/infrastructure/messaging/event-bus';
import {
  BOOKING_CANCELLED,
  BOOKING_PAYMENT_RECEIVED,
  BOOKING_AGENT_CONFIRMED,
  BOOKING_CLIENT_RELEASED,
  BOOKING_SCHEDULE_UPDATED,
  BookingCancelledPayload,
  BookingPaymentReceivedPayload,
  BookingAgentConfirmedPayload,
  BookingClientReleasedPayload,
  BookingScheduleUpdatedPayload,
} from '@/infrastructure/messaging/events';
import { notificationService } from '@/modules/notifications/notification.module';
import { sendEmail } from '@/infrastructure/email';
import {
  bookingPaymentReceivedClientEmail,
  bookingPaymentReceivedAgentEmail,
  bookingAgentConfirmedEmail,
  bookingScheduleUpdatedEmail,
  bookingClientReleasedEmail,
  bookingCancelledEmail,
} from '@/infrastructure/email/templates';
import CustomError from '@/shared/utils/custom-error';

const BOOKING_AMOUNT = 5000; // NGN 5,000 per booking

export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly userRepo: UserRepository,
    private readonly walletService: WalletService
  ) {}

  private async getParticipantNames(clientId: string, agentId: string) {
    const client = await this.userRepo.findById(clientId);
    const agent = await this.userRepo.findById(agentId);
    const clientName = client?.profile
      ? `${client.profile.firstName} ${client.profile.lastName}`.trim()
      : 'Client';
    const agentName = agent?.profile
      ? `${agent.profile.firstName} ${agent.profile.lastName}`.trim()
      : 'Agent';
    return { client, agent, clientName, agentName };
  }

  async createBooking(clientId: string, dto: CreateBookingDTO) {
    const agent = await this.userRepo.findById(dto.agentId);
    if (!agent) throw new CustomError('Agent not found', 404);
    if (agent.role !== RolesEnum.AGENT)
      throw new CustomError('User is not a verified agent', 400);

    if (clientId === dto.agentId) {
      throw new CustomError('You cannot book yourself', 400);
    }

    const client = await this.userRepo.findById(clientId);
    if (!client) throw new CustomError('Client not found', 404);

    const reference = `BKG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const booking = new Booking(
      crypto.randomUUID(),
      clientId,
      dto.agentId,
      dto.propertyId === 'any' || !dto.propertyId ? null : dto.propertyId,
      BOOKING_AMOUNT,
      reference,
      PaymentStatus.PENDING,
      BookingStatus.PENDING,
      false,
      false,
      new Date(dto.scheduledDate),
      dto.scheduledTime,
      dto.notes
    );
    const saved = await this.bookingRepo.create(booking);

    const paymentData = await initializeTransaction(
      client.email,
      BOOKING_AMOUNT,
      reference,
      { bookingId: saved.id, clientId, agentId: dto.agentId, type: 'BOOKING' }
    );

    return {
      booking: saved,
      authorization_url: paymentData.authorization_url,
      reference: paymentData.reference,
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.log('Invalid webhook signature. Webhook allowed for testing.', {
        rawBody,
        signature,
      });
      throw new CustomError('Invalid webhook signature', 400);
    }

    const event = JSON.parse(rawBody);

    console.log({
      events: event.event,
      reference: event.data.reference,
      amount: event.data.amount,
      status: event.data.status,
    });
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const booking = await this.bookingRepo.findByPaymentReference(reference);
      if (!booking) {
        console.error('Booking not found for reference:', reference);
        return;
      }

      if (booking.paymentStatus === PaymentStatus.PAID) {
        console.log('Booking already marked as paid:', booking.id);
        return;
      }

      booking.paymentStatus = PaymentStatus.PAID;
      booking.bookingStatus = BookingStatus.AWAITING_AGENT_CONFIRMATION;
      await this.bookingRepo.update(booking);

      const { client, agent, clientName, agentName } =
        await this.getParticipantNames(booking.clientId, booking.agentId);

      const payload: BookingPaymentReceivedPayload = {
        bookingId: booking.id,
        clientId: booking.clientId,
        clientName,
        clientEmail: client?.email || '',
        agentId: booking.agentId,
        agentName,
        agentEmail: agent?.email || '',
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        bookingReference: booking.paymentReference,
      };

      if (rabbitMQ.isConnected()) {
        publishEvent('booking.payment_received', {
          type: BOOKING_PAYMENT_RECEIVED,
          payload: payload as unknown as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        });
      } else {
        await notificationService.createNotification({
          userId: booking.clientId,
          type: 'system',
          title: 'Payment Received',
          message:
            'Your payment was successful. Waiting for agent to confirm the booking.',
          metadata: { bookingId: booking.id },
        });
        await notificationService.createNotification({
          userId: booking.agentId,
          type: 'system',
          title: 'New Booking — Action Required',
          message: `${clientName} has paid for a booking with you. Please confirm or cancel.`,
          metadata: { bookingId: booking.id },
        });

        try {
          const clientTemplate = bookingPaymentReceivedClientEmail({
            bookingId: booking.id,
            clientName,
            agentName,
            scheduledDate: booking.scheduledDate,
            scheduledTime: booking.scheduledTime,
            bookingReference: booking.paymentReference,
          });
          await sendEmail({ to: client?.email || '', ...clientTemplate });

          const agentTemplate = bookingPaymentReceivedAgentEmail({
            agentName,
            clientName,
            clientEmail: client?.email || '',
            scheduledDate: booking.scheduledDate,
            scheduledTime: booking.scheduledTime,
            bookingReference: booking.paymentReference,
          });
          await sendEmail({ to: agent?.email || '', ...agentTemplate });
        } catch (emailError) {
          console.error('Fallback email send failed:', emailError);
        }
      }
    }
  }

  async agentConfirm(bookingId: string, agentUserId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.agentId !== agentUserId) {
      throw new CustomError(
        'Only the assigned agent can confirm this booking',
        403
      );
    }

    if (booking.bookingStatus !== BookingStatus.AWAITING_AGENT_CONFIRMATION) {
      throw new CustomError('Booking is not awaiting agent confirmation', 400);
    }

    booking.bookingStatus = BookingStatus.CONFIRMED;
    booking.agentConfirmed = true;
    const updated = await this.bookingRepo.update(booking);

    const { client, agent, clientName, agentName } =
      await this.getParticipantNames(booking.clientId, booking.agentId);

    const payload: BookingAgentConfirmedPayload = {
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName,
      clientEmail: client?.email || '',
      agentId: booking.agentId,
      agentName,
      agentEmail: agent?.email || '',
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      bookingReference: booking.paymentReference,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent('booking.agent_confirmed', {
        type: BOOKING_AGENT_CONFIRMED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: booking.clientId,
        type: 'system',
        title: 'Booking Confirmed',
        message: `${agentName} has confirmed your booking. You're all set for the inspection!`,
        metadata: { bookingId: booking.id },
      });

      try {
        const template = bookingAgentConfirmedEmail({
          bookingId: booking.id,
          clientName,
          agentName,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
          bookingReference: booking.paymentReference,
        });
        await sendEmail({ to: client?.email || '', ...template });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }

    return updated;
  }

  async clientRelease(bookingId: string, clientUserId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== clientUserId) {
      throw new CustomError('Only the client can release payment', 403);
    }

    if (
      booking.bookingStatus !== BookingStatus.CONFIRMED &&
      booking.bookingStatus !== BookingStatus.AWAITING_AGENT_CONFIRMATION
    ) {
      throw new CustomError('Booking is not in a releasable state', 400);
    }

    if (booking.paymentStatus !== PaymentStatus.PAID) {
      throw new CustomError('Payment has not been made for this booking', 400);
    }

    booking.bookingStatus = BookingStatus.COMPLETED;
    booking.clientConfirmed = true;
    const updated = await this.bookingRepo.update(booking);

    await this.walletService.creditWallet(
      booking.agentId,
      booking.amount,
      `BKG-CREDIT-${booking.id}`,
      `Booking payment from client`,
      { bookingId: booking.id, clientId: booking.clientId }
    );

    const { client, agent, clientName, agentName } =
      await this.getParticipantNames(booking.clientId, booking.agentId);

    const payload: BookingClientReleasedPayload = {
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName,
      clientEmail: client?.email || '',
      agentId: booking.agentId,
      agentName,
      agentEmail: agent?.email || '',
      amount: booking.amount,
      bookingReference: booking.paymentReference,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent('booking.client_released', {
        type: BOOKING_CLIENT_RELEASED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: booking.agentId,
        type: 'system',
        title: 'Payment Released',
        message: `${clientName} has released the payment. NGN ${booking.amount.toLocaleString()} has been credited to your wallet.`,
        metadata: { bookingId: booking.id },
      });

      try {
        const template = bookingClientReleasedEmail({
          agentName,
          clientName,
          amount: booking.amount,
          bookingReference: booking.paymentReference,
        });
        await sendEmail({ to: agent?.email || '', ...template });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }

    return updated;
  }

  async updateSchedule(
    bookingId: string,
    clientUserId: string,
    dto: UpdateBookingScheduleDTO
  ) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== clientUserId) {
      throw new CustomError('Only the client can update the schedule', 403);
    }

    if (booking.bookingStatus !== BookingStatus.AWAITING_AGENT_CONFIRMATION) {
      throw new CustomError(
        'Schedule can only be updated before agent confirms',
        400
      );
    }

    if (dto.scheduledDate) booking.scheduledDate = new Date(dto.scheduledDate);
    if (dto.scheduledTime) booking.scheduledTime = dto.scheduledTime;
    const updated = await this.bookingRepo.update(booking);

    const { client, agent, clientName, agentName } =
      await this.getParticipantNames(booking.clientId, booking.agentId);

    const payload: BookingScheduleUpdatedPayload = {
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName,
      clientEmail: client?.email || '',
      agentId: booking.agentId,
      agentName,
      agentEmail: agent?.email || '',
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      bookingReference: booking.paymentReference,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent('booking.schedule_updated', {
        type: BOOKING_SCHEDULE_UPDATED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      await notificationService.createNotification({
        userId: booking.agentId,
        type: 'system',
        title: 'Booking Schedule Updated',
        message: `${clientName} has updated the schedule for booking ${booking.paymentReference}.`,
        metadata: { bookingId: booking.id },
      });

      try {
        const template = bookingScheduleUpdatedEmail({
          agentName,
          clientName,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
          bookingReference: booking.paymentReference,
        });
        await sendEmail({ to: agent?.email || '', ...template });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }

    return updated;
  }

  async rejectBooking(bookingId: string, clientUserId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== clientUserId) {
      throw new CustomError('Only the client can reject this booking', 403);
    }

    if (
      booking.bookingStatus !== BookingStatus.CONFIRMED &&
      booking.bookingStatus !== BookingStatus.AWAITING_AGENT_CONFIRMATION
    ) {
      throw new CustomError(
        'Booking cannot be rejected in its current state',
        400
      );
    }

    booking.bookingStatus = BookingStatus.DISPUTED;
    return this.bookingRepo.update(booking);
  }

  // TODO: Refund logic for cancelled bookings
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError('You are not a participant of this booking', 403);
    }

    if (booking.bookingStatus === BookingStatus.COMPLETED) {
      throw new CustomError('Cannot cancel a completed booking', 400);
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new CustomError('Booking is already cancelled', 400);
    }

    if (
      booking.bookingStatus === BookingStatus.CONFIRMED &&
      userId === booking.clientId
    ) {
      throw new CustomError(
        'Cannot cancel after agent has confirmed. You can release payment or raise a dispute instead.',
        400
      );
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    const updated = await this.bookingRepo.update(booking);

    const { client, agent, clientName, agentName } =
      await this.getParticipantNames(booking.clientId, booking.agentId);

    const payload: BookingCancelledPayload = {
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName,
      clientEmail: client?.email || '',
      agentId: booking.agentId,
      agentName,
      agentEmail: agent?.email || '',
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      bookingReference: booking.paymentReference,
      cancelledBy: userId,
    };

    if (rabbitMQ.isConnected()) {
      publishEvent('booking.cancelled', {
        type: BOOKING_CANCELLED,
        payload: payload as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
      });
    } else {
      const otherPartyId =
        userId === booking.clientId ? booking.agentId : booking.clientId;
      const cancellerName =
        userId === booking.clientId ? clientName : agentName;
      await notificationService.createNotification({
        userId: otherPartyId,
        type: 'system',
        title: 'Booking Cancelled',
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
        await sendEmail({ to: client?.email || '', ...clientTemplate });

        const agentTemplate = bookingCancelledEmail({
          recipientName: agentName,
          otherPartyName: clientName,
          bookingReference: booking.paymentReference,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
        });
        await sendEmail({ to: agent?.email || '', ...agentTemplate });
      } catch (emailError) {
        console.error('Fallback email send failed:', emailError);
      }
    }

    return updated;
  }

  async getMyBookings(
    userId: string,
    role: 'client' | 'agent',
    page: number,
    limit: number
  ) {
    if (role === 'agent') {
      return this.bookingRepo.findByAgentId(userId, page, limit);
    }
    return this.bookingRepo.findByClientId(userId, page, limit);
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError('You are not a participant of this booking', 403);
    }

    return booking;
  }

  async getReceiptData(bookingId: string, userId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new CustomError('Booking not found', 404);

    if (booking.clientId !== userId && booking.agentId !== userId) {
      throw new CustomError('You are not a participant of this booking', 403);
    }

    if (booking.paymentStatus !== PaymentStatus.PAID) {
      throw new CustomError('Payment has not been made for this booking', 400);
    }

    const { clientName, agentName } = await this.getParticipantNames(
      booking.clientId,
      booking.agentId
    );

    return {
      bookingReference: booking.paymentReference,
      clientName,
      agentName,
      amount: booking.amount,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      paymentDate: booking.updatedAt,
    };
  }

  async autoRelease() {
    const expired = await this.bookingRepo.findExpiredBookings();
    for (const booking of expired) {
      booking.bookingStatus = BookingStatus.COMPLETED;
      booking.clientConfirmed = true;
      await this.bookingRepo.update(booking);

      try {
        await this.walletService.creditWallet(
          booking.agentId,
          booking.amount,
          `BKG-CREDIT-${booking.id}`,
          `Booking auto-release payment`,
          {
            bookingId: booking.id,
            clientId: booking.clientId,
            autoRelease: true,
          }
        );
      } catch (error) {
        console.error(
          `Failed to credit wallet for auto-release booking ${booking.id}:`,
          error
        );
      }
    }
    return { processed: expired.length };
  }
}
