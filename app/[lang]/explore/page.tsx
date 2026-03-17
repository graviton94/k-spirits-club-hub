import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import ExploreContent from "@/components/ui/ExploreContent";
import { db } from "@/lib/db";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";
import ExploreLoading from "./loading";

export const runtime = 'edge';
export const revalidate = 60;

const CRAWLABLE_EXPLORE_SECTIONS = [
  { category: '위스키', labelKo: '위스키', labelEn: 'Whisky' },
  { category: '소주', labelKo: '소주', labelEn: 'Soju' },
  { category: '청주', labelKo: '청주', labelEn: 'Cheongju' },
  { category: '과실주', labelKo: '과실주', labelEn: 'Wine & Fruit Wine' },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const title = isEn ? "Explore Korean Spirits | Reviews & Data" : "한국 주류 탐색 | 리뷰·데이터";
  const description = isEn
    ? "Search and compare Korean and global spirits by category, ABV, tasting notes, and reviews."
    : "카테고리, 도수, 테이스팅 노트, 리뷰 기준으로 한국 및 글로벌 주류를 탐색하고 비교하세요.";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const ogImageUrl = `${baseUrl}/default-og.jpg`;

  const canonicalUrl = getCanonicalUrl(`/${lang}/explore`);
  const hreflangAlternates = getHreflangAlternates('/explore');

  return {
    title,
    description,
    keywords: isEn
      ? ["Spirits Explorer", "Whisky Categories", "Korean Spirits Search", "Soju", "Makgeolli"]
      : ["주류 탐색", "위스키", "소주", "청주", "과실주", "주류 리뷰", "테이스팅 노트"],
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [ogImageUrl],
      type: "website",
      locale: isEn ? "en_US" : "ko_KR",
      siteName: "K-Spirits Club",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ExplorePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const isEn = lang === 'en';

  const featuredSections = await Promise.all(
    CRAWLABLE_EXPLORE_SECTIONS.map(async (section) => ({
      ...section,
      spirits: await db.getLatestFeatured(section.category, 6).catch(() => []),
    }))
  );
  const hasFeaturedSections = featuredSections.some((section) => section.spirits.length > 0);

  return (
    <>
      {hasFeaturedSections && (
        <section className="border-t border-border/40 bg-background px-4 py-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {isEn ? 'Browse Popular Detail Pages' : '인기 상세 페이지 바로가기'}
              </p>
              <h2 className="text-2xl font-black tracking-tight">
                {isEn ? 'Featured Spirits by Category' : '카테고리별 주요 주류'}
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {isEn
                  ? 'These server-rendered links help both visitors and search engines discover high-value spirit detail pages faster.'
                  : '이 링크 묶음은 사용자와 검색엔진이 주요 상세 페이지를 더 빠르게 발견하도록 돕습니다.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredSections.map((section) => (
                <div key={section.category} className="rounded-3xl border border-border/60 bg-card/50 p-5">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">
                    {isEn ? section.labelEn : section.labelKo}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {section.spirits.map((spirit) => (
                      <li key={spirit.id}>
                        <Link
                          href={`/${lang}/spirits/${spirit.id}`}
                          className="line-clamp-2 text-muted-foreground transition-colors hover:text-amber-600"
                        >
                          {isEn ? (spirit.name_en || spirit.name) : spirit.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Suspense fallback={<ExploreLoading />}>
        <ExploreContent dict={dictionary.explore} />
      </Suspense>
    </>
  );
}
