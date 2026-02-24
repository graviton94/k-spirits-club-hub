import { MetadataRoute } from 'next';
import { getPublishedSpiritMeta } from '@/lib/db/firestore-rest';

export const runtime = 'edge';

/**
 * Sitemap revalidation: 24시간
 * - 하루에 한 번 갱신으로 충분 (술 정보는 자주 바뀌지 않음)
 * - 너무 짧은 revalidate는 Googlebot에 "항상 바뀐다"는 잘못된 신호를 줌
 */
export const revalidate = 86400;

/**
 * Dynamic Sitemap Generation
 *
 * 개선 사항:
 * - lastModified: new Date() → 실제 updatedAt 사용 (크롤 예산 절감)
 * - changeFrequency: 정적/동적 페이지별 적절한 값 적용
 * - priority: 페이지 중요도에 따라 차별화
 * - 새 항목은 updatedAt이 최근이면 Googlebot이 우선 크롤링함
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kspiritsclub.com';
  const locales = ['ko', 'en'] as const;
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ──────────────────────────────────────────────
  // 정적 페이지
  // ──────────────────────────────────────────────
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'daily' }, // 홈
    { path: '/explore', priority: 0.9, freq: 'daily' }, // 탐색
    { path: '/contents/mbti', priority: 0.7, freq: 'monthly' },
    { path: '/contents/worldcup', priority: 0.7, freq: 'monthly' },
    { path: '/contents/perfect-pour', priority: 0.7, freq: 'monthly' },
    { path: '/contents/news', priority: 0.6, freq: 'daily' },
    { path: '/contents/about', priority: 0.5, freq: 'yearly' },
  ];

  for (const page of staticPages) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${page.path}`,
            en: `${baseUrl}/en${page.path}`,
          },
        },
      });
    }
  }

  // ──────────────────────────────────────────────
  // 동적 spirit 페이지
  // ──────────────────────────────────────────────
  try {
    const spiritMeta = await getPublishedSpiritMeta();
    console.log(`[Sitemap] Fetched ${spiritMeta.length} published spirit entries`);

    for (const { id, updatedAt } of spiritMeta) {
      // 실제 업데이트 시각 사용 → 새로 발행된 항목은 최신 날짜 → Googlebot이 우선 크롤링
      const lastModified = updatedAt ? new Date(updatedAt) : now;

      for (const locale of locales) {
        routes.push({
          url: `${baseUrl}/${locale}/spirits/${id}`,
          lastModified,
          // 술 정보 자체는 자주 안 바뀌므로 monthly
          // → Googlebot이 크롤 예산을 새 페이지에 더 집중
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              ko: `${baseUrl}/ko/spirits/${id}`,
              en: `${baseUrl}/en/spirits/${id}`,
            },
          },
        });
      }
    }

    console.log(`[Sitemap] Generated ${spiritMeta.length * locales.length} spirit routes`);
  } catch (error) {
    console.error('[Sitemap] Failed to fetch spirit meta, falling back to static only:', error);
  }

  return routes;
}
