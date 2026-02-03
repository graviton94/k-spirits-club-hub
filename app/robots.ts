import { MetadataRoute } from 'next';

/**
 * Robots.txt Configuration - Global SEO Parity
 * 전략:
 * 1. 주요 봇(Google, Naver, Daum)에게 상세 페이지와 탐색 페이지 명시적 허용
 * 2. 모든 봇에 대해 관리자/개인 페이지 및 검색 필터(query params) 크롤링 제한
 * 3. API의 경우 관리/개인화 API만 차단하고 공용 데이터 접근은 유연하게 유지
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kspiritsclub.com';

  return {
    rules: [
      {
        // 구글, 네이버, 다음/카카오 등 모든 주요 검색 엔진 공통 적용
        userAgent: ['Googlebot', 'Yeti', 'Daumoa', 'bingbot'],
        allow: [
          '/',
          '/ko/',
          '/en/',
          '/spirits/', // 주류 상세 데이터 (가장 중요)
          '/explore',   // 주류 탐색 리스트
          '/contents',  // 월드컵 등 콘텐츠 페이지
        ],
        disallow: [
          '/admin/',
          '/api/admin/',
          '/cabinet/',
          '/api/cabinet/',
          '/login',
          '/*?*', // 쿼리 스트링 차단: 100만 건의 중복 인덱싱 방지 (SEO 핵심)
        ],
      },
      {
        // 기타 일반 봇
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/cabinet/',
          '/api/admin/',
          '/api/cabinet/',
          '/*?*',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}