import { Suspense } from "react";
import { Metadata } from "next";
import ExploreContent from "@/components/ui/ExploreContent";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";
import ExploreLoading from "./loading";

export const revalidate = 60;

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

  return (
    <>
      <Suspense fallback={<ExploreLoading />}>
        <ExploreContent dict={dictionary.explore} />
      </Suspense>
    </>
  );
}
