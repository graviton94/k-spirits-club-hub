import { getDataConnect } from 'firebase-admin/data-connect';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const dc = getDataConnect({ serviceId: 'k-spirits-club-hub', location: 'asia-northeast3', connector: 'main' });

async function check() {
  console.log('--- RELATIONAL AUDIT ---');
  try {
    const ids = ['fsk-199000150021', 'fsk-200100152328'];
    for (const id of ids) {
      const res = await dc.executeQuery('getSpirit', { id });
      const s = (res as any).data.spirit;
      if (s) {
        console.log(`ID: ${id}`);
        console.log(`NAME: ${s.name}`);
        console.log(`REVIEWS_COUNT: ${s.reviews.length}`);
        console.log(`HAS_EDITOR_REVIEW: ${s.reviews.some((r: any) => r.user.role === 'ADMIN' || r.user.nickname === 'K-Spirits Editor')}`);
      } else {
        console.log(`ID: ${id} NOT FOUND`);
      }
    }
  } catch (err: any) {
    console.error('Audit Error:', err.message);
  }
}

check();
