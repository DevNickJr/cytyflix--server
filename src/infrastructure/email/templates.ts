interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// --- Booking Templates ---

export function bookingConfirmedClientEmail(data: {
  clientName: string;
  agentName: string;
  scheduledDate: Date;
  scheduledTime: string;
  bookingReference: string;
}): EmailTemplate {
  return {
    subject: "Booking Confirmed - CytyFlix",
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
    subject: "New Booking Received - CytyFlix",
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
    subject: "Booking Cancelled - CytyFlix",
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
    subject: "Agent Verification Approved - CytyFlix",
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

export function verificationRejectedEmail(data: {
  agentName: string;
  reason: string;
}): EmailTemplate {
  return {
    subject: "Agent Verification Rejected - CytyFlix",
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
