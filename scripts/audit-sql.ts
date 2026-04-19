import { getDataConnect } from 'firebase-admin/data-connect';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

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

const dc = getDataConnect({
  serviceId: 'k-spirits-club-hub',
  location: 'asia-northeast3',
  connector: 'main'
});

async function audit() {
  console.log('--- SQL AUDIT START ---');
  try {
    const users = await dc.executeQuery('auditAllUsers', {});
    const spirits = await dc.executeQuery('listSpirits', {});
    const news = await dc.executeQuery('auditAllNews', {});
    const reviews = await dc.executeQuery('auditAllReviews', {});

    console.log(`SQL_U:${(users as any).data.users.length}`);
    console.log(`SQL_S:${(spirits as any).data.spirits.length}`);
    console.log(`SQL_N:${(news as any).data.newsArticles.length}`);
    console.log(`SQL_R:${(reviews as any).data.spiritReviews.length}`);
  } catch (err: any) {
    console.error('Audit Error:', err.message);
  }
}

audit();
