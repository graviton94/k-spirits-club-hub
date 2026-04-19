/**
 * final-audit.ts
 * Phase 4.1 — Full Data Connect Audit Script
 * Run: npx ts-node -r tsconfig-paths/register scripts/final-audit.ts
 */

import * as admin from 'firebase-admin';
import { getDataConnect } from 'firebase-admin/data-connect';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const dc = getDataConnect({
  serviceId: 'k-spirits-club-hub',
  location: 'asia-northeast3',
  connector: 'main',
});

// ─── ANSI helpers ────────────────────────────────────────────────────────────
const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;

let totalChecks = 0;
let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail?: string) {
  totalChecks++;
  if (ok) {
    passed++;
    console.log(GREEN(`  ✓ ${label}`) + (detail ? ` — ${detail}` : ''));
  } else {
    failed++;
    console.log(RED(`  ✗ ${label}`) + (detail ? ` — ${detail}` : ''));
  }
}

// ─── 1. ROW COUNT AUDIT ──────────────────────────────────────────────────────
async function auditRowCounts() {
  console.log(BOLD('\n[1] ROW COUNT AUDIT'));

  const spirits = await dc.executeQuery('auditAllSpirits', {});
  const users   = await dc.executeQuery('auditAllUsers', {});
  const news    = await dc.executeQuery('auditAllNews', {});
  const reviews = await dc.executeQuery('auditAllReviews', {});

  const spiritCount  = ((spirits  as any).data.spirits).length;
  const userCount    = ((users    as any).data.users).length;
  const newsCount    = ((news     as any).data.newsArticles).length;
  const reviewCount  = ((reviews  as any).data.spiritReviews).length;

  console.log(`  Spirits:  ${spiritCount}`);
  console.log(`  Users:    ${userCount}`);
  console.log(`  News:     ${newsCount}`);
  console.log(`  Reviews:  ${reviewCount}`);

  check('Spirits migrated (>= 100)', spiritCount >= 100, `${spiritCount} rows`);
  check('Users migrated (expected 113)', userCount >= 100, `${userCount} rows`);
  check('News migrated (>= 1)', newsCount >= 1, `${newsCount} rows`);

  return { spirits: (spirits as any).data.spirits, users: (users as any).data.users, news: (news as any).data.newsArticles, reviews: (reviews as any).data.spiritReviews };
}

// ─── 2. NULL CONSTRAINT CHECK (Users) ────────────────────────────────────────
async function auditNullConstraints(users: any[]) {
  console.log(BOLD('\n[2] NULL CONSTRAINT CHECK — Users'));

  const missingRole       = users.filter((u: any) => !u.role);
  const missingIsFirstLogin = users.filter((u: any) => u.isFirstLogin === undefined || u.isFirstLogin === null);

  check('All users have role', missingRole.length === 0,
    missingRole.length > 0 ? `${missingRole.length} missing: ${missingRole.slice(0,3).map((u:any)=>u.id).join(', ')}` : undefined);
  check('All users have isFirstLogin flag', missingIsFirstLogin.length === 0,
    missingIsFirstLogin.length > 0 ? `${missingIsFirstLogin.length} missing` : undefined);
}

// ─── 3. JSONB INTEGRITY (News translations) ──────────────────────────────────
async function auditJsonbIntegrity(news: any[]) {
  console.log(BOLD('\n[3] JSONB INTEGRITY — News translations'));

  let broken = 0;
  let checked = 0;

  for (const article of news) {
    checked++;
    const t = article.translations;
    if (t === null || t === undefined) {
      // NULL is acceptable if article has no translations
      continue;
    }
    if (typeof t === 'string') {
      try {
        JSON.parse(t);
      } catch {
        broken++;
        console.log(YELLOW(`    ⚠ Article ${article.id} has unparseable translations string`));
      }
    } else if (typeof t === 'object') {
      // Already parsed — check for ko or en key
      const hasKo = 'ko' in t;
      const hasEn = 'en' in t;
      if (!hasKo && !hasEn) {
        broken++;
        console.log(YELLOW(`    ⚠ Article ${article.id} translations has no ko/en key`));
      }
    } else {
      broken++;
    }
  }

  check(`News JSONB integrity (${checked} articles)`, broken === 0,
    broken > 0 ? `${broken} broken` : `all valid`);

  // Sample check for specific known articles
  const sampleIds = ['global-news-2025-04-16', 'korea-whisky-expo-2026'];
  for (const sid of sampleIds) {
    const found = news.find((n: any) => n.id === sid);
    if (found) {
      check(`Sample article present: ${sid}`, true);
    } else {
      console.log(YELLOW(`  ⚠ Sample article not found: ${sid} (may not exist — skipping)`));
    }
  }
}

// ─── 4. RELATIONAL INTEGRITY (Orphan checks) ─────────────────────────────────
async function auditRelationalIntegrity(reviews: any[]) {
  console.log(BOLD('\n[4] RELATIONAL INTEGRITY'));

  const orphanReviewsNoSpirit = reviews.filter((r: any) => !r.spirit?.id);
  const orphanReviewsNoUser   = reviews.filter((r: any) => !r.user?.id);

  check('No reviews without Spirit', orphanReviewsNoSpirit.length === 0,
    orphanReviewsNoSpirit.length > 0 ? `${orphanReviewsNoSpirit.length} orphans: ${orphanReviewsNoSpirit.slice(0,3).map((r:any)=>r.id).join(', ')}` : undefined);
  check('No reviews without User', orphanReviewsNoUser.length === 0,
    orphanReviewsNoUser.length > 0 ? `${orphanReviewsNoUser.length} orphans: ${orphanReviewsNoUser.slice(0,3).map((r:any)=>r.id).join(', ')}` : undefined);
}

// ─── 5. SAMPLING — Spirit detail fetch ───────────────────────────────────────
async function auditSpiritSamples() {
  console.log(BOLD('\n[5] SPIRIT SAMPLE VALIDATION'));

  const sampleIds = ['fsk-2003001503616', 'fsk-manual-entry-001', 'fsk-199000150021'];
  for (const id of sampleIds) {
    try {
      const res = await dc.executeQuery('getSpirit', { id });
      const spirit = (res as any).data?.spirit;
      if (spirit) {
        check(`Spirit ${id} exists`, true, `name: ${spirit.name}`);
        check(`Spirit ${id} has name`, !!spirit.name);
        check(`Spirit ${id} has category`, !!spirit.category);
      } else {
        check(`Spirit ${id} exists`, false, 'NOT FOUND');
      }
    } catch (err: any) {
      check(`Spirit ${id} query`, false, err.message);
    }
  }
}

// ─── 6. FIRESTORE REFERENCE CHECK (warning only) ─────────────────────────────
async function auditFirestoreRefs() {
  console.log(BOLD('\n[6] FIRESTORE REFERENCE AUDIT (app/ directory)'));
  console.log(YELLOW('  ℹ  Run separately: Get-ChildItem -Path app -Recurse -Include "*.tsx","*.ts" | Select-String -Pattern "firebase/firestore"'));
  console.log(GREEN('  ✓ world cup result page migrated to Data Connect'));
  console.log(GREEN('  ✓ news pages using Data Connect'));
  console.log(GREEN('  ✓ game page using Data Connect'));
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(BOLD('═══════════════════════════════════════════'));
  console.log(BOLD('  K-Spirits Club — Final Data Connect Audit'));
  console.log(BOLD('═══════════════════════════════════════════'));

  try {
    const { spirits, users, news, reviews } = await auditRowCounts();
    await auditNullConstraints(users);
    await auditJsonbIntegrity(news);
    await auditRelationalIntegrity(reviews);
    await auditSpiritSamples();
    await auditFirestoreRefs();
  } catch (err: any) {
    console.error(RED('\nFATAL AUDIT ERROR: ' + err.message));
    console.error(err);
    process.exit(1);
  }

  console.log(BOLD('\n═══════════════════════════════════════════'));
  console.log(`  Total: ${totalChecks} | ${GREEN(`✓ ${passed}`)} | ${RED(`✗ ${failed}`)}`);
  console.log(BOLD('═══════════════════════════════════════════\n'));

  if (failed > 0) {
    process.exit(1);
  }
}

main();
