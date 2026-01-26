const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
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

if (!privateKey) {
    console.error("Error: FIREBASE_PRIVATE_KEY is not set or malformed in environment variables.");
    console.error("Please check your .env.local file.");
    process.exit(1);
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("Error: FIREBASE_CLIENT_EMAIL is not set in environment variables.");
    process.exit(1);
}

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

async function bulkPublishReadySpirits() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Starting Bulk Publish for READY_FOR_CONFIRM spirits');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        // Step 1: Get all spirits with status READY_FOR_CONFIRM
        console.log('\n📊 Querying Firestore for READY_FOR_CONFIRM spirits...');
        const spiritsRef = db.collection('spirits');
        const snapshot = await spiritsRef
            .where('status', '==', 'READY_FOR_CONFIRM')
            .get();

        if (snapshot.empty) {
            console.log('⚠️  No spirits found with status READY_FOR_CONFIRM');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            process.exit(0);
        }

        const totalSpirits = snapshot.size;
        console.log(`✅ Found ${totalSpirits} spirits to publish\n`);

        // Step 2: Update each spirit in batches
        const batchSize = 200; // Conservative batch size for safety (Firestore max is 500)
        let batchCount = 0;
        let currentBatch = db.batch();
        let successCount = 0;
        let processedCount = 0;

        for (const doc of snapshot.docs) {
            const spiritRef = spiritsRef.doc(doc.id);
            const spiritData = doc.data();
            
            // Update: set isPublished = true and status = PUBLISHED
            currentBatch.update(spiritRef, {
                isPublished: true,
                status: 'PUBLISHED',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            processedCount++;
            batchCount++;

            // Log progress for first few and periodically
            if (processedCount <= 5 || processedCount % 100 === 0) {
                console.log(`  📝 Queued: ${spiritData.name || spiritData.id} (${processedCount}/${totalSpirits})`);
            }

            // Commit batch when it reaches the limit
            if (batchCount === batchSize) {
                console.log(`\n  💾 Committing batch of ${batchCount} updates...`);
                await currentBatch.commit();
                successCount += batchCount;
                console.log(`  ✅ Batch committed successfully (${successCount}/${totalSpirits})\n`);
                
                // Start new batch
                currentBatch = db.batch();
                batchCount = 0;
            }
        }

        // Commit remaining items in the final batch
        if (batchCount > 0) {
            console.log(`\n  💾 Committing final batch of ${batchCount} updates...`);
            await currentBatch.commit();
            successCount += batchCount;
            console.log(`  ✅ Final batch committed successfully\n`);
        }

        // Step 3: Verification - Query published spirits
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 Verification: Querying published spirits...');
        const publishedSnapshot = await spiritsRef
            .where('isPublished', '==', true)
            .get();

        console.log('\n📊 FINAL REPORT:');
        console.log(`  ✅ Successfully published: ${successCount} spirits`);
        console.log(`  📈 Total published spirits in DB: ${publishedSnapshot.size}`);
        console.log(`  🎯 Guest users can now see ${publishedSnapshot.size} spirits on Explore page`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error during bulk publish:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the script
bulkPublishReadySpirits();
