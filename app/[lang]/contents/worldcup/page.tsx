export const runtime = 'edge';

import { Metadata } from 'next';
import Link from 'next/link';
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url';
import WorldCupSelectionPage from './worldcup-client';

interface WorldCupPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: WorldCupPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents/worldcup`);
  const hreflangAlternates = getHreflangAlternates('/contents/worldcup');

  return {
    title: isEn
      ? 'Spirit World Cup — Vote for Your Favorite Drink'
      : '술 취향 월드컵 — 나만의 최애 주류를 가려보세요',
    description: isEn
      ? 'Pick your favorite spirit in a head-to-head tournament. Choose between two drinks each round until your ultimate favorite emerges. Covers whisky, soju, makgeolli, wine, beer, and more.'
      : '두 가지 술 중 더 마시고 싶은 쪽을 선택하는 토너먼트 게임. 위스키, 소주, 막걸리, 와인, 맥주 등 수백 가지 주류를 대결시켜 나의 진짜 최애 주류를 찾아보세요.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirit World Cup | K-Spirits Club' : '술 취향 월드컵 | K-Spirits Club',
      description: isEn
        ? 'Vote for your favorite spirit in our ranking tournament and find your perfect match.'
        : '랭킹 토너먼트로 나만의 최고의 술을 찾아보세요.',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default async function WorldCupPage({ params }: WorldCupPageProps) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <>
      <WorldCupSelectionPage />

      {/* SSR landing content — provides substantial indexed copy for both KO and EN */}
      <section className="bg-background border-t border-border/40 py-14 px-4">
        <div className="container mx-auto max-w-2xl space-y-10">

          {/* Introduction */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isEn ? 'Spirit World Cup' : '술 취향 월드컵'}
            </h1>
            {isEn ? (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  The Spirit World Cup is a tournament-format game that helps you uncover your true favorite drink. Each round presents two spirits side by side — simply choose the one you&rsquo;d rather enjoy. As rounds progress and the field narrows, your genuine taste preference emerges with surprising clarity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The tournament spans hundreds of spirits across multiple categories — Korean soju and makgeolli, Scotch and Japanese whisky, tequila, rum, gin, craft beer, natural wine, and more. Whether you already know your preferences or are exploring for the first time, the Spirit World Cup is the most engaging way to map your taste profile.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  술 취향 월드컵은 나만의 진짜 최애 주류를 발견하는 토너먼트 게임입니다. 매 라운드에서 두 가지 술이 나란히 제시되면, 더 마시고 싶은 쪽을 선택하면 됩니다. 선택을 거듭할수록 범위가 좁혀지고, 나의 진짜 취향이 예상치 못한 명확함으로 드러납니다.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  토너먼트는 국내외 수백 가지 주류를 아우릅니다 — 소주, 막걸리, 전통주, 스카치·일본 위스키, 데킬라, 럼, 진, 크래프트 맥주, 내추럴 와인 등 다양한 카테고리가 등장합니다. 이미 취향을 알고 있든 처음 탐색하든, 술 취향 월드컵은 나의 취향 지도를 그리는 가장 재미있는 방법입니다.
                </p>
              </>
            )}
          </div>

          {/* Tournament Format */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {isEn ? 'How the Tournament Works' : '토너먼트 방식'}
            </h2>
            {isEn ? (
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>Choose a spirit category to start — or let the tournament select a mixed bracket across all categories.</li>
                <li>Each round shows two spirits head-to-head. Pick the one you prefer — by name, image, or intuition.</li>
                <li>Losers are eliminated; winners advance. The bracket continues until one spirit remains.</li>
                <li>Your champion is revealed with a brief flavor profile and a link to explore similar spirits in our catalog.</li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>시작할 주류 카테고리를 선택하거나, 전 카테고리 통합 대진으로 시작하세요.</li>
                <li>매 라운드에서 두 가지 술이 맞붙습니다. 이름, 이미지, 또는 직관으로 더 끌리는 쪽을 선택하세요.</li>
                <li>패자는 탈락하고 승자가 다음 라운드로 진출합니다. 대진은 최후의 1종이 남을 때까지 이어집니다.</li>
                <li>챔피언이 공개되면 간단한 풍미 설명과 함께 카탈로그에서 유사한 주류를 탐색할 수 있는 링크가 제공됩니다.</li>
              </ol>
            )}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {isEn ? 'Frequently Asked Questions' : '자주 묻는 질문'}
            </h2>
            <dl className="space-y-4 text-sm">
              {isEn ? (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">What categories are available?</dt>
                    <dd className="text-muted-foreground mt-1">You can run tournaments across whisky, soju, makgeolli, gin, rum, tequila, wine, beer, and Korean traditional spirits. New categories are added regularly.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">How are the matchups determined?</dt>
                    <dd className="text-muted-foreground mt-1">Matchups are randomly seeded from our verified spirits catalog, so each tournament session offers a fresh bracket. Popular spirits from community reviews also appear more frequently.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Can I share my result?</dt>
                    <dd className="text-muted-foreground mt-1">Yes — your champion result page includes a share button so you can post your winning spirit to social media or send it to friends.</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">어떤 카테고리를 선택할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">위스키, 소주, 막걸리, 진, 럼, 데킬라, 와인, 맥주, 한국 전통주 카테고리에서 토너먼트를 진행할 수 있으며, 새로운 카테고리가 꾸준히 추가됩니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">대진은 어떻게 결정되나요?</dt>
                    <dd className="text-muted-foreground mt-1">검증된 주류 카탈로그에서 무작위로 시드가 배정되어 매번 새로운 대진표가 구성됩니다. 커뮤니티 리뷰에서 인기 있는 주류는 더 자주 등장합니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">결과를 공유할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">네 — 챔피언 결과 페이지에는 공유 버튼이 있어 소셜 미디어에 나의 최애 주류를 게시하거나 친구에게 보낼 수 있습니다.</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Internal Links */}
          <div className="space-y-3 pt-2 border-t border-border/40">
            <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-widest text-sm">
              {isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
            </h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
              <li><Link href={`/${lang}/contents/mbti`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Spirit MBTI Test' : '주류 MBTI 테스트'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/soju-guide`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Korean Soju Guide' : '소주 가이드'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/korean-traditional-spirits`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Korean Traditional Spirits' : '전통주 종류'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Spirits Wiki' : '주류 백과사전'}</Link></li>
              <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Explore Spirits' : '주류 탐색'}</Link></li>
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
