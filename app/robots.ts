import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * Defines crawling rules for search engine bots
 * 
 * Strategy:
 * - Allow all public pages and content (/)
 * - Disallow admin pages and APIs (/admin/, /api/admin/) to prevent indexing
 * - Disallow personal cabinet pages and APIs (/cabinet/, /api/cabinet/) for user privacy
 * - Disallow authentication endpoints (/api/auth/) for security
 */
export default function robots(): MetadataRoute.Robots {
  // Get base URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k-spirits-club-hub.pages.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/cabinet/',
        '/api/admin/',
        '/api/cabinet/',
        '/api/auth/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
