import { SearchBar } from "@/components/ui/SearchBar";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { db } from "@/lib/db";
import Link from "next/link";
import { CATEGORY_NAME_MAP, LEGAL_CATEGORIES } from "@/lib/constants/categories";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import styles from "./page.module.css";

export const revalidate = 60; // Revalidate every minute

async function getTrendingSpirits() {
  // Fetch latest updated spirits that have images
  try {
    const { data } = await db.getSpirits(
      { isPublished: false }, // In dev, we show unpublished too. In prod, switch to true.
      { page: 1, pageSize: 12 }
    );
    // Filter items with images for better UI
    return data.filter(s => s.imageUrl).slice(0, 6);
  } catch (e) {
    console.error("Failed to fetch trending spirits", e);
    return [];
  }
}

export default async function HomePage() {
  const trendingSpirits = await getTrendingSpirits();
  const heroSpirit = trendingSpirits[0];
  const listSpirits = trendingSpirits.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">

      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Layer */}
        {heroSpirit?.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={heroSpirit.imageUrl}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-60 blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />
        )}

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl px-4 text-center space-y-8">
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

          <div className="w-full max-w-lg mx-auto animate-fade-in-up delay-200">
            <SearchBar />
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400 animate-fade-in-up delay-300">
            <span>Trending:</span>
            <span className="text-white hover:text-amber-500 cursor-pointer transition-colors block">#Highball</span>
            <span className="text-white hover:text-amber-500 cursor-pointer transition-colors block">#Smoky</span>
            <span className="text-white hover:text-amber-500 cursor-pointer transition-colors block">#GinTonic</span>
          </div>
        </div>
      </section>

      {/* 2. Categories Auto-Scroll Carousel */}
      <section className="container max-w-4xl mx-auto px-4 -mt-10 relative z-20 mb-16">
        <div className="relative overflow-hidden">
          <div className={`flex gap-4 ${styles['animate-scroll-rtl']}`}>
            {/* Duplicate items for infinite scroll effect */}
            {[...LEGAL_CATEGORIES, ...LEGAL_CATEGORIES].map((cat, index) => {
              // Updated Icons mapping for all 11 categories
              const icons: Record<string, string> = {
                "소주": "🍶",
                "위스키": "🥃",
                "맥주": "🍺",
                "일반증류주": "🍸",
                "기타 주류": "🥂",
                "탁주": "🥣",
                "약주": "🍵",
                "청주": "🍶",
                "과실주": "🍷",
                "브랜디": "🥃",
                "리큐르": "🍹"
              };
              const icon = icons[cat] || "🍾";

              // Gradient mapping
              const gradients: Record<string, string> = {
                "소주": "from-green-600 to-green-800",
                "위스키": "from-amber-700 to-amber-900",
                "맥주": "from-yellow-600 to-yellow-800",
                "일반증류주": "from-sky-700 to-sky-900",
                "기타 주류": "from-gray-500 to-gray-700",
                "탁주": "from-stone-200 to-stone-400 text-stone-900",
                "약주": "from-emerald-100 to-emerald-300 text-emerald-900",
                "청주": "from-blue-100 to-blue-300 text-slate-800",
                "과실주": "from-rose-500 to-red-700",
                "브랜디": "from-purple-700 to-purple-900",
                "리큐르": "from-pink-600 to-pink-800"
              };
              const gradient = gradients[cat] || "from-gray-700 to-gray-900";
              const textColor = ["청주", "탁주", "약주"].includes(cat) ? "text-slate-900" : "text-white";

              return (
                <Link
                  href={`/explore?category=${cat}`}
                  key={`${cat}-${index}`}
                  className="flex-shrink-0"
                >
                  <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center ${textColor} border border-white/10 shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listSpirits.map((spirit) => (
            <SpiritCard key={spirit.id} spirit={spirit} />
          ))}

          {/* Fallback Mock Items if no data */}
          {listSpirits.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-amber-500/50" />
              <p>No spirits found yet.</p>
              <p className="text-sm">Run the data pipeline to populate trends!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Live Reviews (Mock Layout) */}
      <section className="bg-neutral-900/50 py-16 border-y border-white/5">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Live Reviews</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/40 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  U{i}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">User_{i}99</span>
                    <span className="text-xs text-muted-foreground">2 mins ago</span>
                  </div>
                  <p className="text-sm text-gray-300">"This tastes like absolute heaven. The finish is incredibly smooth with hints of vanilla."</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-500 text-xs">★</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
