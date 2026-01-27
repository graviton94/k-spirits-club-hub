import { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티 리뷰",
  description: "K-Spirits Club 커뮤니티의 위스키 리뷰와 전통주 테이스팅 노트를 확인하세요. 실제 사용자들의 시음 경험과 평가를 공유합니다.",
  keywords: [
    "위스키 리뷰", "전통주 리뷰", "테이스팅 노트", "시음 노트",
    "커뮤니티 리뷰", "술 평가", "Whisky Reviews", "Tasting Notes"
  ],
  openGraph: {
    title: "커뮤니티 리뷰 | K-Spirits Club",
    description: "K-Spirits Club 커뮤니티의 위스키 리뷰와 전통주 테이스팅 노트를 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "K-Spirits Club",
  },
  twitter: {
    card: "summary_large_image",
    title: "커뮤니티 리뷰 | K-Spirits Club",
    description: "위스키 리뷰와 전통주 테이스팅 노트를 확인하세요.",
  },
};

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">✍️ 리뷰</h1>
        <p className="text-muted-foreground">커뮤니티 시음 노트 및 리뷰</p>
      </header>

      <div className="text-center py-20">
        <div className="text-6xl mb-4">✍️</div>
        <h2 className="text-2xl font-semibold mb-4">리뷰 서비스 준비 중</h2>
        <p className="text-muted-foreground mb-6">
          각 술의 상세 페이지에서 리뷰를 작성하고 확인할 수 있습니다.
        </p>
        <a
          href="/explore"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          주류 탐색하기
        </a>
      </div>
    </div>
  );
}
