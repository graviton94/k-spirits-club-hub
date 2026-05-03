import admin from 'firebase-admin';
import { v5 as uuidv5 } from 'uuid';
import * as jose from 'jose';
import fs from 'node:fs/promises';
import path from 'node:path';

type FirestoreReviewDoc = {
  spiritId?: string;
  userId?: string;
  userName?: string;
  spiritName?: string;
  rating?: number;
  ratingF?: number;
  ratingN?: number;
  ratingP?: number;
  notes?: string;
  content?: string;
  tagsN?: string;
  tagsP?: string;
  tagsF?: string;
  nose?: string;
  palate?: string;
  finish?: string;
  imageUrl?: string;
  imageUrls?: string[];
  likes?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const TARGET_USER_ID = 'fiO8qf1PjLZAPBNcJmvy1cpqrY52';
const LOCATION = process.env.DATA_CONNECT_LOCATION || 'asia-northeast3';
const SERVICE_ID = process.env.DATA_CONNECT_SERVICE_ID || 'k-spirits-club-hub';
const REVIEW_UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

let cachedToken: { token: string; expiry: number } | null = null;

function ensureFirebaseAdminInitialized() {
  if (admin.apps.length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error('Missing FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
    }),
  });
}

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

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = (await response.json()) as any;
  if (!response.ok || !data.access_token) {
    throw new Error(`OAuth token fetch failed: ${JSON.stringify(data)}`);
  }

  cachedToken = { token: data.access_token, expiry: now + (data.expires_in || 3600) };
  return data.access_token as string;
}

async function executeGraphql(operationName: string, query: string, variables: Record<string, unknown> = {}) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID');

  const accessToken = await getGoogleAccessToken();
  const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}`,
    },
    body: JSON.stringify({ operationName, query, variables }),
  });

  const body = (await response.json()) as any;
  if (!response.ok) {
    throw new Error(`Data Connect REST Error (${response.status}): ${JSON.stringify(body).slice(0, 500)}`);
  }
  if (body.errors?.length) {
    throw new Error(`GraphQL Error (${operationName}): ${body.errors[0]?.message || 'Unknown error'}`);
  }
  return body.data;
}

const LIST_REVIEW_LIKES = `
  query listReviewLikesBatch($limit: Int) {
    reviewLikes(limit: $limit) {
      userId
      reviewId
    }
  }
`;

const DELETE_REVIEW_LIKE = `
  mutation deleteReviewLikeByKey($userId: String!, $reviewId: UUID!) {
    reviewLike_delete(key: { userId: $userId, reviewId: $reviewId }) {
      userId
    }
  }
`;

const LIST_REVIEW_COMMENTS = `
  query listReviewCommentsBatch($limit: Int) {
    reviewComments(limit: $limit) {
      id
    }
  }
`;

const DELETE_REVIEW_COMMENT = `
  mutation deleteReviewCommentById($id: UUID!) {
    reviewComment_delete(id: $id) {
      id
    }
  }
`;

const LIST_REVIEWS = `
  query listReviewsBatch($limit: Int) {
    spiritReviews(limit: $limit) {
      id
    }
  }
`;

const DELETE_REVIEW = `
  mutation deleteReviewById($id: UUID!) {
    spiritReview_delete(id: $id) {
      id
    }
  }
`;

const UPSERT_USER = `
  mutation upsertUserForRestore($id: String!, $nickname: String, $email: String, $profileImage: String, $reviewsWritten: Int) {
    user_upsert(data: {
      id: $id,
      nickname: $nickname,
      email: $email,
      profileImage: $profileImage,
      reviewsWritten: $reviewsWritten
    }) {
      id
    }
  }
`;

const UPSERT_REVIEW = `
  mutation upsertReviewForRestore(
    $id: UUID!,
    $spiritId: String!,
    $userId: String!,
    $rating: Int!,
    $title: String,
    $content: String!,
    $nose: String,
    $palate: String,
    $finish: String,
    $likes: Int,
    $isPublished: Boolean,
    $imageUrls: [String!],
    $createdAt: Timestamp,
    $updatedAt: Timestamp
  ) {
    spiritReview_upsert(data: {
      id: $id,
      spiritId: $spiritId,
      userId: $userId,
      rating: $rating,
      title: $title,
      content: $content,
      nose: $nose,
      palate: $palate,
      finish: $finish,
      likes: $likes,
      isPublished: $isPublished,
      imageUrls: $imageUrls,
      createdAt: $createdAt,
      updatedAt: $updatedAt
    }) {
      id
    }
  }
`;

function toIsoTimestamp(input: unknown, fallback: string): string {
  if (typeof input !== 'string' || !input.trim()) return fallback;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString();
}

function normalizeRating(input: FirestoreReviewDoc): number {
  const raw =
    typeof input.rating === 'number' ? input.rating :
    typeof input.ratingF === 'number' ? input.ratingF :
    typeof input.ratingP === 'number' ? input.ratingP :
    typeof input.ratingN === 'number' ? input.ratingN :
    3;
  const rounded = Math.round(raw);
  return Math.max(1, Math.min(5, rounded));
}

function normalizeReviewPayload(docId: string, input: FirestoreReviewDoc) {
  const nowIso = new Date().toISOString();
  const spiritId = String(input.spiritId || '').trim();
  const userId = String(input.userId || TARGET_USER_ID).trim() || TARGET_USER_ID;

  if (!spiritId) {
    return null;
  }

  const imageUrls = Array.isArray(input.imageUrls)
    ? input.imageUrls.filter((v) => typeof v === 'string' && v.trim().length > 0)
    : (typeof input.imageUrl === 'string' && input.imageUrl.trim().length > 0 ? [input.imageUrl.trim()] : []);

  return {
    id: uuidv5(`${userId}:${docId}`, REVIEW_UUID_NAMESPACE),
    spiritId,
    userId,
    rating: normalizeRating(input),
    title: String(input.spiritName || input.title || '').trim() || null,
    content: String(input.notes || input.content || '').trim() || 'No tasting note provided.',
    nose: String(input.tagsN || input.nose || '').trim() || null,
    palate: String(input.tagsP || input.palate || '').trim() || null,
    finish: String(input.tagsF || input.finish || '').trim() || null,
    likes: typeof input.likes === 'number' ? Math.max(0, Math.trunc(input.likes)) : 0,
    isPublished: input.isPublished !== false,
    imageUrls: imageUrls.length > 0 ? imageUrls : null,
    createdAt: toIsoTimestamp(input.createdAt, nowIso),
    updatedAt: toIsoTimestamp(input.updatedAt, nowIso),
  };
}

async function wipeAllReviewData() {
  const batchSize = 500;
  let deletedLikes = 0;
  let deletedComments = 0;
  let deletedReviews = 0;

  while (true) {
    const likesData = await executeGraphql('listReviewLikesBatch', LIST_REVIEW_LIKES, { limit: batchSize });
    const likes = (likesData?.reviewLikes || []) as Array<{ userId: string; reviewId: string }>;
    if (likes.length === 0) break;

    for (const like of likes) {
      await executeGraphql('deleteReviewLikeByKey', DELETE_REVIEW_LIKE, {
        userId: like.userId,
        reviewId: like.reviewId,
      });
      deletedLikes += 1;
    }

    if (likes.length < batchSize) break;
  }

  while (true) {
    const commentsData = await executeGraphql('listReviewCommentsBatch', LIST_REVIEW_COMMENTS, { limit: batchSize });
    const comments = (commentsData?.reviewComments || []) as Array<{ id: string }>;
    if (comments.length === 0) break;

    for (const comment of comments) {
      await executeGraphql('deleteReviewCommentById', DELETE_REVIEW_COMMENT, { id: comment.id });
      deletedComments += 1;
    }

    if (comments.length < batchSize) break;
  }

  while (true) {
    const reviewsData = await executeGraphql('listReviewsBatch', LIST_REVIEWS, { limit: batchSize });
    const reviews = (reviewsData?.spiritReviews || []) as Array<{ id: string }>;
    if (reviews.length === 0) break;

    for (const review of reviews) {
      await executeGraphql('deleteReviewById', DELETE_REVIEW, { id: review.id });
      deletedReviews += 1;
    }

    if (reviews.length < batchSize) break;
  }

  return {
    deletedLikes,
    deletedComments,
    deletedReviews,
  };
}

async function restoreTargetUserReviews() {
  ensureFirebaseAdminInitialized();
  const db = admin.firestore();

  const userDocRef = db
    .collection('artifacts')
    .doc(APP_ID)
    .collection('users')
    .doc(TARGET_USER_ID);

  const reviewsCollectionRef = userDocRef.collection('reviews');

  const [userSnap, reviewsSnap] = await Promise.all([userDocRef.get(), reviewsCollectionRef.get()]);

  const docs = reviewsSnap.docs.map((doc) => ({ id: doc.id, data: doc.data() as FirestoreReviewDoc }));
  const mapped = docs
    .map(({ id, data }) => normalizeReviewPayload(id, data))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const userData = (userSnap.exists ? userSnap.data() : null) as Record<string, unknown> | null;
  const fallbackUserName = docs.find((d) => typeof d.data.userName === 'string' && d.data.userName.trim().length > 0)?.data.userName || null;
  const nickname =
    (typeof userData?.nickname === 'string' && userData.nickname.trim().length > 0 ? String(userData.nickname).trim() : null) ||
    (typeof userData?.userName === 'string' && userData.userName.trim().length > 0 ? String(userData.userName).trim() : null) ||
    (typeof fallbackUserName === 'string' && fallbackUserName.trim().length > 0 ? fallbackUserName.trim() : null);

  await executeGraphql('upsertUserForRestore', UPSERT_USER, {
    id: TARGET_USER_ID,
    nickname,
    email: typeof userData?.email === 'string' ? userData.email : null,
    profileImage: typeof userData?.profileImage === 'string' ? userData.profileImage : null,
    reviewsWritten: mapped.length,
  });

  const failed: Array<{ reviewDocId: string; spiritId: string; reason: string }> = [];
  let restored = 0;

  for (const review of mapped) {
    try {
      await executeGraphql('upsertReviewForRestore', UPSERT_REVIEW, review);
      restored += 1;
    } catch (error: any) {
      failed.push({
        reviewDocId: review.id,
        spiritId: review.spiritId,
        reason: String(error?.message || error),
      });
    }
  }

  return {
    sourceFirestoreDocs: docs.length,
    mappedForRestore: mapped.length,
    restored,
    failed,
    targetUser: {
      id: TARGET_USER_ID,
      nickname,
    },
  };
}

async function main() {
  const startedAt = new Date();
  console.log('[reset-and-restore-user-reviews] Starting...');

  const wipe = await wipeAllReviewData();
  console.log(`[reset-and-restore-user-reviews] Wiped: likes=${wipe.deletedLikes}, comments=${wipe.deletedComments}, reviews=${wipe.deletedReviews}`);

  const restore = await restoreTargetUserReviews();
  console.log(`[reset-and-restore-user-reviews] Restored ${restore.restored}/${restore.mappedForRestore} reviews from firestore user path.`);

  const summary = {
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    appId: APP_ID,
    wipe,
    restore,
  };

  const outDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outDir, { recursive: true });
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(outDir, `review-reset-restore-${stamp}.json`);
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`[reset-and-restore-user-reviews] Report: ${reportPath}`);

  if (restore.failed.length > 0) {
    console.error(`[reset-and-restore-user-reviews] Completed with ${restore.failed.length} failed rows.`);
    process.exitCode = 2;
    return;
  }

  console.log('[reset-and-restore-user-reviews] Completed successfully.');
}

main().catch((error) => {
  console.error('[reset-and-restore-user-reviews] Fatal:', error?.message || error);
  process.exit(1);
});
