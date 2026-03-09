export const runtime = 'edge';

import { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Gamepad2,
  PenTool,
  BarChart3,
  ChevronRight,
  Sparkles,
  Beer,
  Fingerprint,
  Newspaper,
  MessageSquare,
  BookOpen
} from "lucide-react";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";

interface ContentsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContentsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const ogImageUrl = `${baseUrl}/default-og.jpg`;

  const canonicalUrl = getCanonicalUrl(`/${lang}/contents`);
  const hreflangAlternates = getHreflangAlternates('/contents');

  return {
    title: isEn
      ? "Contents Hub | K-Spirits Club — Spirit MBTI, World Cup, Reviews & Wiki"
      : "콘텐츠 허브 | K-Spirits Club — 주류 MBTI · 월드컵 · 리뷰 · 백과사전",
    description: isEn
      ? "Discover your spirit personality with our MBTI test, vote in the Spirit World Cup, read community tasting reviews, follow AI-powered global spirits news, and explore the Spirits Wiki — all in one place."
      : "주류 MBTI 테스트로 나의 취향을 분석하고, 술 취향 월드컵에서 최애 주류를 뽑고, 커뮤니티 리뷰를 읽고, AI가 분석한 글로벌 주류 뉴스와 주류 백과사전까지 — K-Spirits Club 콘텐츠 허브에서 모두 만나보세요.",
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: isEn ? "Contents Hub | K-Spirits Club" : "콘텐츠 허브 | K-Spirits Club",
      description: isEn
        ? "Spirit MBTI, World Cup tournament, tasting reviews, AI news, and Spirits Wiki — explore all spirits contents in one place."
        : "주류 MBTI, 월드컵 토너먼트, 시음 리뷰, AI 뉴스, 주류 백과사전 — 주류 콘텐츠의 모든 것.",
      type: "website",
      siteName: "K-Spirits Club",
      url: canonicalUrl,
      images: [ogImageUrl]
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Contents Hub | K-Spirits Club" : "콘텐츠 허브 | K-Spirits Club",
      description: isEn
        ? "Spirit MBTI, World Cup tournament, tasting reviews, AI news, and Spirits Wiki."
        : "주류 MBTI, 월드컵 토너먼트, 시음 리뷰, AI 뉴스, 주류 백과사전.",
      images: [ogImageUrl]
    }
  };
}

export default async function ContentsPage({ params }: ContentsPageProps) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const contents = [
    {
      title: isEn ? "Spirit World Cup" : "술 취향 월드컵",
      description: isEn ? "What's your favorite spirit? Ranking Tournament." : "당신의 최애 술은? 랭킹 토너먼트.",
      icon: <Trophy className="w-8 h-8 text-amber-500" />,
      link: `/${lang}/contents/worldcup`,
      status: "OPEN",
      gradient: "from-amber-500/20 to-orange-600/20",
      borderHover: "group-hover:border-amber-500/50"
    },
    {
      title: isEn ? "Spirit MBTI" : "내 술 취향 MBTI",
      description: isEn ? "Find your alcohol ego! Character analysis." : "12가지 질문으로 알아보는 나의 알코올 자아 찾기.",
      icon: <Fingerprint className="w-8 h-8 text-pink-500" />,
      link: `/${lang}/contents/mbti`,
      status: "OPEN",
      gradient: "from-pink-500/20 to-rose-600/20",
      borderHover: "group-hover:border-pink-500/50"
    },
    {
      title: isEn ? "Golden Ratio Master" : "황금 비율 마스터",
      description: isEn ? "Test your pouring skills! Somaek Mini Game." : "당신의 소맥 비율은 몇 점? 타이밍 미니게임.",
      icon: <Beer className="w-8 h-8 text-amber-400" />,
      link: `/${lang}/contents/perfect-pour`,
      status: "NEW",
      gradient: "from-amber-400/20 to-yellow-500/20",
      borderHover: "group-hover:border-amber-400/50"
    },
    {
      title: isEn ? "Review Board" : "리뷰 보드",
      description: isEn ? "Check and share real tasting reviews from other users." : "다른 사용자들의 리얼한 시음평을 확인하고 공유해보세요.",
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      link: `/${lang}/contents/reviews`,
      status: "OPEN",
      gradient: "from-blue-500/20 to-cyan-600/20",
      borderHover: "group-hover:border-blue-500/50"
    },
    {
      title: isEn ? "Global Spirits News" : "글로벌 주류 뉴스",
      description: isEn ? "Latest trends and in-depth reports analyzed by AI." : "AI가 분석한 글로벌 주류 트렌드와 심층 리포트.",
      icon: <Newspaper className="w-8 h-8 text-indigo-500" />,
      link: `/${lang}/contents/news`,
      status: "OPEN",
      gradient: "from-indigo-500/20 to-purple-600/20",
      borderHover: "group-hover:border-indigo-500/50"
    },
    {
      title: isEn ? "Spirits Wiki" : "주류 백과사전",
      description: isEn ? "Explore definitions, history, and pairing tips for every spirit." : "위스키부터 고량주까지 — 세계 주류의 정의, 역사, 페어링을 한눈에.",
      icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
      link: `/${lang}/contents/wiki`,
      status: "NEW",
      gradient: "from-emerald-500/20 to-teal-600/20",
      borderHover: "group-hover:border-emerald-500/50"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl pb-24">
      {/* Header Section matching Cabinet Page */}
      <div className="mb-8 relative text-center">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            {isEn ? 'Contents Hub' : '콘텐츠 허브'}
          </h1>
          <p className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3" /> {isEn ? 'Playground for Spirits Enthusiasts' : '주류 애호가를 위한 놀이터'}
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto relative z-10">
        {contents.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className={`
              group relative overflow-hidden 
              bg-card/40 backdrop-blur-md border border-border/50 
              rounded-2xl p-5
              transition-all duration-300 
              hover:scale-[1.01] hover:shadow-xl hover:shadow-black/20
              ${item.borderHover}
            `}
          >
            {/* Hover Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-background/50 backdrop-blur-sm rounded-xl border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="mt-auto pl-1">
                <p className="text-muted-foreground text-xs font-medium leading-relaxed group-hover:text-white/80 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <div className="p-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Localized intro copy for SEO */}
      <div className="mt-10 max-w-2xl mx-auto text-center relative z-10 px-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isEn
            ? 'Welcome to the K-Spirits Club Contents Hub — your interactive gateway to the world of spirits. Uncover your drinking personality with our Spirit MBTI test, vote for your all-time favorite drink in the Spirit World Cup tournament, discover new bottles through authentic community tasting reviews, stay updated with AI-analyzed global spirits news, and dive deep into categories with our comprehensive Spirits Wiki.'
            : 'K-Spirits Club 콘텐츠 허브에 오신 것을 환영합니다. 주류 MBTI 테스트로 나만의 음주 성격을 발견하고, 술 취향 월드컵에서 최애 주류를 가려보세요. 커뮤니티 시음 리뷰로 새로운 술을 발견하고, AI가 분석한 글로벌 주류 뉴스로 업계 트렌드를 따라가며, 주류 백과사전에서 위스키·소주·막걸리·데킬라 등 세계 주류의 모든 것을 탐구해보세요.'}
        </p>
      </div>


      <div className="mt-16 max-w-4xl mx-auto relative z-10 px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border/50"></div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            {isEn ? "Featured Spirit Guides" : "인기 주류 가이드"}
          </h2>
          <div className="h-px flex-1 bg-border/50"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {isEn ? (
            <>
              <Link href="/en/contents/wiki/soju-guide" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">Korean Soju Guide</Link>
              <Link href="/en/contents/wiki/makgeolli-guide" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">Makgeolli Guide</Link>
              <Link href="/en/contents/wiki/korean-whisky" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">Korean Whisky Guide</Link>
              <Link href="/en/contents/wiki/korean-traditional-spirits" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">Traditional Spirits</Link>
              <Link href="/en/contents/wiki/korean-spirits-by-abv" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">Spirits by ABV</Link>
            </>
          ) : (
            <>
              <Link href="/ko/contents/wiki/soju-guide" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">소주 가이드</Link>
              <Link href="/ko/contents/wiki/makgeolli-guide" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">막걸리 가이드</Link>
              <Link href="/ko/contents/wiki/korean-whisky" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">한국 위스키 증류소</Link>
              <Link href="/ko/contents/wiki/korean-traditional-spirits" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">전통주 종류 정리</Link>
              <Link href="/ko/contents/wiki/korean-spirits-by-abv" className="text-sm px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-secondary hover:text-amber-500 transition-colors">도수별 증류주 추천</Link>
            </>
          )}
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-widest">
          More Experiences Coming Soon
        </p>
      </div>
    </div>
  );
}
