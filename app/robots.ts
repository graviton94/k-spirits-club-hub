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
          // Core indexable routes
          '/ko/',
          '/en/',
          // Static assets
          '/images/',
          '/icons/',
          '/fonts/',
          // Next.js optimized images
          '/_next/image',
          '/_next/static/',
        ],
        disallow: [
          // Private/user-specific pages
          '/admin/',
          '/cabinet/',
          '/me',
          '/login',
          '/private/',
          // API routes (no indexing value)
          '/api/',
          // Dynamic query strings (to prevent duplicate URLs)
          '/*?*',
          // Search result pages with filters
          '/*/explore?*',
        ],
      },
      // Block AI training bots (optional - protects proprietary content)
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}