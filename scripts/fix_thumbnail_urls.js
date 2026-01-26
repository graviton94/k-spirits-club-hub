const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// Initialize Firebase Admin
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is not set in environment variables.");
    console.log("Debug: Checking .env loading...");
    console.log("Current Directory:", process.cwd());
    process.exit(1);
}

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

async function fixThumbnailUrls() {
    try {
        console.log('Starting Thumbnail URL Fix...');
        const spiritsRef = db.collection('spirits');
        const snapshot = await spiritsRef.get();

        let batch = db.batch();
        let counter = 0;
        let totalUpdated = 0;
        const batchSize = 400; // Conservative batch size

        console.log(`Scanning ${snapshot.size} documents...`);

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const imageUrl = data.imageUrl;
            const thumbnailUrl = data.thumbnailUrl;

            // Logic: Sync thumbnailUrl to match imageUrl
            // If imageUrl exists and differs from thumbnailUrl, update.
            // If imageUrl is null/undefined and thumbnailUrl exists, update to null (sync).

            let shouldUpdate = false;

            // Handle undefined/null mapping to null for comparison
            const normImage = imageUrl === undefined ? null : imageUrl;
            const normThumb = thumbnailUrl === undefined ? null : thumbnailUrl;

            if (normImage !== normThumb) {
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                const updateData = {
                    thumbnailUrl: normImage, // Set to match imageUrl (or null)
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                batch.update(doc.ref, updateData);
                counter++;
                totalUpdated++;
            }

            if (counter >= batchSize) {
                await batch.commit();
                console.log(`Committed batch of ${counter} updates.`);
                batch = db.batch();
                counter = 0;
            }
        }

        if (counter > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${counter} updates.`);
        }

        console.log('Thumbnail URL Fix Complete.');
        console.log(`Total documents updated: ${totalUpdated}`);

    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
}

fixThumbnailUrls();
