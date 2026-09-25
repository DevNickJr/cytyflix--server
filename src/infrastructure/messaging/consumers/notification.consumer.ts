import { Channel, ConsumeMessage } from 'amqplib';
import { QUEUES } from '../rabbitmq';
import { DomainEvent } from '../event-bus';
import {
  BOOKING_CONFIRMED,
  BOOKING_CANCELLED,
  BOOKING_PAYMENT_RECEIVED,
  BOOKING_AGENT_CONFIRMED,
  BOOKING_CLIENT_RELEASED,
  BOOKING_SCHEDULE_UPDATED,
  INQUIRY_RECEIVED,
  INQUIRY_RESPONDED,
  VERIFICATION_APPROVED,
  VERIFICATION_REJECTED,
  PROPERTY_FROZEN,
  RENT_PAYMENT_RECEIVED,
  RENT_MOVE_IN_CONFIRMED,
  AGREEMENT_CREATED,
  AGREEMENT_SIGNED,
  BookingConfirmedPayload,
  BookingCancelledPayload,
  BookingPaymentReceivedPayload,
  BookingAgentConfirmedPayload,
  BookingClientReleasedPayload,
  BookingScheduleUpdatedPayload,
  InquiryReceivedPayload,
  InquiryRespondedPayload,
  VerificationApprovedPayload,
  VerificationRejectedPayload,
  PropertyFrozenPayload,
  RentPaymentReceivedPayload,
  RentMoveInConfirmedPayload,
  AgreementCreatedPayload,
  AgreementSignedPayload,
} from '../events';
import { notificationService } from '@/modules/notifications/notification.module';

export async function startNotificationConsumer(
  channel: Channel
): Promise<void> {
  await channel.consume(
    QUEUES.DB_NOTIFICATIONS,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const event: DomainEvent = JSON.parse(msg.content.toString());

        switch (event.type) {
          case BOOKING_CONFIRMED: {
            const payload = event.payload as unknown as BookingConfirmedPayload;
            await notificationService.createNotification({
              userId: payload.clientId,
              type: 'system',
              title: 'Booking Confirmed',
              message:
                'Your payment was successful. Your booking has been confirmed.',
              metadata: { bookingId: payload.bookingId },
            });
            await notificationService.createNotification({
              userId: payload.agentId,
              type: 'system',
              title: 'New Booking',
              message: `You have a new booking from ${payload.clientName}.`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case BOOKING_PAYMENT_RECEIVED: {
            const payload =
              event.payload as unknown as BookingPaymentReceivedPayload;
            await notificationService.createNotification({
              userId: payload.clientId,
              type: 'system',
              title: 'Payment Received',
              message:
                'Your payment was successful. Waiting for agent to confirm the booking.',
              metadata: { bookingId: payload.bookingId },
            });
            await notificationService.createNotification({
              userId: payload.agentId,
              type: 'system',
              title: 'New Booking — Action Required',
              message: `${payload.clientName} has paid for a booking with you. Please confirm or cancel.`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case BOOKING_AGENT_CONFIRMED: {
            const payload =
              event.payload as unknown as BookingAgentConfirmedPayload;
            await notificationService.createNotification({
              userId: payload.clientId,
              type: 'system',
              title: 'Booking Confirmed by Agent',
              message: `${payload.agentName} has confirmed your booking. You're all set for the inspection!`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case BOOKING_CLIENT_RELEASED: {
            const payload =
              event.payload as unknown as BookingClientReleasedPayload;
            await notificationService.createNotification({
              userId: payload.agentId,
              type: 'system',
              title: 'Payment Released',
              message: `${payload.clientName} has released the payment. NGN ${payload.amount.toLocaleString()} has been credited to your wallet.`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case BOOKING_SCHEDULE_UPDATED: {
            const payload =
              event.payload as unknown as BookingScheduleUpdatedPayload;
            await notificationService.createNotification({
              userId: payload.agentId,
              type: 'system',
              title: 'Booking Schedule Updated',
              message: `${payload.clientName} has updated the schedule for booking ${payload.bookingReference}.`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case BOOKING_CANCELLED: {
            const payload = event.payload as unknown as BookingCancelledPayload;
            const otherPartyId =
              payload.cancelledBy === payload.clientId
                ? payload.agentId
                : payload.clientId;
            const cancellerName =
              payload.cancelledBy === payload.clientId
                ? payload.clientName
                : payload.agentName;
            await notificationService.createNotification({
              userId: otherPartyId,
              type: 'system',
              title: 'Booking Cancelled',
              message: `Your booking with ${cancellerName} has been cancelled.`,
              metadata: { bookingId: payload.bookingId },
            });
            break;
          }

          case INQUIRY_RECEIVED: {
            const payload = event.payload as unknown as InquiryReceivedPayload;
            await notificationService.createNotification({
              userId: payload.recipientId,
              type: 'inquiry_received',
              title: 'New Inquiry',
              message: `${payload.senderName} sent an inquiry about "${payload.propertyTitle}".`,
              metadata: {
                inquiryId: payload.inquiryId,
                propertyTitle: payload.propertyTitle,
              },
            });
            break;
          }

          case INQUIRY_RESPONDED: {
            const payload = event.payload as unknown as InquiryRespondedPayload;
            await notificationService.createNotification({
              userId: payload.senderId,
              type: 'inquiry_responded',
              title: 'Inquiry Responded',
              message: `${payload.recipientName} responded to your inquiry about "${payload.propertyTitle}".`,
              metadata: {
                inquiryId: payload.inquiryId,
                propertyTitle: payload.propertyTitle,
              },
            });
            break;
          }

          case VERIFICATION_APPROVED: {
            const payload =
              event.payload as unknown as VerificationApprovedPayload;
            await notificationService.createNotification({
              userId: payload.userId,
              type: 'system',
              title: 'Verification Approved',
              message:
                'Your agent verification has been approved. You can now operate as an agent on CytyFlix.',
              metadata: { verificationId: payload.verificationId },
            });
            break;
          }

          case VERIFICATION_REJECTED: {
            const payload =
              event.payload as unknown as VerificationRejectedPayload;
            await notificationService.createNotification({
              userId: payload.userId,
              type: 'system',
              title: 'Verification Rejected',
              message: `Your agent verification was rejected. Reason: ${payload.reason}`,
              metadata: { verificationId: payload.verificationId },
            });
            break;
          }

          case RENT_PAYMENT_RECEIVED: {
            const payload =
              event.payload as unknown as RentPaymentReceivedPayload;
            await notificationService.createNotification({
              userId: payload.ownerId,
              type: 'system',
              title: 'Rent Payment Received',
              message: `${payload.tenantName} has paid NGN ${payload.amount.toLocaleString()} in rent. The funds are held in escrow until move-in confirmation.`,
              metadata: { rentPaymentId: payload.rentPaymentId },
            });
            await notificationService.createNotification({
              userId: payload.tenantId,
              type: 'system',
              title: 'Rent Payment Successful',
              message: `Your rent payment of NGN ${payload.amount.toLocaleString()} is in escrow. Confirm move-in after you move in.`,
              metadata: { rentPaymentId: payload.rentPaymentId },
            });
            break;
          }

          case RENT_MOVE_IN_CONFIRMED: {
            const payload =
              event.payload as unknown as RentMoveInConfirmedPayload;
            await notificationService.createNotification({
              userId: payload.ownerId,
              type: 'system',
              title: 'Move-In Confirmed — Payment Released',
              message: `${payload.tenantName} confirmed move-in. NGN ${payload.amount.toLocaleString()} has been released to your wallet.`,
              metadata: { rentPaymentId: payload.rentPaymentId },
            });
            break;
          }

          case PROPERTY_FROZEN: {
            const payload = event.payload as unknown as PropertyFrozenPayload;
            await notificationService.createNotification({
              userId: payload.ownerId,
              type: 'system',
              title: 'Property Listing Frozen',
              message: `Your listing "${payload.propertyTitle}" has been frozen due to multiple reports and is under review.`,
              metadata: { propertyId: payload.propertyId },
            });
            break;
          }

          case AGREEMENT_CREATED: {
            const payload = event.payload as unknown as AgreementCreatedPayload;
            await notificationService.createNotification({
              userId: payload.tenantId,
              type: 'system',
              title: 'New Tenancy Agreement',
              message: `${payload.landlordName} has created a tenancy agreement for "${payload.propertyTitle}" for you to review and sign.`,
              metadata: { agreementId: payload.agreementId },
            });
            break;
          }

          case AGREEMENT_SIGNED: {
            const payload = event.payload as unknown as AgreementSignedPayload;
            await notificationService.createNotification({
              userId: payload.landlordId,
              type: 'system',
              title: 'Agreement Fully Signed',
              message: `Your tenancy agreement with ${payload.tenantName} has been signed by both parties.`,
              metadata: { agreementId: payload.agreementId },
            });
            await notificationService.createNotification({
              userId: payload.tenantId,
              type: 'system',
              title: 'Agreement Fully Signed',
              message: `Your tenancy agreement with ${payload.landlordName} has been signed by both parties.`,
              metadata: { agreementId: payload.agreementId },
            });
            break;
          }

          default:
            console.warn(
              `Notification consumer: unhandled event type "${event.type}"`
            );
        }

        channel.ack(msg);
      } catch (error) {
        console.error('Notification consumer error:', error);
        channel.nack(msg, false, true);
      }
    }
  );

  console.log('Notification consumer started.');
}
