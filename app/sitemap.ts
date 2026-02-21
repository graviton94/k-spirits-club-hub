import { MetadataRoute } from 'next';
import { getPublishedSpiritIds } from '@/lib/db/firestore-rest';

export const runtime = 'edge';
export const revalidate = 3600; // 1시간마다 갱신

/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all static and dynamic routes
 * Compatible with Edge Runtime (uses Firestore REST API)
 * 
 * Optimized for SEO:
 * - Fetches ALL published spirit IDs using pagination (no limits)
 * - Uses mask.fieldPaths=__name__ for minimal network usage
 * - Generates complete sitemap for search engine indexing
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kspiritsclub.com';
  const locales = ['ko', 'en'];
  const routes: MetadataRoute.Sitemap = [];

  // Static routes
  const staticPathnames = ['', '/explore', '/contents/mbti'];

  staticPathnames.forEach(pathname => {
    locales.forEach(locale => {
      routes.push({
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: pathname === '' ? 1.0 : (pathname === '/explore' ? 0.9 : 0.6),
        alternates: {
          languages: {
            'ko': `${baseUrl}/ko${pathname}`,
            'en': `${baseUrl}/en${pathname}`,
          }
        }
      });
    });
  });

  try {
    // Fetch all published spirit IDs using pagination
    const spiritIds = await getPublishedSpiritIds();

    console.log(`[Sitemap] Fetched ${spiritIds.length} published spirit IDs`);

    // Generate dynamic routes for all published spirits in each locale
    spiritIds.forEach(id => {
      locales.forEach(locale => {
        routes.push({
          url: `${baseUrl}/${locale}/spirits/${id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              'ko': `${baseUrl}/ko/spirits/${id}`,
              'en': `${baseUrl}/en/spirits/${id}`,
            }
          }
        });
      });
    });

    console.log(`[Sitemap] Generated ${spiritIds.length * locales.length} spirit routes for ${locales.length} locales`);

    return routes;
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    // Return at least static routes if dynamic fetching fails
    const staticRoutes: MetadataRoute.Sitemap = [];
    staticPathnames.forEach(pathname => {
      locales.forEach(locale => {
        staticRoutes.push({
          url: `${baseUrl}/${locale}${pathname}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: pathname === '' ? 1.0 : (pathname === '/explore' ? 0.9 : 0.6),
          alternates: {
            languages: {
              'ko': `${baseUrl}/ko${pathname}`,
              'en': `${baseUrl}/en${pathname}`,
            }
          }
        });
      });
    });
    return staticRoutes;
  }
}
