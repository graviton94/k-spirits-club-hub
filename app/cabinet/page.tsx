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

import SuccessToast from "@/components/ui/SuccessToast";

// ... imports

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

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
      <div className="mb-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
            My Collections
          </h1>
          <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
            Curated Spirits & Tasting Journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 max-w-2xl mx-auto relative z-10">
          <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-amber-500/30 transition-colors group">
            <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:scale-110 transition-transform duration-300">{spirits.length}</p>
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Bottles</p>
          </div>
          <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-amber-500/30 transition-colors group">
            <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:scale-110 transition-transform duration-300">{profile?.reviewsWritten || 0}</p>
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Reviews</p>
          </div>
          <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-rose-500/30 transition-colors group">
            <p className="text-2xl sm:text-3xl font-black text-rose-500 group-hover:scale-110 transition-transform duration-300">{profile?.heartsReceived || 0}</p>
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Hearts</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center relative z-10">
          <div className="inline-flex p-1.5 bg-secondary/50 backdrop-blur-md border border-border/50 rounded-2xl shadow-inner mb-2">
            <button
              onClick={() => setViewMode('cellar')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300
                ${viewMode === 'cellar'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }
              `}
            >
              <span>🍾</span> 술장
            </button>
            <button
              onClick={() => setViewMode('flavor')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300
                ${viewMode === 'flavor'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }
              `}
            >
              <span>🌌</span> 취향 지도
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'cellar' ? (
          <CellarView
            key="cellar"
            spirits={spirits}
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
        onSuccess={(message) => {
          fetchCabinet();
          setToastMessage(message);
          setShowToast(true);
          setSearchModalOpen(false);
        }}
        existingIds={new Set(spirits.map(s => s.id))}
      />

      <SpiritDetailModal
        isOpen={!!selectedSpirit}
        spirit={selectedSpirit}
        onClose={() => setSelectedSpirit(null)}
        onStatusChange={fetchCabinet}
      />

      <SuccessToast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
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
  spirits,
  profile,
  loading,
  onReviewClick,
  onInfoClick,
  onAddClick
}: {
  spirits: Spirit[];
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

      {/* Spirits Grid */}
      <section className="mb-16">
        <div className="relative bg-[#0f172a] rounded-[2.5rem] px-3 py-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
          {/* Neon Glow Effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3"
            >
              {spirits.map((spirit) => (
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
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1">
          <span>★</span> {spirit.userReview.ratingOverall.toFixed(1)}
        </div>
      )}

      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 p-[1px] shadow-sm transition-all duration-500 group-hover:shadow-amber-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <div className="relative h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 group-hover:blur-[1px] group-hover:scale-[0.98] transition-all duration-500">
          <img
            src={spirit.imageUrl && spirit.imageUrl.trim() ? spirit.imageUrl : getCategoryFallbackImage(spirit.category)}
            alt={spirit.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-30 blur-sm' : 'opacity-100'} group-hover:opacity-90`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCategoryFallbackImage(spirit.category);
              target.classList.add('opacity-50');
            }}
          />

          {/* Content Overlay (Always Visible, Top Layer) */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-2 sm:p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <div className="flex flex-col items-start gap-0.5 sm:gap-1">
              {/* Badge */}
              <span className={`inline-block px-1.5 py-0.5 text-[8px] sm:text-[11px] font-bold text-white rounded-md uppercase shadow-sm backdrop-blur-md ${spirit.isWishlist ? 'bg-red-600/80' : 'bg-green-600/80'}`}>
                {spirit.isWishlist ? '🔖' : '✅️'}
              </span>
              {/* Name */}
              <p className="text-[10px] sm:text-sm font-bold text-white text-left leading-tight line-clamp-2 drop-shadow-md">
                {spirit.name}
              </p>
            </div>
          </div>
        </div>
      </div>
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
      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl sm:text-2xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
        +
      </div>
      <span className="text-[10px] sm:text-sm font-bold text-gray-500 group-hover:text-amber-600 dark:text-gray-400 text-center px-1">
        추가
      </span>
    </motion.div>
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
