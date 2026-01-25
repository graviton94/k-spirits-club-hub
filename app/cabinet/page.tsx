'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";

// Configuration
const SPIRITS_PER_ROW = 4;

// Mock data for demonstration - Full shelf simulation
const MOCK_SPIRITS = [
  {
    id: "1",
    name: "달홀진주25",
    category: "소주",
    subcategory: "증류식 소주",
    abv: 25,
    imageUrl: "https://via.placeholder.com/300x600/8B4513/FFFFFF?text=달홀진주25",
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
    imageUrl: "https://via.placeholder.com/300x600/4A5568/FFFFFF?text=화요",
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
    imageUrl: "https://via.placeholder.com/300x600/2D3748/F0E68C?text=문배주",
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
    imageUrl: "https://via.placeholder.com/300x600/B8860B/FFFFFF?text=Hibiki",
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
    imageUrl: "https://via.placeholder.com/300x600/1A202C/90EE90?text=Hendricks",
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
    imageUrl: "https://via.placeholder.com/300x600/8B4513/FFFFFF?text=안동소주",
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
    imageUrl: "https://via.placeholder.com/300x600/F5F5DC/000000?text=막걸리",
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
    imageUrl: "https://via.placeholder.com/300x600/228B22/FFFFFF?text=Glenfiddich",
    distillery: "Glenfiddich",
    isWishlist: true,
    metadata: { tasting_note: "오크, 바닐라" }
  },
  {
    id: "9",
    name: "Jameson Irish Whiskey",
    category: "위스키",
    subcategory: "Irish Whiskey",
    abv: 40,
    imageUrl: "https://via.placeholder.com/300x600/006400/FFFFFF?text=Jameson",
    distillery: "Jameson",
    isWishlist: false,
    metadata: { tasting_note: "스무스, 과일향" }
  },
  {
    id: "10",
    name: "참이슬",
    category: "소주",
    subcategory: "희석식 소주",
    abv: 16.5,
    imageUrl: "https://via.placeholder.com/300x600/90EE90/000000?text=참이슬",
    distillery: "하이트진로",
    isWishlist: false,
    metadata: { tasting_note: "청량한, 가벼운" }
  },
  {
    id: "11",
    name: "처음처럼",
    category: "소주",
    subcategory: "희석식 소주",
    abv: 16.9,
    imageUrl: "https://via.placeholder.com/300x600/FFB6C1/000000?text=처음처럼",
    distillery: "롯데칠성",
    isWishlist: false,
    metadata: { tasting_note: "부드러운, 청량한" }
  },
  {
    id: "12",
    name: "Tanqueray Gin",
    category: "일반증류주",
    subcategory: "Gin",
    abv: 47.3,
    imageUrl: "https://via.placeholder.com/300x600/FF6347/FFFFFF?text=Tanqueray",
    distillery: "Tanqueray",
    isWishlist: false,
    metadata: { tasting_note: "주니퍼, 시트러스" }
  }
];

export default function CabinetPage() {
  const [spirits, setSpirits] = useState<typeof MOCK_SPIRITS>([]);
  const [selectedSpirit, setSelectedSpirit] = useState<typeof MOCK_SPIRITS[0] | null>(null);

  useEffect(() => {
    // In production, fetch from localStorage/API
    setSpirits(MOCK_SPIRITS);
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
      {/* Simple Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">🍾 내 술장</h1>
        <p className="text-sm text-gray-400">{ownedSpirits.length}병 소장중</p>
      </div>

      {/* Visual Display Shelf Section */}
      <section className="mb-16">
        {/* Modern Shelf Container with enhanced depth */}
        <div className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 rounded-2xl p-8 shadow-2xl">
          {/* Subtle wood grain texture overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id29vZCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjIwMCIgeTI9IjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48bGluZSB4MT0iMCIgeTE9IjUwIiB4Mj0iMjAwIiB5Mj0iNTAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjA1Ii8+PGxpbmUgeDE9IjAiIHkxPSIxMDAiIHgyPSIyMDAiIHkyPSIxMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48bGluZSB4MT0iMCIgeTE9IjE1MCIgeDI9IjIwMCIgeTI9IjE1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd29vZCkiLz48L3N2Zz4=')] pointer-events-none rounded-2xl" />
          
          {/* Shelf rows with enhanced 3D effect */}
          <div className="relative space-y-10">
            {/* Chunk spirits into rows */}
            {Array.from({ length: Math.ceil(ownedSpirits.length / SPIRITS_PER_ROW) }, (_, rowIndex) => (
              <div key={rowIndex} className="relative pb-8">
                {/* Enhanced shelf line with gradient and shadow for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent shadow-md"></div>
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-6 pb-4"
                >
                  {ownedSpirits.slice(rowIndex * SPIRITS_PER_ROW, (rowIndex + 1) * SPIRITS_PER_ROW).map((spirit) => (
                    <motion.div
                      key={spirit.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ y: -10, scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="cursor-pointer flex flex-col items-center"
                      onClick={() => setSelectedSpirit(spirit)}
                    >
                      {/* Bottle image with enhanced drop-shadow for 3D effect */}
                      <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm [filter:drop-shadow(0_8px_16px_rgba(0,0,0,0.15))_drop-shadow(0_4px_6px_rgba(0,0,0,0.1))]">
                        {spirit.imageUrl ? (
                          <img
                            src={spirit.imageUrl}
                            alt={spirit.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            🥃
                          </div>
                        )}
                      </div>
                      {/* Minimal label - very small and simple */}
                      <p className="text-[10px] sm:text-xs text-center mt-2 text-gray-700 font-medium truncate w-full px-1 leading-tight">
                        {spirit.name}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wishlist Section - enhanced with grayscale */}
      {wishlistSpirits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">🔖 위시리스트 ({wishlistSpirits.length})</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {wishlistSpirits.map((spirit) => (
              <motion.div
                key={spirit.id}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative cursor-pointer flex flex-col items-center"
                onClick={() => setSelectedSpirit(spirit)}
              >
                {/* Grayscale filter applied to distinguish from owned items */}
                <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-800/50 transition-all duration-300 [filter:grayscale(100%)_drop-shadow(0_4px_8px_rgba(0,0,0,0.2))] hover:[filter:grayscale(0%)_drop-shadow(0_8px_16px_rgba(0,0,0,0.3))]">
                  {spirit.imageUrl ? (
                    <img src={spirit.imageUrl} alt={spirit.name} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-60">🥃</div>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-center mt-2 text-gray-400 truncate w-full px-1 leading-tight">{spirit.name}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Info Popup Modal - Centered */}
      {selectedSpirit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSpirit(null)}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Info Content */}
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{selectedSpirit.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{selectedSpirit.subcategory || selectedSpirit.category}</p>
              </div>
              
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6">
                <p className="text-2xl font-black text-white">ABV {selectedSpirit.abv}°</p>
              </div>

              {/* Top 2 Tags - Prominent Display */}
              {selectedSpirit.metadata?.tasting_note && (
                <div className="flex gap-3 justify-center mb-8">
                  {selectedSpirit.metadata.tasting_note.split(',').slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm font-semibold px-4 py-2 rounded-full bg-amber-50 text-amber-900 border-2 border-amber-200 shadow-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Detail Page Button */}
              <Link
                href={`/spirits/${selectedSpirit.id}`}
                className="inline-block w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setSelectedSpirit(null)}
              >
                상세 페이지 이동 →
              </Link>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedSpirit(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Ad - After Cabinet Content */}
      {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT && (
        <div className="mt-12 mb-6">
          <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
          <GoogleAd
            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT}
            format="auto"
            responsive={true}
            style={{ display: 'block', minHeight: '100px' }}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}
    </div>
  );
}
