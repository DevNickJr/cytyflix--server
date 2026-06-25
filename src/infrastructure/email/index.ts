import env from "@/configs/env.config";
import type { EmailProvider, SendEmailParams, SendEmailResult } from "./email.types";
import { brevoProvider } from "./brevo";

export type { SendEmailParams, SendEmailResult, EmailProvider } from "./email.types";

function getProvider(): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case "brevo":
      return brevoProvider;
    case "ses":
      throw new Error("SES email provider is not yet implemented");
    default:
      throw new Error(`Unknown email provider: ${env.EMAIL_PROVIDER}`);
  }
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const provider = getProvider();
  return provider.sendEmail(params);
}
