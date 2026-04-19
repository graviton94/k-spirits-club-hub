import { MetadataRoute } from 'next';
import { dbListSpiritsForSitemap } from '@/lib/db/data-connect-client';
import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data';

/**
 * Sitemap revalidation: 24시간
 */
export const revalidate = 86400;

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
  const baseUrl = 'https://kspiritsclub.com';
  const locales = ['ko', 'en'] as const;
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/explore', priority: 0.9, freq: 'daily' },
    { path: '/contents', priority: 0.8, freq: 'weekly' },
    { path: '/contents/mbti', priority: 0.7, freq: 'monthly' },
    { path: '/contents/worldcup', priority: 0.7, freq: 'monthly' },
    { path: '/contents/perfect-pour', priority: 0.7, freq: 'monthly' },
    { path: '/contents/reviews', priority: 0.7, freq: 'weekly' },
    { path: '/contents/news', priority: 0.6, freq: 'daily' },
    { path: '/contents/about', priority: 0.5, freq: 'yearly' },
    { path: '/contents/wiki', priority: 0.8, freq: 'monthly' },
    ...SPIRIT_CATEGORIES.map(cat => ({
      path: `/contents/wiki/${cat.slug}` as const,
      priority: 0.75,
      freq: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    })),
  ];

  for (const page of staticPages) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${page.path}`,
            en: `${baseUrl}/en${page.path}`,
          },
        },
      });
    }
  }

  try {
    const spiritMeta = await dbListSpiritsForSitemap() as any[];
    console.log(`[Sitemap] Fetched ${spiritMeta.length} spirit entries from Data Connect`);

    const indexableSpirits = spiritMeta.filter(isIndexableSpiritMeta);
    const tierBCount = spiritMeta.length - indexableSpirits.length;

    console.log(`[Sitemap] Tier A: ${indexableSpirits.length}, Tier B: ${tierBCount}`);

    for (const spirit of indexableSpirits) {
      const lastModified = spirit.updatedAt ? new Date(spirit.updatedAt) : now;

      for (const locale of locales) {
        routes.push({
          url: `${baseUrl}/${locale}/spirits/${spirit.id}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              ko: `${baseUrl}/ko/spirits/${spirit.id}`,
              en: `${baseUrl}/en/spirits/${spirit.id}`,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error('[Sitemap] Data Connect path failed:', error);
  }

  return routes;
}
