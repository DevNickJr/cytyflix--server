import axios from "axios";
import env from "@/configs/env.config";
import type { EmailProvider, SendEmailParams, SendEmailResult } from "./email.types";

const BREVO_BASE = "https://api.brevo.com";

const brevoClient = axios.create({
  baseURL: BREVO_BASE,
  headers: {
    "api-key": env.BREVO_API_KEY,
    "Content-Type": "application/json",
  },
});

export const brevoProvider: EmailProvider = {
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    const sender = params.from ?? {
      email: env.EMAIL_DEFAULT_FROM,
      name: env.EMAIL_DEFAULT_FROM_NAME,
    };

    const recipients = Array.isArray(params.to)
      ? params.to.map((email) => ({ email }))
      : [{ email: params.to }];

    try {
      const response = await brevoClient.post("/v3/smtp/email", {
        sender,
        to: recipients,
        subject: params.subject,
        htmlContent: params.html,
        ...(params.text && { textContent: params.text }),
      });

      return {
        success: true,
        messageId: response.data?.messageId,
      };
    } catch (error) {
      console.error("Brevo email send failed:", error);
      return { success: false };
    }
  },
};
