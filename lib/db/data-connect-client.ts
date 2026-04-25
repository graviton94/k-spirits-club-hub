import { getDataConnect, terminate, DataConnect } from 'firebase/data-connect';
import { initializeApp, getApps } from 'firebase/app';
import {
  connectorConfig,
  listSpirits,
  getSpirit,
  getUserProfile,
  listNewsArticles,
  listNewArrivals,
  listTrendingSpirits,
  getNewsArticle,
  listSpiritReviews,
  getSpiritReviewsCount,
  listSpiritsForSitemap,
  auditAllNews,
  upsertSpirit,
  upsertReview,
  upsertUser,
  upsertNews,
  upsertCabinet,
  upsertModificationRequest,
  upsertWorldCupResult,
  getWorldCupResult,
  listSpiritsForWorldCup,
  listAllSpiritsForWorldCup,
  listSpiritsByCategoryForWorldCup,
  adminListRawSpirits,
  deleteSpirit,
  listAiDiscoveryLogs,
  upsertAiDiscoveryLog,
  listModificationRequests,
  deleteNews,
  listUserCabinet,
  listUserReviews,
  deleteCabinet,
  getReview,
  updateReview,
  findReview,
  searchSpiritsPublic,
  listAllCategories,
  listAllSubcategories,
  upsertReviewLike,
  deleteReviewLike,
  updateReviewLikesCount,
  upsertReviewComment,
  deleteReviewComment,
  getReviewDetail,
  listReviewComments
} from '@/src/dataconnect-generated';

/**
 * Lazy singleton — prevents 'No Firebase App' crash during Next.js
 * build-time static generation (sitemap, page data collection, etc.)
 */
let _dc: DataConnect | null = null;

export function getDC(): DataConnect {
  if (!_dc) {
    if (!getApps().length) {
      initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
    }
    _dc = getDataConnect(connectorConfig);
  }
  return _dc;
}

/**
 * Data Connect Client Wrapper
 * All functions use getDC() for lazy initialization.
 */

// --- Spirits ---
/**
 * Generic field filter to prevent 'not expected' GQL variable errors.
 * Safeguards against 'dirty' objects containing legacy or UI-specific fields.
 */
function filterAllowedFields(data: any, allowedKeys: string[]): any {
  if (!data || typeof data !== 'object') return data;
  const filtered: any = {};
  allowedKeys.forEach(key => {
    if (key in data) filtered[key] = data[key];
  });
  return filtered;
}

// --- Spirits ---
export const dbListSpirits = async (vars: { category?: string, subcategory?: string, country?: string } = {}) => {
  const { data } = await listSpirits(getDC(), vars);
  return data.spirits;
};

export const dbListSpiritsForSitemap = async () => {
  const { data } = await listSpiritsForSitemap(getDC());
  return data.spirits;
};

export const dbAdminListRawSpirits = async (vars: {
  limit?: number;
  offset?: number;
  category?: string;
  distillery?: string;
  isPublished?: boolean;
  search?: string;
}) => {
  const { data } = await adminListRawSpirits(getDC(), vars);
  return data.spirits;
};

export const dbListNewArrivals = async (limit: number) => {
  const { data } = await listNewArrivals(getDC(), { limit });
  return data.spirits;
};

export const dbListTrendingSpirits = async (limit: number) => {
  const { data } = await listTrendingSpirits(getDC(), { limit });
  return data.spirits;
};

export const dbGetSpirit = async (id: string) => {
  const { data } = await getSpirit(getDC(), { id });
  return data.spirit;
};

export const dbUpsertSpirit = async (vars: any) => {
  const normalized = {
    ...vars,
    imageUrl: vars.imageUrl?.replace(/^http:\/\//i, 'https://'),
    thumbnailUrl: vars.thumbnailUrl?.replace(/^http:\/\//i, 'https://'),
    updatedAt: new Date().toISOString()
  };
  const allowed = [
    'id', 'name', 'nameEn', 'category', 'categoryEn', 'mainCategory', 'subcategory',
    'distillery', 'bottler', 'abv', 'volume', 'country', 'region', 'imageUrl', 'thumbnailUrl',
    'descriptionKo', 'descriptionEn', 'pairingGuideKo', 'pairingGuideEn',
    'noseTags', 'palateTags', 'finishTags', 'tastingNote', 'status', 'importer', 'rawCategory',
    'isPublished', 'isReviewed', 'reviewedBy', 'reviewedAt', 'rating', 'reviewCount',
    'metadata'
  ];
  return await upsertSpirit(getDC(), filterAllowedFields(normalized, allowed));
};

export const dbDeleteSpirit = async (id: string) => {
  return await deleteSpirit(getDC(), { id });
};

export const dbSearchSpiritsPublic = async (vars: {
  search?: string;
  category?: string;
  subcategory?: string;
  limit?: number;
  offset?: number;
}) => {
  const { data } = await searchSpiritsPublic(getDC(), vars);
  return data.spirits;
};

export const dbListAllCategories = async () => {
  const { data } = await listAllCategories(getDC());
  // Process unique categories
  const unique = new Map<string, string | null | undefined>();
  data.spirits.forEach((s: { category: string; categoryEn?: string | null }) => {
    if (s.category && !unique.has(s.category)) {
      unique.set(s.category, s.categoryEn);
    }
  });
  return Array.from(unique.entries()).map(([ko, en]) => ({ ko, en }));
};

export const dbListAllSubcategories = async (category?: string) => {
  const { data } = await listAllSubcategories(getDC(), { category });
  const unique = new Set(data.spirits.map((s: { subcategory?: string | null }) => s.subcategory).filter(Boolean));
  return Array.from(unique) as string[];
};

// --- Users ---
export const dbGetUserProfile = async (id: string) => {
  const { data } = await getUserProfile(getDC(), { id });
  return data.user;
};

export const dbUpsertUser = async (vars: any) => {
  const allowed = [
    'id', 'email', 'nickname', 'profileImage', 'role', 'themePreference',
    'isFirstLogin', 'reviewsWritten', 'heartsReceived', 'tasteProfile'
  ];
  return await upsertUser(getDC(), filterAllowedFields(vars, allowed));
};

export const dbIncrementUserReviews = async (userId: string) => {
  if (userId === 'ANONYMOUS_EXPERT') return;
  const profile = await dbGetUserProfile(userId);
  if (profile) {
    return await dbUpsertUser({
      id: userId,
      reviewsWritten: (profile.reviewsWritten || 0) + 1
    });
  }
};

// --- Reviews ---
export const dbListSpiritReviews = async (limit: number, offset: number) => {
  const { data } = await listSpiritReviews(getDC(), { limit, offset });
  return data.spiritReviews;
};

export const dbGetSpiritReviewsCount = async () => {
  const { data } = await getSpiritReviewsCount(getDC());
  return data.spiritReviews.length;
};

export const dbUpsertReview = async (vars: any) => {
  // Ensure UUID format or generation if missing
  return await upsertReview(getDC(), vars);
};

// --- AI Logs ---
export const dbListAiDiscoveryLogs = async (limit: number) => {
  const { data } = await listAiDiscoveryLogs(getDC(), { limit });
  return data.aiDiscoveryLogs;
};

export const dbUpsertAiDiscoveryLog = async (vars: any) => {
  const allowed = ['id', 'userId', 'analysis', 'recommendations', 'messageHistory'];
  return await upsertAiDiscoveryLog(getDC(), filterAllowedFields(vars, allowed));
};

// --- Modification Requests ---
export const dbListModificationRequests = async () => {
  const { data } = await listModificationRequests(getDC());
  return data.modificationRequests;
};

export const dbUpsertModificationRequest = async (vars: any) => {
  const allowed = ['id', 'spiritId', 'spiritName', 'userId', 'title', 'content', 'status', 'createdAt'];
  return await upsertModificationRequest(getDC(), filterAllowedFields(vars, allowed));
};

// --- News ---
export const dbListNewsArticles = async (limit: number, offset: number) => {
  const { data } = await listNewsArticles(getDC(), { limit, offset });
  return data.newsArticles;
};

export const dbGetNewsArticle = async (id: string) => {
  const { data } = await getNewsArticle(getDC(), { id });
  return data.newsArticle;
};

export const dbGetNewsCount = async () => {
  const { data } = await auditAllNews(getDC());
  return data.newsArticles.length;
};

/** Coerce a value that may be a plain string or a structured translation object into a string. */
function extractString(value: any, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && value !== null) {
    return (value as any).ko || (value as any).en || (value as any).title || (value as any).content || (value as any).snippet || fallback;
  }
  return fallback;
}

/** Pick the best available string from a translations payload (ko preferred, then en). */
function pickTranslationTitle(translations: any): string {
  return translations?.ko?.title || translations?.en?.title || '';
}
function pickTranslationContent(translations: any): string {
  return translations?.ko?.content || translations?.ko?.snippet || translations?.en?.content || '';
}

export const dbUpsertNews = async (vars: any) => {
  const t = vars?.translations;
  const normalizedVars = {
    ...vars,
    title: String(extractString(vars?.title, pickTranslationTitle(t)) || 'Untitled').trim(),
    content: String(extractString(vars?.content, pickTranslationContent(t)) || '').trim(),
    tags: vars?.newsTags ?? vars?.tags, // Sync the discrepancy
    // Upgrade insecure links to https
    link: (vars?.link || '').replace(/^http:\/\//i, 'https://')
  };
  const allowed = ['id', 'title', 'content', 'imageUrl', 'category', 'source', 'link', 'date', 'translations', 'tags'];
  return await upsertNews(getDC(), filterAllowedFields(normalizedVars, allowed));
};

export const dbDeleteNews = async (id: string) => {
  return await deleteNews(getDC(), { id });
};

// --- Cabinet ---
export const dbUpsertCabinet = async (vars: any) => {
  // Ensure the variable names match the mutation (spiritId, userId)
  const allowed = ['userId', 'spiritId', 'addedAt', 'notes', 'rating', 'isFavorite'];
  return await upsertCabinet(getDC(), filterAllowedFields(vars, allowed));
};

export const dbListUserCabinet = async (userId: string) => {
  try {
    const { data } = await listUserCabinet(getDC(), { userId });
    return data?.userCabinets || [];
  } catch (err) {
    console.error('[dbListUserCabinet] Error:', err);
    return [];
  }
};

export const dbListUserReviews = async (userId: string) => {
  const { data } = await listUserReviews(getDC(), { userId });
  return data.spiritReviews;
};
export const dbDeleteCabinet = async (vars: { userId: string, spiritId: string }) => {
  return await deleteCabinet(getDC(), vars);
};

export const dbGetReview = async (id: string) => {
  const { data } = await getReview(getDC(), { id });
  return data.spiritReview;
};

export const dbUpdateReview = async (vars: { id: string, likes?: number, likedBy?: string[] }) => {
  return await updateReview(getDC(), vars);
};

export const dbFindReview = async (vars: { userId: string, spiritId: string }) => {
  const { data } = await findReview(getDC(), vars);
  return data.spiritReviews[0] || null;
};

// --- Social ---
export const dbUpsertReviewLike = async (vars: { userId: string, reviewId: string }) => {
  return await upsertReviewLike(getDC(), vars);
};

export const dbDeleteReviewLike = async (vars: { userId: string, reviewId: string }) => {
  return await deleteReviewLike(getDC(), vars);
};

export const dbUpdateReviewLikesCount = async (vars: { id: string, likes: number }) => {
  return await updateReviewLikesCount(getDC(), vars);
};

export const dbUpsertReviewComment = async (vars: { id: string, reviewId: string, userId: string, content: string, updatedAt?: string }) => {
  return await upsertReviewComment(getDC(), vars);
};

export const dbDeleteReviewComment = async (id: string) => {
  return await deleteReviewComment(getDC(), { id });
};

export const dbGetReviewDetail = async (id: string, currentUserId?: string) => {
  const { data } = await getReviewDetail(getDC(), { id, currentUserId });
  return data.spiritReview;
};

export const dbListReviewComments = async (reviewId: string) => {
  const { data } = await listReviewComments(getDC(), { reviewId });
  return data.reviewComments;
};


// --- WorldCup ---
export const dbUpsertWorldCupResult = async (vars: {
  id: string;
  winnerId: string;
  category: string;
  subcategory?: string | null;
  initialRound: number;
  timestamp?: string | null;
}) => {
  return await upsertWorldCupResult(getDC(), vars);
};

export const dbGetWorldCupResult = async (id: string) => {
  const { data } = await getWorldCupResult(getDC(), { id });
  return data.worldCupResult;
};

export const dbListSpiritsForWorldCup = async (category: string, subcategories: string[]) => {
  const { data } = await listSpiritsForWorldCup(getDC(), { category, subcategories });
  return data.spirits;
};

export const dbListAllSpiritsForWorldCup = async () => {
  const { data } = await listAllSpiritsForWorldCup(getDC());
  return data.spirits;
};

export const dbListSpiritsByCategoryForWorldCup = async (category: string) => {
  const { data } = await listSpiritsByCategoryForWorldCup(getDC(), { category });
  return data.spirits;
};

// Utility — close connection (scripts only)
export const closeDC = async () => {
  if (_dc) await terminate(_dc);
};
