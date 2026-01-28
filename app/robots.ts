import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration
 * Defines crawling rules for search engine bots
 * 
 * Strategy:
 * - Allow all public pages and content (/)
 * - Disallow admin pages (/admin/) to prevent indexing of admin interface
 * - Disallow personal cabinet pages (/cabinet/) for user privacy
 */
export default function robots(): MetadataRoute.Robots {
  // Get base URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://k-spirits-club-hub.pages.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/cabinet/'], // Admin and personal cabinet pages are not indexed
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
