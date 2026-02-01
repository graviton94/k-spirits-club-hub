
import { spiritsDb } from '../lib/db/firestore-rest';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function audit() {
    console.log('--- DB Subcategory Audit Starting ---');

    try {
        const allSpirits = await spiritsDb.getAll({});
        console.log(`Successfully fetched ${allSpirits.length} spirits.`);

        const auditResult: Record<string, Set<string>> = {};

        allSpirits.forEach(spirit => {
            const cat = spirit.category || 'Unknown';
            const sub = spirit.subcategory || 'None';

            if (!auditResult[cat]) {
                auditResult[cat] = new Set();
            }
            auditResult[cat].add(sub);
        });

        console.log('\n--- Real Data Summary ---');
        Object.keys(auditResult).sort().forEach(cat => {
            console.log(`\n[${cat}]`);
            const subcategories = Array.from(auditResult[cat]).sort();
            subcategories.forEach(sub => {
                console.log(`  - ${sub}`);
            });
        });

        console.log('\n--- End of Audit ---');
    } catch (err) {
        console.error('Audit failed:', err);
    }
}

audit();
