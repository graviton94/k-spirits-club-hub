'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SpiritCard } from "@/components/ui/SpiritCard";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";

// Mock data for demonstration
const MOCK_SPIRITS = [
  {
    id: "1",
    name: "달홀진주25",
    category: "소주",
    subcategory: "증류식 소주",
    abv: 25,
    imageUrl: null,
    distillery: "달홀",
    isWishlist: false,
    metadata: { tasting_note: "깔끔한, 부드러운" }
  },
  {
    id: "2",
    name: "화요",
    category: "소주",
    subcategory: "증류식 소주",
    abv: 41,
    imageUrl: null,
    distillery: "국순당",
    isWishlist: false,
    metadata: { tasting_note: "스파이시한, 곡물향" }
  },
  {
    id: "3",
    name: "문배주",
    category: "전통주",
    subcategory: "증류식 소주",
    abv: 40,
    imageUrl: null,
    distillery: "문배주양조원",
    isWishlist: false,
    metadata: { tasting_note: "과일향, 달콤한" }
  },
  {
    id: "4",
    name: "Hibiki Harmony",
    category: "위스키",
    subcategory: "Japanese Whisky",
    abv: 43,
    imageUrl: null,
    distillery: "Suntory",
    isWishlist: false,
    metadata: { tasting_note: "플로랄, 허니" }
  },
  {
    id: "5",
    name: "Hendrick's Gin",
    category: "일반증류주",
    subcategory: "Gin",
    abv: 44,
    imageUrl: null,
    distillery: "Hendrick's",
    isWishlist: true,
    metadata: { tasting_note: "큐컴버, 로즈" }
  },
  {
    id: "6",
    name: "안동소주",
    category: "전통주",
    subcategory: "증류식 소주",
    abv: 45,
    imageUrl: null,
    distillery: "안동소주",
    isWishlist: true,
    metadata: { tasting_note: "전통적인, 강렬한" }
  },
  {
    id: "7",
    name: "막걸리 생탁",
    category: "탁주",
    subcategory: "생막걸리",
    abv: 6,
    imageUrl: null,
    distillery: "서울탁주",
    isWishlist: false,
    metadata: { tasting_note: "상큼한, 발효향" }
  },
  {
    id: "8",
    name: "Glenfiddich 12",
    category: "위스키",
    subcategory: "Single Malt Scotch",
    abv: 40,
    imageUrl: null,
    distillery: "Glenfiddich",
    isWishlist: true,
    metadata: { tasting_note: "오크, 바닐라" }
  }
];

interface PersonaData {
  title: string;
  emoji: string;
  description: string;
}

function generatePersona(spirits: typeof MOCK_SPIRITS): PersonaData {
  const owned = spirits.filter(s => !s.isWishlist);

  if (owned.length === 0) {
    return {
      title: "술 탐험가 입문자",
      emoji: "🗺️",
      description: "아직 술장이 비어있지만, 곧 멋진 컬렉션이 시작될 거예요!"
    };
  }

  const categoryCount: Record<string, number> = {};
  owned.forEach(s => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);

  const dominantCategory = sortedCategories[0][0];
  const dominantPercentage = (sortedCategories[0][1] / owned.length) * 100;

  // Persona logic
  if (dominantPercentage > 60) {
    const personaMap: Record<string, PersonaData> = {
      "위스키": {
        title: "위스키 애호가",
        emoji: "🥃",
        description: "깊이 있는 위스키 컬렉션을 자랑하는 진정한 애호가"
      },
      "소주": {
        title: "소주 컬렉터",
        emoji: "🍶",
        description: "한국 증류주의 다양성을 탐구하는 소주 마니아"
      },
      "전통주": {
        title: "전통주 마스터",
        emoji: "🏺",
        description: "우리 술의 깊은 맛을 아는 전통주 전문가"
      },
      "탁주": {
        title: "막걸리 러버",
        emoji: "🍚",
        description: "발효의 매력에 푹 빠진 탁주 애호가"
      }
    };
    return personaMap[dominantCategory] || {
      title: `${dominantCategory} 전문가`,
      emoji: "🍾",
      description: `${dominantCategory}의 세계를 깊이 탐구하는 전문가`
    };
  }

  // Diverse collection
  if (sortedCategories.length >= 4) {
    return {
      title: "다양성의 탐험가",
      emoji: "🌍",
      description: "세계 각국의 술을 폭넓게 즐기는 진정한 탐험가"
    };
  }

  return {
    title: "술 컬렉터",
    emoji: "🎯",
    description: "자신만의 취향을 찾아가는 컬렉터"
  };
}

export default function CabinetPage() {
  const [spirits, setSpirits] = useState<typeof MOCK_SPIRITS>([]);
  const [persona, setPersona] = useState<PersonaData | null>(null);

  useEffect(() => {
    // In production, fetch from localStorage/API
    setSpirits(MOCK_SPIRITS);
    setPersona(generatePersona(MOCK_SPIRITS));
  }, []);

  const ownedSpirits = spirits.filter(s => !s.isWishlist);
  const wishlistSpirits = spirits.filter(s => s.isWishlist);

  // Empty state
  if (spirits.length === 0 || ownedSpirits.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-8xl mb-6"
          >
            🥃
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            술장이 비어있어 간이 심심해하고 있습니다
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            술을 채우러 가볼까요?
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-900/50 active:scale-[0.98]"
          >
            탐색하러 가기 →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Persona Section */}
      {persona && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-transparent border border-amber-900/30 p-8"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTkxLDM2LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

          <div className="relative z-10 flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-7xl"
            >
              {persona.emoji}
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black text-amber-100 mb-2"
              >
                {persona.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-amber-200/70 text-lg"
              >
                {persona.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-right"
            >
              <div className="text-5xl font-black text-amber-400">{ownedSpirits.length}</div>
              <div className="text-sm text-amber-200/60">병 소장중</div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* My Cellar Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-white">🍾 내 술장</h2>
          <span className="text-sm text-gray-500">({ownedSpirits.length})</span>
        </div>

        {/* Luxury Shelf Design */}
        <div className="relative">
          {/* Wood shelf background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-amber-900/10 to-transparent rounded-xl pointer-events-none" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative"
          >
            {ownedSpirits.map((spirit, index) => (
              <motion.div
                key={spirit.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SpiritCard spirit={spirit} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Wishlist Section */}
      {wishlistSpirits.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-white">🔖 위시리스트</h2>
            <span className="text-sm text-gray-500">({wishlistSpirits.length})</span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {wishlistSpirits.map((spirit) => (
              <motion.div
                key={spirit.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="relative group"
              >
                {/* Grayscale overlay for wishlist items */}
                <div className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <SpiritCard spirit={spirit} />
                </div>

                {/* Wishlist badge */}
                <div className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full">
                  WISH
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Bottom Ad - After Cabinet Content */}
      <div className="mt-12 mb-6">
        <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
        <GoogleAd
          client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-0000000000000000"}
          slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || "1111111111"}
          format="auto"
          responsive={true}
          style={{ display: 'block', minHeight: '100px' }}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}
