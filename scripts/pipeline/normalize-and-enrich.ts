/**
 * normalize-and-enrich.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single CLI entry-point that replaces:
 *   normalize_spirits.py / _v2.py / normalize_spirit_names.py / normalize_remaining.py
 *   bulkProcessor.ts / enrich-all-cleanup.ts / upload_to_db.py / run_pipeline.py
 *   enrich_with_gemini.py
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/pipeline/normalize-and-enrich.ts \
 *     --source data/spirits_위스키.json \
 *     --stage all \
 *     --batch-size 4 \
 *     --limit 50 \
 *     [--dry-run]
 *
 * Stages: normalize | audit | sensory | pairing | all
 *
 * Environment (.env.local):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *   GEMINI_API_KEY
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'util';

import { normalizeSpirit } from './lib/normalizer';
import { partitionByAudit, RawSpiritInput } from './lib/auditor';
import { runSensoryStage, SensoryOutput } from './lib/sensory';
import { runPairingStage, PairingOutput } from './lib/pairing';
import { dbAdminUpsertSpirit } from '../../lib/db/data-connect-admin';

// ─── CLI arg parsing ────────────────────────────────────────────────────────
const { values: args } = parseArgs({
    options: {
        source:      { type: 'string' },
        stage:       { type: 'string', default: 'all' },
        'batch-size':{ type: 'string', default: '4' },
        limit:       { type: 'string', default: '0' },
        'dry-run':   { type: 'boolean', default: false },
        'force-reenrich': { type: 'boolean', default: false },
    },
    strict: true,
});

if (!args.source) {
    console.error('❌  --source <file.json> is required');
    process.exit(1);
}

const SOURCE_PATH  = path.resolve(args.source);
const STAGE        = (args.stage ?? 'all') as 'normalize' | 'audit' | 'sensory' | 'pairing' | 'all';
const BATCH_SIZE   = Math.max(1, parseInt(args['batch-size'] ?? '4', 10));
const LIMIT        = parseInt(args.limit ?? '0', 10);
const DRY_RUN      = args['dry-run'] ?? false;
const FORCE        = args['force-reenrich'] ?? false;

const GEMINI_KEY   = process.env.GEMINI_API_KEY ?? '';

// ─── Failure log path ───────────────────────────────────────────────────────
const LOG_DIR      = path.resolve('data/temp_pipeline');
const FAIL_LOG     = path.join(LOG_DIR, `failed_batch_log_${Date.now()}.json`);
fs.mkdirSync(LOG_DIR, { recursive: true });

// ─── Type-safe upsert payload ────────────────────────────────────────────────
// Mirrors upsertSpirit args in dataconnect/main/mutations.gql exactly.
interface UpsertSpiritPayload {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    nameEn?: string;
    categoryEn?: string;
    mainCategory?: string;
    subcategory?: string;
    distillery?: string;
    bottler?: string;
    abv?: number;
    volume?: number;
    country?: string;
    region?: string;
    thumbnailUrl?: string;
    descriptionKo?: string;
    descriptionEn?: string;
    pairingGuideKo?: string;
    pairingGuideEn?: string;
    noseTags?: string[];
    palateTags?: string[];
    finishTags?: string[];
    tastingNote?: string;
    status?: string;
    isPublished?: boolean;
    isReviewed?: boolean;
    reviewedBy?: string;
    reviewedAt?: string;
    rating?: number;
    reviewCount?: number;
    importer?: string;
    rawCategory?: string;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}

function buildPayload(
    raw: RawSpiritInput,
    sensory: SensoryOutput | null,
    pairing: PairingOutput | null
): UpsertSpiritPayload {
    return {
        id:             raw.id as string,
        name:           raw.name,
        category:       raw.category,
        imageUrl:       raw.imageUrl as string,
        nameEn:         (pairing?.nameEn || (raw.nameEn as string | undefined)) ?? undefined,
        categoryEn:     raw.categoryEn as string | undefined,
        mainCategory:   sensory?.mainCategory ?? (raw.mainCategory as string | undefined),
        subcategory:    sensory?.subcategory ?? (raw.subcategory as string | undefined),
        distillery:     sensory?.distillery ?? (raw.distillery as string | undefined),
        bottler:        raw.bottler as string | undefined,
        abv:            sensory?.abv ?? (raw.abv as number | undefined),
        volume:         raw.volume as number | undefined,
        country:        raw.country as string | undefined,
        region:         sensory?.region ?? (raw.region as string | undefined),
        thumbnailUrl:   raw.thumbnailUrl as string | undefined,
        descriptionKo:  sensory?.descriptionKo || (raw.descriptionKo as string | undefined),
        descriptionEn:  pairing?.descriptionEn || (raw.descriptionEn as string | undefined),
        pairingGuideKo: pairing?.pairingGuideKo || (raw.pairingGuideKo as string | undefined),
        pairingGuideEn: pairing?.pairingGuideEn || (raw.pairingGuideEn as string | undefined),
        noseTags:       sensory?.noseTags ?? (raw.noseTags as string[] | undefined),
        palateTags:     sensory?.palateTags ?? (raw.palateTags as string[] | undefined),
        finishTags:     sensory?.finishTags ?? (raw.finishTags as string[] | undefined),
        tastingNote:    sensory?.tastingNote ?? (raw.tastingNote as string | undefined),
        status:         'ENRICHED',
        isPublished:    (raw.isPublished as boolean | undefined) ?? false,
        isReviewed:     true,
        importer:       raw.importer as string | undefined,
        rawCategory:    raw.rawCategory as string | undefined,
        metadata:       raw.metadata as Record<string, unknown> | undefined,
        updatedAt:      new Date().toISOString(),
    };
}

// ─── Per-spirit handler with full isolation ──────────────────────────────────
interface FailedEntry {
    id: string;
    name: string;
    stage: string;
    error: string;
}

async function processOne(
    raw: RawSpiritInput,
    failures: FailedEntry[]
): Promise<void> {
    const tag = `[${raw.id}] ${raw.name}`;

    // Stage 0: Normalize
    const norm = normalizeSpirit(raw.name, raw.abv as number | undefined, raw.volume as number | undefined);
    const normalized: RawSpiritInput = {
        ...raw,
        name:   norm.name,
        abv:    norm.abv ?? raw.abv,
        volume: norm.volume ?? raw.volume,
    };

    // Stage 2: Sensory
    let sensory: SensoryOutput | null = null;
    if (STAGE === 'sensory' || STAGE === 'all') {
        try {
            sensory = await runSensoryStage({
                id:          normalized.id,
                name:        normalized.name,
                category:    normalized.category,
                distillery:  normalized.distillery as string | undefined,
                abv:         normalized.abv as number | null,
                region:      normalized.region as string | undefined,
                subcategory: normalized.subcategory as string | undefined,
            }, GEMINI_KEY);
            console.log(`  ✓ Sensory done — ${tag}`);
        } catch (err: any) {
            console.error(`  ✗ Sensory FAILED — ${tag}: ${err.message}`);
            failures.push({ id: raw.id, name: raw.name, stage: 'sensory', error: err.message });
        }
    }

    // Stage 3: Pairing
    let pairing: PairingOutput | null = null;
    if (STAGE === 'pairing' || STAGE === 'all') {
        try {
            pairing = await runPairingStage({
                id:          normalized.id,
                name:        normalized.name,
                category:    normalized.category,
                noseTags:    sensory?.noseTags,
                palateTags:  sensory?.palateTags,
                finishTags:  sensory?.finishTags,
                tastingNote: sensory?.tastingNote,
                descriptionKo: sensory?.descriptionKo,
            }, GEMINI_KEY);
            console.log(`  ✓ Pairing done — ${tag}`);
        } catch (err: any) {
            console.error(`  ✗ Pairing FAILED — ${tag}: ${err.message}`);
            failures.push({ id: raw.id, name: raw.name, stage: 'pairing', error: err.message });
        }
    }

    // Build type-safe payload
    const payload = buildPayload(normalized, sensory, pairing);

    if (DRY_RUN) {
        console.log(`  [DRY-RUN] Payload for ${tag}:`);
        console.log(JSON.stringify(payload, null, 2));
        return;
    }

    // Upsert to Data Connect
    try {
        await dbAdminUpsertSpirit(payload);
        console.log(`  ✓ Upserted — ${tag}`);
    } catch (err: any) {
        console.error(`  ✗ Upsert FAILED — ${tag}: ${err.message}`);
        failures.push({ id: raw.id, name: raw.name, stage: 'upsert', error: err.message });
    }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
    console.log(`\n🚀 K-Spirits Pipeline — stage=${STAGE} batch=${BATCH_SIZE} limit=${LIMIT} dry-run=${DRY_RUN}`);
    console.log(`   Source: ${SOURCE_PATH}\n`);

    if (!fs.existsSync(SOURCE_PATH)) {
        console.error(`❌  Source file not found: ${SOURCE_PATH}`);
        process.exit(1);
    }

    if (!DRY_RUN && !GEMINI_KEY) {
        console.error('❌  GEMINI_API_KEY is required for live enrichment');
        process.exit(1);
    }

    // Load source
    const rawData: RawSpiritInput[] = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf-8'));
    console.log(`📦  Loaded ${rawData.length} spirits from source`);

    // Stage 1: Audit — partition ready vs. skipped
    let { ready, skipped } = partitionByAudit(rawData);
    if (!FORCE) {
        console.log(`\n📋  Audit results: ${ready.length} ready, ${skipped.length} skipped`);
        skipped.slice(0, 5).forEach(s => console.log(`    SKIP [${s.spirit.id}] ${s.reason}`));
        if (skipped.length > 5) console.log(`    ... and ${skipped.length - 5} more`);
    } else {
        ready = rawData; // force re-enrich ignores audit
        console.log(`⚡  Force mode: processing all ${ready.length} spirits`);
    }

    // Apply limit
    const items = LIMIT > 0 ? ready.slice(0, LIMIT) : ready;
    console.log(`\n🎯  Processing ${items.length} spirits (limit=${LIMIT || 'none'})\n`);

    const failures: FailedEntry[] = [];
    let done = 0;

    // Batch loop (≤ BATCH_SIZE concurrent via sequential for...of)
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        console.log(`── Batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(items.length / BATCH_SIZE)} ──`);

        // Sequential within batch to respect Gemini rate limits
        for (const spirit of batch) {
            await processOne(spirit, failures);
            done++;
        }

        // Brief pause between batches to avoid 429
        if (i + BATCH_SIZE < items.length) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    // ─── Summary ──────────────────────────────────────────────────────────────
    console.log(`\n✅  Done: ${done - failures.length} succeeded, ${failures.length} failed`);

    if (failures.length > 0) {
        fs.writeFileSync(FAIL_LOG, JSON.stringify(failures, null, 2), 'utf-8');
        console.log(`⚠️   Failure log written → ${FAIL_LOG}`);
    }

    if (DRY_RUN) {
        console.log('\n[DRY-RUN] No data was written to Data Connect.');
    }
}

main().catch(err => {
    console.error('\n💥  Pipeline crashed:', err);
    process.exit(1);
});
