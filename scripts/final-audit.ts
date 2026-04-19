/**
 * final-audit.ts
 * Phase 4.1 — Full Data Connect Audit
 * Uses Data Connect REST API directly (no deploy required).
 * Run: npx ts-node --project tsconfig.scripts.json scripts/final-audit.ts
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as https from 'https';

dotenv.config({ path: '.env.local' });
dotenv.config();

// ─── Init Admin SDK ──────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const LOCATION   = 'asia-northeast3';
const SERVICE_ID = 'k-spirits-club-hub';
const CONNECTOR  = 'main';

const DC_URL = `https://firebasedataconnect.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/${LOCATION}/services/${SERVICE_ID}/connectors/${CONNECTOR}:executeQuery`;

// ─── REST API helper ─────────────────────────────────────────────────────────
async function dcQuery(operationName: string, query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const token = await admin.app().options.credential!.getAccessToken();
  const accessToken = token.access_token;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ name: operationName, operationName, query, variables });
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(DC_URL, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`[${operationName}] ${parsed.error.message || JSON.stringify(parsed.error)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── ANSI helpers ────────────────────────────────────────────────────────────
const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;

let passed = 0, failed = 0;

function check(label: string, ok: boolean, detail?: string) {
  if (ok) { passed++; console.log(GREEN(`  ✓ ${label}`) + (detail ? ` — ${detail}` : '')); }
  else     { failed++; console.log(RED  (`  ✗ ${label}`) + (detail ? ` — ${detail}` : '')); }
}

// ─── 1. ROW COUNT AUDIT ──────────────────────────────────────────────────────
async function auditRowCounts() {
  console.log(BOLD('\n[1] ROW COUNT AUDIT'));

  const [spirits, users, news, reviews] = await Promise.all([
    dcQuery('auditAllSpirits',  'query auditAllSpirits { spirits { id } }'),
    dcQuery('auditAllUsers',    'query auditAllUsers { users { id role isFirstLogin } }'),
    dcQuery('auditAllNews',     'query auditAllNews { newsArticles { id translations } }'),
    dcQuery('auditAllReviews',  'query auditAllReviews { spiritReviews { id spirit { id } user { id } } }'),
  ]);

  const spiritRows  = spirits.data?.spirits   ?? [];
  const userRows    = users.data?.users        ?? [];
  const newsRows    = news.data?.newsArticles  ?? [];
  const reviewRows  = reviews.data?.spiritReviews ?? [];

  console.log(`  Spirits:  ${spiritRows.length}`);
  console.log(`  Users:    ${userRows.length}`);
  console.log(`  News:     ${newsRows.length}`);
  console.log(`  Reviews:  ${reviewRows.length}`);

  check('Spirits migrated (>= 100)',    spiritRows.length >= 100,  `${spiritRows.length} rows`);
  check('Users migrated (>= 100)',      userRows.length >= 100,    `${userRows.length} rows`);
  check('News migrated (>= 1)',         newsRows.length >= 1,      `${newsRows.length} rows`);

  return { userRows, newsRows, reviewRows };
}

// ─── 2. NULL CONSTRAINT CHECK ────────────────────────────────────────────────
async function auditNullConstraints(userRows: any[]) {
  console.log(BOLD('\n[2] NULL CONSTRAINT CHECK — Users'));

  const missingRole        = userRows.filter((u: any) => !u.role);
  const missingFirstLogin  = userRows.filter((u: any) => u.isFirstLogin === undefined || u.isFirstLogin === null);

  check('All users have role',           missingRole.length === 0,
    missingRole.length > 0 ? `${missingRole.length} missing` : undefined);
  check('All users have isFirstLogin',   missingFirstLogin.length === 0,
    missingFirstLogin.length > 0 ? `${missingFirstLogin.length} missing` : undefined);
}

// ─── 3. JSONB INTEGRITY ───────────────────────────────────────────────────────
async function auditJsonbIntegrity(newsRows: any[]) {
  console.log(BOLD('\n[3] JSONB INTEGRITY — News translations'));

  let broken = 0;
  for (const article of newsRows) {
    const t = article.translations;
    if (t === null || t === undefined) continue;
    if (typeof t === 'string') {
      try { JSON.parse(t); } catch { broken++; console.log(YELLOW(`    ⚠ ${article.id}: unparseable`)); }
    } else if (typeof t === 'object') {
      if (!('ko' in t) && !('en' in t)) {
        broken++;
        console.log(YELLOW(`    ⚠ ${article.id}: no ko/en key`));
      }
    }
  }

  check(`JSONB integrity (${newsRows.length} articles)`, broken === 0,
    broken > 0 ? `${broken} broken` : 'all valid');

  // Sample lookup
  for (const sid of ['global-news-2025-04-16', 'korea-whisky-expo-2026']) {
    const found = newsRows.find((n: any) => n.id === sid);
    if (found) check(`Sample present: ${sid}`, true);
    else console.log(YELLOW(`  ⚠ Sample not found: ${sid} (may not exist)`));
  }
}

// ─── 4. RELATIONAL INTEGRITY ─────────────────────────────────────────────────
async function auditRelationalIntegrity(reviewRows: any[]) {
  console.log(BOLD('\n[4] RELATIONAL INTEGRITY'));

  const noSpirit = reviewRows.filter((r: any) => !r.spirit?.id);
  const noUser   = reviewRows.filter((r: any) => !r.user?.id);

  check('No reviews missing Spirit', noSpirit.length === 0,
    noSpirit.length > 0 ? `${noSpirit.length} orphans` : undefined);
  check('No reviews missing User',   noUser.length === 0,
    noUser.length > 0 ? `${noUser.length} orphans` : undefined);
}

// ─── 5. SPIRIT SAMPLING ───────────────────────────────────────────────────────
async function auditSpiritSamples() {
  console.log(BOLD('\n[5] SPIRIT SAMPLE VALIDATION'));

  const ids = ['fsk-2003001503616', 'fsk-manual-entry-001', 'fsk-199000150021'];
  for (const id of ids) {
    try {
      const res = await dcQuery('getSpirit',
        'query getSpirit($id: String!) { spirit(id: $id) { id name category } }',
        { id });
      const s = res.data?.spirit;
      if (s) check(`Spirit ${id}`, true, `${s.name}`);
      else   check(`Spirit ${id}`, false, 'NOT FOUND');
    } catch (e: any) {
      check(`Spirit ${id}`, false, e.message);
    }
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(BOLD('════════════════════════════════════════'));
  console.log(BOLD('  K-Spirits — Final Data Connect Audit  '));
  console.log(BOLD('════════════════════════════════════════'));

  const { userRows, newsRows, reviewRows } = await auditRowCounts();
  await auditNullConstraints(userRows);
  await auditJsonbIntegrity(newsRows);
  await auditRelationalIntegrity(reviewRows);
  await auditSpiritSamples();

  console.log(BOLD('\n════════════════════════════════════════'));
  console.log(`  ${GREEN(`✓ ${passed} passed`)}  ${failed > 0 ? RED(`✗ ${failed} failed`) : ''}`);
  console.log(BOLD('════════════════════════════════════════\n'));

  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(RED('FATAL: ' + e.message)); process.exit(1); });
