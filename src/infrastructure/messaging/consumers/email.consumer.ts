import { Channel, ConsumeMessage } from "amqplib";
import { QUEUES } from "../rabbitmq";
import { DomainEvent } from "../event-bus";
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
} from "../events";
import { sendEmail } from "@/infrastructure/email";
import {
  bookingConfirmedClientEmail,
  bookingConfirmedAgentEmail,
  bookingCancelledEmail,
  bookingPaymentReceivedClientEmail,
  bookingPaymentReceivedAgentEmail,
  bookingAgentConfirmedEmail,
  bookingScheduleUpdatedEmail,
  bookingClientReleasedEmail,
  inquiryReceivedEmail,
  inquiryRespondedEmail,
  verificationApprovedEmail,
  verificationRejectedEmail,
  propertyFrozenEmail,
  rentPaymentReceivedEmail,
  rentMoveInConfirmedEmail,
  agreementCreatedEmail,
  agreementSignedEmail,
} from "@/infrastructure/email/templates";

export async function startEmailConsumer(channel: Channel): Promise<void> {
  await channel.consume(QUEUES.EMAIL_NOTIFICATIONS, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event: DomainEvent = JSON.parse(msg.content.toString());

      switch (event.type) {
        case BOOKING_CONFIRMED: {
          const payload = event.payload as unknown as BookingConfirmedPayload;
          const clientTemplate = bookingConfirmedClientEmail({
            bookingId: payload.bookingId,
            clientName: payload.clientName,
            agentName: payload.agentName,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.clientEmail, ...clientTemplate });

          const agentTemplate = bookingConfirmedAgentEmail({
            agentName: payload.agentName,
            clientName: payload.clientName,
            clientEmail: payload.clientEmail,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.agentEmail, ...agentTemplate });
          break;
        }

        case BOOKING_PAYMENT_RECEIVED: {
          const payload = event.payload as unknown as BookingPaymentReceivedPayload;
          const clientTemplate = bookingPaymentReceivedClientEmail({
            bookingId: payload.bookingId,
            clientName: payload.clientName,
            agentName: payload.agentName,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.clientEmail, ...clientTemplate });

          const agentTemplate = bookingPaymentReceivedAgentEmail({
            agentName: payload.agentName,
            clientName: payload.clientName,
            clientEmail: payload.clientEmail,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.agentEmail, ...agentTemplate });
          break;
        }

        case BOOKING_AGENT_CONFIRMED: {
          const payload = event.payload as unknown as BookingAgentConfirmedPayload;
          const template = bookingAgentConfirmedEmail({
            bookingId: payload.bookingId,
            clientName: payload.clientName,
            agentName: payload.agentName,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.clientEmail, ...template });
          break;
        }

        case BOOKING_CLIENT_RELEASED: {
          const payload = event.payload as unknown as BookingClientReleasedPayload;
          const template = bookingClientReleasedEmail({
            agentName: payload.agentName,
            clientName: payload.clientName,
            amount: payload.amount,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.agentEmail, ...template });
          break;
        }

        case BOOKING_SCHEDULE_UPDATED: {
          const payload = event.payload as unknown as BookingScheduleUpdatedPayload;
          const template = bookingScheduleUpdatedEmail({
            agentName: payload.agentName,
            clientName: payload.clientName,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
            bookingReference: payload.bookingReference,
          });
          await sendEmail({ to: payload.agentEmail, ...template });
          break;
        }

        case BOOKING_CANCELLED: {
          const payload = event.payload as unknown as BookingCancelledPayload;
          const clientTemplate = bookingCancelledEmail({
            recipientName: payload.clientName,
            otherPartyName: payload.agentName,
            bookingReference: payload.bookingReference,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
          });
          await sendEmail({ to: payload.clientEmail, ...clientTemplate });

          const agentTemplate = bookingCancelledEmail({
            recipientName: payload.agentName,
            otherPartyName: payload.clientName,
            bookingReference: payload.bookingReference,
            scheduledDate: payload.scheduledDate,
            scheduledTime: payload.scheduledTime,
          });
          await sendEmail({ to: payload.agentEmail, ...agentTemplate });
          break;
        }

        case INQUIRY_RECEIVED: {
          const payload = event.payload as unknown as InquiryReceivedPayload;
          const template = inquiryReceivedEmail({
            recipientName: payload.recipientName,
            senderName: payload.senderName,
            propertyTitle: payload.propertyTitle,
            message: payload.message,
          });
          await sendEmail({ to: payload.recipientEmail, ...template });
          break;
        }

        case INQUIRY_RESPONDED: {
          const payload = event.payload as unknown as InquiryRespondedPayload;
          const template = inquiryRespondedEmail({
            senderName: payload.senderName,
            recipientName: payload.recipientName,
            propertyTitle: payload.propertyTitle,
          });
          await sendEmail({ to: payload.senderEmail, ...template });
          break;
        }

        case VERIFICATION_APPROVED: {
          const payload = event.payload as unknown as VerificationApprovedPayload;
          const template = verificationApprovedEmail({
            agentName: payload.userName,
          });
          await sendEmail({ to: payload.userEmail, ...template });
          break;
        }

        case VERIFICATION_REJECTED: {
          const payload = event.payload as unknown as VerificationRejectedPayload;
          const template = verificationRejectedEmail({
            agentName: payload.userName,
            reason: payload.reason,
          });
          await sendEmail({ to: payload.userEmail, ...template });
          break;
        }

        case RENT_PAYMENT_RECEIVED: {
          const payload = event.payload as unknown as RentPaymentReceivedPayload;
          const template = rentPaymentReceivedEmail({
            ownerName: payload.ownerName,
            tenantName: payload.tenantName,
            amount: payload.amount,
            moveInDate: payload.moveInDate,
            paymentReference: payload.paymentReference,
          });
          await sendEmail({ to: payload.ownerEmail, ...template });
          break;
        }

        case RENT_MOVE_IN_CONFIRMED: {
          const payload = event.payload as unknown as RentMoveInConfirmedPayload;
          const template = rentMoveInConfirmedEmail({
            ownerName: payload.ownerName,
            tenantName: payload.tenantName,
            amount: payload.amount,
            paymentReference: payload.paymentReference,
          });
          await sendEmail({ to: payload.ownerEmail, ...template });
          break;
        }

        case PROPERTY_FROZEN: {
          const payload = event.payload as unknown as PropertyFrozenPayload;
          if (payload.ownerEmail) {
            const template = propertyFrozenEmail({
              ownerName: payload.ownerName || "Property Owner",
              propertyTitle: payload.propertyTitle,
              reason: payload.reason,
            });
            await sendEmail({ to: payload.ownerEmail, ...template });
          }
          break;
        }

        case AGREEMENT_CREATED: {
          const payload = event.payload as unknown as AgreementCreatedPayload;
          const template = agreementCreatedEmail({
            tenantName: payload.tenantName,
            landlordName: payload.landlordName,
            propertyTitle: payload.propertyTitle,
          });
          await sendEmail({ to: payload.tenantEmail, ...template });
          break;
        }

        case AGREEMENT_SIGNED: {
          const payload = event.payload as unknown as AgreementSignedPayload;
          const template = agreementSignedEmail({
            landlordName: payload.landlordName,
            tenantName: payload.tenantName,
          });
          await sendEmail({ to: payload.landlordEmail, ...template });
          await sendEmail({ to: payload.tenantEmail, ...template });
          break;
        }

        default:
          console.warn(`Email consumer: unhandled event type "${event.type}"`);
      }

      channel.ack(msg);
    } catch (error) {
      console.error("Email consumer error:", error);
      channel.nack(msg, false, true);
    }
  });

  console.log("Email consumer started.");
}
