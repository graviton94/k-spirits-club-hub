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

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const collectionPath = 'spirits';

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
    let allSpirits = [];
    const args = process.argv.slice(2);
    const fileArgIndex = args.indexOf('--file');

    if (fileArgIndex !== -1 && args[fileArgIndex + 1]) {
        // Mode 1: Specific File
        const filePath = args[fileArgIndex + 1];
        console.log(`📂 Processing specific file: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            process.exit(1);
        }
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(content)) allSpirits.push(...content);
    } else {
        // Mode 2: Scan Directory (Default)
        console.log("📂 Scanning 'data/' directory (Default Mode)...");

        // Read from data/*.json files (domestic spirits)
        if (fs.existsSync(dataDir)) {
            const files = fs.readdirSync(dataDir);
            for (const file of files) {
                if (file.startsWith('spirits_') && file.endsWith('.json')) {
                    const filePath = path.join(dataDir, file);
                    console.log(`Reading ${file}...`);
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    if (Array.isArray(content)) allSpirits.push(...content);
                }
            }
        }

        // Read from data/raw_imported/*.json files (imported spirits)
        if (fs.existsSync(rawImportedDir)) {
            const files = fs.readdirSync(rawImportedDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(rawImportedDir, file);
                    console.log(`Reading ${file} (Size: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB)...`);
                    try {
                        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                        if (Array.isArray(content)) {
                            allSpirits.push(...content);
                            console.log(`  -> Loaded ${content.length} records.`);
                        }
                    } catch (e) {
                        console.error(`  -> Failed to parse ${file}: ${e.message}`);
                    }
                }
            }
        }
    }

    // Deduplicate by ID
    const uniqueMap = new Map();
    allSpirits.forEach(spirit => uniqueMap.set(spirit.id, spirit));
    let spirits = Array.from(uniqueMap.values());

    console.log(`Found ${spirits.length} unique spirits to migrate (from ${allSpirits.length} total)...`);

    // --- RESUME CAPABILITY ---
    const logPath = path.join(__dirname, 'migration_success_log.json');
    let processedIds = new Set();

    if (fs.existsSync(logPath)) {
        try {
            const loggedData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
            processedIds = new Set(loggedData);
            console.log(`📜 Found migration log. Skipping ${processedIds.size} already uploaded items.`);
        } catch (e) {
            console.warn("⚠️ Failed to read migration log, starting fresh.");
        }
    }

    // Filter out already processed items
    const originalCount = spirits.length;
    spirits = spirits.filter(s => !processedIds.has(s.id));
    console.log(`⏭️  Skipping ${originalCount - spirits.length} items. Remaining to upload: ${spirits.length}`);

    if (spirits.length === 0) {
        console.log("✅ All items already uploaded!");
        return;
    }

    let batch = db.batch();
    let count = 0;
    let totalCommitted = 0;
    let currentBatchIds = [];

    for (const spirit of spirits) {
        // Use the new nested path
        const docRef = db.collection(collectionPath).doc(spirit.id);

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
        currentBatchIds.push(spirit.id);
        count++;

        if (count >= BATCH_SIZE) {
            await batch.commit();

            // Update Log
            try {
                const currentLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
                const updatedLog = [...currentLog, ...currentBatchIds];
                fs.writeFileSync(logPath, JSON.stringify(updatedLog, null, 2));
            } catch (e) {
                console.error("⚠️ Failed to update migration log:", e);
            }

            totalCommitted += count;
            console.log(`Committed ${totalCommitted} / ${spirits.length} items...`);

            batch = db.batch();
            count = 0;
            currentBatchIds = [];

            // Optional: Small delay to be gentle on quota if needed
            // await new Promise(r => setTimeout(r, 100));
        }
    }

    if (count > 0) {
        await batch.commit();
        // Update Log for final batch
        try {
            const currentLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
            const updatedLog = [...currentLog, ...currentBatchIds];
            fs.writeFileSync(logPath, JSON.stringify(updatedLog, null, 2));
        } catch (e) {
            console.error("⚠️ Failed to update migration log:", e);
        }
        totalCommitted += count;
    }

    console.log('Migration Complete! Total items uploaded this run:', totalCommitted);

    // Final Summary
    console.log("\n" + "=".repeat(50));
    console.log(" 📊 [SUMMARY] Firestore Migration");
    console.log("-".repeat(50));
    console.log(`  • Total Found        : ${allSpirits.length}`);
    console.log(`  • Target (Unique)    : ${spirits.length + processedIds.size}`);
    console.log(`  • Skipped (Done)     : ${processedIds.size}`);
    console.log(`  • Uploaded Now       : ${totalCommitted}`);
    console.log("=".repeat(50) + "\n");
}

migrate().catch(console.error);
