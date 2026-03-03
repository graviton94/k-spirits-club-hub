import { MetadataRoute } from 'next';

/**
 * SEO Phase 2: Robots.txt Optimization
 *
 * Goals:
 * 1. Focus crawl budget on indexable content
 * 2. Block private/user-specific pages
 * 3. Block dynamic query parameters
 * 4. Explicitly reference sitemap
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kspiritsclub.com';

  return {
    rules: [
      {
        // All bots: Unified rules
        userAgent: '*',
        allow: [
          '/ko/',
          '/en/',
        ],
        disallow: [
          // Private/user-specific pages
          '/ko/cabinet',
          '/en/cabinet',
          '/ko/me',
          '/en/me',
          '/ko/admin',
          '/en/admin',
          // API routes (no indexing value)
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}