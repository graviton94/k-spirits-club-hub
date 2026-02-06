import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

// Load .env and .env.local
dotenv.config({ path: resolve(__dirname, '../.env') });
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        let serviceAccount: any;
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
            serviceAccount = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };
        }
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } catch (error) {
        console.error('ERROR: Firebase initialization failed.');
        process.exit(1);
    }
}

const db = admin.firestore();

async function diagnose() {
    const snapshot = await db.collection('spirits').where('isPublished', '==', true).get();
    const total = snapshot.size;

    let missingNameEn = 0;
    let missingRootTags = 0;
    let missingDescEn = 0;
    let missingPairingEn = 0;
    let perfectCount = 0;

    const samples: any = {
        missingNameEn: [],
        missingRootTags: [],
        missingDescEn: []
    };

    snapshot.forEach(doc => {
        const data = doc.data();
        const meta = data.metadata || {};
        let issues = 0;

        // 1. name_en at root
        if (!data.name_en) {
            missingNameEn++;
            if (samples.missingNameEn.length < 5) samples.missingNameEn.push({ id: doc.id, name: data.name });
            issues++;
        }

        // 2. tags at root (migration check)
        const hasMetaTags = meta.nose_tags?.length > 0 || meta.palate_tags?.length > 0;
        const hasRootTags = data.nose_tags?.length > 0 || data.palate_tags?.length > 0;
        if (hasMetaTags && !hasRootTags) {
            missingRootTags++;
            if (samples.missingRootTags.length < 5) samples.missingRootTags.push({ id: doc.id, name: data.name });
            issues++;
        }

        // 3. description_en (often missing in old data)
        if (!meta.description_en && !data.description_en) {
            missingDescEn++;
            if (samples.missingDescEn.length < 5) samples.missingDescEn.push({ id: doc.id, name: data.name });
            issues++;
        }

        if (issues === 0) perfectCount++;
    });

    const report = {
        total,
        perfectCount,
        perfectPercentage: ((perfectCount / total) * 100).toFixed(1) + '%',
        issues: {
            missingNameEn,
            missingRootTags,
            missingDescEn,
            missingPairingEn
        },
        samples
    };

    fs.writeFileSync('health_report.json', JSON.stringify(report, null, 2));
    console.log(`Diagnosis of ${total} published spirits complete. Result saved.`);
}

diagnose().catch(console.error);
