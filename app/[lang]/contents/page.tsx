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
  Beer
} from "lucide-react";

interface ContentsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContentsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "K-Spirits Club | Contents Hub" : "K-Spirits Club | 컨텐츠 허브",
    description: isEn
      ? "Enjoy various contents like Spirit World Cup, Mini Games, and Tasting Notes."
      : "술 취향 월드컵, 미니게임, 테이스팅 노트 등 K-Spirits Club의 다양한 즐길거리를 만나보세요.",
    openGraph: {
      title: isEn ? "K-Spirits Club | Contents Hub" : "K-Spirits Club | 컨텐츠 허브",
      description: isEn ? "Enjoy various spirits contents and events." : "다양한 주류 컨텐츠와 이벤트를 즐겨보세요.",
      type: "website",
      siteName: "K-Spirits Club",
    },
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
      title: isEn ? "Golden Ratio Master" : "황금 비율 마스터",
      description: isEn ? "Test your pouring skills! Somaek Mini Game." : "당신의 소맥 비율은 몇 점? 타이밍 미니게임.",
      icon: <Beer className="w-8 h-8 text-amber-400" />,
      link: `/${lang}/contents/perfect-pour`,
      status: "NEW",
      gradient: "from-amber-400/20 to-yellow-500/20",
      borderHover: "group-hover:border-amber-400/50"
    },
    {
      title: isEn ? "Tasting Notes (🚧Dev)" : "시음 노트(🚧개발 중)",
      description: isEn ? "Community to share your tasting experiences." : "서로의 미각을 공유하는 커뮤니티 공간.",
      icon: <PenTool className="w-8 h-8 text-blue-500" />,
      link: "#",
      status: "Ready",
      gradient: "from-blue-500/20 to-cyan-600/20",
      borderHover: "group-hover:border-blue-500/50"
    },
    {
      title: isEn ? "Hall of Fame (🚧Dev)" : "명예의 전당(🚧개발 중)",
      description: isEn ? "Best members of the month & Popular spirits." : "이달의 베스트 멤버와 인기 주류 랭킹.",
      icon: <BarChart3 className="w-8 h-8 text-emerald-500" />,
      link: "#",
      status: "Ready",
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
            Contents Hub
          </h1>
          <p className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Playground for Drinkers
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

      {/* Footer Text */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-widest">
          More Experiences Coming Soon
        </p>
      </div>
    </div>
  );
}
