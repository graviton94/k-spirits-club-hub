import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ko', 'en'];
const DEFAULT_LOCALE = 'ko';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude public assets, API routes, and hidden files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.') || // Check for files (favicon.ico, etc.)
    pathname.startsWith('/favicon.ico')
  ) {
    return;
  }

  // 2. Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 3. Determine the locale
  // Priority: 1. Cookie, 2. Accept-Language header, 3. Default
  let locale = request.cookies.get('NEXT_LOCALE')?.value;

  if (!locale || !locales.includes(locale)) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      if (acceptLanguage.toLowerCase().includes('ko')) {
        locale = 'ko';
      } else {
        locale = 'en';
      }
    } else {
      locale = DEFAULT_LOCALE;
    }
  }

  // 4. Redirect
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
  ],
};