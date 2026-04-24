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
    const [viewMode, setViewMode] = useState<ViewMode>('cellar');
    const [spirits, setSpirits] = useState<Spirit[]>([]);
    const [isLoadingCabinet, setIsLoadingCabinet] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);
    const [likesReceived, setLikesReceived] = useState(0);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<Spirit | null>(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { profile, loading, user } = useAuth();
    const { searchIndex } = useSpiritsCache();

    useEffect(() => {
        document.title = isEn
            ? `My Cabinet | K-Spirits Club`
            : `K-Spirits Club | 나만의 술장 만들기 & 취향 분석`;
    }, [isEn]);

    const fetchCabinet = useCallback(async () => {
        if (!user) {
            setSpirits([]);
            return;
        }

        const cacheKey = `cabinet_data_${user.uid}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            try {
                setSpirits(JSON.parse(cachedData));
            } catch (e) {
                console.error('Failed to parse cabinet cache', e);
            }
        } else {
            setIsLoadingCabinet(true);
        }

        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`/api/cabinet/list?uid=${user.uid}`, {
                headers: {
                    'authorization': `Bearer ${idToken}`
                }
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                console.group('❌ Cabinet Fetch Failed (500/Internal)');
                console.error('Status:', response.status);
                console.error('Trace ID:', errorBody.traceId);
                console.table(errorBody);
                console.groupEnd();
                throw new Error(errorBody.error || 'Failed to fetch cabinet data');
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

            const enrichedSpirits = enrichedData as Spirit[];
            setSpirits(enrichedSpirits);
            localStorage.setItem(cacheKey, JSON.stringify(enrichedSpirits));
        } catch (error: any) {
            console.error('Failed to fetch cabinet:', error);
            if (error.response) {
                try {
                    const errorDetails = await error.response.json();
                    console.table(errorDetails);
                } catch (e) {}
            }
            if (!cachedData) setSpirits([]);
        } finally {
            setIsLoadingCabinet(false);
        }
    }, [user, searchIndex]);

    useEffect(() => {
        if (loading) return;
        fetchCabinet();
        fetchUserStats();
    }, [loading, fetchCabinet, searchIndex]);

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

    if (!loading && !isLoadingCabinet && spirits.length === 0) {
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
        <div className="container mx-auto px-4 py-12 max-w-6xl pb-32">
            <div className="mb-14 relative">
                {/* Immersive Background Atmosphere */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-primary/10 blur-[120px] pointer-events-none" />

                <div className="text-center mb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-brand-gradient bg-clip-text text-transparent italic uppercase drop-shadow-2xl leading-none">
                            {dict.title || (isEn ? "My Cabinet" : "내 술장")}
                        </h1>
                        <p className="text-[10px] md:text-xs font-black text-muted-foreground/40 tracking-[0.6em] uppercase flex items-center justify-center gap-3">
                            <span className="w-10 h-px bg-primary/20" />
                            {dict.subtitle || "Curated Spirits & Tasting Journey"}
                            <span className="w-10 h-px bg-primary/20" />
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 md:gap-10 mb-16 max-w-4xl mx-auto relative z-10">
                    <div className="bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl hover:border-primary/30 transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-4xl md:text-5xl font-black text-foreground group-hover:scale-110 transition-transform duration-700 leading-none mb-2 italic">{spirits.length}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-30">
                            {dict.stats?.bottles || "Bottles"}
                        </p>
                    </div>
                    <div className="bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl hover:border-primary/30 transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-4xl md:text-5xl font-black text-foreground group-hover:scale-110 transition-transform duration-700 leading-none mb-2 italic">{isLoadingStats ? '...' : reviewCount}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-30">
                            {dict.stats?.reviews || "Reviews"}
                        </p>
                    </div>
                    <div className="bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl hover:border-rose-500/30 transition-all duration-700 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-4xl md:text-5xl font-black text-rose-500 group-hover:scale-110 transition-transform duration-700 leading-none mb-2 italic">{isLoadingStats ? '...' : likesReceived}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-30">
                            {dict.stats?.hearts || "Hearts"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center relative z-10">
                    <div className="inline-flex p-2 bg-muted/20 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl mb-2">
                        <button
                            onClick={() => setViewMode('cellar')}
                            className={`
                                flex items-center gap-2.5 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all duration-500
                                ${viewMode === 'cellar'
                                    ? 'bg-primary text-primary-foreground shadow-[0_10px_30px_-5px_rgba(var(--primary-rgb),0.5)] scale-105'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }
                            `}
                        >
                            <span className="text-lg">🍾</span> {dict.viewMode?.cabinet || (isEn ? "Cabinet" : "술장")}
                        </button>
                        <button
                            onClick={() => setViewMode('flavor')}
                            className={`
                                flex items-center gap-2.5 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all duration-500
                                ${viewMode === 'flavor'
                                    ? 'bg-primary text-primary-foreground shadow-[0_10px_30px_-5px_rgba(var(--primary-rgb),0.5)] scale-105'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }
                            `}
                        >
                            <span className="text-lg">🌌</span> {dict.viewMode?.tasteDna || (isEn ? "Taste DNA" : "취향 탐색")}
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
                        spirits={spirits}
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
