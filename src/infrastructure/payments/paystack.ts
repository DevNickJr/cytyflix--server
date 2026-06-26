import axios from "axios";
import env from "@/configs/env.config";
import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE,
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: boolean;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    metadata: Record<string, any>;
  };
}

export async function initializeTransaction(
  email: string,
  amount: number,
  reference: string,
  metadata: Record<string, any> = {},
): Promise<PaystackInitResponse> {
  try {
    const response = await paystackClient.post("/transaction/initialize", {
      email,
      amount: amount * 100, // Paystack uses kobo
      reference,
      metadata,
    });
    console.log({ resopnse: response.data });
    return response.data.data;
  } catch (error) {
    console.error("Error initializing transaction:", error);
    throw new Error("Failed to initialize transaction");
  }
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
  const response = await paystackClient.get(`/transaction/verify/${reference}`);
  return response.data;
}

export async function createTransferRecipient(
  name: string,
  accountNumber: string,
  bankCode: string,
): Promise<string> {
  const response = await paystackClient.post("/transferrecipient", {
    type: "nuban",
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN",
  });
  return response.data.data.recipient_code;
}

export async function initiateTransfer(
  amount: number,
  recipientCode: string,
  reference: string,
): Promise<void> {
  await paystackClient.post("/transfer", {
    source: "balance",
    amount: amount * 100,
    recipient: recipientCode,
    reference,
  });
}

export interface ResolvedAccount {
  account_number: string;
  account_name: string;
  bank_id: number;
}

export async function resolveAccountNumber(
  accountNumber: string,
  bankCode: string,
): Promise<ResolvedAccount> {
  const response = await paystackClient.get("/bank/resolve", {
    params: { account_number: accountNumber, bank_code: bankCode },
  });
  return response.data.data;
}

export interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  type: string;
  currency: string;
}

export async function listBanks(): Promise<PaystackBank[]> {
  const response = await paystackClient.get("/bank", {
    params: { country: "nigeria", perPage: 100 },
  });
  return response.data.data;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  console.log("Webhook signature verification:", { hash, signature, isValid: hash === signature });
  return hash === signature;
}
