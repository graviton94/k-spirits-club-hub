'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";
import MindMap from "@/components/cabinet/MindMap";
import { analyzeCellar, MOCK_CELLAR_SPIRITS, loadCellarFromStorage, type Spirit } from "@/lib/utils/flavor-engine";
import { useAuth } from "@/app/context/auth-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";

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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">My Collections</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{ownedSpirits.length}병 소장중</p>

        {/* Segmented Toggle - Explore style */}
        <div className="inline-flex gap-3">
          <button
            onClick={() => setViewMode('cellar')}
            className={`
              transition-all duration-300 px-4 py-2 rounded-xl text-sm font-bold border
              ${viewMode === 'cellar'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 border-amber-500'
                : 'bg-slate-200 dark:bg-slate-800 text-gray-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
              }
            `}
          >
            🍾 술장
          </button>

          <button
            onClick={() => setViewMode('flavor')}
            className={`
              transition-all duration-300 px-4 py-2 rounded-xl text-sm font-bold border
              ${viewMode === 'flavor'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 border-amber-500'
                : 'bg-slate-200 dark:bg-slate-800 text-gray-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
              }
            `}
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
            className="relative"
          >
            {/* Guest User Overlay */}
            {!profile && (
              <div className="absolute inset-0 z-40 flex items-center justify-center">
                {/* Glassmorphism Blur Overlay */}
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-3xl" />

                {/* Signup Prompt Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-4"
                >
                  <div className="text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-7xl"
                    >
                      🗃️
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      회원 전용 공간
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      나만의 술장을 만들고<br />
                      기록 해보세요!
                    </p>

                    {/* Signup Button */}
                    <button
                      onClick={() => {
                        // Trigger login/signup modal
                        const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
                        if (loginButton) loginButton.click();
                      }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      회원가입하고 시작하기
                    </button>

                    {/* Additional Info */}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      이미 회원이신가요? 로그인하세요
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Visual Display Shelf Section */}
            <section className="mb-16">
              {/* Premium Gallery Container */}
              <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700">
                {/* Elegant overlay pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)] pointer-events-none rounded-3xl" />

                {/* Premium Gallery Grid */}
                <div className="relative">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                    className="grid grid-cols-4 gap-6"
                  >
                    {ownedSpirits.map((spirit) => (
                      <motion.div
                        key={spirit.id}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ y: -8, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="cursor-pointer group"
                        onClick={() => setSelectedSpirit(spirit)}
                      >
                        {/* Premium Card with gradient border */}
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-1 shadow-xl hover:shadow-2xl transition-all duration-300">
                          {/* Gradient border effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 dark:from-amber-600 dark:via-orange-600 dark:to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                          {/* Image container */}
                          <div className="relative h-full rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                            {spirit.imageUrl ? (
                              <img
                                src={spirit.imageUrl}
                                alt={spirit.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = getCategoryFallbackImage(spirit.category);
                                  target.classList.add('opacity-50');
                                }}
                              />
                            ) : (
                              <img
                                src={getCategoryFallbackImage(spirit.category)}
                                alt={spirit.name}
                                className="w-full h-full object-cover opacity-50"
                              />
                            )}

                            {/* Overlay gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>

                        {/* Label */}
                        <p className="text-xs text-center mt-3 text-gray-800 dark:text-gray-200 font-semibold truncate px-1">
                          {spirit.name}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
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
                          <img
                            src={spirit.imageUrl}
                            alt={spirit.name}
                            className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getCategoryFallbackImage(spirit.category);
                              target.classList.add('opacity-40');
                            }}
                          />
                        ) : (
                          <img
                            src={getCategoryFallbackImage(spirit.category)}
                            alt={spirit.name}
                            className="w-full h-full object-cover opacity-40"
                          />
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
            className="relative"
          >
            {/* Guest User Overlay for Flavor Map */}
            {!profile && (
              <div className="absolute inset-0 z-40 flex items-center justify-center">
                {/* Glassmorphism Blur Overlay */}
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-3xl" />

                {/* Signup Prompt Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-4"
                >
                  <div className="text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-7xl"
                    >
                      🌌
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      취향 지도 잠금
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      나만의 취향 분석을<br />
                      시작 해보세요!
                    </p>

                    {/* Signup Button */}
                    <button
                      onClick={() => {
                        const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
                        if (loginButton) loginButton.click();
                      }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      회원가입하고 시작하기
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getCategoryFallbackImage(selectedSpirit.category);
                      target.classList.add('opacity-50');
                    }}
                  />
                ) : (
                  <img
                    src={getCategoryFallbackImage(selectedSpirit.category)}
                    alt={selectedSpirit.name}
                    className="w-full h-full object-cover opacity-50"
                  />
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
