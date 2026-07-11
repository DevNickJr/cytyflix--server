import axios from "axios";
import env from "@/configs/env.config";

const dojahClient = axios.create({
  baseURL: env.DOJAH_BASE_URL,
  headers: {
    Authorization: env.DOJAH_SECRET_KEY,
    AppId: env.DOJAH_APP_ID,
    "Content-Type": "application/json",
  },
});

export interface DojahVNINResponse {
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: string;
  photo?: string;
  nin: string;
}

/**
 * Verify a Virtual NIN (vNIN) using the Dojah API.
 * vNIN is a 16-character alphanumeric token generated from the NIMC mobile app.
 * It expires after 72 hours and replaces raw 11-digit NIN for verification.
 */
export async function verifyVNIN(vnin: string): Promise<DojahVNINResponse> {
  try {
    const response = await dojahClient.get("/api/v1/kyc/nin/vnin", {
      params: { vnin },
    });
    return response.data.entity;
  } catch (error: any) {
    const message = error.response?.data?.error?.message || "NIN verification failed";
    throw new Error(`Dojah vNIN verification failed: ${message}`);
  }
}
