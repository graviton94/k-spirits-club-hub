'use client';

import { SearchBar } from "@/components/ui/SearchBar";
import DailyPick from "@/components/home/DailyPick";
import { LiveReviews } from "@/components/ui/LiveReviews";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Flame, ArrowRight } from "lucide-react";
import styles from "@/app/[lang]/page.module.css";
import { RandomBackground } from "@/components/ui/RandomBackground";
import { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { Spirit } from "@/lib/db/schema";
import WikiSnippetSection from "@/components/home/WikiSnippetSection";
import { surfaces, typography, chips } from "@/lib/design/patterns";

interface HomeClientProps {
    lang: string;
    dict: any;
    initialNewArrivals: Spirit[];
    initialTrending: any[];
    initialReviews: any[];
    dailySnippet: import('@/lib/utils/wiki-snippet').WikiSnippet | null;
    children?: React.ReactNode;
}

const UI_TEXT = {
    ko: {
        newArrivals: "최신 입고",
        trending: "오늘의 인기 제품",
        viewAll: "전체보기",
        noNew: "아직 새로운 상품이 없습니다.",
        liveReviews: "⚡️ 실시간 리뷰",
    },
    en: {
        newArrivals: "New Arrivals",
        trending: "Today's Trending",
        viewAll: "View All",
        noNew: "No new arrivals yet.",
        liveReviews: "⚡️ Live Reviews",
    }
};

export default function HomeClient({ lang, dict, initialNewArrivals, initialReviews, dailySnippet, children }: HomeClientProps) {
    // const { publishedSpirits, isLoading: isCacheLoading } = useSpiritsCache(); // Cache might still be used for other things or removed if only for trending
    // Actually, let's keep it simple. Remove trending logic.

    // Use state with initial data for instant render
    // const [trendingSpirits] = useState<any[]>(initialTrending); // REMOVED
    const [newArrivals] = useState<any[]>(initialNewArrivals);
    // Carousel clone items — added client-side only to prevent duplicate content in SSR HTML.
    // The clone is required for the CSS infinite-scroll animation (translate -50%).
    const [carouselItems, setCarouselItems] = useState<Spirit[]>(initialNewArrivals);
    useEffect(() => {
        // Run once on mount; initialNewArrivals is a static server prop that does not change.
        if (initialNewArrivals.length > 0) {
            setCarouselItems([...initialNewArrivals, ...initialNewArrivals]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const isEn = lang === 'en';
    const t = UI_TEXT[isEn ? 'en' : 'ko'];

    // Compute final display spirits (trending or fallback to recent) - REMOVED

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary/30">

            {/* 🏰 1. Premium Hero Section */}
            <section className="relative w-full h-[85vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
                {/* Visual Foundation */}
                <div className="absolute inset-0 z-0">
                    <RandomBackground />
                </div>
                <div className="absolute inset-0 z-10 bg-linear-to-b from-black/55 via-black/35 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 z-10 bg-radial-[ellipse_at_center] from-transparent via-black/10 to-black/35 pointer-events-none" />

                {/* Content Layer */}
                <div className="relative z-30 w-full max-w-6xl px-6 text-center space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-center flex-wrap gap-3 animate-fade-in-up">
                            <span className={`${chips.primarySm} backdrop-blur-md`}>
                                {dict.heroSubtitle}
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.92] md:leading-[0.85] tracking-tight animate-fade-in-up delay-100 drop-shadow-[0_12px_32px_rgba(0,0,0,0.56)]">
                            {dict.heroTitle} <br />
                            <span className="text-brand-gradient drop-shadow-none">
                                Spirit
                            </span>
                        </h1>
                    </div>

                    <div className="w-full max-w-2xl mx-auto animate-fade-in-up delay-200 relative z-30 space-y-4">
                        <div>
                             <SearchBar isHero={true} dict={dict} />
                        </div>
                        <div className="flex justify-center">
                            <DailyPick lang={lang} />
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-background to-transparent z-20" />
            </section>

            {/* ✨ 2. New Arrivals (Curated Exhibit) */}
            <section className="max-w-7xl mx-auto [padding-inline:var(--spacing-container)] -mt-10 md:-mt-24 relative z-30 mb-16 md:mb-32">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <h2 className={typography.sectionTitle}>{dict.newArrivals}</h2>
                    </div>
                    <Link href={`/${lang}/explore`} className={`${typography.sectionMeta} hover:text-primary transition-all flex items-center gap-1.5 group`}>
                        {isEn ? 'Explore' : '전체보기'}
                        <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative overflow-hidden w-full h-[240px] md:h-[320px] py-2 md:py-4 group/marquee">
                    {newArrivals.length > 0 ? (
                        <div className={`flex items-start gap-10 absolute ${styles.marquee} group-hover/marquee:[animation-play-state:paused]`}>
                            {carouselItems.map((spirit, index) => (
                                <Link
                                    href={`/${lang}/spirits/${spirit.id}`}
                                    key={`${spirit.id}-${index}`}
                                    className="shrink-0 block"
                                >
                                    <div className="w-[140px] md:w-[200px] flex flex-col items-center gap-3 md:gap-4 transition-all duration-500 hover:scale-105">
                                        <div className={`relative w-full aspect-[3/4] rounded-[24px] md:rounded-[40px] ${surfaces.panelSoft} overflow-hidden flex items-center justify-center p-4 md:p-8 group-hover:border-primary/50 transition-all`}>
                                            {/* Reflection Effect */}
                                            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                                            
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={getOptimizedImageUrl(spirit.thumbnailUrl || spirit.imageUrl || '/mys-4.webp', 300)}
                                                    alt={spirit.name}
                                                    loading="lazy"
                                                    fill
                                                    sizes="(max-width: 768px) 140px, 200px"
                                                    className="object-contain"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center w-full px-2">
                                            <h3 className="font-black text-sm text-foreground line-clamp-1 w-full tracking-tight">
                                                {isEn ? (spirit.nameEn || spirit.name_en || spirit.name) : spirit.name}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-[40px] border-2 border-dashed border-border/50 text-muted-foreground">
                            <p className="font-bold">{t.noNew}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 🗞️ 3. Global News Feed (Replaces Trending) */}
            <div className="max-w-7xl mx-auto [padding-inline:var(--spacing-container)] mb-16 md:mb-32">
                {children}
            </div>

            {/* 💬 4. Live Reviews (Social Proof) */}
            <section className="max-w-7xl mx-auto [padding-inline:var(--spacing-container)] mb-16 md:mb-32">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent">
                            <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                        <h2 className={typography.sectionTitle}>{dict.recentReviews || t.liveReviews}</h2>
                    </div>
                    <Link
                        href={`/${lang}/contents/reviews`}
                        className={`${typography.sectionMeta} hover:text-primary transition-all flex items-center gap-1.5 group`}
                    >
                        {isEn ? 'Stories' : '리뷰 더보기'}
                        <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className={`p-4 md:p-8 ${surfaces.panelSoft} rounded-[32px] md:rounded-[48px]`}>
                    <LiveReviews initialReviews={initialReviews} />
                </div>
            </section>

            {/* 📖 5. Institutional FAQ / Wiki */}
            <section className="bg-background py-16 md:py-32 border-t border-border/40">
                <div className="max-w-7xl mx-auto [padding-inline:var(--spacing-container)]">
                    <WikiSnippetSection lang={lang} initialSnippet={dailySnippet} />
                </div>
            </section>

        </div>
    );
}
