/**
 * Locale Path Utilities
 * Helpers for generating locale-aware internal links
 */

import { Locale } from '@/i18n-config';

/**
 * Ensure a path has the locale prefix
 * @param href - The path to check/modify
 * @param locale - The locale to prepend
 * @returns Path with locale prefix
 */
export function withLocale(href: string, locale: Locale): string {
  // If it's an absolute URL (http:// or https://), return as-is
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }

  // If it's a hash or protocol-relative URL, return as-is
  if (href.startsWith('#') || href.startsWith('//')) {
    return href;
  }

  // Normalize the href to ensure it starts with /
  const normalizedHref = href.startsWith('/') ? href : `/${href}`;

  // Check if it already has a locale prefix
  const hasLocalePrefix = /^\/(ko|en)(\/|$)/.test(normalizedHref);

  if (hasLocalePrefix) {
    return normalizedHref;
  }

  // Add locale prefix
  return `/${locale}${normalizedHref}`;
}

/**
 * Remove locale prefix from a path
 * @param pathname - The pathname to strip locale from
 * @returns Path without locale prefix
 */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(ko|en)(\/|$)/, '/');
}

/**
 * Extract locale from pathname
 * @param pathname - The pathname to extract locale from
 * @returns Locale if found, undefined otherwise
 */
export function extractLocale(pathname: string): Locale | undefined {
  const match = pathname.match(/^\/(ko|en)(\/|$)/);
  return match ? (match[1] as Locale) : undefined;
}
