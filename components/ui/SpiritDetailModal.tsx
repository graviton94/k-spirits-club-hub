'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/auth-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getTagColor } from "@/lib/constants/tag-colors";
import type { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { Bookmark, Plus, Pencil, Check, Loader2 } from "lucide-react";

interface SpiritDetailModalProps {
    spirit: any; // Flexible for now
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void; // Refresh parent if needed
}

export default function SpiritDetailModal({ spirit, isOpen, onClose, onStatusChange }: SpiritDetailModalProps) {
    const { user, profile } = useAuth();
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
                const res = await fetch(`/api/cabinet/check?spiritId=${spirit.id}`, {
                    headers: { 'x-user-id': user!.uid }
                });
                const { isOwned, isWishlist, data } = await res.json();
                setCabinetStatus({ isOwned, isWishlist });
                if (data) setLocalSpirit(data);
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
            const payload = {
                ...spirit,
                isWishlist: action === 'wishlist',
                updatedAt: new Date().toISOString()
            };

            const res = await fetch('/api/cabinet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.uid
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setCabinetStatus({
                    isOwned: action === 'add',
                    isWishlist: action === 'wishlist'
                });
                if (onStatusChange) onStatusChange();
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
            const res = await fetch('/api/cabinet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.uid
                },
                body: JSON.stringify(updatedSpirit)
            });

            if (res.ok) {
                setLocalSpirit(updatedSpirit);
                setCabinetStatus(prev => ({ ...prev, isOwned: true }));
                if (onStatusChange) onStatusChange();
            }
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
                    className="bg-background rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl border border-border overflow-hidden relative"
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
                                    <span className="inline-block px-2 py-1 mb-2 text-[10px] font-black text-black bg-amber-400 rounded-md uppercase">
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
                    <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar bg-background text-foreground">

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {!cabinetStatus.isOwned ? (
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('add')}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-all scale-100 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        <span>술장에 담기</span>
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('wishlist')}
                                        className={`p-3 rounded-xl border transition-all active:scale-95 ${cabinetStatus.isWishlist ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                                    >
                                        {cabinetStatus.isWishlist ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                    </button>
                                </>
                            ) : (
                                <div className="w-full flex gap-2">
                                    <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl font-bold text-sm">
                                        <Check className="w-4 h-4" /> 내 술장 소장 중
                                    </div>
                                    <button
                                        onClick={() => setIsReviewOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        {localSpirit.userReview ? '리뷰 수정하기' : '리뷰 쓰기'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Rating Summary (if exists) */}
                        {localSpirit.userReview && (
                            <div className="bg-amber-500/5 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-500/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1 text-amber-500 font-black text-xl">
                                        <span>★</span> {localSpirit.userReview.ratingOverall.toFixed(1)}
                                    </div>
                                    <div className="h-4 w-px bg-amber-500/20"></div>
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest">Master Review</span>
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
                                {((localSpirit.userReview?.tagsN?.length || 0) > 0 || localSpirit.metadata?.nose_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">👃 Aroma</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsN || localSpirit.metadata?.nose_tags || []).map((tag: any, i: number) => {
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
                                {((localSpirit.userReview?.tagsP?.length || 0) > 0 || localSpirit.metadata?.palate_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">👅 Palate</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsP || localSpirit.metadata?.palate_tags || []).map((tag: any, i: number) => {
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
                                {((localSpirit.userReview?.tagsF?.length || 0) > 0 || localSpirit.metadata?.finish_tags) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-foreground">🏁 Finish</span>
                                            <div className="h-px flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsF || localSpirit.metadata?.finish_tags || []).map((tag: any, i: number) => {
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
