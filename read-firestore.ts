import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getAppPath } from './lib/db/path-config';

dotenv.config({ path: '.env.local' });
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const paths = getAppPath(APP_ID);

async function check() {
  const snapshot = await db.collection(paths.reviews).limit(2).get();
  console.log("Docs found: ", snapshot.size);
  snapshot.forEach(doc => {
    console.log("ID:", doc.id);
    console.log("Data:", JSON.stringify(doc.data(), null, 2));
  });
}

check().catch(console.error);
