import { MetadataRoute } from 'next';

// Paths that should not be indexed by search engines
const DISALLOWED_PATHS = ['/admin', '/api'];

/**
 * Robots.txt Configuration
 * Defines crawling rules for search engine bots
 */
export default function robots(): MetadataRoute.Robots {
  // Get base URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k-spirits-club-hub.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
