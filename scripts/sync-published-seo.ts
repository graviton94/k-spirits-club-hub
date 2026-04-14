const path = require('path');
const fs = require('fs');
// 1. Load Environment (CJS style to avoid hoisting)
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const { spiritsDb } = require('../lib/db/firestore-rest');
const { calculateInitialContentRating } = require('../lib/utils/content-rating');

async function syncPublishedSEO() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 SEO Migration & Search Index Sync');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('❌ Error: Missing FIREBASE_CLIENT_EMAIL in environment.');
    return;
  }

  try {
    console.log('📡 Fetching published spirit IDs...');
    const allIds = await spiritsDb.getPublishedSpiritIds();
    console.log(`✅ Found ${allIds.length} published spirits.\n`);

    if (allIds.length === 0) return;

    const BATCH_SIZE = 50;
    const COMMIT_BATCH_SIZE = 100;
    const QUALITY_THRESHOLD = 3.5;
    
    let processedCount = 0;
    let auditReport = [];
    let currentCommitBatch = [];

    for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
      const chunk = allIds.slice(i, i + BATCH_SIZE);
      console.log(`⏳ Processing batch ${Math.floor(i / BATCH_SIZE) + 1}... (${chunk.length} items)`);

      const spiritDetails = await Promise.all(
        chunk.map((id: string) => spiritsDb.getById(id).catch((err: any) => {
          console.error(`   ⚠️ Failed to fetch ${id}:`, err.message);
          return null;
        }))
      );

      for (const spirit of spiritDetails) {
        if (!spirit) continue;

        try {
          const seoResult = calculateInitialContentRating(spirit);
          const userReviews = spirit.userReviews || [];
          const userRatingSum = userReviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
          
          // Calculate aggregate including the editor's review
          const totalRatingSum = seoResult.ratingValue + userRatingSum;
          const totalCount = 1 + userReviews.length;
          const aggregateRatingValue = Number((totalRatingSum / totalCount).toFixed(1));

          const indexUpdate = {
            i: spirit.id,
            n: spirit.name,
            en: spirit.name_en || (spirit.metadata && spirit.metadata.name_en) || null,
            c: spirit.category,
            mc: spirit.mainCategory || null,
            sc: spirit.subcategory || null,
            t: spirit.thumbnailUrl || spirit.imageUrl || null,
            a: spirit.abv || 0,
            d: spirit.distillery || null,
            tn: spirit.tasting_note || null,
            cre: spirit.createdAt ? (new Date(spirit.createdAt).toISOString()) : new Date().toISOString(),
            r: aggregateRatingValue, // Short key for Google rating
            rc: totalCount,         // Short key for review count
            h: !!spirit.tasting_note
          };

          currentCommitBatch.push({
            id: spirit.id,
            spiritUpdates: {
              updatedAt: new Date(),
              aggregateRating: {
                ratingValue: aggregateRatingValue,
                reviewCount: totalCount
              },
              expertReview: seoResult.expertReview
            },
            indexUpdates: indexUpdate
          });

          // Detailed Audit for Quality Control
          if (aggregateRatingValue < QUALITY_THRESHOLD) {
            auditReport.push({
              id: spirit.id,
              name: spirit.name,
              rating: aggregateRatingValue,
              missingElements: seoResult.missingElements || []
            });
          }

          if (currentCommitBatch.length >= COMMIT_BATCH_SIZE) {
            await spiritsDb.bulkUpdateSEOData(currentCommitBatch);
            processedCount += currentCommitBatch.length;
            console.log(`   ✅ Committed ${processedCount}/${allIds.length} items...`);
            currentCommitBatch = [];
          }
        } catch (itemError: any) {
          console.error(`   ❌ Error processing ${spirit.id}:`, itemError.message);
        }
      }
    }

    if (currentCommitBatch.length > 0) {
      await spiritsDb.bulkUpdateSEOData(currentCommitBatch);
      processedCount += currentCommitBatch.length;
      console.log(`   ✅ Committed final ${currentCommitBatch.length} items...`);
    }

    // Save Audit Report
    if (auditReport.length > 0) {
      const reportPath = path.join(process.cwd(), 'low_quality_spirits.json');
      fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
      console.log(`\n💾 Saved quality report to: ${reportPath}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Quality Audit Report (Rating < ${QUALITY_THRESHOLD})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (auditReport.length === 0) {
      console.log(`✨ All spirits meet high-quality standards (>= ${QUALITY_THRESHOLD})!`);
    } else {
      console.log(`⚠️ ${auditReport.length} spirits require content enrichment:`);
      auditReport.slice(0, 10).forEach(item => {
        console.log(`   - [${item.rating}] ${item.name} (${item.id}) -> Missing: ${item.missingElements.join(', ') || 'N/A'}`);
      });
      if (auditReport.length > 10) console.log(`   ... and ${auditReport.length - 10} more.`);
    }

    console.log('\n🎉 Migration Complete!');

  } catch (error: any) {
    console.error('\n❌ Fatal Error during migration:', error.message);
    process.exit(1);
  }
}

syncPublishedSEO();

