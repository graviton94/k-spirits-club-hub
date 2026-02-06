import { Suspense } from "react";
import { Metadata } from "next";
import ExploreContent from "@/components/ui/ExploreContent";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const isEn = lang === 'en';

  const title = dict.meta.explore;
  const description = isEn
    ? "Explore various spirits by category including Whisky, Soju, Makgeolli, and more. Search and compare spirits from Korea and around the world."
    : "위스키, 전통주, 증류주 등 다양한 주류를 카테고리별로 탐색하세요. 싱글몰트, 버번, 막걸리, 소주 등 한국과 전세계의 술을 검색하고 비교할 수 있습니다.";

  return {
    title,
    description,
    keywords: isEn
      ? ["Spirits Explorer", "Whisky Categories", "Korean Spirits Search", "Soju", "Makgeolli"]
      : ["주류 탐색", "위스키 카테고리", "전통주 검색", "증류주 종류", "싱글몰트", "버번", "막걸리", "소주"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: isEn ? "en_US" : "ko_KR",
      siteName: "K-Spirits Club",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

import ExploreLoading from "./loading";

export default async function ExplorePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreContent dict={dictionary.explore} />
    </Suspense>
  );
}
