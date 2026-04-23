import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCanonicalUrl, getHreflangAlternates, toAbsoluteUrl } from '@/lib/utils/seo-url';
import ReviewBoardPage from './reviews-client';
import { dbListSpiritReviews } from '@/lib/db/data-connect-client';

interface ReviewsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string; q?: string; sort?: string; tag?: string; source?: string }>;
}

const PAGE_SIZE = 10;

/** Returns true if any search/filter/sort variant is present (not just pagination). */
function hasFilterParams(sp: { page?: string; q?: string; sort?: string; tag?: string; source?: string }): boolean {
  return !!(sp.q || sp.sort || sp.tag || sp.source);
}

export async function generateMetadata({ params, searchParams }: ReviewsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  const isEn = lang === 'en';

  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);
  const basePath = `/${lang}/contents/reviews`;
  const canonicalUrl = page > 1
    ? toAbsoluteUrl(`${basePath}?page=${page}`)
    : getCanonicalUrl(basePath);
  const hreflangAlternates = getHreflangAlternates('/contents/reviews');

  // Search/filter variants → noindex to prevent index bloat
  if (hasFilterParams(sp)) {
    return {
      title: isEn
        ? 'Spirits Review Board — Search Results'
        : '주류 리뷰 보드 — 검색 결과',
      robots: { index: false, follow: true },
      alternates: { canonical: getCanonicalUrl(basePath) },
    };
  }

  return {
    title: page > 1
      ? (isEn
        ? `Spirits Review Board — Page ${page}`
        : `주류 리뷰 보드 — ${page}페이지`)
      : (isEn
        ? 'Spirits Review Board — Authentic Tasting Notes from Real Drinkers'
        : '주류 리뷰 보드 — 실제 경험자의 생생한 시음 노트'),
    description: isEn
      ? 'Read and share honest tasting reviews for whisky, soju, makgeolli, wine, and more. Community-driven spirits reviews with aroma, flavor, and finish notes from verified drinkers.'
      : '위스키, 소주, 막걸리, 와인 등 다양한 주류에 대한 솔직한 시음 리뷰를 읽고 공유하세요. 향, 맛, 여운을 담은 커뮤니티 기반의 진짜 주류 시음 노트.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Spirits Review Board | K-Spirits Club' : '주류 리뷰 보드 | K-Spirits Club',
      description: isEn
        ? 'Authentic tasting reviews from real spirits enthusiasts.'
        : '실제 주류 애호가들의 진솔한 시음 리뷰.',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default async function ReviewsPage({ params, searchParams }: ReviewsPageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const isEn = lang === 'en';

  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  const initialReviews = await dbListSpiritReviews(PAGE_SIZE, (page - 1) * PAGE_SIZE).catch(() => []);

  // Invalid page: no results for page > 1 → 404 to avoid thin empty pages
  if (page > 1 && initialReviews.length === 0) {
    notFound();
  }

  // --- FAQ Schema for Reviews Hub ---
  // Boosts SERP real estate and answers common user intent (who can write, what spirits etc.)
  const faqQuestions = isEn ? [
    {
      '@type': 'Question',
      name: 'Who can write a spirits review on K-Spirits Club?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any registered member can write a review. Creating an account is free and takes under a minute.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of spirits can I find reviews for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can find reviews for over 100,000 products including Whisky, Soju, Makgeolli, Wine, Gin, and more.'
      }
    }
  ] : [
    {
      '@type': 'Question',
      name: 'K-Spirits Club에서 누가 리뷰를 작성할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '가입한 회원이라면 누구나 자유롭게 시음 리뷰를 작성할 수 있습니다. 가입은 무료이며 1분 내외로 가능합니다.'
      }
    },
    {
      '@type': 'Question',
      name: '어떤 종류의 술 리뷰를 볼 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '위스키, 소주, 막걸리, 와인 등 10만 종 이상의 다양한 주류 리뷰와 테이스팅 노트를 확인할 수 있습니다.'
      }
    }
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* SSR landing content — provides substantial indexed copy for both KO and EN */}
      <section className="bg-background border-t border-border/40 py-14 px-4">
        <div className="container mx-auto max-w-2xl space-y-10">

          {/* Introduction */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isEn ? 'Spirits Review Board' : '주류 리뷰 보드'}
            </h1>
            {isEn ? (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  The K-Spirits Club Review Board is where genuine tasting experiences live. Browse reviews written by real spirits enthusiasts — not marketing copy, but honest impressions covering aroma, palate, finish, and the context in which a drink was enjoyed. From everyday Korean soju to rare aged single malts, every review tells a real story.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Looking for your next bottle? Community reviews help you make a more confident choice before you buy. Already tasted something worth sharing? Write your review and contribute to a growing body of knowledge that helps fellow enthusiasts navigate the vast world of spirits with better information.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  K-Spirits Club 리뷰 보드에서는 실제 음주 경험을 가진 사용자들의 생생한 시음 기록을 읽을 수 있습니다. 마케팅 문구가 아닌 솔직한 인상 — 향, 맛, 여운, 그리고 그 술을 마신 상황까지 담긴 진짜 리뷰가 쌓여 있습니다. 일상적인 소주부터 희귀한 숙성 싱글 몰트까지, 모든 리뷰는 진짜 이야기입니다.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  다음에 마실 술을 고르고 있나요? 커뮤니티 리뷰를 통해 구매 전에 더 자신 있는 선택을 할 수 있습니다. 이미 인상 깊게 마신 술이 있다면, 리뷰를 남겨 다른 애호가들이 더 좋은 정보로 주류의 세계를 탐험하도록 도와주세요.
                </p>
              </>
            )}
          </div>

          {/* What You Can Discover */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {isEn ? 'What You Can Discover in Reviews' : '리뷰에서 발견할 수 있는 것들'}
            </h2>
            {isEn ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>Detailed tasting notes on aroma, palate, and finish — not just star ratings.</li>
                <li>Context notes: how and when the spirit was enjoyed, food pairings tried, serving temperature used.</li>
                <li>Comparisons between similar spirits from different producers or price points.</li>
                <li>Honest assessments of value for money, especially for premium and rare bottles.</li>
                <li>Emerging bottles gaining traction in the community before mainstream attention.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>향, 맛, 여운에 대한 세밀한 시음 노트 — 별점만이 아닌 진짜 설명.</li>
                <li>컨텍스트 노트: 언제 어떻게 마셨는지, 시도한 안주 페어링, 시음 온도.</li>
                <li>다른 생산자나 가격대의 유사 주류와의 비교.</li>
                <li>가성비에 대한 솔직한 평가 — 특히 프리미엄·희귀 주류 대상.</li>
                <li>커뮤니티에서 주목받기 시작한 신흥 주류 발굴.</li>
              </ul>
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
                    <dt className="font-semibold text-foreground">Who can write a review?</dt>
                    <dd className="text-muted-foreground mt-1">Any registered K-Spirits Club member can write a tasting review. Creating a free account takes under a minute.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">What spirits can be reviewed?</dt>
                    <dd className="text-muted-foreground mt-1">Any spirit in our catalog of 100,000+ products can be reviewed, including whisky, soju, makgeolli, sake, wine, gin, rum, tequila, and Korean traditional spirits.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Are reviews moderated?</dt>
                    <dd className="text-muted-foreground mt-1">Yes. Community reviews go through a basic moderation step to keep content authentic and spam-free. Offensive or clearly fabricated reviews are removed.</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">누가 리뷰를 작성할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">K-Spirits Club에 가입한 회원이라면 누구나 시음 리뷰를 작성할 수 있습니다. 무료 계정 생성은 1분도 걸리지 않습니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">어떤 주류를 리뷰할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">위스키, 소주, 막걸리, 사케, 와인, 진, 럼, 데킬라, 전통주 등 10만 종 이상의 카탈로그에 등록된 모든 주류를 리뷰할 수 있습니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">리뷰는 검토되나요?</dt>
                    <dd className="text-muted-foreground mt-1">네. 커뮤니티 리뷰는 콘텐츠의 진정성을 유지하고 스팸을 방지하기 위해 기본 검토 과정을 거칩니다. 모욕적이거나 명백히 허위인 리뷰는 삭제됩니다.</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Internal Links */}
          <div className="space-y-3 pt-2 border-t border-border/40">
            <h2 className="font-semibold text-muted-foreground uppercase tracking-widest text-sm">
              {isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
            </h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
              <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Explore Spirits' : '주류 탐색'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/soju-guide`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Korean Soju Guide' : '소주 가이드'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/makgeolli-guide`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Makgeolli Guide' : '막걸리 가이드'}</Link></li>
              <li><Link href={`/${lang}/contents/mbti`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Spirit MBTI Test' : '주류 MBTI 테스트'}</Link></li>
              <li><Link href={`/${lang}/contents/news`} className="px-3 py-1.5 rounded-full border border-border hover:border-blue-500/60 hover:text-blue-500 transition-colors">{isEn ? 'Global Spirits News' : '글로벌 주류 뉴스'}</Link></li>
            </ul>
          </div>

        </div>
      </section>

      <ReviewBoardPage key={`page-${page}`} initialReviews={initialReviews} initialPage={page} />
    </>
  );
}
