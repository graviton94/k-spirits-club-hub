'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";
import MindMap from "@/components/cabinet/MindMap";
import ReviewModal from "@/components/cabinet/ReviewModal";
import SearchSpiritModal from "@/components/cabinet/SearchSpiritModal";
import { analyzeCellar, type Spirit, type UserReview } from "@/lib/utils/flavor-engine";
import SpiritDetailModal from "@/components/ui/SpiritDetailModal";
import { useAuth } from "@/app/context/auth-context";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { addToCabinet } from "@/app/actions/cabinet";

type ViewMode = 'cellar' | 'flavor';

export const runtime = 'edge';

export default function CabinetPage() {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('cellar');

  // Cabinet state
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [isLoadingCabinet, setIsLoadingCabinet] = useState(false);

  // Modal state
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<Spirit | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Hooks
  const { profile, loading, user } = useAuth();
  const { searchIndex } = useSpiritsCache();

  // Fetch cabinet data
  const fetchCabinet = useCallback(async () => {
    if (!user) {
      setSpirits([]);
      return;
    }

    setIsLoadingCabinet(true);
    try {
      // Use API route instead of Server Action to avoid 405 on Edge
      const response = await fetch(`/api/cabinet/list?uid=${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cabinet data');
      }
      const { data: cabinetData } = await response.json();

      // Enrich with search index data for thumbnails
      const enrichedData = cabinetData.map((item: any) => {
        const indexItem = searchIndex.find(s => s.i === item.id);
        return {
          ...item,
          thumbnailUrl: item.thumbnailUrl || indexItem?.t || item.imageUrl,
          imageUrl: item.imageUrl || indexItem?.t,
        };
      });

      setSpirits(enrichedData as Spirit[]);
    } catch (error) {
      console.error('Failed to fetch cabinet:', error);
      setSpirits([]);
    } finally {
      setIsLoadingCabinet(false);
    }
  }, [user, searchIndex]);

  // Load cabinet on mount and when user changes
  useEffect(() => {
    if (loading) return;
    fetchCabinet();
  }, [loading, fetchCabinet]);

  // Handle review submission
  const handleReviewSubmit = async (review: UserReview) => {
    if (!reviewTarget || !user) return;

    try {
      await addToCabinet(user.uid, reviewTarget.id, {
        isWishlist: reviewTarget.isWishlist,
        userReview: review,
        userName: profile?.nickname || user.displayName || 'Anonymous'
      });

      // Update local state
      setSpirits(prev =>
        prev.map(s => s.id === reviewTarget.id ? { ...s, userReview: review } : s)
      );

      if (selectedSpirit?.id === reviewTarget.id) {
        setSelectedSpirit({ ...selectedSpirit, userReview: review });
      }
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  // Handle adding new spirit
  const handleAddSpirit = async (newSpirit: any) => {
    if (!user) return;

    try {
      await addToCabinet(user.uid, newSpirit.id, {
        isWishlist: false,
        name: newSpirit.name,
        distillery: newSpirit.distillery,
        imageUrl: newSpirit.imageUrl,
        category: newSpirit.category,
        abv: newSpirit.abv
      });

      // Refresh cabinet
      await fetchCabinet();
    } catch (error) {
      console.error('Failed to add spirit:', error);
    }
  };

  // Event handlers
  const openReviewModal = (e: React.MouseEvent, spirit: Spirit) => {
    e.stopPropagation();
    setReviewTarget(spirit);
    setReviewModalOpen(true);
  };

  const openInfoModal = (e: React.MouseEvent, spirit: Spirit) => {
    e.stopPropagation();
    setSelectedSpirit(spirit);
  };

  // Computed values
  const ownedSpirits = spirits.filter(s => !s.isWishlist);
  const wishlistSpirits = spirits.filter(s => s.isWishlist);
  const flavorAnalysis = analyzeCellar(spirits);

  // Empty state
  if (!loading && spirits.length === 0) {
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
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            술장이 잠들어 있어요.💤
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            한 번 깨우러 가볼까요?
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-900/50 active:scale-[0.98]"
          >
            탐색하러 가기
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          My Collections
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {ownedSpirits.length}병 소장중
        </p>

        {/* View Mode Toggle */}
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

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'cellar' ? (
          <CellarView
            key="cellar"
            ownedSpirits={ownedSpirits}
            wishlistSpirits={wishlistSpirits}
            profile={profile}
            loading={loading}
            onReviewClick={openReviewModal}
            onInfoClick={openInfoModal}
            onAddClick={() => setSearchModalOpen(true)}
          />
        ) : (
          <FlavorView
            key="flavor"
            flavorAnalysis={flavorAnalysis}
            profile={profile}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      {reviewModalOpen && reviewTarget && (
        <ReviewModal
          spirit={reviewTarget}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      <SearchSpiritModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onAdd={handleAddSpirit}
        existingIds={new Set(spirits.map(s => s.id))}
      />

      <SpiritDetailModal
        isOpen={!!selectedSpirit}
        spirit={selectedSpirit}
        onClose={() => setSelectedSpirit(null)}
        onStatusChange={fetchCabinet}
      />

      {/* Ad */}
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

// Cellar View Component
function CellarView({
  ownedSpirits,
  wishlistSpirits,
  profile,
  loading,
  onReviewClick,
  onInfoClick,
  onAddClick
}: {
  ownedSpirits: Spirit[];
  wishlistSpirits: Spirit[];
  profile: any;
  loading: boolean;
  onReviewClick: (e: React.MouseEvent, spirit: Spirit) => void;
  onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
  onAddClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Guest Overlay */}
      {!profile && !loading && (
        <GuestOverlay />
      )}

      {/* Owned Spirits Grid */}
      <section className="mb-16">
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)] pointer-events-none rounded-3xl" />

          <div className="relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-4 gap-6"
            >
              {ownedSpirits.map((spirit) => (
                <SpiritCard
                  key={spirit.id}
                  spirit={spirit}
                  onReviewClick={onReviewClick}
                  onInfoClick={onInfoClick}
                />
              ))}

              {/* Add Button */}
              <AddSpiritCard onClick={onAddClick} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wishlist */}
      {wishlistSpirits.length > 0 && (
        <WishlistSection spirits={wishlistSpirits} onInfoClick={onInfoClick} />
      )}
    </motion.div>
  );
}

// Flavor View Component
function FlavorView({
  flavorAnalysis,
  profile,
  loading
}: {
  flavorAnalysis: any;
  profile: any;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {!profile && !loading && (
        <GuestOverlay flavor />
      )}
      <MindMap analysis={flavorAnalysis} profileImage={profile?.profileImage} />
    </motion.div>
  );
}

// Spirit Card Component
function SpiritCard({
  spirit,
  onReviewClick,
  onInfoClick
}: {
  spirit: Spirit;
  onReviewClick: (e: React.MouseEvent, spirit: Spirit) => void;
  onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="cursor-pointer group relative"
      onClick={(e) => onInfoClick(e, spirit)}
    >
      {spirit.userReview && (
        <div className="absolute top-2 right-2 z-20 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>★</span> {spirit.userReview.ratingOverall.toFixed(1)}
        </div>
      )}

      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-1 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 dark:from-amber-600 dark:via-orange-600 dark:to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative h-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 group-hover:blur-[2px] transition-all duration-300">
          <img
            src={spirit.imageUrl && spirit.imageUrl.trim() ? spirit.imageUrl : getCategoryFallbackImage(spirit.category)}
            alt={spirit.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-50' : ''}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCategoryFallbackImage(spirit.category);
              target.classList.add('opacity-50');
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex justify-between items-center w-full mt-auto">
              <button
                onClick={(e) => onReviewClick(e, spirit)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-amber-500 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="리뷰 작성"
              >
                ✏️
              </button>
              <button
                onClick={(e) => onInfoClick(e, spirit)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-blue-500 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="정보 보기"
              >
                ℹ️
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center mt-3 text-gray-800 dark:text-gray-200 font-semibold truncate px-1">
        {spirit.name}
      </p>
    </motion.div>
  );
}

// Add Spirit Card Component
function AddSpiritCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="cursor-pointer group flex flex-col items-center justify-center aspect-[2/3] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
        +
      </div>
      <span className="text-sm font-bold text-gray-500 group-hover:text-amber-600 dark:text-gray-400">
        새 술 추가하기
      </span>
    </motion.div>
  );
}

// Wishlist Section Component
function WishlistSection({
  spirits,
  onInfoClick
}: {
  spirits: Spirit[];
  onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🔖 위시리스트 ({spirits.length})
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {spirits.map((spirit) => (
          <motion.div
            key={spirit.id}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative cursor-pointer flex flex-col items-center"
            onClick={(e) => onInfoClick(e, spirit)}
          >
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800/50 transition-all duration-300 [filter:grayscale(100%)_drop-shadow(0_3px_6px_rgba(0,0,0,0.15))] hover:[filter:grayscale(0%)_drop-shadow(0_6px_12px_rgba(0,0,0,0.25))]">
              <img
                src={spirit.imageUrl && spirit.imageUrl.trim() ? spirit.imageUrl : getCategoryFallbackImage(spirit.category)}
                alt={spirit.name}
                className={`w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-40' : ''}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getCategoryFallbackImage(spirit.category);
                  target.classList.add('opacity-40');
                }}
              />
            </div>
            <p className="text-[9px] text-center mt-1.5 text-gray-600 dark:text-gray-400 truncate w-full px-0.5 leading-tight">
              {spirit.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Guest Overlay Component
function GuestOverlay({ flavor = false }: { flavor?: boolean }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-3xl" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-4"
      >
        <div className="text-center space-y-6">
          <motion.div
            animate={flavor ? { rotate: [0, 10, -10, 0] } : { y: [0, -10, 0] }}
            transition={{ duration: flavor ? 3 : 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl"
          >
            {flavor ? '🌌' : '🗃️'}
          </motion.div>

          <h2 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            {flavor ? '취향 지도 잠금' : '회원 전용 공간'}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {flavor ? '나만의 취향 분석을' : '나만의 술장을 만들고'}<br />
            {flavor ? '시작 해보세요!' : '기록 해보세요!'}
          </p>

          <button
            onClick={() => {
              const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
              if (loginButton) loginButton.click();
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            회원가입하고 시작하기
          </button>

          {!flavor && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              이미 회원이신가요? 로그인하세요
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
