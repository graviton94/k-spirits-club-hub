import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * [도메인 강제 리다이렉트 미들웨어]
 * 클라우드플레어 대시보드나 _redirects 파일이 작동하지 않을 때
 * 넥스트 엔진 레벨에서 .pages.dev 트래픽을 잡아 .com으로 던집니다.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // 구 주소(pages.dev)로 접속했을 경우
  if (host === 'k-spirits-club-hub.pages.dev') {
    // 새 도메인으로 301 (영구 이동) 리다이렉트
    return NextResponse.redirect(
      `https://kspiritsclub.com${url.pathname}${url.search}`,
      301
    );
  }

  return NextResponse.next();
}

// 미들웨어가 작동할 경로 설정 (모든 경로 포함, 정적 파일 제외)
export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 경로에서 실행하여 무한 루프 방지 및 성능 확보:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, manifest.json 등 공통 파일
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|api).*)',
  ],
};