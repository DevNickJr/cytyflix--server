// Event type constants
export const BOOKING_CONFIRMED = 'booking.confirmed';
export const BOOKING_CANCELLED = 'booking.cancelled';
export const BOOKING_PAYMENT_RECEIVED = 'booking.payment_received';
export const BOOKING_AGENT_CONFIRMED = 'booking.agent_confirmed';
export const BOOKING_CLIENT_RELEASED = 'booking.client_released';
export const BOOKING_SCHEDULE_UPDATED = 'booking.schedule_updated';
export const INQUIRY_RECEIVED = 'inquiry.received';
export const INQUIRY_RESPONDED = 'inquiry.responded';
export const VERIFICATION_APPROVED = 'verification.approved';
export const VERIFICATION_REJECTED = 'verification.rejected';
export const PROPERTY_FROZEN = 'property.frozen';
export const RENT_PAYMENT_RECEIVED = 'rent.payment_received';
export const RENT_MOVE_IN_CONFIRMED = 'rent.move_in_confirmed';
export const AGREEMENT_CREATED = 'agreement.created';
export const AGREEMENT_SIGNED = 'agreement.signed';

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

export interface BookingPaymentReceivedPayload {
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

export interface BookingAgentConfirmedPayload {
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

export interface BookingClientReleasedPayload {
  bookingId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  amount: number;
  bookingReference: string;
}

export interface BookingScheduleUpdatedPayload {
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

export interface PropertyFrozenPayload {
  propertyId: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  propertyTitle: string;
  reason: string;
}

export interface RentPaymentReceivedPayload {
  rentPaymentId: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  moveInDate: Date;
  paymentReference: string;
}

export interface RentMoveInConfirmedPayload {
  rentPaymentId: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  paymentReference: string;
}

export interface AgreementCreatedPayload {
  agreementId: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  propertyTitle: string;
}

export interface AgreementSignedPayload {
  agreementId: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
}
