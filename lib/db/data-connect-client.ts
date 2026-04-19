import { getDataConnect, terminate } from 'firebase/data-connect';
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
  listSpiritsForWorldCup
} from '@/src/dataconnect-generated';

// Client-side initialization
export const dc = getDataConnect(connectorConfig);

/**
 * Data Connect Client Wrapper
 * Provides a unified interface for the application to interact with PostgreSQL via GraphQL.
 */

// --- Spirits ---
export const dbListSpirits = async (category?: string) => {
  const { data } = await listSpirits(dc, { category });
  return data.spirits;
};

export const dbListSpiritsForSitemap = async () => {
  const { data } = await listSpiritsForSitemap(dc);
  return data.spirits;
};

export const dbListNewArrivals = async (limit: number) => {
  const { data } = await listNewArrivals(dc, { limit });
  return data.spirits;
};

export const dbGetSpirit = async (id: string) => {
  const { data } = await getSpirit(dc, { id });
  return data.spirit;
};

export const dbUpsertSpirit = async (vars: any) => {
  return await upsertSpirit(dc, vars);
};

// --- Users ---
export const dbGetUserProfile = async (id: string) => {
  const { data } = await getUserProfile(dc, { id });
  return data.user;
};

export const dbUpsertUser = async (vars: any) => {
  return await upsertUser(dc, vars);
};

// --- Reviews ---
export const dbListSpiritReviews = async (limit: number, offset: number) => {
  const { data } = await listSpiritReviews(dc, { limit, offset });
  return data.spiritReviews;
};

export const dbGetSpiritReviewsCount = async () => {
  const { data } = await getSpiritReviewsCount(dc);
  return data.spiritReviews.length;
};

export const dbUpsertReview = async (vars: any) => {
  return await upsertReview(dc, vars);
};

// --- News ---
export const dbListNewsArticles = async (limit: number, offset: number) => {
  const { data } = await listNewsArticles(dc, { limit, offset });
  return data.newsArticles;
};

export const dbGetNewsArticle = async (id: string) => {
  const { data } = await getNewsArticle(dc, { id });
  return data.newsArticle;
};

export const dbGetNewsCount = async () => {
  const { data } = await auditAllNews(dc);
  return data.newsArticles.length;
};

export const dbUpsertNews = async (vars: any) => {
  return await upsertNews(dc, vars);
};

// --- Cabinet ---
export const dbUpsertCabinet = async (vars: any) => {
  return await upsertCabinet(dc, vars);
};

// --- Admin / Others ---
export const dbUpsertModificationRequest = async (vars: any) => {
  return await upsertModificationRequest(dc, vars);
};

export const dbUpsertWorldCupResult = async (vars: {
  id: string,
  winnerId: string,
  category: string,
  subcategory?: string | null,
  initialRound: number,
  timestamp?: string | null
}) => {
  return await upsertWorldCupResult(dc, vars);
};

export const dbGetWorldCupResult = async (id: string) => {
  const { data } = await getWorldCupResult(dc, { id });
  return data.worldCupResult;
};

export const dbListSpiritsForWorldCup = async (category: string, subcategories: string[]) => {
  const { data } = await listSpiritsForWorldCup(dc, { category, subcategories });
  return data.spirits;
};

// Utility to close connection (useful for scripts)
export const closeDC = async () => {
  await terminate(dc);
};
