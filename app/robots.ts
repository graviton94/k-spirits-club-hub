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
          // Search/filter/sort query variants — noindex is set in HTML, robots disallow reinforces policy
          '/ko/contents/reviews/*?q=',
          '/en/contents/reviews/*?q=',
          '/ko/contents/news/*?q=',
          '/en/contents/news/*?q=',
          '/ko/contents/reviews/*?sort=',
          '/en/contents/reviews/*?sort=',
          '/ko/contents/news/*?sort=',
          '/en/contents/news/*?sort=',
          '/ko/contents/reviews/*?tag=',
          '/en/contents/reviews/*?tag=',
          '/ko/contents/news/*?tag=',
          '/en/contents/news/*?tag=',
          '/ko/contents/reviews/*?source=',
          '/en/contents/reviews/*?source=',
          '/ko/contents/news/*?source=',
          '/en/contents/news/*?source=',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}