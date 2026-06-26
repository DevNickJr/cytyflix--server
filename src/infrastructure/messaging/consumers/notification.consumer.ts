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
import { notificationService } from "@/modules/notifications/notification.module";

export async function startNotificationConsumer(channel: Channel): Promise<void> {
  await channel.consume(QUEUES.DB_NOTIFICATIONS, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event: DomainEvent = JSON.parse(msg.content.toString());

      switch (event.type) {
        case BOOKING_CONFIRMED: {
          const payload = event.payload as unknown as BookingConfirmedPayload;
          await notificationService.createNotification({
            userId: payload.clientId,
            type: "system",
            title: "Booking Confirmed",
            message: "Your payment was successful. Your booking has been confirmed.",
            metadata: { bookingId: payload.bookingId },
          });
          await notificationService.createNotification({
            userId: payload.agentId,
            type: "system",
            title: "New Booking",
            message: `You have a new booking from ${payload.clientName}.`,
            metadata: { bookingId: payload.bookingId },
          });
          break;
        }

        case BOOKING_CANCELLED: {
          const payload = event.payload as unknown as BookingCancelledPayload;
          const otherPartyId = payload.cancelledBy === payload.clientId ? payload.agentId : payload.clientId;
          const cancellerName = payload.cancelledBy === payload.clientId ? payload.clientName : payload.agentName;
          await notificationService.createNotification({
            userId: otherPartyId,
            type: "system",
            title: "Booking Cancelled",
            message: `Your booking with ${cancellerName} has been cancelled.`,
            metadata: { bookingId: payload.bookingId },
          });
          break;
        }

        case INQUIRY_RECEIVED: {
          const payload = event.payload as unknown as InquiryReceivedPayload;
          await notificationService.createNotification({
            userId: payload.recipientId,
            type: "inquiry_received",
            title: "New Inquiry",
            message: `${payload.senderName} sent an inquiry about "${payload.propertyTitle}".`,
            metadata: { inquiryId: payload.inquiryId, propertyTitle: payload.propertyTitle },
          });
          break;
        }

        case INQUIRY_RESPONDED: {
          const payload = event.payload as unknown as InquiryRespondedPayload;
          await notificationService.createNotification({
            userId: payload.senderId,
            type: "inquiry_responded",
            title: "Inquiry Responded",
            message: `${payload.recipientName} responded to your inquiry about "${payload.propertyTitle}".`,
            metadata: { inquiryId: payload.inquiryId, propertyTitle: payload.propertyTitle },
          });
          break;
        }

        case VERIFICATION_APPROVED: {
          const payload = event.payload as unknown as VerificationApprovedPayload;
          await notificationService.createNotification({
            userId: payload.userId,
            type: "system",
            title: "Verification Approved",
            message: "Your agent verification has been approved. You can now operate as an agent on CytyFlix.",
            metadata: { verificationId: payload.verificationId },
          });
          break;
        }

        case VERIFICATION_REJECTED: {
          const payload = event.payload as unknown as VerificationRejectedPayload;
          await notificationService.createNotification({
            userId: payload.userId,
            type: "system",
            title: "Verification Rejected",
            message: `Your agent verification was rejected. Reason: ${payload.reason}`,
            metadata: { verificationId: payload.verificationId },
          });
          break;
        }

        default:
          console.warn(`Notification consumer: unhandled event type "${event.type}"`);
      }

      channel.ack(msg);
    } catch (error) {
      console.error("Notification consumer error:", error);
      channel.nack(msg, false, true);
    }
  });

  console.log("Notification consumer started.");
}
