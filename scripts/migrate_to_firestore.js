const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' }); // Load envs if execution is local
require('dotenv').config();

// Initialize Firebase
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is not set in environment variables.");
    process.exit(1);
}

// Handle private key newlines
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
const BATCH_SIZE = 400; // Firestore batch limit is 500

async function migrate() {
    const filePath = path.join(__dirname, '../lib/db/ingested-data.json');
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const spirits = JSON.parse(raw);

    console.log(`Found ${spirits.length} spirits to migrate...`);

    let batch = db.batch();
    let count = 0;
    let totalCommitted = 0;

    for (const spirit of spirits) {
        const docRef = db.collection('spirits').doc(spirit.id);

        // Convert Dates
        const prepareData = {
            ...spirit,
            createdAt: spirit.createdAt ? new Date(spirit.createdAt) : new Date(),
            updatedAt: spirit.updatedAt ? new Date(spirit.updatedAt) : new Date(),
            reviewedAt: spirit.reviewedAt ? new Date(spirit.reviewedAt) : null,
            metadata: spirit.metadata || {}
        };

        // Remove undefined
        Object.keys(prepareData).forEach(key => prepareData[key] === undefined && delete prepareData[key]);

        batch.set(docRef, prepareData);
        count++;

        if (count >= BATCH_SIZE) {
            await batch.commit();
            totalCommitted += count;
            console.log(`Committed ${totalCommitted} / ${spirits.length} items...`);
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
        totalCommitted += count;
    }

    console.log('Migration Complete! Total items:', totalCommitted);
}

migrate().catch(console.error);
