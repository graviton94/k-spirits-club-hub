'use client';

import { SearchBar } from "@/components/ui/SearchBar";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { LiveReviews } from "@/components/ui/LiveReviews";
import Link from "next/link";
import { CATEGORY_NAME_MAP } from "@/lib/constants/categories";
import metadata from '@/lib/constants/spirits-metadata.json';
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { RandomBackground } from "@/components/ui/RandomBackground";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useMemo } from "react";

export default function HomePage() {
  const { publishedSpirits, isLoading } = useSpiritsCache();

  // Get top trending spirits from cache (sorted by createdAt, most recent first)
  const trendingSpirits = useMemo(() => {
    if (!publishedSpirits.length) return [];

    // Filter spirits with images and sort by createdAt (most recent first)
    return publishedSpirits
      .filter(s => s.imageUrl)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [publishedSpirits]);

  const heroSpirit = trendingSpirits[0];
  const listSpirits = trendingSpirits.slice(1);

  // Use all categories from metadata
  const allCategories = Object.keys(metadata.categories);

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
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up delay-300">
            <span>Trending:</span>
            <span className="text-gray-900 dark:text-white hover:text-amber-500 cursor-pointer transition-colors block">#Highball</span>
            <span className="text-gray-900 dark:text-white hover:text-amber-500 cursor-pointer transition-colors block">#Smoky</span>
            <span className="text-gray-900 dark:text-white hover:text-amber-500 cursor-pointer transition-colors block">#GinTonic</span>
          </div>
        </div>
      </section>

      {/* 2. Categories Auto-Scroll Carousel */}
      <section className="container max-w-4xl mx-auto px-4 mt-8 relative z-20 mb-16">
        <div className="relative overflow-hidden">
          <div className={`flex gap-4 ${styles['animate-scroll-rtl']}`}>
            {/* Duplicate items for infinite scroll effect */}
            {[...allCategories, ...allCategories].map((cat, index) => {
              // Updated Icons mapping for all 11 categories
              const icons: Record<string, string> = {
                "소주": "🍶",
                "위스키": "🥃",
                "맥주": "🍺",
                "일반증류주": "🍸",
                "기타 주류": "🥂",
                "탁주": "🥛",
                "약주": "🍵",
                "청주": "🍶",
                "과실주": "🍾",
                "브랜디": "🍷",
                "리큐르": "🍹"
              };
              const icon = icons[cat] || "🍾";

              // Gradient mapping
              const gradients: Record<string, string> = {
                "소주": "from-green-100 to-green-300 dark:from-green-600 dark:to-green-800",
                "위스키": "from-amber-100 to-amber-300 dark:from-amber-700 dark:to-amber-900",
                "맥주": "from-yellow-100 to-yellow-300 dark:from-yellow-600 dark:to-yellow-800",
                "일반증류주": "from-sky-100 to-sky-300 dark:from-sky-700 dark:to-sky-900",
                "기타 주류": "from-gray-200 to-gray-400 dark:from-gray-500 dark:to-gray-700",
                "탁주": "from-stone-200 to-stone-400 dark:from-stone-200 dark:to-stone-400",
                "약주": "from-emerald-100 to-emerald-300 dark:from-emerald-100 dark:to-emerald-300",
                "청주": "from-blue-100 to-blue-300 dark:from-blue-100 dark:to-blue-300",
                "과실주": "from-rose-100 to-rose-300 dark:from-rose-500 dark:to-red-700",
                "브랜디": "from-purple-100 to-purple-300 dark:from-purple-700 dark:to-purple-900",
                "리큐르": "from-pink-100 to-pink-300 dark:from-pink-600 dark:to-pink-800"
              };
              const gradient = gradients[cat] || "from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900";
              const textColor = "text-gray-900 dark:text-white";

              return (
                <Link
                  href={`/explore?category=${cat}`}
                  key={`${cat}-${index}`}
                  className="flex-shrink-0"
                >
                  <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center ${textColor} border border-gray-200 dark:border-white/10 shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                    <span className="text-3xl mb-2">{icon}</span>
                    <span className="font-bold text-sm text-center px-1 break-keep">
                      {CATEGORY_NAME_MAP[cat] || cat}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Personalized / Trending Feed */}
      <section className="container max-w-4xl mx-auto px-4 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Today's Trending</h2>
          </div>
          <Link href="/explore" className="text-sm text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors">
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
              {listSpirits.slice(0, 3).map((spirit) => (
                <SpiritCard key={spirit.id} spirit={spirit} />
              ))}

              {/* Fallback Mock Items if no data */}
              {listSpirits.length === 0 && (
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
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Live Reviews</h2>
          <LiveReviews />
        </div>
      </section>

    </div>
  );
}
