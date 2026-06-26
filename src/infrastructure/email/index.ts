import env from "@/configs/env.config";
import type { EmailProvider, SendEmailParams, SendEmailResult } from "./email.types";
import { brevoProvider } from "./brevo";
import { sesProvider } from "./ses";

export type { SendEmailParams, SendEmailResult, EmailProvider } from "./email.types";

function getProvider(): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case "brevo":
      return brevoProvider;
    case "ses":
      return sesProvider;
    default:
      throw new Error(`Unknown email provider: ${env.EMAIL_PROVIDER}`);
  }
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const provider = getProvider();
  return provider.sendEmail(params);
}
