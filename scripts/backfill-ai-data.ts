/**
 * backfill-ai-data.ts — Phase 5 (Grounded Search Discovery)
 * Enriches spirits using the new Multi-Phase Researcher protocol.
 * 
 * Run: npx ts-node --project tsconfig.scripts.json scripts/backfill-ai-data.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import * as admin from 'firebase-admin';
import { getDataConnect } from 'firebase-admin/data-connect';
import { enrichSpiritWithAI } from '../lib/services/gemini-translation';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

const dc = getDataConnect({
  serviceId: 'k-spirits-club-hub',
  location: 'asia-northeast3',
  connector: 'main',
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;
const CYAN   = (s: string) => `\x1b[36m${s}\x1b[0m`;

/**
 * mapAISpiritToSQL - Robust Sanitizer & Mapper
 * Converts non-structured AI output into strict Data Connect format.
 */
function mapAISpiritToSQL(current: any, aiData: any) {
  // 1. ABV Sanitization
  let sanitizedAbv = current.abv || 0;
  if (aiData.abv !== undefined) {
    if (typeof aiData.abv === 'number') {
      sanitizedAbv = aiData.abv;
    } else if (typeof aiData.abv === 'string') {
      const num = parseFloat(aiData.abv.replace(/[^0-9.]/g, ''));
      sanitizedAbv = isNaN(num) ? (current.abv || 0) : num;
    }
  }

  // 2. Metadata Merge (Confidence & Sources)
  const metadata = {
    ...(current.metadata || {}),
    confidence: aiData.metadata?.confidence || 0,
    sources: aiData.metadata?.sources || [],
    lastEnriched: new Date().toISOString()
  };

  // 3. Status Logic (Grounded Guardrail)
  const isConfident = metadata.confidence >= 0.7;
  const status = isConfident ? "ENRICHED" : "NEEDS_REVIEW";
  const isPublished = isConfident; // Automatically unpublish low-confidence items

  return {
    id: current.id,
    name: current.name,
    category: current.category,
    imageUrl: current.imageUrl,
    nameEn: aiData.nameEn || current.nameEn || null,
    categoryEn: aiData.categoryEn || current.categoryEn || null,
    mainCategory: current.mainCategory || null,
    subcategory: aiData.subcategory || current.subcategory || null,
    distillery: aiData.distillery || current.distillery || null,
    bottler: current.bottler || null,
    abv: sanitizedAbv,
    volume: current.volume || null,
    country: aiData.country || current.country || null,
    region: aiData.region || current.region || null,
    thumbnailUrl: current.thumbnailUrl || null,
    descriptionKo: aiData.descriptionKo || current.descriptionKo || null,
    descriptionEn: aiData.descriptionEn || current.descriptionEn || null,
    pairingGuideKo: aiData.pairingGuideKo || current.pairingGuideKo || null,
    pairingGuideEn: aiData.pairingGuideEn || current.pairingGuideEn || null,
    noseTags: aiData.noseTags || current.noseTags || [],
    palateTags: aiData.palateTags || current.palateTags || [],
    finishTags: aiData.finishTags || current.finishTags || [],
    tastingNote: aiData.tastingNote || current.tastingNote || null,
    status: status,
    isPublished: isPublished,
    isReviewed: isConfident,
    rating: current.rating || 0,
    reviewCount: current.reviewCount || 0,
    metadata: metadata
  };
}

async function main() {
  console.log(BOLD('\n🚀 STARTING GROUNDED AI BACKFILL (Researcher Mode)'));
  console.log('--------------------------------------------------');

  try {
    const res = await dc.executeQuery('listSpirits', {});
    const allPublished = (res as any).data.spirits || [];
    
    // Target items missing description or pairings
    const targetsAll = allPublished.filter((s: any) => !s.descriptionKo || !s.pairingGuideKo);
    
    // Support --limit flag
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : (process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : targetsAll.length);
    
    const targets = targetsAll.slice(0, isNaN(limit) ? targetsAll.length : limit);
    console.log(YELLOW(`[*] Targets for discovery: ${targets.length} (out of ${targetsAll.length} total missing)`));

    if (targets.length === 0) {
      console.log(GREEN('✅ All spirits are already grounded and enriched.'));
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < targets.length; i++) {
      const s = targets[i];
      console.log(`\n[${i + 1}/${targets.length}] Investigating: ${BOLD(s.name)}`);

      try {
        const detailRes = await dc.executeQuery('getSpirit', { id: s.id });
        const current = (detailRes as any).data.spirit;

        if (!current) continue;

        // The Orchestrator now handles the 3-phase research
        const aiData = await enrichSpiritWithAI({
          name: current.name,
          category: current.category,
          subcategory: current.subcategory || undefined,
          distillery: current.distillery || undefined,
          abv: current.abv || undefined,
          region: current.region || undefined,
          country: current.country || undefined,
          nameEn: current.nameEn || undefined,
        });

        const variables = mapAISpiritToSQL(current, aiData);

        // Logging the "Grounding" result
        const conf = variables.metadata.confidence;
        const sourceMark = variables.metadata.sources.length > 0 ? GREEN('[Grounded]') : RED('[Heuristic]');
        console.log(`  ${sourceMark} Confidence: ${(conf * 100).toFixed(0)}% | Status: ${CYAN(variables.status)}`);

        await dc.executeMutation('upsertSpirit', variables);
        successCount++;

      } catch (err: any) {
        console.error(RED(`  ✗ Failed: ${err.message}`));
        failCount++;
      }

      if (i < targets.length - 1) await sleep(1500);
    }

    console.log('\n' + BOLD('--------------------------------------------------'));
    console.log(BOLD('DISCOVERY SUMMARY'));
    console.log(GREEN(`✓ Success: ${successCount}`));
    console.log(RED(`✗ Fail:    ${failCount}`));
    console.log(BOLD('--------------------------------------------------\n'));

  } catch (error: any) {
    console.error(RED('FATAL ERROR: ' + error.message));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
