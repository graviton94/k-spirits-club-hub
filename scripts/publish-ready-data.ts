/**
 * Bulk Publish Script for READY_FOR_CONFIRM Spirits
 * 
 * This script publishes all spirits that have status='READY_FOR_CONFIRM' 
 * by setting isPublished=true and status='PUBLISHED'.
 * 
 * Usage:
 *   Option 1 (Direct Node.js with Firebase Admin):
 *     node scripts/publish-ready-data.js
 * 
 *   Option 2 (Via API - requires dev server running):
 *     npm run dev (in one terminal)
 *     npm run publish-ready-spirits (in another terminal)
 * 
 *   Option 3 (TypeScript with tsx):
 *     npx tsx scripts/publish-ready-data.ts
 */

async function bulkPublishViaAPI() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Bulk Publishing via API Endpoint');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const endpoint = `${API_URL}/api/admin/spirits/bulk-publish`;

    console.log(`\n📡 Calling: ${endpoint}`);
    console.log('📦 Payload: { publishByStatus: "READY_FOR_CONFIRM", updateStatus: true }\n');

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publishByStatus: 'READY_FOR_CONFIRM',
                updateStatus: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ BULK PUBLISH COMPLETED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Message: ${result.message}`);
        console.log(`✅ Successfully Published: ${result.publishedCount} spirits`);
        console.log(`❌ Failed: ${result.failedCount || 0} spirits`);

        if (result.publishedIds && result.publishedIds.length > 0) {
            console.log(`\n📝 First 10 Published IDs:`);
            result.publishedIds.slice(0, 10).forEach((id: string, idx: number) => {
                console.log(`   ${idx + 1}. ${id}`);
            });
            if (result.publishedIds.length > 10) {
                console.log(`   ... and ${result.publishedIds.length - 10} more`);
            }
        }

        if (result.failures && result.failures.length > 0) {
            console.log(`\n⚠️  Failures:`);
            result.failures.forEach((failure: any) => {
                console.log(`   ❌ ${failure.id}: ${failure.error}`);
            });
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 VERIFICATION STEPS:');
        console.log('   1. Open the app in incognito mode (guest user)');
        console.log('   2. Navigate to /explore');
        console.log('   3. Open browser console');
        console.log(`   4. Look for: [FINAL_CHECK] Guest user now sees ${result.publishedCount} spirits`);
        console.log('   5. Verify spirits are visible in the grid');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Automatic Trigger of Bulk Processor
        if (result.publishedCount > 0) {
            console.log('🤖 Auto-Triggering AI Enrichment (Bulk Processor)...');
            try {
                const { execSync } = require('child_process');
                // Inherit stdio to show the processor's output in real-time
                execSync('npx tsx scripts/bulkProcessor.ts', { stdio: 'inherit' });
            } catch (err) {
                console.error('⚠️ Automatic AI processing failed to start. You can run it manually:');
                console.error('   npx tsx scripts/bulkProcessor.ts');
            }
        } else {
            console.log('ℹ️ No new items published, skipping AI enrichment.');
        }

    } catch (error) {
        console.error('\n❌ Error during bulk publish:', error);
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('   1. Ensure the Next.js dev server is running (npm run dev)');
        console.error('   2. Check that Firebase credentials are configured');
        console.error('   3. Verify the API endpoint is accessible');
        console.error('   4. Alternatively, use: node scripts/publish-ready-data.js\n');
        process.exit(1);
    }
}

// Run the script if executed directly
bulkPublishViaAPI().catch(err => {
    console.error(err);
    process.exit(1);
});

