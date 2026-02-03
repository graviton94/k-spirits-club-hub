import { MetadataRoute } from 'next';
import { spiritsDb } from '@/lib/db';

export const revalidate = 3600; // 1시간마다 갱신

/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all static and dynamic routes
 * Compatible with Edge Runtime (uses Firestore REST API)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure production domain is used for search engine indexing
  const baseUrl = 'https://kspiritsclub.com';
  const locales = ['ko', 'en'];

  // Static routes with priority and changeFrequency for each locale
  const staticRoutes: MetadataRoute.Sitemap = [];

  // Automatically collected from app/[lang] structure
  const staticPathnames = [
    '',
    '/explore',
    // Content Hub Pages
    '/contents',
    '/contents/perfect-pour',
    '/contents/worldcup',
    // Filter out: /admin, /cabinet, /login, /me (User private/Admin pages)
  ];

  staticPathnames.forEach(pathname => {
    locales.forEach(locale => {
      staticRoutes.push({
        url: `${baseUrl}/${locale}${pathname}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: pathname === '' ? 1.0 : (pathname === '/explore' ? 0.9 : 0.8),
      });
    });
  });

  try {
    // Fetch all published spirits from Firebase
    const publishedSpirits = await spiritsDb.getAll({
      isPublished: true,
    });

    console.log(`[Sitemap] Fetched ${publishedSpirits.length} published spirits`);

    // Generate dynamic routes for spirit detail pages in each locale
    const spiritRoutes: MetadataRoute.Sitemap = [];

    publishedSpirits
      .filter(spirit => spirit.id && typeof spirit.id === 'string' && spirit.id.trim().length > 0)
      .forEach(spirit => {
        // Safely parse lastModified date
        let lastModified = new Date();
        if (spirit.updatedAt) {
          const parsedDate = new Date(spirit.updatedAt);
          if (!isNaN(parsedDate.getTime())) {
            lastModified = parsedDate;
          }
        }

        locales.forEach(locale => {
          spiritRoutes.push({
            url: `${baseUrl}/${locale}/spirits/${spirit.id}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          });
        });
      });

    console.log(`[Sitemap] Generated ${spiritRoutes.length} spirit routes for ${locales.length} locales`);

    // Combine static and dynamic routes
    return [...staticRoutes, ...spiritRoutes];
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    // Return at least static routes if dynamic fetching fails
    return staticRoutes;
  }
}
