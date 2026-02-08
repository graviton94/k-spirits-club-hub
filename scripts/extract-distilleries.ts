/**
 * Extract Unique Distilleries from Firestore
 * Fetches all spirits and extracts unique distillery names to update metadata.json
 */

import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from both files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin using environment variables
if (!admin.apps.length) {
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any)
        });

        console.log('✅ Firebase Admin initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error);
        console.error('\n💡 Make sure Firebase environment variables are set in .env.local');
        process.exit(1);
    }
}

const db = admin.firestore();

async function extractDistilleries() {
    console.log('🔍 Fetching all spirits from Firestore...');

    const snapshot = await db.collection('spirits').get();

    console.log(`📊 Total spirits found: ${snapshot.size}`);

    const distillerySet = new Set<string>();

    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.distillery && typeof data.distillery === 'string' && data.distillery.trim()) {
            distillerySet.add(data.distillery.trim());
        }
    });

    const distilleries = Array.from(distillerySet).sort((a, b) => a.localeCompare(b, 'ko'));

    console.log(`\n✅ Found ${distilleries.length} unique distilleries:`);
    console.log(distilleries.slice(0, 20).join(', '), '...');

    // Read existing metadata
    const metadataPath = path.join(process.cwd(), 'lib', 'constants', 'spirits-metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    // Add distilleries to metadata
    metadata.distilleries = distilleries;

    // Write back to file
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

    console.log('\n💾 Updated spirits-metadata.json with distillery list');
    console.log(`📝 Total: ${distilleries.length} distilleries`);

    return distilleries;
}

extractDistilleries()
    .then(() => {
        console.log('\n✨ Migration complete!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
