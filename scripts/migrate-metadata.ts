
import { getGoogleAccessToken } from '../lib/auth/google-auth';
import { getEnv } from '../lib/env';
import * as fs from 'fs';
import * as path from 'path';

// Parse CLI Arguments
const args = process.argv.slice(2);
const offsetArg = args.find(a => a.startsWith('--offset='))?.split('=')[1];
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];

const START_OFFSET = offsetArg ? parseInt(offsetArg) : 0;
const MAX_LIMIT = limitArg ? parseInt(limitArg) : 100;

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const [key, ...rest] = line.split('=');
                if (key && rest.length > 0) process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
            });
        }
    } catch (e) {}
}

loadEnv();

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = getEnv('FIREBASE_PROJECT_ID');
    const location = getEnv('DATA_CONNECT_LOCATION') || 'asia-northeast3';
    const serviceId = getEnv('DATA_CONNECT_SERVICE_ID') || 'k-spirits-club-hub';
    const accessToken = await getGoogleAccessToken();
    const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName, query, variables }),
    });
    return await res.json();
}

// Improved Tag Parser (#A, #B, #C or [A, B, C] or A, B, C)
function parseTags(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String).filter(Boolean);
    // Split by # or comma and trim
    return String(val)
        .split(/[#,]+/)
        .map(x => x.trim())
        .filter(x => x.length > 0);
}

async function startHoisting() {
    console.log(`🚀 LIVE DB HOISTING WAVE [Offset: ${START_OFFSET}, Limit: ${MAX_LIMIT}]`);

    const listQuery = `
        query listForHoisting($limit: Int, $offset: Int) {
            spirits(limit: $limit, offset: $offset) {
                id, name, category, imageUrl, metadata,
                descriptionKo, descriptionEn, pairingGuideKo, pairingGuideEn,
                tastingNote, noseTags, palateTags, finishTags, nameEn, rawCategory, importer
            }
        }
    `;

    const upsertMutation = `
        mutation hoistSpirit(
            $id: String!, $name: String!, $category: String!, $imageUrl: String!,
            $descriptionKo: String, $descriptionEn: String, $pairingGuideKo: String, $pairingGuideEn: String,
            $rawCategory: String, $importer: String, $tastingNote: String,
            $noseTags: [String!], $palateTags: [String!], $finishTags: [String!], $nameEn: String,
            $metadata: Any
        ) {
            spirit_upsert(data: {
                id: $id, name: $name, category: $category, imageUrl: $imageUrl,
                descriptionKo: $descriptionKo, descriptionEn: $descriptionEn,
                pairingGuideKo: $pairingGuideKo, pairingGuideEn: $pairingGuideEn,
                rawCategory: $rawCategory, importer: $importer, tastingNote: $tastingNote,
                noseTags: $noseTags, palateTags: $palateTags, finishTags: $finishTags, nameEn: $nameEn,
                metadata: $metadata
            }) { id }
        }
    `;

    const listRes: any = await executeGraphql('listForHoisting', listQuery, { limit: MAX_LIMIT, offset: START_OFFSET });
    const spirits = listRes.data?.spirits || [];
    
    if (spirits.length === 0) {
        console.log('🏁 No spirits found in this window.');
        return;
    }

    let updatedCount = 0;

    for (const spirit of spirits) {
        const meta = spirit.metadata || {};
        const vars: any = { ...spirit }; // Start with current values

        const mappings = [
            { s: 'description_ko', t: 'descriptionKo' },
            { s: 'description_en', t: 'descriptionEn' },
            { s: 'pairing_guide_ko', t: 'pairingGuideKo' },
            { s: 'pairing_guide_en', t: 'pairingGuideEn' },
            { s: 'nose_tags', t: 'noseTags', isArray: true },
            { s: 'palate_tags', t: 'palateTags', isArray: true },
            { s: 'finish_tags', t: 'finishTags', isArray: true },
            { s: 'tasting_note', t: 'tastingNote' },
            { s: 'raw_category', t: 'rawCategory' },
            { s: 'importer', t: 'importer' },
            { s: 'name_en', t: 'nameEn' }
        ];

        let modified = false;
        const newMetadata = { ...meta };

        mappings.forEach(({ s, t, isArray }) => {
            if (meta[s]) {
                const value = meta[s];
                vars[t] = isArray ? parseTags(value) : value;
                delete newMetadata[s];
                modified = true;
            }
        });

        if (modified) {
            vars.metadata = newMetadata;
            console.log(`  ✨ Hoisting: ${spirit.name} (${spirit.id})`);
            const res = await executeGraphql('hoistSpirit', upsertMutation, vars);
            if (!res.errors) updatedCount++;
        }
    }

    console.log(`\n✅ WAVE FINISHED: ${updatedCount} records successfully hoisted.`);
    console.log(`Next Wave Command: npx tsx scripts/migrate-metadata.ts --offset=${START_OFFSET + MAX_LIMIT} --limit=${MAX_LIMIT}`);
}

startHoisting();
