import { MetadataRoute } from 'next';
import {
  dbGetNewsCount,
  dbGetSpiritReviewsCount,
  dbListSpiritReviews,
  dbListSpiritsForSitemap,
} from '@/lib/db/data-connect-client';
import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data';

/**
 * Sitemap revalidation: 24시간
 */
export const revalidate = 86400;

const LOCALES = ['ko', 'en'] as const;
const REVIEWS_PAGE_SIZE = 10;
const NEWS_PAGE_SIZE = 10;
const MAX_PAGINATED_PAGES = 1000;
const REVIEW_DETAIL_SITEMAP_LIMIT = 1000;

/**
 * SEO Phase 2: Indexable Tier Classification
 */
function isIndexableSpiritMeta(spirit: {
  name: string;
  category: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  descriptionKo: string | null;
  descriptionEn: string | null;
  pairingGuideKo: string | null;
  pairingGuideEn: string | null;
  tastingNote: string | null;
  noseTags: string[] | null;
  palateTags: string[] | null;
  finishTags: string[] | null;
}): boolean {
  const hasName = !!spirit.name;
  const hasCategory = !!spirit.category;

  if (!hasName || !hasCategory) return false;

  const hasImage = !!(spirit.imageUrl || spirit.thumbnailUrl);
  const qualitySignalCount = [
    hasImage,
    (spirit.descriptionKo?.length || 0) >= 160 || (spirit.descriptionEn?.length || 0) >= 160,
    (spirit.pairingGuideKo?.length || 0) >= 120 || (spirit.pairingGuideEn?.length || 0) >= 120,
    (spirit.tastingNote?.length || 0) >= 24 || ((spirit.noseTags?.length || 0) + (spirit.palateTags?.length || 0) + (spirit.finishTags?.length || 0)) >= 4,
  ].filter(Boolean).length;

  return qualitySignalCount >= 2;
}

/**
 * Dynamic Sitemap Generation
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  const pushLocalizedRoute = (
    path: string,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
  ) => {
    for (const locale of LOCALES) {
      routes.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${path}`,
            en: `${baseUrl}/en${path}`,
          },
        },
      });
    }
  };

  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/explore', priority: 0.9, freq: 'daily' },
    { path: '/contents', priority: 0.8, freq: 'weekly' },
    { path: '/contents/about', priority: 0.5, freq: 'yearly' },
    { path: '/contents/mbti', priority: 0.7, freq: 'monthly' },
    { path: '/contents/worldcup', priority: 0.7, freq: 'monthly' },
    { path: '/contents/perfect-pour', priority: 0.7, freq: 'monthly' },
    { path: '/contents/reviews', priority: 0.7, freq: 'weekly' },
    { path: '/contents/news', priority: 0.6, freq: 'daily' },
    { path: '/contents/wiki', priority: 0.8, freq: 'monthly' },
  ];

  for (const page of staticPages) {
    pushLocalizedRoute(page.path, now, page.freq, page.priority);
  }

  const wikiSlugs = new Set<string>([
    ...SPIRIT_CATEGORIES.map((cat) => cat.slug),
    'red-grape',
    'white-grape',
  ]);

  for (const slug of wikiSlugs) {
    pushLocalizedRoute(`/contents/wiki/${slug}`, now, 'monthly', 0.75);
  }

  try {
    const [reviewCount, newsCount] = await Promise.all([
      dbGetSpiritReviewsCount(),
      dbGetNewsCount(),
    ]);

    const reviewPages = Math.max(1, Math.ceil(reviewCount / REVIEWS_PAGE_SIZE));
    const newsPages = Math.max(1, Math.ceil(newsCount / NEWS_PAGE_SIZE));

    const reviewPageLimit = Math.min(reviewPages, MAX_PAGINATED_PAGES);
    const newsPageLimit = Math.min(newsPages, MAX_PAGINATED_PAGES);

    for (let page = 2; page <= reviewPageLimit; page++) {
      pushLocalizedRoute(`/contents/reviews?page=${page}`, now, 'weekly', 0.45);
    }

    for (let page = 2; page <= newsPageLimit; page++) {
      pushLocalizedRoute(`/contents/news?page=${page}`, now, 'daily', 0.4);
    }
  } catch (error) {
    console.error('[Sitemap] Failed to build paginated hub URLs:', error);
  }

  try {
    const spiritMeta = await dbListSpiritsForSitemap() as any[];
    console.log(`[Sitemap] Fetched ${spiritMeta.length} spirit entries from Data Connect`);

    // Canonical rule: published spirits only + Tier A quality filter.
    // listSpiritsForSitemap already queries isPublished=true; this guard keeps the rule explicit in app logic.
    const publishedSpirits = spiritMeta.filter((spirit) => spirit?.isPublished !== false);
    const indexableSpirits = publishedSpirits.filter(isIndexableSpiritMeta);
    const tierBCount = publishedSpirits.length - indexableSpirits.length;

    console.log(`[Sitemap] Published: ${publishedSpirits.length}, Tier A: ${indexableSpirits.length}, Tier B: ${tierBCount}`);

    for (const spirit of indexableSpirits) {
      const lastModified = spirit.updatedAt ? new Date(spirit.updatedAt) : now;
      pushLocalizedRoute(`/spirits/${spirit.id}`, lastModified, 'monthly', 0.7);
    }
  } catch (error) {
    console.error('[Sitemap] Data Connect path failed:', error);
  }

  try {
    const reviews = await dbListSpiritReviews(REVIEW_DETAIL_SITEMAP_LIMIT, 0);
    const uniqueReviewIds = Array.from(new Set(reviews.map((review: any) => review.id).filter(Boolean)));

    for (const reviewId of uniqueReviewIds) {
      pushLocalizedRoute(`/contents/reviews/${reviewId}`, now, 'monthly', 0.55);
    }
  } catch (error) {
    console.error('[Sitemap] Failed to include review detail URLs:', error);
  }

  return routes;
}
