import type { EmailProvider, SendEmailParams, SendEmailResult } from "./email.types";

export const sesProvider: EmailProvider = {
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    console.warn(
      "SES email provider is not yet fully implemented. Install @aws-sdk/client-ses and configure AWS credentials to enable.",
      { to: params.to, subject: params.subject },
    );
    return { success: false };
  },
};
