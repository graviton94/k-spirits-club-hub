#!/usr/bin/env node

/**
 * Migration Script: Populate searchKeywords for all spirits
 * 
 * This script reads all spirits from Firestore and updates them with searchKeywords
 * generated from their name, English name, and distillery.
 * 
 * Usage: node scripts/populate-search-keywords.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Generates n-gram keywords from a text string
 */
function generateNGrams(text, minLength = 2, maxLength = 10) {
  if (!text || typeof text !== 'string') return [];
  
  const normalized = text.toLowerCase().trim();
  const keywords = new Set();
  
  const words = normalized.split(/\s+/);
  
  for (const word of words) {
    if (word.length === 0) continue;
    
    if (word.length <= maxLength) {
      keywords.add(word);
    }
    
    if (word.length >= minLength) {
      for (let i = 0; i <= word.length - minLength; i++) {
        for (let len = minLength; len <= Math.min(maxLength, word.length - i); len++) {
          const ngram = word.substring(i, i + len);
          if (ngram.length >= minLength) {
            keywords.add(ngram);
          }
        }
      }
    }
  }
  
  return Array.from(keywords);
}

/**
 * Generates search keywords for a spirit
 */
function generateSpiritSearchKeywords(spirit) {
  const allKeywords = new Set();
  
  if (spirit.name) {
    const nameKeywords = generateNGrams(spirit.name);
    nameKeywords.forEach(k => allKeywords.add(k));
  }
  
  if (spirit.metadata?.name_en) {
    const enNameKeywords = generateNGrams(spirit.metadata.name_en);
    enNameKeywords.forEach(k => allKeywords.add(k));
  }
  
  if (spirit.distillery) {
    const distilleryKeywords = generateNGrams(spirit.distillery);
    distilleryKeywords.forEach(k => allKeywords.add(k));
  }
  
  return Array.from(allKeywords).sort();
}

async function populateSearchKeywords() {
  try {
    console.log('Starting searchKeywords population...');
    
    // Fetch all spirits
    const spiritsRef = db.collection('spirits');
    const snapshot = await spiritsRef.get();
    
    console.log(`Found ${snapshot.size} spirits to process`);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process in batches for better performance
    const batchSize = 500;
    let batch = db.batch();
    let operationsInBatch = 0;
    
    for (const doc of snapshot.docs) {
      try {
        const spirit = doc.data();
        
        // Generate keywords
        const searchKeywords = generateSpiritSearchKeywords(spirit);
        
        if (searchKeywords.length > 0) {
          // Update the document
          batch.update(doc.ref, { searchKeywords });
          operationsInBatch++;
          updated++;
          
          // Commit batch if it reaches the limit
          if (operationsInBatch >= batchSize) {
            await batch.commit();
            console.log(`Committed batch of ${operationsInBatch} updates`);
            batch = db.batch();
            operationsInBatch = 0;
          }
        } else {
          skipped++;
        }
        
        // Log progress every 100 spirits
        if ((updated + skipped) % 100 === 0) {
          console.log(`Progress: ${updated + skipped}/${snapshot.size}`);
        }
      } catch (error) {
        console.error(`Error processing spirit ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    // Commit remaining operations
    if (operationsInBatch > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${operationsInBatch} updates`);
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`Total spirits: ${snapshot.size}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the migration
populateSearchKeywords();
