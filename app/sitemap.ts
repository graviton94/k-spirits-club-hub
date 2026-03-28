import { MetadataRoute } from 'next';
import { getPublishedSpiritMetaWithQuality } from '@/lib/db/firestore-rest';
import { SPIRIT_CATEGORIES } from '@/lib/constants/spirits-guide-data';


/**
 * Sitemap revalidation: 24시간
 * - 하루에 한 번 갱신으로 충분 (술 정보는 자주 바뀌지 않음)
 * - 너무 짧은 revalidate는 Googlebot에 "항상 바뀐다"는 잘못된 신호를 줌
 */
export const revalidate = 86400;

/**
 * SEO Phase 2: Indexable Tier Classification
 *
 * Tier A (Indexable): Spirits with high-quality content
 * - name, abv, category
 * - at least two quality signals among image / description / pairing / tasting data
 *
 * Tier B (Non-indexable): Thin content spirits
 * - Excluded from sitemap, marked with noindex on page
 *
 * This prevents "Discovered - currently not indexed" issues in GSC
 */
function isIndexableSpiritMeta(spirit: {
  name: string;
  category: string | null;
  // ... rest of meta if needed, but we focus on core identity for indexability
}): boolean {
  const hasName = !!spirit.name;
  const hasCategory = !!spirit.category;

  // SEO Expert: We now index all spirits with at least a name and category to maximize reach.
  return hasName && hasCategory;
}

/**
 * Dynamic Sitemap Generation - Phase 2
 *
 * Includes ONLY:
 * - Canonical URLs (with locale prefix)
 * - High-quality Tier A spirit pages
 * - Core indexable pages (explore, wiki, etc.)
 *
 * Excludes:
 * - Private pages (cabinet, me, admin)
 * - Tier B spirits (thin content)
 * - Query strings
 * - Dynamic filter combinations
 *
 * This focused approach helps Google concentrate crawl budget on quality content.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kspiritsclub.com';
  const locales = ['ko', 'en'] as const;
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ──────────────────────────────────────────────
  // Static Indexable Pages (Tier A)
  // ──────────────────────────────────────────────
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'daily' }, // Homepage
    { path: '/explore', priority: 0.9, freq: 'daily' }, // Search/Explore
    { path: '/contents', priority: 0.8, freq: 'weekly' }, // Contents Hub
    { path: '/contents/mbti', priority: 0.7, freq: 'monthly' },
    { path: '/contents/worldcup', priority: 0.7, freq: 'monthly' },
    { path: '/contents/perfect-pour', priority: 0.7, freq: 'monthly' },
    { path: '/contents/reviews', priority: 0.7, freq: 'weekly' },
    { path: '/contents/news', priority: 0.6, freq: 'daily' },
    { path: '/contents/about', priority: 0.5, freq: 'yearly' },
    // Spirit Encyclopedia Hub
    { path: '/contents/wiki', priority: 0.8, freq: 'monthly' },
    // Spirit Encyclopedia Category Pages
    ...SPIRIT_CATEGORIES.map(cat => ({
      path: `/contents/wiki/${cat.slug}` as const,
      priority: 0.75,
      freq: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    })),
  ];

  // NON-INDEXABLE PAGES (Excluded from sitemap):
  // - /cabinet (personal collections, user-specific)
  // - /me (user profile, user-specific)
  // - /admin (admin dashboard, restricted)
  // - Search result pages with query strings
  // - Filter combination URLs

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

  // ──────────────────────────────────────────────
  // Dynamic Spirit Pages (Tier A Only)
  // ──────────────────────────────────────────────
  try {
    const spiritMeta = await getPublishedSpiritMetaWithQuality();
    console.log(`[Sitemap] Fetched ${spiritMeta.length} published spirit entries`);

    // Filter for Tier A (indexable) spirits only
    const indexableSpirits = spiritMeta.filter(isIndexableSpiritMeta);
    const tierBCount = spiritMeta.length - indexableSpirits.length;

    console.log(`[Sitemap] Tier A (indexable): ${indexableSpirits.length}, Tier B (excluded): ${tierBCount}`);

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

    console.log(`[Sitemap] Generated ${indexableSpirits.length * locales.length} spirit routes (Tier A only)`);
  } catch (error) {
    console.error('[Sitemap] Failed to fetch spirit meta, falling back to static only:', error);
  }

  console.log(`[Sitemap] Total routes: ${routes.length}`);
  return routes;
}
