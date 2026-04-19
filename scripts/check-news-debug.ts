import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getAppPath } from '../lib/db/path-config';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const paths = getAppPath('k-spirits-club-hub');

async function checkNews() {
  console.log(`Checking path: ${paths.news}`);
  const snapshot = await db.collection(paths.news).get();
  console.log(`News count in ${paths.news}: ${snapshot.size}`);

  const ids = ['global-news-2025-04-16', 'korea-whisky-expo-2026'];
  for (const id of ids) {
    const doc = await db.collection(paths.news).doc(id).get();
    console.log(`- ${id} exists: ${doc.exists}`);
  }
}

checkNews();
