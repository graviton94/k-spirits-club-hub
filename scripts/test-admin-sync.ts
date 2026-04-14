import './load-env';
import { db } from '../lib/db';
import { spiritsDb, searchIndexDb } from '../lib/db/firestore-rest';
import { calculateInitialContentRating } from '../lib/utils/content-rating';

async function testAdminSync() {
  const TEST_ID = 'fsk-202500165001'; // 원석 위스키
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀 Testing Admin Sync for: ${TEST_ID}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  try {
    // 1. Fetch current state
    const beforeSpirit = await spiritsDb.getById(TEST_ID);
    if (!beforeSpirit) {
      console.error('❌ Test spirit not found in DB.');
      return;
    }
    console.log(`📡 Current Rating: ${beforeSpirit.aggregateRating?.ratingValue || 'NONE'}`);

    // 2. Perform Update (Simulate Admin "Publish")
    console.log(`\n✍️  Simulating Admin update/publish...`);
    // We update with an empty object to trigger the internal automation in updateSpirit
    await db.updateSpirit(TEST_ID, { status: 'PUBLISHED' });

    // 3. Verify Sync
    console.log(`\n🔍 Verifying Synchronization...`);
    const afterSpirit = await spiritsDb.getById(TEST_ID);
    
    // We need to fetch from search_index manually to verify atomic sync
    // searchIndexDb.getPublishedSearchIndex() might be too slow for a single item, 
    // but we added a helper or can just use REST directly.
    // Actually, let's use the new searchIndexDb.getTopInCategory to check it
    const topResults = await searchIndexDb.getTopInCategory(afterSpirit!.category, 50);
    const indexEntry = topResults.find(r => r.i === TEST_ID);

    const expectedRating = calculateInitialContentRating(afterSpirit!).ratingValue;

    console.log(`\n✅ Spirit Master: ${afterSpirit?.aggregateRating?.ratingValue} (Expected: ${expectedRating})`);
    
    if (indexEntry) {
      console.log(`✅ Search Index:  ${indexEntry.r} (Rating), ${indexEntry.rc} (Count)`);
      if (indexEntry.r === afterSpirit?.aggregateRating?.ratingValue) {
        console.log(`\n✨ SUCCESS: Atomic Synchronization Verified.`);
      } else {
        console.warn(`\n⚠️  WARNING: Data Mismatch between Collections.`);
      }
    } else {
      console.warn(`\n⚠️  WARNING: Search Index Entry not found or not published.`);
    }

  } catch (error) {
    console.error(`\n❌ Fatal Error during test:`, error);
  }
}

testAdminSync();
