'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";
import MindMap from "@/components/cabinet/MindMap";
import { analyzeCellar, MOCK_CELLAR_SPIRITS, loadCellarFromStorage, type Spirit } from "@/lib/utils/flavor-engine";
import { useAuth } from "@/app/context/auth-context";

// Configuration
const SPIRITS_PER_ROW = 4;

type ViewMode = 'cellar' | 'flavor';

export default function CabinetPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cellar');
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);
  const { profile } = useAuth();

  /*
  ### Configuration
  - [/] Tailwind config - dark mode 활성화
  - [/] globals.css - CSS 변수로 테마 색상 정의

  ### Theme Toggle Component
  - [/] ThemeToggle 컴포넌트 생성
  - [/] Header에 테마 토글 버튼 추가
  - [/] localStorage로 테마 설정 저장
  */
  useEffect(() => {
    // Load from localStorage or use mock data
    const loaded = loadCellarFromStorage();
    setSpirits(loaded.length > 0 ? loaded : MOCK_CELLAR_SPIRITS);
  }, []);

  const ownedSpirits = spirits.filter(s => !s.isWishlist);
  const wishlistSpirits = spirits.filter(s => s.isWishlist);

  // Generate flavor analysis
  const flavorAnalysis = analyzeCellar(spirits);

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
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            술장이 비어있어 간이 심심해하고 있습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
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
      {/* Header with Toggle */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">🍾 My Collections</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{ownedSpirits.length}병 소장중</p>

        {/* Segmented Toggle */}
        <div className="relative inline-flex bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-300 dark:border-gray-700">
          <motion.div
            className="absolute inset-y-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
            initial={false}
            animate={{
              x: viewMode === 'cellar' ? 0 : '100%',
              width: viewMode === 'cellar' ? '50%' : '50%',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          <button
            onClick={() => setViewMode('cellar')}
            className={`relative z-10 px-4 py-2 rounded-full text-xs font-bold transition-colors truncate ${viewMode === 'cellar' ? 'text-black' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            🍾 술장
          </button>

          <button
            onClick={() => setViewMode('flavor')}
            className={`relative z-10 px-4 py-2 rounded-full text-xs font-bold transition-colors truncate ${viewMode === 'flavor' ? 'text-black' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            🌌 취향 지도
          </button>
        </div>
      </div>

      {/* View Container with Animation */}
      <AnimatePresence mode="wait">
        {viewMode === 'cellar' ? (
          <motion.div
            key="cellar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
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
                        className="grid grid-cols-4 gap-4 pb-4"
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
                            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm [filter:drop-shadow(0_6px_12px_rgba(0,0,0,0.12))_drop-shadow(0_3px_5px_rgba(0,0,0,0.08))]">
                              {spirit.imageUrl ? (
                                <img
                                  src={spirit.imageUrl}
                                  alt={spirit.name}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                  🥃
                                </div>
                              )}
                            </div>
                            {/* Minimal label - very small and simple */}
                            <p className="text-[9px] text-center mt-1.5 text-gray-700 font-medium truncate w-full px-0.5 leading-tight">
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔖 위시리스트 ({wishlistSpirits.length})</h2>
                <div className="grid grid-cols-4 gap-3">
                  {wishlistSpirits.map((spirit) => (
                    <motion.div
                      key={spirit.id}
                      whileHover={{ scale: 1.05, y: -4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="relative cursor-pointer flex flex-col items-center"
                      onClick={() => setSelectedSpirit(spirit)}
                    >
                      {/* Grayscale filter applied to distinguish from owned items */}
                      <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800/50 transition-all duration-300 [filter:grayscale(100%)_drop-shadow(0_3px_6px_rgba(0,0,0,0.15))] hover:[filter:grayscale(0%)_drop-shadow(0_6px_12px_rgba(0,0,0,0.25))]">
                        {spirit.imageUrl ? (
                          <img src={spirit.imageUrl} alt={spirit.name} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl opacity-60">🥃</div>
                        )}
                      </div>
                      <p className="text-[9px] text-center mt-1.5 text-gray-600 dark:text-gray-400 truncate w-full px-0.5 leading-tight">{spirit.name}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="flavor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MindMap analysis={flavorAnalysis} profileImage={profile?.profileImage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Info Popup Modal - Centered Vertical Card */}
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 max-w-xs w-full shadow-2xl border border-gray-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Inside card top-right */}
            <button
              onClick={() => setSelectedSpirit(null)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-colors z-10"
            >
              ✕
            </button>

            {/* Quick Info Content - Vertical Layout */}
            <div className="flex flex-col items-center text-center">
              {/* Small Bottle Image */}
              <div className="w-20 h-28 mb-3 rounded-lg overflow-hidden bg-white shadow-md">
                {selectedSpirit.imageUrl ? (
                  <img
                    src={selectedSpirit.imageUrl}
                    alt={selectedSpirit.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    🥃
                  </div>
                )}
              </div>

              {/* Product Name */}
              <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">{selectedSpirit.name}</h3>

              {/* Subcategory */}
              <p className="text-xs text-gray-500 font-medium mb-2">{selectedSpirit.subcategory || selectedSpirit.category}</p>

              {/* Distillery Info */}
              {selectedSpirit.distillery && (
                <p className="text-xs text-gray-600 mb-3">
                  🏭 {selectedSpirit.distillery}
                </p>
              )}

              {/* ABV Badge */}
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                <p className="text-lg font-black text-white">ABV {selectedSpirit.abv}°</p>
              </div>

              {/* Tasting Tags Row */}
              {selectedSpirit.metadata?.tasting_note && (
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                  {selectedSpirit.metadata.tasting_note.split(',').slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Detail Page Button */}
              <Link
                href={`/spirits/${selectedSpirit.id}`}
                className="inline-block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setSelectedSpirit(null)}
              >
                상세 페이지 이동 →
              </Link>
            </div>
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
