import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * Defines crawling rules for search engine bots
 * 
 * Strategy:
 * - Allow public API endpoints for data indexing (/api/spirits, /api/reviews, /api/trending)
 * - Allow static resources (fonts, images, etc.) via /_next/static/
 * - Disallow sensitive endpoints (/api/admin, /api/auth)
 */
export default function robots(): MetadataRoute.Robots {
  // Get base URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k-spirits-club-hub.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/spirits',
          '/api/reviews',
          '/api/trending',
          '/_next/static/',
        ],
        disallow: [
          '/admin',
          '/api/admin',
          '/api/auth',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
