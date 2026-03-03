import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host');

  // 0. Domain Redirect (pages.dev -> custom domain, www -> non-www)
  if (host === 'k-spirits-club-hub.pages.dev' || host === 'www.kspiritsclub.com') {
    const newUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://kspiritsclub.com');
    return NextResponse.redirect(newUrl, { status: 301 });
  }

  // 1. Exclude static assets, API routes, and special paths
  // These should never be redirected or have locale prefix added
  if (
    // File extensions (images, fonts, etc.)
    pathname.includes('.') ||
    // API routes
    pathname.startsWith('/api') ||
    // Next.js internals
    pathname.startsWith('/_next') ||
    // Static asset directories
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/fonts/') ||
    // SEO files
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    // PWA manifest
    pathname.startsWith('/manifest') ||
    // Well-known URIs
    pathname.startsWith('/.well-known/')
  ) {
    return;
  }

  // 2. Check if the pathname already has a locale prefix
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. Permanent redirect if there is no locale prefix
  if (!pathnameHasLocale) {
    // Determine locale with priority: 1. Cookie, 2. Accept-Language, 3. Default
    let locale = request.cookies.get('NEXT_LOCALE')?.value;

    if (!locale || !i18n.locales.includes(locale as any)) {
      locale = getLocale(request);
    }

    // Build redirect URL with locale prefix
    const redirectPath = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    const redirectUrl = new URL(redirectPath + request.nextUrl.search, request.url);

    // Prevent redirect loop: if somehow we're redirecting to the same URL, bail out
    if (redirectUrl.pathname === pathname) {
      return;
    }

    // Use 308 (Permanent Redirect) to maintain POST/PUT methods and signal permanence to search engines
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }
}

export const config = {
  // Matcher ignoring static assets, API routes, and special files
  // This provides first-level filtering before middleware logic
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|icons|fonts|robots|sitemap|manifest|\\.well-known).*)',
  ],
};