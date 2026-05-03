import { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Gamepad2,
  ChevronRight,
  Sparkles,
  Beer,
  Fingerprint,
  Newspaper,
  MessageSquare,
  BookOpen
} from "lucide-react";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";
import { SPIRIT_CATEGORIES } from "@/lib/constants/spirits-guide-data";
import { ContentsHeaderAnimated, ContentsCardAnimated } from "./contents-animated";

interface ContentsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContentsPageProps): Promise<Metadata> {
  try {
    const { lang = 'ko' } = await params;
    const isEn = lang === 'en';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
    const ogImageUrl = `${baseUrl}/default-og.jpg`;

    const canonicalUrl = getCanonicalUrl(`/${lang}/contents`);
    const hreflangAlternates = getHreflangAlternates('/contents');

    return {
      title: isEn
        ? "Contents Hub — Spirit MBTI, World Cup, Reviews & Wiki"
        : "콘텐츠 허브 — 주류 MBTI · 월드컵 · 리뷰 · 백과사전",
      description: isEn
        ? "Discover your spirit personality with our MBTI test, vote in the Spirit World Cup, read community tasting reviews, follow AI-powered global spirits news, and explore the Spirits Wiki and comparison guides."
        : "주류 MBTI 테스트로 나의 취향을 분석하고, 술 취향 월드컵에서 최애 주류를 뽑고, 커뮤니티 리뷰를 읽고, AI 뉴스까지 한곳에서 만나보세요.",
      alternates: {
        canonical: canonicalUrl,
        languages: hreflangAlternates,
      },
    };
  } catch (e) {
    return { title: 'Contents Hub | K-Spirits Club' };
  }
}

export default async function ContentsPage({ params }: ContentsPageProps) {
  const resolvedParams = await params.catch(() => ({ lang: 'ko' }));
  const lang = resolvedParams?.lang || 'ko';
  const isEn = lang === 'en';
  const wikiQuickSlugs = ['soju-guide', 'makgeolli-guide', 'korean-whisky', 'single-malt', 'bourbon', 'gin', 'tequila', 'sake', 'rum', 'cognac', 'vodka'];
  const wikiQuickLinks = wikiQuickSlugs
    .map((slug) => SPIRIT_CATEGORIES.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  const contents = [
    {
      title: isEn ? "Spirit World Cup" : "술 취향 월드컵",
      description: isEn ? "Ranking Tournament! Find your ultimate favorite spirit from 500k+ options." : "50만 종 이상의 술 중 당신의 진짜 최애 주류를 가려내는 토너먼트.",
      icon: <Trophy className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/worldcup`,
      status: "OPEN",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    },
    {
      title: isEn ? "Spirit Persona" : "내 술 취향 MBTI",
      description: isEn ? "12 questions to uncover your hidden spirit personality and drink ego." : "12가지 질문으로 정밀 분석하는 나의 숨겨진 주류 성격과 자아 찾기.",
      icon: <Fingerprint className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/mbti`,
      status: "HOT",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    },
    {
      title: isEn ? "Golden Pour Master" : "퍼펙트 푸어",
      description: isEn ? "Test your precision! Pour the legendary golden ratio in this timing game." : "전설의 황금 비율에 도전하라! 타이밍과 감각을 시험하는 미니게임.",
      icon: <Beer className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/perfect-pour`,
      status: "NEW",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    },
    {
      title: isEn ? "Community Reviews" : "주류 리뷰 보드",
      description: isEn ? "Authentic tasting notes from real enthusiasts. Discover hidden gems." : "주류 애호가들의 리얼한 시음 노트. 숨겨진 명작을 발견해보세요.",
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/reviews`,
      status: "OPEN",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    },
    {
      title: isEn ? "AI Sommelier News" : "글로벌 뉴스 피드",
      description: isEn ? "Latest global trends and distillery updates, analyzed by our AI Sommelier." : "AI 소믈리에가 분석한 글로벌 주류 트렌드와 증류소 최신 소식.",
      icon: <Newspaper className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/news`,
      status: "AI",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    },
    {
      title: isEn ? "Spirits Encyclopedia" : "주류 백과사전",
      description: isEn ? "The ultimate guide to every spirit category. History, production, and pairing." : "모든 주류 카테고리를 총망라한 가이드. 역사, 공정, 페어링의 모든 것.",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      link: `/${lang}/contents/wiki`,
      status: "NEW",
      gradient: "from-primary/10 to-transparent",
      glow: "bg-primary/20"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-32 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="mb-16 relative text-center">
        <ContentsHeaderAnimated>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-card/40 backdrop-blur-xl border border-white/5 rounded-full mb-4 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/80">
              {isEn ? 'Experience Playground' : '익스피리언스 플레이그라운드'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter italic uppercase leading-none">
            <span className="text-foreground">Contents</span><br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">Hub</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {isEn
              ? 'Your interactive gateway to the world of spirits. Explore tournaments, character tests, and AI-powered insights all in one place.'
              : '주류 문화를 즐기는 가장 완벽한 방법. 토너먼트, 성격 테스트, AI 분석 소식까지 한곳에서 모두 경험해보세요.'}
          </p>
        </ContentsHeaderAnimated>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {contents.map((item, idx) => (
          <ContentsCardAnimated key={idx} delay={idx * 0.1}>
            <Link
              href={item.link}
              className="group relative h-full flex flex-col bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:scale-[1.02] hover:bg-card/30 hover:border-primary/30 hover:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className={`absolute -top-24 -right-24 w-48 h-48 ${item.glow} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative z-10 flex flex-col h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-background/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-500 group-hover:shadow-primary/10">
                    {item.icon}
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 translate-y-1 group-hover:-translate-y-1 transition-transform">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  {isEn ? 'Proceed' : '입장하기'} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </ContentsCardAnimated>
        ))}
      </div>

      {/* SEO & Wiki Section Elevation */}
      <div className="mt-32 space-y-24 relative z-10">
        <div className="p-10 md:p-16 bg-card/10 backdrop-blur-2xl border border-white/5 rounded-[4rem] shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-foreground italic uppercase tracking-tighter">
                {isEn ? "Spirits" : "주류"}<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent italic">Wiki</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                {isEn
                  ? 'Dive deep into the rich history, complex production processes, and curated pairing tips for every category of fine spirits from around the world.'
                  : '전 세계 모든 주류 카테고리의 깊은 역사, 복잡한 제조 공정, 그리고 엄선된 페어링 팁을 한눈에 살펴보세요.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
               {wikiQuickLinks.map((wiki, i) => (
                 <Link 
                   key={i}
                   href={`/${lang}/contents/wiki/${wiki.slug}`} 
                   className="p-4 bg-muted/10 border border-white/5 rounded-2xl text-[11px] font-black text-center uppercase tracking-tighter hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all active:scale-95 whitespace-nowrap"
                 >
                   {isEn ? wiki.nameEn : wiki.nameKo}
                 </Link>
               ))}
               <Link 
                 href={`/${lang}/contents/wiki`} 
                 className="p-4 bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-2xl text-[11px] font-black text-center uppercase tracking-tighter hover:scale-105 transition-all active:scale-95"
               >
                 {isEn ? '→ Browse All' : '→ 전체 보기'}
               </Link>
            </div>
          </div>
        </div>

        {/* Footer Ambience */}
        <div className="text-center">
          <p className="text-muted-foreground/30 text-xs font-black uppercase tracking-[0.4em] animate-pulse italic">
            Expanding the Liquor Universe
          </p>
        </div>
      </div>
    </div>
  );
}
