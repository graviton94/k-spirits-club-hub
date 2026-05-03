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

const DEFAULT_LOCATION = process.env.DATA_CONNECT_LOCATION || 'asia-northeast3';
const DEFAULT_SERVICE_ID = process.env.DATA_CONNECT_SERVICE_ID || 'k-spirits-club-hub';

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
  const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${DEFAULT_LOCATION}/services/${DEFAULT_SERVICE_ID}:executeGraphql`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${DEFAULT_LOCATION}/services/${DEFAULT_SERVICE_ID}`,
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

function hasValidPairingGuideKo(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
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
  const timestamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outDir, { recursive: true });

  console.log('[sync-publish-by-pairing-guide-ko] Loading spirits...');
  const spirits = await listAllSpirits();
  console.log(`[sync-publish-by-pairing-guide-ko] Loaded ${spirits.length} spirits`);

  const backup: Array<{
    id: string;
    name: string;
    previousStatus: string | null | undefined;
    previousIsPublished: boolean | null | undefined;
    pairingGuideKo: string | null;
    targetStatus: 'DRAFT';
    targetIsPublished: false;
  }> = [];

  let inspected = 0;
  let updated = 0;
  let unchanged = 0;
  let withPairingKo = 0;
  let withoutPairingKo = 0;

  for (const spirit of spirits) {
    inspected += 1;

    const hasPairingKo = hasValidPairingGuideKo(spirit.pairingGuideKo);
    if (hasPairingKo) {
      withPairingKo += 1;
      unchanged += 1;
      continue;
    }

    withoutPairingKo += 1;

    const isCurrentlyPublished = (spirit.status ?? null) === 'PUBLISHED' || (spirit.isPublished ?? false) === true;
    if (!isCurrentlyPublished) {
      unchanged += 1;
      continue;
    }

    backup.push({
      id: spirit.id,
      name: spirit.name,
      previousStatus: spirit.status,
      previousIsPublished: spirit.isPublished,
      pairingGuideKo: typeof spirit.pairingGuideKo === 'string' ? spirit.pairingGuideKo : null,
      targetStatus: 'DRAFT',
      targetIsPublished: false,
    });

    await executeGraphql('upsertSpirit', UPSERT_SPIRIT, {
      ...spirit,
      status: 'DRAFT',
      isPublished: false,
      updatedAt: new Date().toISOString(),
    });

    updated += 1;
    if (updated % 100 === 0) {
      console.log(`[sync-publish-by-pairing-guide-ko] Updated ${updated} records so far...`);
    }
  }

  const backupPath = path.join(outDir, `spirit-publish-sync-by-pairing-ko-backup-${timestamp}.json`);
  await fs.writeFile(
    backupPath,
    JSON.stringify(
      {
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        inspected,
        updated,
        unchanged,
        withPairingKo,
        withoutPairingKo,
        changedRows: backup,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log('[sync-publish-by-pairing-guide-ko] Done');
  console.log(`- inspected: ${inspected}`);
  console.log(`- updated: ${updated}`);
  console.log(`- unchanged: ${unchanged}`);
  console.log(`- withPairingKo: ${withPairingKo}`);
  console.log(`- withoutPairingKo: ${withoutPairingKo}`);
  console.log(`- backup: ${backupPath}`);
}

main().catch((error) => {
  console.error('[sync-publish-by-pairing-guide-ko] Failed:', error);
  process.exit(1);
});
