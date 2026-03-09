export const runtime = 'edge';

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCanonicalUrl, getHreflangAlternates, toAbsoluteUrl } from '@/lib/utils/seo-url';
import NewsContentPage from './news-client';
import { newsDb } from '@/lib/db/firestore-rest';

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

  const initialNews = page === 1
    ? await newsDb.getLatest(PAGE_SIZE).catch(() => [])
    : await newsDb.getPage(page, PAGE_SIZE).catch(() => []);

  if (page > 1 && initialNews.length === 0) {
    notFound();
  }

  return (
    <>
      {/* SSR landing content — provides substantial indexed copy for both KO and EN */}
      <section className="bg-background border-t border-border/40 py-14 px-4">
        <div className="container mx-auto max-w-2xl space-y-10">

          {/* Introduction */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isEn ? 'Global Spirits News' : '글로벌 주류 뉴스'}
            </h1>
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

          {/* Coverage Areas */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {isEn ? 'What We Cover' : '주요 커버리지 영역'}
            </h2>
            {isEn ? (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li><strong className="text-foreground">Korean Spirits</strong> — Traditional spirits (soju, makgeolli, cheongju, distilled soju) gaining international recognition and export growth.</li>
                <li><strong className="text-foreground">Whisky</strong> — Scotch, Japanese, Irish, American, and emerging Korean whisky distilleries, release calendars, and auction highlights.</li>
                <li><strong className="text-foreground">Awards &amp; Recognition</strong> — Results from IWSC, ISC, San Francisco World Spirits Competition, and other major global competitions.</li>
                <li><strong className="text-foreground">Market Trends</strong> — Premiumisation, category growth, consumer behavior shifts, and investment in the spirits sector.</li>
                <li><strong className="text-foreground">Craft &amp; Indie</strong> — Independent distillers, limited releases, and emerging categories worth watching.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li><strong className="text-foreground">한국 전통주</strong> — 소주, 막걸리, 청주, 증류 소주 등 국제적 인정을 받으며 수출이 성장하는 한국 주류 소식.</li>
                <li><strong className="text-foreground">위스키</strong> — 스카치, 일본, 아이리시, 아메리칸, 그리고 신흥 한국 위스키 증류소의 출시 일정 및 경매 하이라이트.</li>
                <li><strong className="text-foreground">수상 및 인정</strong> — IWSC, ISC, 샌프란시스코 세계 주류 대회 등 주요 국제 대회 결과.</li>
                <li><strong className="text-foreground">시장 트렌드</strong> — 프리미엄화, 카테고리별 성장, 소비자 행동 변화, 주류 업계 투자 동향.</li>
                <li><strong className="text-foreground">크래프트 &amp; 인디</strong> — 독립 증류소, 한정 릴리즈, 주목할 만한 신흥 카테고리.</li>
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
                    <dt className="font-semibold text-foreground">How often is the news updated?</dt>
                    <dd className="text-muted-foreground mt-1">New articles are added regularly as significant industry news breaks. Our AI analysis layer processes incoming stories and adds context, key takeaways, and related spirit references.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">What makes this different from a standard news aggregator?</dt>
                    <dd className="text-muted-foreground mt-1">Each story is enriched with AI-generated analysis that explains why it matters, which spirit categories are affected, and how it connects to broader industry trends — making it useful even for readers who are new to the category.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Can I follow a specific category or region?</dt>
                    <dd className="text-muted-foreground mt-1">Yes. You can filter articles by spirit category, region of origin, and topic type to see only the news most relevant to your interests.</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="font-semibold text-foreground">뉴스는 얼마나 자주 업데이트되나요?</dt>
                    <dd className="text-muted-foreground mt-1">주요 업계 소식이 생기는 즉시 새 기사가 추가됩니다. AI 분석 레이어가 뉴스를 처리하여 맥락, 핵심 포인트, 관련 주류 정보를 덧붙입니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">일반 뉴스 집계 서비스와 어떻게 다른가요?</dt>
                    <dd className="text-muted-foreground mt-1">각 뉴스는 AI가 생성한 분석을 통해 왜 중요한지, 어떤 주류 카테고리에 영향을 미치는지, 더 넓은 업계 트렌드와 어떻게 연결되는지를 설명합니다. 해당 분야에 처음 입문한 독자에게도 유익합니다.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">특정 카테고리나 지역을 팔로우할 수 있나요?</dt>
                    <dd className="text-muted-foreground mt-1">네. 주류 카테고리, 원산지 지역, 주제 유형으로 기사를 필터링하여 나의 관심사에 가장 관련된 뉴스만 볼 수 있습니다.</dd>
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
            <ul className="flex flex-wrap gap-x-2 gap-y-3 text-sm">
              <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Spirits Wiki' : '주류 백과사전'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/korean-traditional-spirits`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Korean Traditional Spirits' : '전통주 종류'}</Link></li>
              <li><Link href={`/${lang}/contents/wiki/korean-whisky`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Korean Whisky Distilleries' : '한국 위스키'}</Link></li>
              <li><Link href={`/${lang}/contents/reviews`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Spirit Tasting Reviews' : '커뮤니티 리뷰'}</Link></li>
              <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-indigo-500/60 hover:text-indigo-500 transition-colors">{isEn ? 'Explore Spirits' : '주류 탐색'}</Link></li>
            </ul>
          </div>

        </div>
      </section>

      <NewsContentPage key={`page-${page}`} initialNews={initialNews} initialPage={page} />
    </>
  );
}
