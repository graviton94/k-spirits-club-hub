'use client';

import { SearchBar } from "@/components/ui/SearchBar";
import DailyPick from "@/components/home/DailyPick";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { LiveReviews } from "@/components/ui/LiveReviews";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Flame, ArrowRight } from "lucide-react";
import styles from "@/app/[lang]/page.module.css";
import { RandomBackground } from "@/components/ui/RandomBackground";
import { useSpiritsCache } from "@/app/[lang]/context/spirits-cache-context";
import { useMemo, useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { Spirit } from "@/lib/db/schema";
import WikiSnippetSection from "@/components/home/WikiSnippetSection";

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

                {/* Content Layer */}
                <div className="relative z-30 w-full max-w-6xl px-6 text-center space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-center flex-wrap gap-3 animate-fade-in-up">
                            <span className="capsule-premium bg-primary/20 backdrop-blur-md">
                                {dict.heroSubtitle}
                            </span>
                            <span className="capsule-accent bg-accent/20 backdrop-blur-md">
                                {lang === 'ko' ? 'AI 전문가 추천' : 'AI Powered'}
                            </span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] md:leading-[0.85] tracking-tighter animate-fade-in-up delay-100 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {dict.heroTitle} <br />
                            <span className="text-brand-gradient drop-shadow-none">
                                Spirit
                            </span>
                        </h1>
                    </div>

                    <div className="w-full max-w-2xl mx-auto animate-fade-in-up delay-200 relative z-30 space-y-4">
                        <div className="card-premium p-1 md:p-1.5 shadow-primary/10">
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
            <section className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-24 relative z-30 mb-20 md:mb-32">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic">{dict.newArrivals}</h2>
                    </div>
                    <Link href={`/${lang}/spirits`} className="text-xs font-black text-foreground/40 hover:text-primary transition-all uppercase tracking-widest flex items-center gap-2 group">
                        {isEn ? 'Explore Gallery' : '전체보기'}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative overflow-hidden w-full h-[320px] py-4 group/marquee">
                    {newArrivals.length > 0 ? (
                        <div className={`flex items-start gap-10 absolute ${styles.marquee} group-hover/marquee:[animation-play-state:paused]`}>
                            {carouselItems.map((spirit, index) => (
                                <Link
                                    href={`/${lang}/spirits/${spirit.id}`}
                                    key={`${spirit.id}-${index}`}
                                    className="shrink-0 block"
                                >
                                    <div className="w-[200px] flex flex-col items-center gap-5 transition-all duration-500 hover:scale-105">
                                        <div className="relative w-full aspect-[3/4] rounded-[40px] bg-card border border-border/50 shadow-2xl overflow-hidden flex items-center justify-center p-8 group-hover:border-primary/50 transition-all hover:shadow-primary/10">
                                            {/* Reflection Effect */}
                                            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                                            
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={getOptimizedImageUrl(spirit.thumbnailUrl || spirit.imageUrl || '/mys-4.webp', 400)}
                                                    alt={spirit.name}
                                                    loading="lazy"
                                                    fill
                                                    sizes="200px"
                                                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-center w-full px-2">
                                            <p className="text-[10px] font-black tracking-[0.2em] text-foreground/30 uppercase opacity-60">
                                                {spirit.category}
                                            </p>
                                            <h3 className="font-black text-sm text-foreground line-clamp-1 w-full tracking-tight">
                                                {isEn ? (spirit.nameEn || spirit.name) : spirit.name}
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
            <div className="max-w-7xl mx-auto px-6 mb-24 md:mb-32">
                {children}
            </div>

            {/* 💬 4. Live Reviews (Social Proof) */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent">
                            <Flame className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic">{dict.recentReviews || t.liveReviews}</h2>
                    </div>
                    <Link
                        href={`/${lang}/contents/reviews`}
                        className="text-xs font-black text-foreground/40 hover:text-primary transition-all uppercase tracking-widest flex items-center gap-2 group"
                    >
                        {isEn ? 'Read All Stories' : '리뷰 더보기'}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="p-8 bg-card/30 rounded-[48px] border border-border/30 backdrop-blur-sm">
                    <LiveReviews initialReviews={initialReviews} />
                </div>
            </section>

            {/* 📖 5. Institutional FAQ / Wiki */}
            <section className="bg-foreground text-background py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <WikiSnippetSection lang={lang} initialSnippet={dailySnippet} />
                </div>
            </section>

        </div>
    );
}
