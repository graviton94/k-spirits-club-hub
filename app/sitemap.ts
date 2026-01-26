import { MetadataRoute } from 'next';
import { spiritsDb } from '@/lib/db';

/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml with all static and dynamic routes
 * Compatible with Edge Runtime (uses Firestore REST API)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k-spirits-club-hub.com';
  
  // Static routes with priority and changeFrequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cabinet`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // Fetch all published spirits from Firebase
    // Using isPublished filter for Edge Runtime compatibility
    const publishedSpirits = await spiritsDb.getAll({
      isPublished: true,
    });

    console.log(`[Sitemap] Fetched ${publishedSpirits.length} published spirits`);

    // Generate dynamic routes for spirit detail pages
    const spiritRoutes: MetadataRoute.Sitemap = publishedSpirits
      .filter(spirit => spirit.id) // Ensure spirit has valid ID
      .map(spirit => ({
        url: `${baseUrl}/spirits/${spirit.id}`,
        lastModified: spirit.updatedAt ? new Date(spirit.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    console.log(`[Sitemap] Generated ${spiritRoutes.length} spirit routes`);

    // Combine static and dynamic routes
    return [...staticRoutes, ...spiritRoutes];
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    // Return at least static routes if dynamic fetching fails
    return staticRoutes;
  }
}
