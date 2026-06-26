// Event type constants
export const BOOKING_CONFIRMED = "booking.confirmed";
export const BOOKING_CANCELLED = "booking.cancelled";
export const INQUIRY_RECEIVED = "inquiry.received";
export const INQUIRY_RESPONDED = "inquiry.responded";
export const VERIFICATION_APPROVED = "verification.approved";
export const VERIFICATION_REJECTED = "verification.rejected";

// Payload interfaces
export interface BookingConfirmedPayload {
  bookingId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}

export interface BookingCancelledPayload {
  bookingId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
  cancelledBy: string;
}

export interface InquiryReceivedPayload {
  inquiryId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  propertyTitle: string;
  message: string;
}

export interface InquiryRespondedPayload {
  inquiryId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  propertyTitle: string;
}

export interface VerificationApprovedPayload {
  verificationId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

export interface VerificationRejectedPayload {
  verificationId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
}
