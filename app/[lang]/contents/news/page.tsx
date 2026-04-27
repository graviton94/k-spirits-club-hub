import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCanonicalUrl, getHreflangAlternates, toAbsoluteUrl } from '@/lib/utils/seo-url';
import NewsContentPage from './news-client';
import { dbAdminListNewsArticles } from '@/lib/db/data-connect-admin';
import { RelatedContentLinks, getRelatedIconKey } from '@/components/common/related-content-links';

interface NewsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string; q?: string; sort?: string; tag?: string; source?: string }>;
}

const PAGE_SIZE = 10;

function hasFilterParams(sp: { page?: string; q?: string; sort?: string; tag?: string; source?: string }): boolean {
  return !!(sp.q || sp.sort || sp.tag || sp.source);
}

export async function generateMetadata({ params, searchParams }: NewsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  const isEn = lang === 'en';

  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);
  const basePath = `/${lang}/contents/news`;
  const canonicalUrl = page > 1
    ? toAbsoluteUrl(`${basePath}?page=${page}`)
    : getCanonicalUrl(basePath);
  const hreflangAlternates = getHreflangAlternates('/contents/news');

  if (hasFilterParams(sp)) {
    return {
      title: isEn
        ? 'Global Spirits News — Search Results'
        : '글로벌 주류 뉴스 — 검색 결과',
      robots: { index: false, follow: true },
      alternates: { canonical: getCanonicalUrl(basePath) },
    };
  }

  return {
    title: page > 1
      ? (isEn
        ? `Global Spirits News — Page ${page}`
        : `글로벌 주류 뉴스 — ${page}페이지`)
      : (isEn
        ? 'Global Spirits News — AI-Analyzed Industry Updates'
        : '글로벌 주류 뉴스 — AI가 분석한 주류 업계 최신 동향'),
    description: isEn
      ? 'Stay informed with the latest global spirits industry news — new distillery launches, award results, market trends, and in-depth reports analyzed by AI. Covers Korean spirits, Scotch, Japanese whisky, and more.'
      : '글로벌 주류 업계 최신 소식을 AI 분석과 함께 확인하세요. 신규 증류소, 수상 결과, 시장 트렌드, 심층 리포트 — 한국 전통주부터 스카치, 일본 위스키까지 세계 주류 뉴스를 한곳에서.',
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? 'Global Spirits News | K-Spirits Club' : '글로벌 주류 뉴스 | K-Spirits Club',
      description: isEn
        ? 'Global spirits industry news and insights, analyzed by AI.'
        : 'AI가 분석한 글로벌 주류업계 주요 뉴스 및 인사이트.',
      type: 'website',
      siteName: 'K-Spirits Club',
      url: canonicalUrl,
    },
  };
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const isEn = lang === 'en';

  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  let initialNews: any[] = [];
  try {
    initialNews = await dbAdminListNewsArticles(PAGE_SIZE, (page - 1) * PAGE_SIZE);
  } catch (err) {
    console.error('[NewsPage] Failed to fetch initial news:', err);
    // initialNews remains [] as fallback
  }

  // FAQ Schema
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: isEn ? [
      {
        '@type': 'Question',
        name: 'How often is the news updated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'New articles are added regularly as significant industry news breaks.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I follow a specific category or region?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can filter articles by spirit category and region.'
        }
      }
    ] : [
      {
        '@type': 'Question',
        name: '뉴스는 얼마나 자주 업데이트되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '주요 업계 소식이 생기는 즉시 새 기사가 추가됩니다.'
        }
      },
      {
        '@type': 'Question',
        name: '특정 카테고리나 지역을 팔로우할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네. 카테고리나 지역별로 최신 소식을 확인하실 수 있습니다.'
        }
      }
    ]
  };

  // Breadcrumb Schema
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : '홈',
        item: `https://kspiritsclub.com/${lang}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Global Spirits News' : '글로벌 주류 뉴스',
        item: `https://kspiritsclub.com/${lang}/contents/news`
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <NewsContentPage key={`page-${page}`} initialNews={initialNews} initialPage={page} />

      {/* SSR landing content — moved to bottom for better UX (content first) */}
      <section className="bg-background border-t border-border/40 py-8 md:py-14 px-4">
        <div className="container mx-auto max-w-2xl space-y-6 md:space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isEn ? 'About Global Spirits News' : '글로벌 주류 뉴스 안내'}
            </h2>
            {isEn ? (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  Stay informed with what is happening across the global spirits industry, powered by AI analysis. New distillery launches, major award announcements, shifting market trends, and in-depth producer profiles — all curated and analyzed so you get the substance behind the headlines, not just the noise.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our coverage spans every major spirits-producing region: the rise of Korean traditional spirits on the world stage, rare Japanese whisky releases driving collector demand, the expanding craft gin and rum scene in Southeast Asia, and the continued evolution of the Scotch and Irish whisky markets. Whether you are a collector, enthusiast, or trade professional, Global Spirits News keeps you ahead of the curve.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground leading-relaxed">
                  AI가 분석한 글로벌 주류 업계 최신 소식을 한곳에서 확인하세요. 신규 증류소 오픈, 주요 수상 발표, 시장 트렌드 변화, 생산자 심층 프로파일 — 단순 헤드라인을 넘어 뉴스 뒤의 맥락과 의미를 전달합니다.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  세계 주요 주류 생산 지역을 모두 커버합니다. 세계 무대로 진출하는 한국 전통주, 컬렉터 수요를 끌어올리는 희귀 일본 위스키, 동남아시아의 크래프트 진·럼 씬의 확장, 스카치와 아이리시 위스키 시장의 진화까지. 컬렉터이든, 취미 애호가이든, 업계 전문가이든 글로벌 주류 뉴스가 한발 앞서 나아갈 수 있도록 돕습니다.
                </p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold">
              {isEn ? 'What We Cover' : '주요 커버리지 영역'}
            </h3>
            {isEn ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li><strong className="text-foreground">Korean Spirits</strong> — Traditional spirits gaining international recognition.</li>
                <li><strong className="text-foreground">Whisky</strong> — Scotch, Japanese, Irish, American, and emerging distilleries.</li>
                <li><strong className="text-foreground">Awards &amp; Recognition</strong> — Results from major global competitions.</li>
                <li><strong className="text-foreground">Market Trends</strong> — Premiumisation and consumer behavior shifts.</li>
                <li><strong className="text-foreground">Craft &amp; Indie</strong> — Independent distillers and limited releases.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li><strong className="text-foreground">한국 전통주</strong> — 국제적 성장을 거듭하는 한국 주류 소식.</li>
                <li><strong className="text-foreground">위스키</strong> — 출시 일정, 증류소 소식 및 경매 하이라이트.</li>
                <li><strong className="text-foreground">수상 및 인정</strong> — 주요 국제 대회 결과 총망라.</li>
                <li><strong className="text-foreground">시장 트렌드</strong> — 업계 투자 동향 및 트렌드 분석.</li>
                <li><strong className="text-foreground">크래프트 &amp; 인디</strong> — 주목할 만한 신흥 카테고리.</li>
              </ul>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              {isEn ? 'Frequently Asked Questions' : '자주 묻는 질문'}
            </h3>
            <dl className="space-y-4 text-sm">
              {isEn ? (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">How often is the news updated?</dt>
                    <dd className="text-muted-foreground mt-1">New articles are added regularly as significant industry news breaks.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Can I follow a specific category or region?</dt>
                    <dd className="text-muted-foreground mt-1">Yes. You can filter articles by spirit category and region.</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">뉴스는 얼마나 자주 업데이트되나요?</dt>
                    <dd className="text-muted-foreground mt-1">주요 업계 소식이 생기는 즉시 새 기사가 추가됩니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">특정 카테고리나 지역을 팔로우할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">네. 카테고리나 지역별로 최신 소식을 확인하실 수 있습니다.</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          <RelatedContentLinks 
            title={isEn ? 'Explore Related Content' : '관련 콘텐츠 탐색'}
            links={[
              { href: `/${lang}/contents`, label: isEn ? 'Contents Hub' : '콘텐츠 허브', icon: getRelatedIconKey('hub', '/contents') },
              { href: `/${lang}/contents/wiki`, label: isEn ? 'Spirits Wiki' : '주류 백과사전', icon: getRelatedIconKey('wiki', '/contents/wiki') },
              { href: `/${lang}/contents/reviews`, label: isEn ? 'Spirit Tasting Reviews' : '커뮤니티 리뷰', icon: getRelatedIconKey('reviews', '/contents/reviews') },
              { href: `/${lang}/explore`, label: isEn ? 'Explore Spirits' : '주류 탐색', icon: getRelatedIconKey('explore', '/explore') },
            ]}
          />
        </div>
      </section>
    </>
  );
}
