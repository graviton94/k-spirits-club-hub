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
        <div className="min-h-screen bg-background text-foreground pb-20">

            {/* 1. Hero Section */}
            <section className="relative w-full h-[70vh] min-h-[500px] flex flex-col items-center justify-center">
                {/* Background Layer */}
                <div className="absolute inset-0 overflow-hidden">
                    <RandomBackground />
                </div>

                {/* Content */}
                <div className="relative z-30 w-full max-w-4xl px-4 text-center space-y-8">
                    <div className="space-y-2">
                        <p className="text-amber-500 font-bold uppercase tracking-widest text-sm animate-fade-in-up">
                            {dict.heroSubtitle}
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                            {dict.heroTitle} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-600">
                                Spirit
                            </span>
                        </h1>
                    </div>

                    <div className="w-full max-w-lg mx-auto animate-fade-in-up delay-200 relative z-30">
                        <SearchBar isHero={true} dict={dict} />
                        <DailyPick lang={lang} />
                    </div>
                </div>
            </section>

            {/* 2. New Arrivals Auto-Scroll Carousel */}
            <section className="container max-w-4xl mx-auto px-4 mt-12 relative z-20 mb-8 md:mb-12">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                    <span className="text-xl">✨</span>
                    <h2 className="text-lg font-black tracking-tight text-foreground">{dict.newArrivals}</h2>
                </div>

                <div className="relative overflow-hidden w-full h-56">
                    {newArrivals.length > 0 ? (
                        <div className={`flex items-start gap-6 absolute ${styles.marquee}`}>
                            {/* Duplicate items added client-side only (see useEffect) */}
                            {carouselItems.map((spirit, index) => (
                                <Link
                                    href={`/${lang}/spirits/${spirit.id}`}
                                    key={`${spirit.id}-${index}`}
                                    className="shrink-0 group"
                                >
                                    <div className="w-32 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105">
                                        <div className="relative w-28 h-36 rounded-2xl bg-card border border-border shadow-md overflow-hidden flex items-center justify-center p-2 group-hover:border-amber-500/50 transition-colors">
                                            {spirit.thumbnailUrl || spirit.imageUrl ? (
                                                <Image
                                                    src={getOptimizedImageUrl(spirit.thumbnailUrl || spirit.imageUrl, 224)}
                                                    alt={spirit.name}
                                                    loading="lazy"
                                                    fill
                                                    sizes="(max-width: 768px) 112px, 112px"
                                                    className="object-contain p-2"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <span className="text-3xl">🍾</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-xs text-center line-clamp-2 w-full px-1 text-foreground group-hover:text-amber-600 transition-colors">
                                            {isEn ? (spirit.name_en || spirit.metadata?.name_en || spirit.name) : spirit.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>{t.noNew}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Global News Feed (Replaces Trending) */}
            {children}

            {/* 4. Live Reviews Grid */}
            <section className="container max-w-4xl mx-auto px-4 mb-20">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <h2 className="text-lg font-black tracking-tight text-foreground">{dict.recentReviews || t.liveReviews}</h2>
                    </div>
                    <Link
                        href={`/${lang}/contents/reviews`}
                        className="text-xs font-bold text-muted-foreground hover:text-amber-500 transition-colors flex items-center gap-1 group/link"
                    >
                        {isEn ? 'View All' : '전체 보러가기'}
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
                <LiveReviews initialReviews={initialReviews} />
            </section>

            {/* 5. Random Wiki Snippet */}
            <WikiSnippetSection lang={lang} initialSnippet={dailySnippet} />

        </div>
    );
}
