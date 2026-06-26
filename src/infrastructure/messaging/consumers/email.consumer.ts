import { Channel, ConsumeMessage } from "amqplib";
import { QUEUES } from "../rabbitmq";
import { DomainEvent } from "../event-bus";
import {
  BOOKING_CONFIRMED,
  BOOKING_CANCELLED,
  INQUIRY_RECEIVED,
  INQUIRY_RESPONDED,
  VERIFICATION_APPROVED,
  VERIFICATION_REJECTED,
  BookingConfirmedPayload,
  BookingCancelledPayload,
  InquiryReceivedPayload,
  InquiryRespondedPayload,
  VerificationApprovedPayload,
  VerificationRejectedPayload,
} from "../events";
import { sendEmail } from "@/infrastructure/email";
import {
  bookingConfirmedClientEmail,
  bookingConfirmedAgentEmail,
  bookingCancelledEmail,
  inquiryReceivedEmail,
  inquiryRespondedEmail,
  verificationApprovedEmail,
  verificationRejectedEmail,
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

        case BOOKING_CANCELLED: {
          const payload = event.payload as unknown as BookingCancelledPayload;
          // Notify both parties
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
