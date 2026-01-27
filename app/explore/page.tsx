import { Suspense } from "react";
import { Metadata } from "next";
import ExploreContent from "@/components/ui/ExploreContent";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "주류 탐색",
  description: "위스키, 전통주, 증류주 등 다양한 주류를 카테고리별로 탐색하세요. 싱글몰트, 버번, 막걸리, 소주 등 한국과 전세계의 술을 검색하고 비교할 수 있습니다.",
  keywords: [
    "주류 탐색", "위스키 카테고리", "전통주 검색", "증류주 종류",
    "싱글몰트", "버번", "막걸리", "소주", "술 카테고리",
    "Spirits Explorer", "Whisky Categories"
  ],
  openGraph: {
    title: "주류 탐색 | K-Spirits Club",
    description: "위스키, 전통주, 증류주 등 다양한 주류를 카테고리별로 탐색하세요. 싱글몰트, 버번, 막걸리, 소주 등 한국과 전세계의 술을 검색하고 비교할 수 있습니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "K-Spirits Club",
  },
  twitter: {
    card: "summary_large_image",
    title: "주류 탐색 | K-Spirits Club",
    description: "위스키, 전통주, 증류주 등 다양한 주류를 카테고리별로 탐색하세요.",
  },
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
