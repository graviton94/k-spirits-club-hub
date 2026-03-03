/**
 * SEO URL Utilities
 * Helper functions for canonical URL generation and normalization
 */

/**
 * Get the base URL from environment or fallback
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
}

/**
 * Convert a pathname to an absolute URL
 * @param pathname - The pathname (e.g., "/ko/spirits/123")
 * @returns Absolute URL (e.g., "https://kspiritsclub.com/ko/spirits/123")
 */
export function toAbsoluteUrl(pathname: string): string {
  const baseUrl = getBaseUrl();
  // Remove trailing slash from baseUrl and leading slash from pathname if both exist
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Strip query string from URL for canonical URLs
 * @param url - The URL to strip
 * @returns URL without query string
 */
export function stripQuery(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
  } catch {
    // If not a valid URL, just remove everything after ?
    return url.split('?')[0];
  }
}

/**
 * Generate canonical URL for a given pathname
 * Query strings are always stripped from canonical URLs
 * @param pathname - The pathname with locale (e.g., "/ko/spirits/123")
 * @returns Canonical absolute URL without query string
 */
export function getCanonicalUrl(pathname: string): string {
  const absolute = toAbsoluteUrl(pathname);
  return stripQuery(absolute);
}

/**
 * Generate hreflang alternates for a pathname
 * @param pathname - The pathname without locale (e.g., "/spirits/123")
 * @param locales - Supported locales
 * @returns Object with locale keys and absolute URLs
 */
export function getHreflangAlternates(
  pathname: string,
  locales: readonly string[] = ['ko', 'en']
): Record<string, string> {
  const alternates: Record<string, string> = {};

  // Ensure pathname starts with /
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  for (const locale of locales) {
    alternates[locale] = toAbsoluteUrl(`/${locale}${normalizedPath}`);
  }

  return alternates;
}
