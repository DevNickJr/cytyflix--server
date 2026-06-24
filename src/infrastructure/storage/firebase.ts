import { firebaseBucket } from "@/configs/firebase.config";
import env from "@/configs/env.config";

const BUCKET_NAME = `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`;

export function verifyFirebaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "firebasestorage.googleapis.com" &&
      parsed.pathname.includes(BUCKET_NAME)
    );
  } catch {
    return false;
  }
}

export async function deleteFirebaseFile(url: string): Promise<void> {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+?)(\?|$)/);
    if (!match) return;

    const filePath = match[1];
    await firebaseBucket.file(filePath).delete();
  } catch (error) {
    console.error("Failed to delete Firebase file:", error);
  }
}
