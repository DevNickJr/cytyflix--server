import { UserRepository } from "@/modules/users/contracts/user.interfaces";
import { verifyWebhookSignature } from "@/infrastructure/payments/paystack";
import { rabbitMQ } from "@/infrastructure/messaging/rabbitmq";
import { publishEvent } from "@/infrastructure/messaging/event-bus";
import { BOOKING_CONFIRMED, BookingConfirmedPayload } from "@/infrastructure/messaging/events";
import { notificationService } from "@/modules/notifications/notification.module";
import { sendEmail } from "@/infrastructure/email";
import { bookingConfirmedClientEmail, bookingConfirmedAgentEmail } from "@/infrastructure/email/templates";
import CustomError from "@/shared/utils/custom-error";
import { BookingRepository } from "@/modules/bookings/contracts/booking.interfaces";
import { BookingStatus, PaymentStatus } from "@/modules/bookings/domain/booking";

export class WebhookService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly userRepo: UserRepository,
  ) {}

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
      await handleBooking({ event, bookingRepo: this.bookingRepo, userRepo: this.userRepo })
    } else if (event.event === "transfer.success") {

    }
  }
}


const handleBooking = async ({ event, bookingRepo, userRepo }: { event: any, bookingRepo: BookingRepository, userRepo: UserRepository }) => {
  const reference = event.data.reference;
  const booking = await bookingRepo.findByPaymentReference(reference);
  if (!booking) {
    console.error("Booking not found for reference:", reference);
    return;
  };

  if (booking.paymentStatus === PaymentStatus.PAID) {
    console.log("Booking already marked as paid:", booking.id);
    return;
  }

  booking.paymentStatus = PaymentStatus.PAID;
  booking.bookingStatus = BookingStatus.CONFIRMED;
  await bookingRepo.update(booking);

  // Look up client and agent for event data
  const client = await userRepo.findById(booking.clientId);
  const agent = await userRepo.findById(booking.agentId);
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

// const handleTransferSuccess = async ({ event, walletService }: { event: any, walletService: WalletService }) => {
//   const reference = event.data.reference;
//   const booking = await walletService.(reference);
//   if (!booking) {
//     console.error("Booking not found for reference:", reference);
//     return;
//   };

//   if (booking.paymentStatus === PaymentStatus.PAID) {
//     console.log("Booking already marked as paid:", booking.id);
//     return;
//   }

//   booking.paymentStatus = PaymentStatus.PAID;
//   booking.bookingStatus = BookingStatus.CONFIRMED;
//   await bookingRepo.update(booking);

//   // Look up client and agent for event data
//   const client = await userRepo.findById(booking.clientId);
//   const agent = await userRepo.findById(booking.agentId);
//   const clientName = client?.profile ? `${client.profile.firstName} ${client.profile.lastName}`.trim() : "Client";
//   const agentName = agent?.profile ? `${agent.profile.firstName} ${agent.profile.lastName}`.trim() : "Agent";

//   const payload: BookingConfirmedPayload = {
//     bookingId: booking.id,
//     clientId: booking.clientId,
//     clientName,
//     clientEmail: client?.email || "",
//     agentId: booking.agentId,
//     agentName,
//     agentEmail: agent?.email || "",
//     scheduledDate: booking.scheduledDate,
//     scheduledTime: booking.scheduledTime,
//     bookingReference: booking.paymentReference,
//   };
//   console.log("RabbitMQ connected:", rabbitMQ.isConnected());

//   if (rabbitMQ.isConnected()) {
//     publishEvent("booking.confirmed", {
//       type: BOOKING_CONFIRMED,
//       payload: payload as unknown as Record<string, unknown>,
//       timestamp: new Date().toISOString(),
//     });
//   } else {
//     // Fallback: direct notification + email calls
//     await notificationService.createNotification({
//       userId: booking.clientId,
//       type: "system",
//       title: "Booking Confirmed",
//       message: "Your payment was successful. Your booking has been confirmed.",
//       metadata: { bookingId: booking.id },
//     });
//     await notificationService.createNotification({
//       userId: booking.agentId,
//       type: "system",
//       title: "New Booking",
//       message: `You have a new booking from ${clientName}.`,
//       metadata: { bookingId: booking.id },
//     });

//     try {
//       const clientTemplate = bookingConfirmedClientEmail({
//         clientName,
//         agentName,
//         scheduledDate: booking.scheduledDate,
//         scheduledTime: booking.scheduledTime,
//         bookingReference: booking.paymentReference,
//       });
//       await sendEmail({ to: client?.email || "", ...clientTemplate });

//       const agentTemplate = bookingConfirmedAgentEmail({
//         agentName,
//         clientName,
//         clientEmail: client?.email || "",
//         scheduledDate: booking.scheduledDate,
//         scheduledTime: booking.scheduledTime,
//         bookingReference: booking.paymentReference,
//       });
//       await sendEmail({ to: agent?.email || "", ...agentTemplate });
//     } catch (emailError) {
//       console.error("Fallback email send failed:", emailError);
//     }
//   }
// }