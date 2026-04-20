import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getDataConnect } from 'firebase-admin/data-connect';
dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'k-spirits-club',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function count() {
    const dataConnect = getDataConnect({
      serviceId: 'k-spirits-club-hub',
      location: 'asia-northeast3',
      connector: 'main'
    });
    const result = await dataConnect.executeQuery('listSpiritReviews', { limit: 10000 });
    console.log("🔥 REAL PROGRESS: Current Review Count in PG:", (result.data as any).spiritReviews.length);
}
count().catch(console.error);
