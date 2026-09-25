import {
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
} from '@/shared/utils/calendar-links';
import env from '@/configs/env.config';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function calendarLinksHTML(data: {
  bookingId: string;
  bookingReference: string;
  scheduledDate: Date;
  scheduledTime: string;
}): string {
  const calData = {
    title: `CytyFlix Booking - ${data.bookingReference}`,
    description: `Property inspection booking. Reference: ${data.bookingReference}`,
    startDate: data.scheduledDate,
    startTime: data.scheduledTime,
    durationMinutes: 60,
  };

  const googleLink = generateGoogleCalendarLink(calData);
  const outlookLink = generateOutlookCalendarLink(calData);
  const apiUrl = env.APP_URL || 'http://localhost:4001';
  const icsLink = `${apiUrl}/api/v1/bookings/${data.bookingId}/calendar.ics`;

  return `
    <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">Add to Calendar</p>
      <p style="margin: 0;">
        <a href="${googleLink}" target="_blank" style="color: #2563eb; text-decoration: underline; margin-right: 16px;">Google Calendar</a>
        <a href="${outlookLink}" target="_blank" style="color: #2563eb; text-decoration: underline; margin-right: 16px;">Outlook</a>
        <a href="${icsLink}" style="color: #2563eb; text-decoration: underline;">Download .ics</a>
      </p>
    </div>
  `;
}

// --- Booking Templates ---

export function bookingConfirmedClientEmail(data: {
  bookingId?: string;
  clientName: string;
  agentName: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  const calLinks = data.bookingId
    ? calendarLinksHTML({
        bookingId: data.bookingId,
        bookingReference: data.bookingReference,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
      })
    : '';
  return {
    subject: 'Booking Confirmed - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed!</h2>
        <p>Hi ${data.clientName},</p>
        <p>Your booking with <strong>${data.agentName}</strong> has been confirmed.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
        </table>
        ${calLinks}
        <p>Please be on time for your appointment. You can view your booking details in your dashboard.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Booking Confirmed!\n\nHi ${data.clientName},\n\nYour booking with ${data.agentName} has been confirmed.\n\nReference: ${data.bookingReference}\nDate: ${data.scheduledDate}\nTime: ${data.scheduledTime}\n\nPlease be on time for your appointment.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingConfirmedAgentEmail(data: {
  agentName: string;
  clientName: string;
  clientEmail: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  return {
    subject: 'New Booking Received - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received!</h2>
        <p>Hi ${data.agentName},</p>
        <p>You have a new confirmed booking from <strong>${data.clientName}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Client Email</td><td style="padding: 8px;">${data.clientEmail}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
        </table>
        <p>Please prepare for the meeting and be available at the scheduled time.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `New Booking Received!\n\nHi ${data.agentName},\n\nYou have a new confirmed booking from ${data.clientName}.\n\nReference: ${data.bookingReference}\nClient Email: ${data.clientEmail}\nDate: ${data.scheduledDate}\nTime: ${data.scheduledTime}\n\nPlease prepare for the meeting.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingCancelledEmail(data: {
  recipientName: string;
  otherPartyName: string;
  bookingReference: string;
  scheduledDate: Date;
  scheduledTime: string;
}): EmailTemplate {
  return {
    subject: 'Booking Cancelled - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Cancelled</h2>
        <p>Hi ${data.recipientName},</p>
        <p>The booking with <strong>${data.otherPartyName}</strong> (Ref: ${data.bookingReference}) scheduled for ${data.scheduledDate} at ${data.scheduledTime} has been cancelled.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Booking Cancelled\n\nHi ${data.recipientName},\n\nThe booking with ${data.otherPartyName} (Ref: ${data.bookingReference}) scheduled for ${data.scheduledDate} at ${data.scheduledTime} has been cancelled.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingPaymentReceivedClientEmail(data: {
  bookingId?: string;
  clientName: string;
  agentName: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  const calLinks = data.bookingId
    ? calendarLinksHTML({
        bookingId: data.bookingId,
        bookingReference: data.bookingReference,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
      })
    : '';
  return {
    subject: 'Payment Received - Awaiting Agent Confirmation - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Received!</h2>
        <p>Hi ${data.clientName},</p>
        <p>Your payment for the booking with <strong>${data.agentName}</strong> has been received. The agent has been notified and needs to confirm the booking.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Status</td><td style="padding: 8px; color: #d97706; font-weight: bold;">Awaiting Agent Confirmation</td></tr>
        </table>
        ${calLinks}
        <p>You can edit the schedule until the agent confirms. Once confirmed, you'll be able to release payment after your inspection.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Payment Received!\n\nHi ${data.clientName},\n\nYour payment for the booking with ${data.agentName} has been received. The agent needs to confirm the booking.\n\nReference: ${data.bookingReference}\nDate: ${data.scheduledDate}\nTime: ${data.scheduledTime}\nStatus: Awaiting Agent Confirmation\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingPaymentReceivedAgentEmail(data: {
  agentName: string;
  clientName: string;
  clientEmail: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  return {
    subject: 'New Booking - Action Required - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking — Action Required</h2>
        <p>Hi ${data.agentName},</p>
        <p><strong>${data.clientName}</strong> has paid for a booking with you. Please confirm or cancel the booking from your dashboard.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Client Email</td><td style="padding: 8px;">${data.clientEmail}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
        </table>
        <p>Please log in to your dashboard to confirm this booking.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `New Booking — Action Required\n\nHi ${data.agentName},\n\n${data.clientName} has paid for a booking with you. Please confirm or cancel from your dashboard.\n\nReference: ${data.bookingReference}\nClient Email: ${data.clientEmail}\nDate: ${data.scheduledDate}\nTime: ${data.scheduledTime}\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingAgentConfirmedEmail(data: {
  bookingId?: string;
  clientName: string;
  agentName: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  const calLinks = data.bookingId
    ? calendarLinksHTML({
        bookingId: data.bookingId,
        bookingReference: data.bookingReference,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
      })
    : '';
  return {
    subject: 'Booking Confirmed by Agent - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed!</h2>
        <p>Hi ${data.clientName},</p>
        <p><strong>${data.agentName}</strong> has confirmed your booking. You're all set for the inspection!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
        </table>
        ${calLinks}
        <p>After your inspection, you can release the payment to the agent or raise a dispute if something is wrong. Payment will be auto-released 24 hours after your scheduled date if no action is taken.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Booking Confirmed!\n\nHi ${data.clientName},\n\n${data.agentName} has confirmed your booking.\n\nReference: ${data.bookingReference}\nDate: ${data.scheduledDate}\nTime: ${data.scheduledTime}\n\nAfter inspection, release payment or raise a dispute. Auto-release happens 24 hours after the scheduled date.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingScheduleUpdatedEmail(data: {
  agentName: string;
  clientName: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  return {
    subject: 'Booking Schedule Updated - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Schedule Updated</h2>
        <p>Hi ${data.agentName},</p>
        <p><strong>${data.clientName}</strong> has updated the schedule for booking <strong>${data.bookingReference}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.bookingReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">New Date</td><td style="padding: 8px;">${data.scheduledDate}</td></tr>
          <tr><td style="padding: 8px; color: #666;">New Time</td><td style="padding: 8px;">${data.scheduledTime}</td></tr>
        </table>
        <p>Please review and confirm the booking from your dashboard.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Booking Schedule Updated\n\nHi ${data.agentName},\n\n${data.clientName} has updated the schedule for booking ${data.bookingReference}.\n\nNew Date: ${data.scheduledDate}\nNew Time: ${data.scheduledTime}\n\nPlease confirm from your dashboard.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function bookingClientReleasedEmail(data: {
  agentName: string;
  clientName: string;
  amount: number;
  bookingReference: string;
}): EmailTemplate {
  return {
    subject: 'Payment Released - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment Released!</h2>
        <p>Hi ${data.agentName},</p>
        <p><strong>${data.clientName}</strong> has released the payment for booking <strong>${data.bookingReference}</strong>. The amount of <strong>NGN ${data.amount.toLocaleString()}</strong> has been credited to your wallet.</p>
        <p>You can withdraw your funds from your wallet at any time.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Payment Released!\n\nHi ${data.agentName},\n\n${data.clientName} has released the payment for booking ${data.bookingReference}. NGN ${data.amount.toLocaleString()} has been credited to your wallet.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

// --- Inquiry Templates ---

export function inquiryReceivedEmail(data: {
  recipientName: string;
  senderName: string;
  propertyTitle: string;
  message: string;
}): EmailTemplate {
  return {
    subject: `New Inquiry on ${data.propertyTitle} - CytyFlix`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Inquiry Received</h2>
        <p>Hi ${data.recipientName},</p>
        <p><strong>${data.senderName}</strong> has sent you an inquiry about your property <strong>${data.propertyTitle}</strong>.</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        <p>Log in to your dashboard to respond.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `New Inquiry Received\n\nHi ${data.recipientName},\n\n${data.senderName} has sent you an inquiry about your property "${data.propertyTitle}".\n\nMessage:\n${data.message}\n\nLog in to your dashboard to respond.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function inquiryRespondedEmail(data: {
  senderName: string;
  recipientName: string;
  propertyTitle: string;
}): EmailTemplate {
  return {
    subject: `Your Inquiry Was Responded To - CytyFlix`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Inquiry Responded</h2>
        <p>Hi ${data.senderName},</p>
        <p><strong>${data.recipientName}</strong> has responded to your inquiry about <strong>${data.propertyTitle}</strong>.</p>
        <p>Log in to your dashboard to view the response.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Inquiry Responded\n\nHi ${data.senderName},\n\n${data.recipientName} has responded to your inquiry about "${data.propertyTitle}".\n\nLog in to your dashboard to view the response.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

// --- Verification Templates ---

export function verificationApprovedEmail(data: {
  agentName: string;
}): EmailTemplate {
  return {
    subject: 'Agent Verification Approved - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verification Approved!</h2>
        <p>Hi ${data.agentName},</p>
        <p>Congratulations! Your agent verification has been <strong>approved</strong>. You can now operate as a verified agent on CytyFlix.</p>
        <p>You can start listing properties and accepting bookings from clients.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Verification Approved!\n\nHi ${data.agentName},\n\nCongratulations! Your agent verification has been approved. You can now operate as a verified agent on CytyFlix.\n\nYou can start listing properties and accepting bookings from clients.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

// --- Property Templates ---

export function propertyFrozenEmail(data: {
  ownerName: string;
  propertyTitle: string;
  reason: string;
}): EmailTemplate {
  return {
    subject: 'Property Listing Frozen - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Property Listing Frozen</h2>
        <p>Hi ${data.ownerName},</p>
        <p>Your property listing <strong>"${data.propertyTitle}"</strong> has been automatically frozen and is no longer visible to users.</p>
        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0;"><strong>Reason:</strong> ${data.reason}</p>
        </div>
        <p>This action was taken because multiple users reported this listing. Our team will review the reports and contact you if further action is needed.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Property Listing Frozen\n\nHi ${data.ownerName},\n\nYour property listing "${data.propertyTitle}" has been automatically frozen.\n\nReason: ${data.reason}\n\nMultiple users reported this listing. Our team will review it.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

// --- Rent Payment Templates ---

export function rentPaymentReceivedEmail(data: {
  ownerName: string;
  tenantName: string;
  amount: number;
  moveInDate: Date;
  paymentReference: string;
}): EmailTemplate {
  return {
    subject: 'Rent Payment Received - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rent Payment Received</h2>
        <p>Hi ${data.ownerName},</p>
        <p><strong>${data.tenantName}</strong> has made a rent payment for your property.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #666;">Reference</td><td style="padding: 8px; font-weight: bold;">${data.paymentReference}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Amount</td><td style="padding: 8px; font-weight: bold;">NGN ${data.amount.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px; color: #666;">Move-in Date</td><td style="padding: 8px;">${data.moveInDate}</td></tr>
        </table>
        <p>The funds are held in escrow and will be released to your wallet once the tenant confirms move-in, or automatically 3 days after the move-in date.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Rent Payment Received\n\nHi ${data.ownerName},\n\n${data.tenantName} has made a rent payment.\n\nReference: ${data.paymentReference}\nAmount: NGN ${data.amount.toLocaleString()}\nMove-in Date: ${data.moveInDate}\n\nFunds are in escrow until move-in confirmation or 3 days after move-in date.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function rentMoveInConfirmedEmail(data: {
  ownerName: string;
  tenantName: string;
  amount: number;
  paymentReference: string;
}): EmailTemplate {
  return {
    subject: 'Move-In Confirmed — Payment Released - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Move-In Confirmed!</h2>
        <p>Hi ${data.ownerName},</p>
        <p><strong>${data.tenantName}</strong> has confirmed their move-in. <strong>NGN ${data.amount.toLocaleString()}</strong> (Ref: ${data.paymentReference}) has been released to your wallet.</p>
        <p>You can withdraw your funds from your wallet at any time.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Move-In Confirmed!\n\nHi ${data.ownerName},\n\n${data.tenantName} has confirmed their move-in. NGN ${data.amount.toLocaleString()} has been released to your wallet.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function rentReleasedEmail(data: {
  ownerName: string;
  tenantName: string;
  amount: number;
  paymentReference: string;
}): EmailTemplate {
  return {
    subject: 'Rent Payment Auto-Released - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rent Payment Released</h2>
        <p>Hi ${data.ownerName},</p>
        <p>The rent payment of <strong>NGN ${data.amount.toLocaleString()}</strong> (Ref: ${data.paymentReference}) from <strong>${data.tenantName}</strong> has been automatically released to your wallet after the move-in period.</p>
        <p>You can withdraw your funds from your wallet at any time.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Rent Payment Released\n\nHi ${data.ownerName},\n\nNGN ${data.amount.toLocaleString()} from ${data.tenantName} has been auto-released to your wallet.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function verificationRejectedEmail(data: {
  agentName: string;
  reason: string;
}): EmailTemplate {
  return {
    subject: 'Agent Verification Rejected - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verification Rejected</h2>
        <p>Hi ${data.agentName},</p>
        <p>Unfortunately, your agent verification has been <strong>rejected</strong>.</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p>You may resubmit your verification documents after addressing the issues mentioned above.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Verification Rejected\n\nHi ${data.agentName},\n\nUnfortunately, your agent verification has been rejected.\n\nReason: ${data.reason}\n\nYou may resubmit your verification documents after addressing the issues mentioned above.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

// --- Tenancy Agreement Templates ---

export function agreementCreatedEmail(data: {
  tenantName: string;
  landlordName: string;
  propertyTitle: string;
}): EmailTemplate {
  return {
    subject: 'New Tenancy Agreement to Review - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Tenancy Agreement Created</h2>
        <p>Hi ${data.tenantName},</p>
        <p><strong>${data.landlordName}</strong> has created a tenancy agreement for the property <strong>"${data.propertyTitle}"</strong> for you to review and sign.</p>
        <p>Please log in to your CytyFlix dashboard to review and sign the agreement.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Tenancy Agreement Created\n\nHi ${data.tenantName},\n\n${data.landlordName} has created a tenancy agreement for "${data.propertyTitle}" for you to review and sign.\n\nPlease log in to your CytyFlix dashboard to review and sign the agreement.\n\nBest regards,\nThe CytyFlix Team`,
  };
}

export function agreementSignedEmail(data: {
  landlordName: string;
  tenantName: string;
}): EmailTemplate {
  return {
    subject: 'Tenancy Agreement Fully Signed - CytyFlix',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Agreement Signed by Both Parties</h2>
        <p>The tenancy agreement between <strong>${data.landlordName}</strong> (Landlord) and <strong>${data.tenantName}</strong> (Tenant) has been signed by both parties.</p>
        <p>You can download the signed agreement as a PDF from your CytyFlix dashboard.</p>
        <p>Best regards,<br/>The CytyFlix Team</p>
      </div>
    `,
    text: `Agreement Signed by Both Parties\n\nThe tenancy agreement between ${data.landlordName} (Landlord) and ${data.tenantName} (Tenant) has been signed by both parties.\n\nYou can download the signed agreement as a PDF from your CytyFlix dashboard.\n\nBest regards,\nThe CytyFlix Team`,
  };
}
