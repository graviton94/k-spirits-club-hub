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

async function deDuplicate() {
    console.log("🧹 STARTING REVIEW DE-DUPLICATION 🧹");
    
    const dataConnect = getDataConnect({
      serviceId: 'k-spirits-club-hub',
      location: 'asia-northeast3',
      connector: 'main'
    });

    const result = await dataConnect.executeQuery('listSpiritReviews', { limit: 5000 });
    const allReviews = (result.data as any).spiritReviews;
    
    console.log(`Auditing ${allReviews.length} total reviews for content duplicates...`);

    // Grouping key: userId + spiritId + hash(content)
    const groups: { [key: string]: any[] } = {};

    for (const r of allReviews) {
        const key = `${r.user.id}_${r.spirit.id}_${r.content.trim()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
    }

    let deletedCount = 0;
    for (const key in groups) {
        const group = groups[key];
        if (group.length > 1) {
            console.log(`  > Found duplicate group [${key.substring(0, 50)}...] with ${group.length} items.`);
            
            // Keep the first one, delete the rest
            const toKeep = group[0];
            const toDelete = group.slice(1);

            for (const dup of toDelete) {
                try {
                    await dataConnect.executeMutation('deleteReview', { id: dup.id });
                    deletedCount++;
                } catch (err: any) {
                    console.error(`    ❌ Failed to delete duplicate ${dup.id}: ${err.message}`);
                }
            }
        }
    }

    console.log(`✅ DE-DUPLICATION COMPLETE. ${deletedCount} redundant clones removed.`);
}

deDuplicate().catch(console.error);
