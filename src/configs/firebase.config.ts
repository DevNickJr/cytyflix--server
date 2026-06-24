import * as admin from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import env from "./env.config";

const firebaseApp = admin.initializeApp({
  credential: admin.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

export const firebaseBucket = getStorage(firebaseApp).bucket();
export { firebaseApp };
