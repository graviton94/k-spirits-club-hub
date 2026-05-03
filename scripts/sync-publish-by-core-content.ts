import fs from 'node:fs/promises';
import path from 'node:path';
import * as jose from 'jose';

type SpiritFull = {
  id: string;
  name: string;
  nameEn?: string | null;
  category: string;
  categoryEn?: string | null;
  mainCategory?: string | null;
  subcategory?: string | null;
  distillery?: string | null;
  bottler?: string | null;
  abv?: number | null;
  volume?: number | null;
  country?: string | null;
  region?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  descriptionKo?: string | null;
  descriptionEn?: string | null;
  pairingGuideKo?: string | null;
  pairingGuideEn?: string | null;
  noseTags?: string[] | null;
  palateTags?: string[] | null;
  finishTags?: string[] | null;
  tastingNote?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  isReviewed?: boolean | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  metadata?: any;
  importer?: string | null;
  rawCategory?: string | null;
};

const LOCATION = process.env.DATA_CONNECT_LOCATION || 'asia-northeast3';
const SERVICE_ID = process.env.DATA_CONNECT_SERVICE_ID || 'k-spirits-club-hub';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const THRESHOLD_ARG = args.find((a) => a.startsWith('--threshold='));
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const OFFSET_ARG = args.find((a) => a.startsWith('--offset='));

const QUALITY_THRESHOLD = THRESHOLD_ARG ? Number(THRESHOLD_ARG.split('=')[1]) : 70;
const WINDOW_LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : null;
const WINDOW_OFFSET = OFFSET_ARG ? Number(OFFSET_ARG.split('=')[1]) : 0;

let cachedToken: { token: string; expiry: number } | null = null;

async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiry > now + 60) return cachedToken.token;

  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').replace(/["']/g, '').trim();
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
    .replace(/["']/g, '')
    .trim()
    .replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY in environment');
  }

  const jwt = await new jose.SignJWT({
    iss: clientEmail,
    sub: clientEmail,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(await jose.importPKCS8(privateKey, 'RS256'));

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = (await res.json()) as any;
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth token fetch failed: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    token: data.access_token,
    expiry: now + (data.expires_in || 3600),
  };

  return data.access_token as string;
}

async function executeGraphql(operationName: string, query: string, variables: Record<string, unknown>) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID');

  const accessToken = await getGoogleAccessToken();
  const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}`,
    },
    body: JSON.stringify({ operationName, query, variables }),
  });

  const body = (await res.json()) as any;
  if (!res.ok) {
    throw new Error(`Data Connect REST Error (${res.status}): ${JSON.stringify(body).slice(0, 300)}`);
  }
  if (body.errors?.length) {
    throw new Error(`GraphQL Error: ${body.errors[0]?.message || 'Unknown error'}`);
  }
  return body.data;
}

const LIST_SPIRITS_PAGE = `
  query listSpiritsPage($limit: Int, $offset: Int) {
    spirits(limit: $limit, offset: $offset, orderBy: [{ updatedAt: DESC }]) {
      id
      name
      nameEn
      category
      categoryEn
      mainCategory
      subcategory
      distillery
      bottler
      abv
      volume
      country
      region
      imageUrl
      thumbnailUrl
      descriptionKo
      descriptionEn
      pairingGuideKo
      pairingGuideEn
      noseTags
      palateTags
      finishTags
      tastingNote
      status
      isPublished
      isReviewed
      reviewedBy
      reviewedAt
      rating
      reviewCount
      metadata
      importer
      rawCategory
    }
  }
`;

const UPSERT_SPIRIT = `
  mutation upsertSpirit(
    $id: String!,
    $name: String!,
    $category: String!,
    $nameEn: String,
    $categoryEn: String,
    $mainCategory: String,
    $subcategory: String,
    $distillery: String,
    $bottler: String,
    $abv: Float,
    $volume: Int,
    $country: String,
    $region: String,
    $imageUrl: String!,
    $thumbnailUrl: String,
    $descriptionKo: String,
    $descriptionEn: String,
    $pairingGuideKo: String,
    $pairingGuideEn: String,
    $isPublished: Boolean,
    $noseTags: [String!],
    $palateTags: [String!],
    $finishTags: [String!],
    $tastingNote: String,
    $status: String,
    $isReviewed: Boolean,
    $reviewedBy: String,
    $reviewedAt: Timestamp,
    $rating: Float,
    $reviewCount: Int,
    $importer: String,
    $rawCategory: String,
    $metadata: Any,
    $updatedAt: Timestamp
  ) {
    spirit_upsert(data: {
      id: $id,
      name: $name,
      category: $category,
      nameEn: $nameEn,
      categoryEn: $categoryEn,
      mainCategory: $mainCategory,
      subcategory: $subcategory,
      distillery: $distillery,
      bottler: $bottler,
      abv: $abv,
      volume: $volume,
      country: $country,
      region: $region,
      imageUrl: $imageUrl,
      thumbnailUrl: $thumbnailUrl,
      descriptionKo: $descriptionKo,
      descriptionEn: $descriptionEn,
      pairingGuideKo: $pairingGuideKo,
      pairingGuideEn: $pairingGuideEn,
      isPublished: $isPublished,
      noseTags: $noseTags,
      palateTags: $palateTags,
      finishTags: $finishTags,
      tastingNote: $tastingNote,
      status: $status,
      isReviewed: $isReviewed,
      reviewedBy: $reviewedBy,
      reviewedAt: $reviewedAt,
      rating: $rating,
      reviewCount: $reviewCount,
      importer: $importer,
      rawCategory: $rawCategory,
      metadata: $metadata,
      updatedAt: $updatedAt
    }) {
      id
    }
  }
`;

const LOW_VALUE_TEXT_PATTERNS = [
  /^(n\/?a|none|null|unknown|tbd)$/i,
  /^(정보\s*없음|없음|미상|미정|작성\s*예정)$/,
  /^no\s+(description|pairing|data)(\s+available)?$/i,
  /^lorem ipsum/i,
  /추후\s*업데이트/,
];

const LOW_VALUE_TAGS = new Set([
  '기타', '없음', 'unknown', 'other', 'etc', 'default', 'flavor', 'note', 'notes',
  '향', '맛', '풍미', '노트', '테이스팅', '좋음', '무난',
]);

const DEFAULT_IMAGE_URL = 'https://placehold.co/400';
const MIN_DESCRIPTION_KO_CHARS = 150;
const MIN_PAIRING_GUIDE_KO_CHARS = 100;

type QualityBreakdown = {
  score: number;
  pass: boolean;
  reasons: string[];
  fieldScores: Record<string, number>;
};

function normalizedText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isMeaningfulText(value: unknown): boolean {
  const text = normalizedText(value);
  if (!text) return false;
  if (LOW_VALUE_TEXT_PATTERNS.some((rx) => rx.test(text))) return false;
  const noSpaceLen = text.replace(/\s+/g, '').length;
  if (noSpaceLen < 20) return false;
  if (/(.)\1{6,}/.test(text)) return false;
  return true;
}

function scoreLongText(value: unknown, targetLen = 80, maxScore = 18): number {
  if (!isMeaningfulText(value)) return 0;
  const text = normalizedText(value);
  const len = text.replace(/\s+/g, ' ').trim().length;
  const base = Math.min(1, len / targetLen);
  return Math.round(base * maxScore);
}

function visibleCharLen(value: unknown): number {
  return normalizedText(value).replace(/\s+/g, '').length;
}

function hasValidEnglishName(value: unknown): boolean {
  const text = normalizedText(value);
  if (!text) return false;
  if (LOW_VALUE_TEXT_PATTERNS.some((rx) => rx.test(text))) return false;
  return text.length >= 2;
}

function hasValidImageUrl(value: unknown): boolean {
  const url = normalizedText(value);
  if (!url) return false;
  if (url === DEFAULT_IMAGE_URL) return false;
  if (/^https?:\/\/placehold\.co\//i.test(url)) return false;
  return /^https?:\/\//i.test(url) || /^\//.test(url);
}

function normalizeTagArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((v) => String(v || '').trim()).filter(Boolean))];
}

function scoreTags(value: unknown, maxScore = 12): { score: number; validCount: number; rawCount: number } {
  const tags = normalizeTagArray(value);
  const valid = tags.filter((tag) => {
    const key = tag.toLowerCase();
    if (LOW_VALUE_TAGS.has(tag) || LOW_VALUE_TAGS.has(key)) return false;
    if (tag.replace(/\s+/g, '').length < 2) return false;
    return true;
  });

  if (valid.length === 0) return { score: 0, validCount: 0, rawCount: tags.length };
  const bounded = Math.min(valid.length, 6);
  const score = Math.round((bounded / 6) * maxScore);
  return { score, validCount: valid.length, rawCount: tags.length };
}

function evaluateSpiritQuality(spirit: SpiritFull, threshold: number): QualityBreakdown {
  const fieldScores: Record<string, number> = {};
  const reasons: string[] = [];

  const nameEnValid = hasValidEnglishName(spirit.nameEn);
  const imageValid = hasValidImageUrl(spirit.imageUrl);
  const descriptionKoLen = visibleCharLen(spirit.descriptionKo);
  const pairingGuideKoLen = visibleCharLen(spirit.pairingGuideKo);

  // Heavier weight on long-form textual quality (description/pairing).
  fieldScores.descriptionKo = scoreLongText(spirit.descriptionKo, 110, 24);
  fieldScores.descriptionEn = scoreLongText(spirit.descriptionEn, 110, 24);
  fieldScores.pairingGuideKo = scoreLongText(spirit.pairingGuideKo, 90, 16);
  fieldScores.pairingGuideEn = scoreLongText(spirit.pairingGuideEn, 90, 16);

  const nose = scoreTags(spirit.noseTags, 8);
  const palate = scoreTags(spirit.palateTags, 8);
  const finish = scoreTags(spirit.finishTags, 4);

  fieldScores.noseTags = nose.score;
  fieldScores.palateTags = palate.score;
  fieldScores.finishTags = finish.score;

  if (fieldScores.descriptionKo === 0) reasons.push('descriptionKo low value');
  if (fieldScores.descriptionEn === 0) reasons.push('descriptionEn low value');
  if (fieldScores.pairingGuideKo === 0) reasons.push('pairingGuideKo low value');
  if (fieldScores.pairingGuideEn === 0) reasons.push('pairingGuideEn low value');
  if (nose.validCount < 2) reasons.push('noseTags too weak');
  if (palate.validCount < 2) reasons.push('palateTags too weak');
  if (finish.validCount < 1) reasons.push('finishTags too weak');

  if (!nameEnValid) reasons.push('nameEn missing or low value');
  if (!imageValid) reasons.push('imageUrl is blank or placeholder');
  if (descriptionKoLen < MIN_DESCRIPTION_KO_CHARS) reasons.push(`descriptionKo too short (${descriptionKoLen} < ${MIN_DESCRIPTION_KO_CHARS})`);
  if (pairingGuideKoLen < MIN_PAIRING_GUIDE_KO_CHARS) reasons.push(`pairingGuideKo too short (${pairingGuideKoLen} < ${MIN_PAIRING_GUIDE_KO_CHARS})`);

  const score = Object.values(fieldScores).reduce((sum, value) => sum + value, 0);
  const hardGate =
    nameEnValid &&
    imageValid &&
    descriptionKoLen >= MIN_DESCRIPTION_KO_CHARS &&
    pairingGuideKoLen >= MIN_PAIRING_GUIDE_KO_CHARS;

  const pass = hardGate && score >= threshold;
  if (!pass && score < threshold) {
    reasons.push(`score below threshold (${score} < ${threshold})`);
  }
  return { score, pass, reasons, fieldScores };
}

async function listAllSpirits(): Promise<SpiritFull[]> {
  const limit = 1000;
  let offset = 0;
  const rows: SpiritFull[] = [];

  while (true) {
    const data = await executeGraphql('listSpiritsPage', LIST_SPIRITS_PAGE, { limit, offset });
    const chunk = (data?.spirits || []) as SpiritFull[];
    if (!chunk.length) break;
    rows.push(...chunk);
    if (chunk.length < limit) break;
    offset += limit;
  }

  return rows;
}

async function main() {
  const startedAt = new Date();
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outDir, { recursive: true });

  console.log(`[sync-publish-by-core-content] mode=${APPLY ? 'APPLY' : 'DRY_RUN'} threshold=${QUALITY_THRESHOLD}`);
  console.log('[sync-publish-by-core-content] Loading spirits...');
  const spirits = await listAllSpirits();
  console.log(`[sync-publish-by-core-content] Loaded ${spirits.length} spirits`);

  const scoped = WINDOW_LIMIT === null
    ? spirits
    : spirits.slice(WINDOW_OFFSET, WINDOW_OFFSET + WINDOW_LIMIT);

  let inspected = 0;
  let passCount = 0;
  let failCount = 0;
  let updated = 0;
  let unchanged = 0;

  const changedRows: Array<{
    id: string;
    name: string;
    score: number;
    pass: boolean;
    reasons: string[];
    fieldScores: Record<string, number>;
    beforeStatus: string | null | undefined;
    beforeIsPublished: boolean | null | undefined;
    afterStatus: 'PUBLISHED' | 'DRAFT';
    afterIsPublished: boolean;
  }> = [];

  for (const spirit of scoped) {
    inspected += 1;

    const quality = evaluateSpiritQuality(spirit, QUALITY_THRESHOLD);
    if (quality.pass) passCount += 1;
    else failCount += 1;

    const targetStatus: 'PUBLISHED' | 'DRAFT' = quality.pass ? 'PUBLISHED' : 'DRAFT';
    const targetIsPublished = quality.pass;

    const isSameState = (spirit.status === targetStatus) && Boolean(spirit.isPublished) === targetIsPublished;
    if (isSameState) {
      unchanged += 1;
      continue;
    }

    changedRows.push({
      id: spirit.id,
      name: spirit.name,
      score: quality.score,
      pass: quality.pass,
      reasons: quality.reasons,
      fieldScores: quality.fieldScores,
      beforeStatus: spirit.status,
      beforeIsPublished: spirit.isPublished,
      afterStatus: targetStatus,
      afterIsPublished: targetIsPublished,
    });

    if (!APPLY) continue;

    await executeGraphql('upsertSpirit', UPSERT_SPIRIT, {
      ...spirit,
      status: targetStatus,
      isPublished: targetIsPublished,
      updatedAt: new Date().toISOString(),
    });

    updated += 1;
    if (updated % 100 === 0) {
      console.log(`[sync-publish-by-core-content] Updated ${updated} rows...`);
    }
  }

  const reportPath = path.join(outDir, `sync-publish-by-core-content-${stamp}.json`);
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        mode: APPLY ? 'APPLY' : 'DRY_RUN',
        threshold: QUALITY_THRESHOLD,
        window: { offset: WINDOW_OFFSET, limit: WINDOW_LIMIT },
        inspected,
        passCount,
        failCount,
        toBeUpdated: changedRows.length,
        updated,
        unchanged,
        changedRows,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log('[sync-publish-by-core-content] Done');
  console.log(`- mode: ${APPLY ? 'APPLY' : 'DRY_RUN'}`);
  console.log(`- threshold: ${QUALITY_THRESHOLD}`);
  console.log(`- window: offset=${WINDOW_OFFSET}, limit=${WINDOW_LIMIT ?? 'ALL'}`);
  console.log(`- inspected: ${inspected}`);
  console.log(`- passCount: ${passCount}`);
  console.log(`- failCount: ${failCount}`);
  console.log(`- toBeUpdated: ${changedRows.length}`);
  console.log(`- updated: ${updated}`);
  console.log(`- unchanged: ${unchanged}`);
  console.log(`- report: ${reportPath}`);
  console.log('- usage: dry-run(default) -> npx tsx scripts/sync-publish-by-core-content.ts --threshold=70');
  console.log('- usage: apply -> npx tsx scripts/sync-publish-by-core-content.ts --apply --threshold=70');
}

main().catch((error) => {
  console.error('[sync-publish-by-core-content] Failed:', error);
  process.exit(1);
});
