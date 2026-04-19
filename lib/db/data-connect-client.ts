import { getDataConnect, terminate, DataConnect } from 'firebase/data-connect';
import { initializeApp, getApps } from 'firebase/app';
import {
  connectorConfig,
  listSpirits,
  getSpirit,
  getUserProfile,
  listNewsArticles,
  listNewArrivals,
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
  adminListRawSpirits,
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
export const dbListSpirits = async (category?: string) => {
  const { data } = await listSpirits(getDC(), { category });
  return data.spirits;
};

export const dbListSpiritsForSitemap = async () => {
  const { data } = await listSpiritsForSitemap(getDC());
  return data.spirits;
};

export const dbAdminListRawSpirits = async (limit: number, offset: number) => {
  const { data } = await adminListRawSpirits(getDC(), { limit, offset });
  return data.spirits;
};

export const dbListNewArrivals = async (limit: number) => {
  const { data } = await listNewArrivals(getDC(), { limit });
  return data.spirits;
};

export const dbGetSpirit = async (id: string) => {
  const { data } = await getSpirit(getDC(), { id });
  return data.spirit;
};

export const dbUpsertSpirit = async (vars: any) => {
  return await upsertSpirit(getDC(), vars);
};

// --- Users ---
export const dbGetUserProfile = async (id: string) => {
  const { data } = await getUserProfile(getDC(), { id });
  return data.user;
};

export const dbUpsertUser = async (vars: any) => {
  return await upsertUser(getDC(), vars);
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
  return await upsertReview(getDC(), vars);
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

export const dbUpsertNews = async (vars: any) => {
  return await upsertNews(getDC(), vars);
};

// --- Cabinet ---
export const dbUpsertCabinet = async (vars: any) => {
  return await upsertCabinet(getDC(), vars);
};

// --- Admin / Others ---
export const dbUpsertModificationRequest = async (vars: any) => {
  return await upsertModificationRequest(getDC(), vars);
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

// Utility — close connection (scripts only)
export const closeDC = async () => {
  if (_dc) await terminate(_dc);
};
