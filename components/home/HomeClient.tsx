'use client';

import { SearchBar } from "@/components/ui/SearchBar";
import DailyPick from "@/components/home/DailyPick";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { LiveReviews } from "@/components/ui/LiveReviews";
import Link from "next/link";
import { Sparkles, Flame, ArrowRight } from "lucide-react";
import styles from "@/app/[lang]/page.module.css";
import { RandomBackground } from "@/components/ui/RandomBackground";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useMemo, useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { Spirit } from "@/lib/db/schema";

interface HomeClientProps {
    lang: string;
    initialNewArrivals: Spirit[];
    initialTrending: any[];
    initialReviews: any[];
}

export default function HomeClient({ lang, initialNewArrivals, initialTrending, initialReviews }: HomeClientProps) {
    const { publishedSpirits, isLoading: isCacheLoading } = useSpiritsCache();

    // Use state with initial data for instant render
    const [trendingSpirits] = useState<any[]>(initialTrending);
    const [newArrivals] = useState<any[]>(initialNewArrivals);

    // Compute final display spirits (trending or fallback to recent)
    const displaySpirits = useMemo(() => {
        if (trendingSpirits.length > 0) return trendingSpirits;

        // Fallback: Show most recent spirits from cache
        if (!publishedSpirits.length) return [];
        return [...publishedSpirits]
            .filter(s => s.imageUrl)
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [trendingSpirits, publishedSpirits]);

    const isLoading = isCacheLoading && trendingSpirits.length === 0;

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
                            Discover Your Taste
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                            Find the Perfect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
                                Spirit
                            </span>
                        </h1>
                    </div>

                    <div className="w-full max-w-lg mx-auto animate-fade-in-up delay-200 relative z-30">
                        <SearchBar isHero={true} />
                        <DailyPick />
                    </div>
                </div>
            </section>

            {/* 2. New Arrivals Auto-Scroll Carousel */}
            <section className="container max-w-4xl mx-auto px-4 mt-12 relative z-20 mb-20">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-black tracking-tight">New Arrivals</h2>
                </div>

                <div className="relative overflow-hidden py-4">
                    {newArrivals.length > 0 ? (
                        <div className={`flex gap-6 ${styles['animate-scroll-rtl']}`}>
                            {/* Duplicate items for infinite scroll effect */}
                            {[...newArrivals, ...newArrivals].map((spirit, index) => (
                                <Link
                                    href={`/${lang}/spirits/${spirit.id}`}
                                    key={`${spirit.id}-${index}`}
                                    className="flex-shrink-0 group"
                                >
                                    <div className="w-32 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-105">
                                        <div className="relative w-28 h-36 rounded-2xl bg-card border border-border shadow-md overflow-hidden flex items-center justify-center p-2 group-hover:border-amber-500/50 transition-colors">
                                            {spirit.thumbnailUrl || spirit.imageUrl ? (
                                                <img
                                                    src={getOptimizedImageUrl(spirit.thumbnailUrl || spirit.imageUrl, 240)}
                                                    alt={spirit.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-3xl">🍾</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-xs text-center line-clamp-2 px-1 text-foreground group-hover:text-amber-600 transition-colors">
                                            {spirit.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>아직 새로운 상품이 없습니다.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Personalized / Trending Feed */}
            <section className="container max-w-4xl mx-auto px-4 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <h2 className="text-2xl font-bold">Today's Trending</h2>
                    </div>
                    <Link href={`/${lang}/explore`} className="text-sm text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-24 bg-card/50 animate-pulse rounded-2xl" />
                        ))
                    ) : (
                        <>
                            {displaySpirits.map((spirit) => (
                                <SpiritCard key={spirit.id} spirit={spirit} />
                            ))}

                            {/* Fallback Mock Items if no data */}
                            {displaySpirits.length === 0 && (
                                <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                                    <Sparkles className="w-10 h-10 mx-auto mb-3 text-amber-500/50" />
                                    <p>No trending spirits available yet.</p>
                                    <p className="text-sm">Check back soon!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* 4. Live Reviews */}
            <section className="bg-secondary py-16 border-y border-border">
                <div className="container max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-left text-foreground">✍️ Live Reviews</h2>
                    <LiveReviews initialReviews={initialReviews} />
                </div>
            </section>

        </div>
    );
}
