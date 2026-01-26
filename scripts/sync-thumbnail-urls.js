#!/usr/bin/env node

/**
 * Migration Script: Sync thumbnailUrl with imageUrl for confirmed spirits
 * 
 * This script finds all confirmed (isReviewed=true) spirits where imageUrl and thumbnailUrl differ,
 * and updates thumbnailUrl to match imageUrl.
 * 
 * Usage: node scripts/sync-thumbnail-urls.js
 */

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

async function syncThumbnailUrls() {
  try {
    console.log('Starting thumbnailUrl synchronization...');
    console.log('Finding confirmed spirits where imageUrl != thumbnailUrl...\n');
    
    // Fetch all confirmed spirits
    const spiritsRef = db.collection('spirits');
    const snapshot = await spiritsRef.where('isReviewed', '==', true).get();
    
    console.log(`Found ${snapshot.size} confirmed spirits to check`);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const mismatchedSpirits = [];
    
    // First pass: Find mismatches
    for (const doc of snapshot.docs) {
      try {
        const spirit = doc.data();
        const imageUrl = spirit.imageUrl || null;
        const thumbnailUrl = spirit.thumbnailUrl || null;
        
        // Check if they differ
        if (imageUrl !== thumbnailUrl) {
          mismatchedSpirits.push({
            id: doc.id,
            name: spirit.name,
            imageUrl: imageUrl,
            thumbnailUrl: thumbnailUrl
          });
        }
      } catch (error) {
        console.error(`Error checking spirit ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\nFound ${mismatchedSpirits.length} spirits with mismatched URLs\n`);
    
    if (mismatchedSpirits.length === 0) {
      console.log('✅ No mismatches found. All confirmed spirits are already in sync!');
      process.exit(0);
    }
    
    // Display first 10 mismatches
    console.log('Sample of mismatched spirits (showing first 10):');
    console.log('================================================');
    mismatchedSpirits.slice(0, 10).forEach((spirit, idx) => {
      console.log(`${idx + 1}. ${spirit.name} (${spirit.id})`);
      console.log(`   imageUrl:     ${spirit.imageUrl || '(null)'}`);
      console.log(`   thumbnailUrl: ${spirit.thumbnailUrl || '(null)'}`);
      console.log('');
    });
    
    // Update in batches
    const batchSize = 500;
    let batch = db.batch();
    let operationsInBatch = 0;
    
    console.log('Starting batch updates...\n');
    
    for (const spirit of mismatchedSpirits) {
      try {
        const docRef = spiritsRef.doc(spirit.id);
        
        // Update thumbnailUrl to match imageUrl
        batch.update(docRef, { 
          thumbnailUrl: spirit.imageUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        operationsInBatch++;
        updated++;
        
        // Commit batch if it reaches the limit
        if (operationsInBatch >= batchSize) {
          await batch.commit();
          console.log(`✅ Committed batch of ${operationsInBatch} updates (${updated}/${mismatchedSpirits.length})`);
          batch = db.batch();
          operationsInBatch = 0;
        }
      } catch (error) {
        console.error(`❌ Error updating spirit ${spirit.id}:`, error.message);
        errors++;
      }
    }
    
    // Commit remaining operations
    if (operationsInBatch > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch of ${operationsInBatch} updates`);
    }
    
    console.log('\n=== Synchronization Complete ===');
    console.log(`Total confirmed spirits checked: ${snapshot.size}`);
    console.log(`Mismatches found: ${mismatchedSpirits.length}`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    
  } catch (error) {
    console.error('❌ Synchronization failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the synchronization
syncThumbnailUrls();
