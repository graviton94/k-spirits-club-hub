import fs from 'node:fs/promises';
import path from 'node:path';
import * as jose from 'jose';
import admin from 'firebase-admin';

type SpiritRow = {
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

type FirestoreSpirit = FirebaseFirestore.DocumentData & {
  id?: string;
  name?: string;
  name_en?: string | null;
  nameEn?: string | null;
  category?: string;
  category_en?: string | null;
  categoryEn?: string | null;
  main_category?: string | null;
  mainCategory?: string | null;
  subcategory?: string | null;
  distillery?: string | null;
  bottler?: string | null;
  abv?: number | string | null;
  volume?: number | string | null;
  country?: string | null;
  region?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  description_ko?: string | null;
  descriptionKo?: string | null;
  description_en?: string | null;
  descriptionEn?: string | null;
  pairing_guide_ko?: string | null;
  pairingGuideKo?: string | null;
  pairing_guide_en?: string | null;
  pairingGuideEn?: string | null;
  nose_tags?: unknown;
  noseTags?: unknown;
  palate_tags?: unknown;
  palateTags?: unknown;
  finish_tags?: unknown;
  finishTags?: unknown;
  tasting_note?: string | null;
  tastingNote?: string | null;
  status?: string | null;
  importer?: string | null;
  raw_category?: string | null;
  rawCategory?: string | null;
  isPublished?: boolean | null;
  isReviewed?: boolean | null;
  reviewedBy?: string | null;
  reviewedAt?: unknown;
  source?: string | null;
  externalId?: string | null;
  metadata?: Record<string, unknown> | null;
  updatedAt?: unknown;
  createdAt?: unknown;
};

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const OVERWRITE_DIFFERENT = args.includes('--overwrite-different');
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const OFFSET_ARG = args.find((a) => a.startsWith('--offset='));
const TARGET_ID_ARG = args.find((a) => a.startsWith('--id='));

const WINDOW_LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : null;
const WINDOW_OFFSET = OFFSET_ARG ? Number(OFFSET_ARG.split('=')[1]) : 0;
const TARGET_ID = TARGET_ID_ARG ? TARGET_ID_ARG.split('=')[1] : null;

const LOCATION = process.env.DATA_CONNECT_LOCATION || 'asia-northeast3';
const SERVICE_ID = process.env.DATA_CONNECT_SERVICE_ID || 'k-spirits-club-hub';

let cachedToken: { token: string; expiry: number } | null = null;

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

function normalizeTagArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return [...new Set(parsed.map((v) => String(v).trim()).filter(Boolean))];
        }
      } catch {
        // Fall back to comma split.
      }
    }
    return [...new Set(trimmed.split(',').map((v) => v.trim()).filter(Boolean))];
  }

  return [];
}

function normalizeString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  return null;
}

function normalizeFloat(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeInt(value: unknown): number | null {
  const n = normalizeFloat(value);
  if (n === null) return null;
  return Math.trunc(n);
}

function normalizeTimestamp(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp?.toDate === 'function') {
    const d = maybeTimestamp.toDate();
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

function pickFirst<T>(...values: T[]): T | undefined {
  for (const v of values) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length > 0;
  return true;
}

function isMissing(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiry > now + 60) return cachedToken.token;

  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').replace(/['"]/g, '').trim();
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
    .replace(/['"]/g, '')
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

async function listAllDataConnectSpirits(): Promise<SpiritRow[]> {
  const limit = 1000;
  let offset = 0;
  const all: SpiritRow[] = [];

  while (true) {
    const data = await executeGraphql('listSpiritsPage', LIST_SPIRITS_PAGE, { limit, offset });
    const rows = (data?.spirits || []) as SpiritRow[];
    if (!rows.length) break;
    all.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
  }

  return all;
}

async function loadFirestoreTagMap() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  const snapshot = await admin.firestore().collection('spirits').get();
  const map = new Map<string, FirestoreSpirit>();

  snapshot.forEach((doc) => {
    map.set(doc.id, { id: doc.id, ...(doc.data() as FirestoreSpirit) });
  });

  return map;
}

function buildMergedPayload(fsDoc: FirestoreSpirit, dc: SpiritRow): SpiritRow {
  const meta = (fsDoc.metadata || {}) as Record<string, unknown>;

  const noseTags = normalizeTagArray(pickFirst(fsDoc.noseTags, fsDoc.nose_tags, meta.nose_tags, meta.noseTags));
  const palateTags = normalizeTagArray(pickFirst(fsDoc.palateTags, fsDoc.palate_tags, meta.palate_tags, meta.palateTags));
  const finishTags = normalizeTagArray(pickFirst(fsDoc.finishTags, fsDoc.finish_tags, meta.finish_tags, meta.finishTags));

  const mergedMetadata = {
    ...(dc.metadata || {}),
    ...(meta || {}),
  } as Record<string, unknown>;

  if (hasValue(fsDoc.source) && !hasValue(mergedMetadata.source)) {
    mergedMetadata.source = fsDoc.source;
  }
  if (hasValue(fsDoc.externalId) && !hasValue(mergedMetadata.externalId)) {
    mergedMetadata.externalId = fsDoc.externalId;
  }
  const fsCreatedAt = normalizeTimestamp(fsDoc.createdAt);
  if (fsCreatedAt && !hasValue(mergedMetadata.originalCreatedAt)) {
    mergedMetadata.originalCreatedAt = fsCreatedAt;
  }

  const imageUrl = normalizeString(pickFirst(fsDoc.imageUrl, fsDoc.thumbnailUrl, dc.imageUrl)) || 'https://placehold.co/400';
  const thumbnailUrl = normalizeString(pickFirst(fsDoc.thumbnailUrl, fsDoc.imageUrl, dc.thumbnailUrl, imageUrl));

  return {
    ...dc,
    id: normalizeString(pickFirst(fsDoc.id, dc.id)) || dc.id,
    name: normalizeString(pickFirst(fsDoc.name, dc.name)) || dc.name,
    nameEn: normalizeString(pickFirst(fsDoc.nameEn, fsDoc.name_en, meta.name_en, dc.nameEn)),
    category: normalizeString(pickFirst(fsDoc.category, dc.category)) || dc.category,
    categoryEn: normalizeString(pickFirst(fsDoc.categoryEn, fsDoc.category_en, meta.category_en, dc.categoryEn)),
    mainCategory: normalizeString(pickFirst(fsDoc.mainCategory, fsDoc.main_category, meta.main_category, dc.mainCategory)),
    subcategory: normalizeString(pickFirst(fsDoc.subcategory, meta.subcategory, dc.subcategory)),
    distillery: normalizeString(pickFirst(fsDoc.distillery, meta.distillery, dc.distillery)),
    bottler: normalizeString(pickFirst(fsDoc.bottler, meta.bottler, dc.bottler)),
    abv: normalizeFloat(pickFirst(fsDoc.abv, meta.abv, dc.abv)),
    volume: normalizeInt(pickFirst(fsDoc.volume, meta.volume, dc.volume)),
    country: normalizeString(pickFirst(fsDoc.country, meta.country, dc.country)),
    region: normalizeString(pickFirst(fsDoc.region, meta.region, dc.region)),
    imageUrl,
    thumbnailUrl,
    descriptionKo: normalizeString(pickFirst(fsDoc.descriptionKo, fsDoc.description_ko, meta.description_ko, dc.descriptionKo)),
    descriptionEn: normalizeString(pickFirst(fsDoc.descriptionEn, fsDoc.description_en, meta.description_en, dc.descriptionEn)),
    pairingGuideKo: normalizeString(pickFirst(fsDoc.pairingGuideKo, fsDoc.pairing_guide_ko, meta.pairing_guide_ko, dc.pairingGuideKo)),
    pairingGuideEn: normalizeString(pickFirst(fsDoc.pairingGuideEn, fsDoc.pairing_guide_en, meta.pairing_guide_en, dc.pairingGuideEn)),
    noseTags,
    palateTags,
    finishTags,
    tastingNote: normalizeString(pickFirst(fsDoc.tastingNote, fsDoc.tasting_note, meta.tasting_note, dc.tastingNote)),
    status: normalizeString(pickFirst(fsDoc.status, dc.status)),
    importer: normalizeString(pickFirst(fsDoc.importer, meta.importer, dc.importer)),
    rawCategory: normalizeString(pickFirst(fsDoc.rawCategory, fsDoc.raw_category, meta.raw_category, dc.rawCategory)),
    isPublished: normalizeBoolean(pickFirst(fsDoc.isPublished, dc.isPublished)),
    isReviewed: normalizeBoolean(pickFirst(fsDoc.isReviewed, dc.isReviewed)),
    reviewedBy: normalizeString(pickFirst(fsDoc.reviewedBy, dc.reviewedBy)),
    reviewedAt: normalizeTimestamp(pickFirst(fsDoc.reviewedAt, dc.reviewedAt)),
    rating: normalizeFloat(pickFirst(dc.rating, 0)),
    reviewCount: normalizeInt(pickFirst(dc.reviewCount, 0)),
    metadata: mergedMetadata,
  };
}

function collectDiffFields(before: SpiritRow, after: SpiritRow): string[] {
  const fields: Array<keyof SpiritRow> = [
    'nameEn', 'categoryEn', 'mainCategory', 'subcategory', 'distillery', 'bottler',
    'abv', 'volume', 'country', 'region', 'imageUrl', 'thumbnailUrl',
    'descriptionKo', 'descriptionEn', 'pairingGuideKo', 'pairingGuideEn',
    'noseTags', 'palateTags', 'finishTags', 'tastingNote',
    'status', 'importer', 'rawCategory',
    'isPublished', 'isReviewed', 'reviewedBy', 'reviewedAt',
    'metadata'
  ];

  return fields.filter((f) => !deepEqual(before[f], after[f]));
}

async function main() {
  const startedAt = new Date();
  const timestamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outDir, { recursive: true });

  console.log(`[tag-migration] mode=${APPLY ? 'APPLY' : 'DRY_RUN'} overwriteDifferent=${OVERWRITE_DIFFERENT}`);
  console.log('[tag-migration] Loading Firestore source data...');
  const firestoreTagMap = await loadFirestoreTagMap();
  console.log(`[tag-migration] Firestore spirits loaded: ${firestoreTagMap.size}`);

  console.log('[tag-migration] Loading Data Connect spirits...');
  const dcSpirits = await listAllDataConnectSpirits();
  console.log(`[tag-migration] Data Connect spirits loaded: ${dcSpirits.length}`);

  const backup: Array<{
    id: string;
    name: string;
    before: Partial<SpiritRow>;
    after: Partial<SpiritRow>;
    reason: string[];
  }> = [];

  let missingInFirestore = 0;
  let candidateCount = 0;
  let fixedCount = 0;
  let failedCount = 0;
  let alreadySynced = 0;

  let rows = dcSpirits;
  if (TARGET_ID) {
    rows = rows.filter((r) => r.id === TARGET_ID);
  }
  if (WINDOW_LIMIT !== null) {
    rows = rows.slice(WINDOW_OFFSET, WINDOW_OFFSET + WINDOW_LIMIT);
  }

  for (const spirit of rows) {
    const source = firestoreTagMap.get(spirit.id);
    if (!source) {
      missingInFirestore += 1;
      continue;
    }

    const merged = buildMergedPayload(source, spirit);
    const diffFields = collectDiffFields(spirit, merged);
    if (!diffFields.length) {
      alreadySynced += 1;
      continue;
    }

    const fillOnlyFields = diffFields.filter((f) => isMissing((spirit as any)[f]) && hasValue((merged as any)[f]));
    const overwriteFields = diffFields.filter((f) => !isMissing((spirit as any)[f]) && hasValue((merged as any)[f]));

    const selectedFields = OVERWRITE_DIFFERENT
      ? diffFields
      : [...fillOnlyFields];

    if (!selectedFields.length) {
      alreadySynced += 1;
      continue;
    }

    candidateCount += 1;
    backup.push({
      id: spirit.id,
      name: spirit.name,
      before: Object.fromEntries(selectedFields.map((f) => [f, (spirit as any)[f]])),
      after: Object.fromEntries(selectedFields.map((f) => [f, (merged as any)[f]])),
      reason: [
        `fill:${fillOnlyFields.join(',') || '-'}`,
        `overwrite:${overwriteFields.join(',') || '-'}`,
        `selected:${selectedFields.join(',')}`,
      ],
    });

    if (!APPLY) continue;

    const updatePayload: SpiritRow = {
      ...spirit,
      ...Object.fromEntries(selectedFields.map((f) => [f, (merged as any)[f]])),
      updatedAt: normalizeTimestamp(source.updatedAt) || new Date().toISOString(),
    };

    try {
      await executeGraphql('upsertSpirit', UPSERT_SPIRIT, {
        ...updatePayload,
      });
      fixedCount += 1;
      if (fixedCount % 100 === 0) {
        console.log(`[tag-migration] Updated ${fixedCount} / ${candidateCount} candidates...`);
      }
    } catch (error: any) {
      failedCount += 1;
      console.error(`[tag-migration] Failed ${spirit.id}: ${error.message}`);
    }
  }

  const reportPath = path.join(outDir, `firestore-tag-migration-${timestamp}.json`);
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        mode: APPLY ? 'APPLY' : 'DRY_RUN',
        overwriteDifferent: OVERWRITE_DIFFERENT,
        startedAt: startedAt.toISOString(),
        finishedAt: new Date().toISOString(),
        firestoreRows: firestoreTagMap.size,
        dataConnectRows: dcSpirits.length,
        processedRows: rows.length,
        targetId: TARGET_ID,
        window: { offset: WINDOW_OFFSET, limit: WINDOW_LIMIT },
        missingInFirestore,
        alreadySynced,
        candidateCount,
        fixedCount,
        failedCount,
        changes: backup,
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log('[tag-migration] Done');
  console.log(`- mode: ${APPLY ? 'APPLY' : 'DRY_RUN'}`);
  console.log(`- candidateCount: ${candidateCount}`);
  console.log(`- fixedCount: ${fixedCount}`);
  console.log(`- failedCount: ${failedCount}`);
  console.log(`- alreadySynced: ${alreadySynced}`);
  console.log(`- missingInFirestore: ${missingInFirestore}`);
  console.log(`- report: ${reportPath}`);
  console.log(`- tips: use --apply to execute writes, --overwrite-different to force source overwrite`);
}

main().catch((error) => {
  console.error('[tag-migration] Fatal:', error);
  process.exit(1);
});
