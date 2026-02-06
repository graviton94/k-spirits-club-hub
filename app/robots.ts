import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kspiritsclub.com';

  return {
    rules: [
      {
        // 1. 모든 봇 공통 규칙 (단순화 및 통합)
        userAgent: '*',
        allow: [
          '/',
          '/spirits/',
          '/explore',
          '/contents',
          // ✅ 핵심 수정: Next.js 이미지 최적화 경로는 쿼리 스트링이 있어도 무조건 허용
          '/_next/image*',
          '/_next/',
          '/images/',
          '/public/',
        ],
        disallow: [
          '/admin/',
          '/api/',        // API 보안
          '/cabinet/',    // 개인화 페이지 (크롤링 불필요)
          '/login',
          '/me',
          '/private/',
          // ✅ 수정: 쿼리 스트링 차단은 유지하되, 위에서 Allow한 /_next/image는 우선순위로 통과됨
          '/*?*',
        ],
      },
      // (선택 사항) AI 학습용 봇 차단 - 우리 데이터를 공짜로 학습하는 게 싫다면 추가
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}