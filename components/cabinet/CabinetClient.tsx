'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAd from "@/components/ui/GoogleAd";
import Link from "next/link";
import ReviewModal from "@/components/cabinet/ReviewModal";
import SearchSpiritModal from "@/components/cabinet/SearchSpiritModal";
import { analyzeCellar, type Spirit, type UserReview } from "@/lib/utils/flavor-engine";
import SpiritDetailModal from "@/components/ui/SpiritDetailModal";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { useSpiritsCache } from "@/app/[lang]/context/spirits-cache-context";
import { addToCabinet } from "@/app/[lang]/actions/cabinet";

// New Components
import MyCabinet from "@/components/cabinet/MyCabinet";
import PreferenceExploration from "@/components/cabinet/PreferenceExploration";
import SuccessToast from "@/components/ui/SuccessToast";
import { Locale } from "@/i18n-config";

type ViewMode = 'cellar' | 'flavor';

interface CabinetClientProps {
    lang: Locale;
    dict: any;
}

export default function CabinetClient({ lang, dict }: CabinetClientProps) {
    const isEn = lang === 'en';
    // View state
    const [viewMode, setViewMode] = useState<ViewMode>('cellar');

    // Cabinet state
    const [spirits, setSpirits] = useState<Spirit[]>([]);
    const [isLoadingCabinet, setIsLoadingCabinet] = useState(false);

    // User stats state
    const [reviewCount, setReviewCount] = useState(0);
    const [likesReceived, setLikesReceived] = useState(0);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

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

    // Set page title for SEO
    useEffect(() => {
        document.title = isEn
            ? `My Cabinet | K-Spirits Club`
            : `K-Spirits Club | 나만의 술장 만들기 & AI 취향 분석`;
    }, [isEn]);

    // Fetch cabinet data
    const fetchCabinet = useCallback(async () => {
        if (!user) {
            setSpirits([]);
            return;
        }

        setIsLoadingCabinet(true);
        try {
            const response = await fetch(`/api/cabinet/list?uid=${user.uid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cabinet data');
            }
            const { data: cabinetData } = await response.json();

            const enrichedData = cabinetData.map((item: any) => {
                const indexItem = searchIndex.find(s => s.i === item.id);
                return {
                    ...item,
                    name_en: item.name_en || indexItem?.en || null,
                    thumbnailUrl: item.thumbnailUrl || indexItem?.t || item.imageUrl,
                    imageUrl: item.imageUrl || indexItem?.t,
                    category: item.category || indexItem?.c,
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

    useEffect(() => {
        if (loading) return;
        fetchCabinet();
        fetchUserStats();
    }, [loading, fetchCabinet]);

    const fetchUserStats = async () => {
        if (!user) {
            setReviewCount(0);
            setLikesReceived(0);
            return;
        }

        setIsLoadingStats(true);
        try {
            const response = await fetch('/api/users/stats', {
                headers: {
                    'x-user-id': user.uid
                }
            });

            if (response.ok) {
                const stats = await response.json();
                setReviewCount(stats.reviewCount || 0);
                setLikesReceived(stats.totalLikes || 0);
            } else {
                setReviewCount(0);
                setLikesReceived(0);
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
            setReviewCount(0);
            setLikesReceived(0);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const handleReviewSubmit = async (review: UserReview) => {
        if (!reviewTarget || !user) return;

        try {
            await addToCabinet(user.uid, reviewTarget.id, {
                isWishlist: reviewTarget.isWishlist,
                userReview: review,
                userName: profile?.nickname || user.displayName || 'Anonymous'
            });

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

    const openReviewModal = (e: React.MouseEvent, spirit: Spirit) => {
        e.stopPropagation();
        setReviewTarget(spirit);
        setReviewModalOpen(true);
    };

    const openInfoModal = (e: React.MouseEvent, spirit: Spirit) => {
        e.stopPropagation();
        setSelectedSpirit(spirit);
    };

    const flavorAnalysis = analyzeCellar(spirits);

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
                        {dict.empty || (isEn ? "Your cabinet is empty." : "술장이 비어있습니다.")}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        {dict.emptySubtitle || (isEn ? "Let's fill it up with your favorite spirits!" : "좋아하는 술들로 채워볼까요?")}
                    </p>
                    <Link
                        href={`/${lang}/explore`}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-900/50 active:scale-[0.98]"
                    >
                        {dict.exploreButton || (isEn ? "Go to Explore" : "탐색하러 가기")}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
            <div className="mb-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />

                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                        {dict.title || (isEn ? "My Cabinet" : "내 술장")}
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
                        {dict.subtitle || "Curated Spirits & Tasting Journey"}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 max-w-2xl mx-auto relative z-10">
                    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-amber-500/30 transition-colors group">
                        <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:scale-110 transition-transform duration-300">{spirits.length}</p>
                        <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            {dict.stats?.bottles || "Bottles"}
                        </p>
                    </div>
                    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-amber-500/30 transition-colors group">
                        <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:scale-110 transition-transform duration-300">{isLoadingStats ? '...' : reviewCount}</p>
                        <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            {dict.stats?.reviews || "Reviews"}
                        </p>
                    </div>
                    <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-black/5 hover:border-rose-500/30 transition-colors group">
                        <p className="text-2xl sm:text-3xl font-black text-rose-500 group-hover:scale-110 transition-transform duration-300">{isLoadingStats ? '...' : likesReceived}</p>
                        <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                            {dict.stats?.hearts || "Hearts"}
                        </p>
                    </div>
                </div>

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
                            <span>🍾</span> {dict.viewMode?.cabinet || (isEn ? "Cabinet" : "술장")}
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
                            <span>🌌</span> {dict.viewMode?.tasteDna || (isEn ? "Taste DNA" : "취향 탐색")}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'cellar' ? (
                    <MyCabinet
                        key="cellar"
                        spirits={spirits}
                        profile={profile}
                        loading={loading}
                        onReviewClick={openReviewModal}
                        onInfoClick={openInfoModal}
                        onAddClick={() => setSearchModalOpen(true)}
                        dict={dict.tabs}
                    />
                ) : (
                    <PreferenceExploration
                        key="flavor"
                        flavorAnalysis={flavorAnalysis}
                        profile={profile}
                        loading={loading}
                        dict={dict}
                    />
                )}
            </AnimatePresence>

            {reviewModalOpen && reviewTarget && (
                <ReviewModal
                    spirit={reviewTarget}
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                    onSubmit={handleReviewSubmit}
                    dict={dict.modals?.review}
                    lang={lang}
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
                dict={dict.modals?.search}
                lang={lang}
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
