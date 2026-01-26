'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getTagColor } from "@/lib/constants/tag-colors";
import type { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { Bookmark, Plus, Pencil, Check, Loader2 } from "lucide-react";
import { addToCabinet, checkCabinetStatus } from "@/app/actions/cabinet";

interface SpiritDetailModalProps {
    spirit: any; // Flexible for now
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void; // Refresh parent if needed
}

export default function SpiritDetailModal({ spirit, isOpen, onClose, onStatusChange }: SpiritDetailModalProps) {
    const { user, profile } = useAuth();
    const router = useRouter();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [localSpirit, setLocalSpirit] = useState<Spirit | null>(spirit);
    const [cabinetStatus, setCabinetStatus] = useState<{ isOwned: boolean; isWishlist: boolean }>({
        isOwned: false,
        isWishlist: false
    });

    // Sync local spirit when prop changes
    useEffect(() => {
        setLocalSpirit(spirit);
    }, [spirit]);

    // Check cabinet status
    useEffect(() => {
        if (!user || !spirit) return;

        async function checkStatus() {
            try {
                const status = await checkCabinetStatus(user!.uid, spirit.id);
                setCabinetStatus({ isOwned: status.isOwned, isWishlist: status.isWishlist });
                if (status.data) setLocalSpirit(status.data);
            } catch (e) {
                console.error("Status check failed", e);
            }
        }
        checkStatus();
    }, [user, spirit, isOpen]);

    const handleAction = async (action: 'add' | 'wishlist') => {
        if (!user) {
            alert('로그인이 필요한 기능입니다.');
            return;
        }

        setIsProcessing(true);
        try {
            await addToCabinet(user.uid, spirit.id, {
                isWishlist: action === 'wishlist',
                userReview: localSpirit?.userReview,
                name: spirit.name,
                distillery: spirit.distillery ?? undefined,
                imageUrl: spirit.imageUrl || undefined,
                category: spirit.category,
                abv: spirit.abv
            });

            setCabinetStatus({
                isOwned: action === 'add',
                isWishlist: action === 'wishlist'
            });
            if (onStatusChange) onStatusChange();

            // Redirect to product detail page after adding to cabinet
            if (action === 'add') {
                router.push(`/spirits/${spirit.id}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReviewSubmit = async (review: UserReview) => {
        if (!user || !localSpirit) return;

        setIsProcessing(true);
        try {
            const updatedSpirit = { ...localSpirit, userReview: review };

            await addToCabinet(user.uid, spirit.id, {
                isWishlist: localSpirit.isWishlist || false,
                userReview: review,
                name: spirit.name,
                distillery: spirit.distillery ?? undefined,
                imageUrl: spirit.imageUrl || undefined,
                category: spirit.category,
                abv: spirit.abv
            });

            setLocalSpirit(updatedSpirit);
            setCabinetStatus(prev => ({ ...prev, isOwned: true }));
            if (onStatusChange) onStatusChange();
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen || !localSpirit) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl w-full max-w-sm sm:max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-colors"
                    >
                        ✕
                    </button>

                    {/* 1. Image Header with Info Overlay */}
                    <div className="relative h-72 sm:h-80 w-full bg-secondary">
                        {localSpirit.imageUrl ? (
                            <img
                                src={localSpirit.imageUrl}
                                alt={localSpirit.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getCategoryFallbackImage(localSpirit.category);
                                    target.classList.add('opacity-50');
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl bg-secondary opacity-50">🥃</div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 mr-4">
                                    <span className="inline-block px-2 py-1 mb-2 text-[10px] font-black text-primary-foreground bg-primary rounded-md uppercase shadow-[0_0_8px_rgba(251,146,60,0.6)] relative z-10">
                                        {localSpirit.subcategory || localSpirit.category}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1 drop-shadow-lg break-keep">
                                        {localSpirit.name}
                                    </h2>
                                    {localSpirit.distillery && (
                                        <p className="text-gray-300 text-sm font-medium">
                                            {localSpirit.distillery}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-lg p-2 min-w-[3.5rem] border border-white/10">
                                    <span className="text-[10px] text-gray-200 font-bold uppercase tracking-tighter">ABV</span>
                                    <span className="text-xl font-black text-white">{localSpirit.abv}<span className="text-xs ml-0.5">%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Actions & Detailed Info */}
                    <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-slate-900/60 text-foreground backdrop-blur-md">

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {!cabinetStatus.isOwned ? (
                                <button
                                    disabled={isProcessing}
                                    onClick={() => handleAction('add')}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all scale-100 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    <span>술장에 담기</span>
                                </button>
                            ) : (
                                <div className="w-full flex gap-2">
                                    <button
                                        disabled={isProcessing}
                                        onClick={async () => {
                                            if (!confirm('정말 술장에서 제거하시겠습니까?')) return;
                                            setIsProcessing(true);
                                            try {
                                                await import('@/app/actions/cabinet').then(({ removeFromCabinet }) =>
                                                    removeFromCabinet(user!.uid, spirit.id)
                                                );
                                                setCabinetStatus({ isOwned: false, isWishlist: false });
                                                if (onStatusChange) onStatusChange();
                                            } catch (e) { console.error(e); }
                                            finally { setIsProcessing(false); }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> 제거하기
                                    </button>
                                    <button
                                        onClick={() => setIsReviewOpen(true)}
                                        className="flex-[2] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:from-amber-600 hover:to-orange-700 hover:scale-105 transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        {localSpirit.userReview ? '리뷰 수정하기' : '리뷰 쓰기'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Rating Summary (if exists) */}
                        {localSpirit.userReview && (
                            <div className="bg-primary/5 rounded-2xl p-4 border-2 border-primary/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1 text-primary font-black text-xl">
                                        <span>★</span> {localSpirit.userReview.ratingOverall.toFixed(1)}
                                    </div>
                                    <div className="h-4 w-px bg-primary/20"></div>
                                    <span className="text-[10px] text-primary font-black uppercase tracking-widest">Master Review</span>
                                </div>
                                <p className="text-sm text-foreground italic leading-relaxed">
                                    "{localSpirit.userReview.comment}"
                                </p>
                            </div>
                        )}

                        {/* Tasting Profile - N/P/F */}
                        <div>
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                                Tasting Profile
                            </h3>

                            <div className="space-y-5">
                                {/* Nose */}
                                {((localSpirit.userReview?.tagsN?.length || 0) > 0 || (localSpirit.metadata as any)?.nose_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">👃 Aroma</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsN || (localSpirit.metadata as any)?.nose_tags || []).map((tag: any, i: number) => {
                                                const color = getTagColor(tag);
                                                return (
                                                    <span key={i} className={`inline-block text-[10px] px-2.5 py-1 rounded-md border font-bold ${color.bg} ${color.text} ${color.border}`}>
                                                        {tag}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Palate */}
                                {((localSpirit.userReview?.tagsP?.length || 0) > 0 || (localSpirit.metadata as any)?.palate_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">👅 Palate</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsP || (localSpirit.metadata as any)?.palate_tags || []).map((tag: any, i: number) => {
                                                const color = getTagColor(tag);
                                                return (
                                                    <span key={i} className={`inline-block text-[10px] px-2.5 py-1 rounded-md border font-bold ${color.bg} ${color.text} ${color.border}`}>
                                                        {tag}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Finish */}
                                {((localSpirit.userReview?.tagsF?.length || 0) > 0 || (localSpirit.metadata as any)?.finish_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">🏁 Finish</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsF || (localSpirit.metadata as any)?.finish_tags || []).map((tag: any, i: number) => {
                                                const color = getTagColor(tag);
                                                return (
                                                    <span key={i} className={`inline-block text-[10px] px-2.5 py-1 rounded-md border font-bold ${color.bg} ${color.text} ${color.border}`}>
                                                        {tag}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Review Modal Integration */}
                {isReviewOpen && (
                    <ReviewModal
                        spirit={localSpirit as any}
                        isOpen={isReviewOpen}
                        onClose={() => setIsReviewOpen(false)}
                        onSubmit={handleReviewSubmit}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
