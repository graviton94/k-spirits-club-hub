import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kspiritsclub.com';

  return {
    rules: [
      {
        // 1. 주요 검색 엔진 (Google, Naver, Daum, Bing)
        userAgent: ['Googlebot', 'Yeti', 'Daumoa', 'bingbot'],
        allow: [
          '/',
          '/spirits/',
          '/explore',
          '/contents',
          // ⚠️ 중요: Next.js 이미지 최적화 및 정적 리소스 허용
          '/_next/', 
          '/images/',
          '/public/',
        ],
        disallow: [
          '/admin/',
          '/api/',       // API 전체 차단 (보안 및 리소스 절약)
          '/cabinet/',
          '/login',
          '/me',         // 마이페이지 차단
          '/*?*',        // 쿼리 스트링 차단 (검색 필터 중복 방지)
        ],
      },
      {
        // 2. 기타 봇 (보수적으로 접근)
        userAgent: '*',
        allow: ['/', '/_next/'], // 여기도 _next는 허용해야 사이트가 깨져 보이지 않음
        disallow: [
          '/admin/',
          '/cabinet/',
          '/api/',
          '/login',
          '/me',
          '/*?*',
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
