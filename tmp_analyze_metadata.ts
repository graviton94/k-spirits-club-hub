
import { dbAdminListRawSpirits } from './lib/db/data-connect-admin';
import { getEnv } from './lib/env';

async function analyzeMetadata() {
    console.log('--- Metadata Key Analysis ---');
    try {
        const spirits = await dbAdminListRawSpirits({ limit: 1000 });
        console.log(`Total spirits fetched: ${spirits.length}`);
        
        const keyCounts: Record<string, number> = {};
        let spiritsWithMetadata = 0;

        for (const s of spirits) {
            // Need to fetch full record if dbAdminListRawSpirits doesn't return metadata
            // Actually dbAdminListRawSpirits usually only returns id/name/imageUrl/updatedAt
            // Let's check data-connect-admin.ts
        }
    } catch (e) {
        console.error(e);
    }
}
