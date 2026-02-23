'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getTagColor } from "@/lib/constants/tag-colors";
import type { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { Bookmark, Plus, Pencil, Check, Loader2, X } from "lucide-react";
import { addToCabinet } from "@/app/[lang]/actions/cabinet";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import metadata from "@/lib/constants/spirits-metadata.json";

import SuccessToast from "@/components/ui/SuccessToast";

interface SpiritDetailModalProps {
    spirit: any; // Flexible for now
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void; // Refresh parent if needed
}

const UI_TEXT = {
    ko: {
        add_cabinet: "술장에 담기",
        remove_cabinet: "제거하기",
        edit_review: "리뷰 수정하기",
        write_review: "리뷰 쓰기",
        master_review: "Master Review",
        aroma: "👃 Aroma",
        palate: "👅 Palate",
        finish: "🏁 Finish",
        description: "Description",
        toast_login: "로그인이 필요한 기능입니다. 👤",
        toast_added: "성공적으로 술장에 담겼습니다! 🥃",
        toast_wishlist: "위시리스트에 담겼습니다! 🔖",
        confirm_remove_wishlist: "위시리스트에서 제거하시겠습니까?",
        confirm_remove_cabinet: "정말 술장에서 제거하시겠습니까?"
    },
    en: {
        add_cabinet: "Add to Cabinet",
        remove_cabinet: "Remove",
        edit_review: "Edit Review",
        write_review: "Write Review",
        master_review: "Master Review",
        aroma: "👃 Aroma",
        palate: "👅 Palate",
        finish: "🏁 Finish",
        description: "Description",
        toast_login: "Login required. 👤",
        toast_added: "Added to Cabinet! 🥃",
        toast_wishlist: "Added to Wishlist! 🔖",
        confirm_remove_wishlist: "Remove from Wishlist?",
        confirm_remove_cabinet: "Remove from Cabinet?"
    }
};

export default function SpiritDetailModal({ spirit, isOpen, onClose, onStatusChange }: SpiritDetailModalProps) {
    const { user, profile } = useAuth();
    const router = useRouter();
    const pathname = usePathname() || "";
    const isEn = pathname.split('/')[1] === 'en';
    const t = isEn ? UI_TEXT.en : UI_TEXT.ko;

    // Helper to get localized category name
    const getLocalizedCategory = (cat: string) => {
        if (!cat) return '';
        const displayNames = isEn ? (metadata as any).display_names_en : metadata.display_names;
        return displayNames[cat] || cat;
    };

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [localSpirit, setLocalSpirit] = useState<Spirit | null>(spirit);
    const [cabinetStatus, setCabinetStatus] = useState<{ isOwned: boolean; isWishlist: boolean }>({
        isOwned: false,
        isWishlist: false
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    // Sync local spirit when prop changes
    useEffect(() => {
        setLocalSpirit(spirit);
    }, [spirit]);

    // Check cabinet status
    useEffect(() => {
        if (!user || !spirit) return;

        async function checkStatus() {
            try {
                const res = await fetch(`/api/cabinet/check?uid=${user!.uid}&sid=${spirit.id}`);
                const status = await res.json();
                setCabinetStatus({ isOwned: status.isOwned, isWishlist: status.isWishlist });
                if (status.data) setLocalSpirit(status.data);
            } catch (e) {
                console.error("Status check failed", e);
            }
        }
        checkStatus();
    }, [user, spirit, isOpen]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also prevent touchmove on the backdrop if needed, but 'hidden' usually works for desktop/modern mobile
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleAction = async (action: 'add' | 'wishlist') => {
        if (!user) {
            setToastMessage(t.toast_login);
            setToastVariant('error');
            setShowToast(true);
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

            // Show Toast
            if (action === 'add') {
                setToastMessage(t.toast_added);
                setToastVariant('success');
                setShowToast(true);
            } else if (action === 'wishlist') {
                setToastMessage(t.toast_wishlist);
                setToastVariant('success');
                setShowToast(true);
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
                className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-md bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ... (Header Image code remains unchanged) ... */}
                    {/* (Omitted for brevity, but it's part of the replacement block) */}
                    <div className="relative h-[28vh] w-full bg-zinc-800 shrink-0 aspect-video overflow-hidden">
                        {/* Close Button (Top Left) */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 left-5 z-20 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white transition-all active:scale-90 shadow-lg border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {localSpirit.imageUrl ? (
                            <img
                                src={getOptimizedImageUrl(localSpirit.imageUrl, 800)}
                                alt={localSpirit.name}
                                className="w-full h-full object-cover object-center"
                                loading="eager"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                🥃
                            </div>
                        )}
                    </div>

                    {/* 2. Actions & Detailed Info */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-neutral-900 text-white pb-12">
                        {/* Title Section */}
                        <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold bg-amber-500/90 text-black rounded uppercase tracking-wider">
                                {getLocalizedCategory(localSpirit.category)}
                            </span>
                            <h2 className="text-3xl font-black text-white leading-tight mb-1">
                                {localSpirit.name}
                            </h2>
                            {localSpirit.distillery && (
                                <p className="text-lg text-amber-500 font-bold">{localSpirit.distillery}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {!cabinetStatus.isOwned ? (
                                <div className="w-full flex gap-2">
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('add')}
                                        className="flex-2 flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-emerald-500 to-green-600 text-white font-black rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all scale-100 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        <span>{t.add_cabinet}</span>
                                    </button>
                                    {cabinetStatus.isWishlist && (
                                        <button
                                            disabled={isProcessing}
                                            onClick={async () => {
                                                if (!confirm(t.confirm_remove_wishlist)) return;
                                                setIsProcessing(true);
                                                try {
                                                    await import('@/app/[lang]/actions/cabinet').then(({ removeFromCabinet }) =>
                                                        removeFromCabinet(user!.uid, spirit.id)
                                                    );
                                                    setCabinetStatus({ isOwned: false, isWishlist: false });
                                                    if (onStatusChange) onStatusChange();
                                                } catch (e) { console.error(e); }
                                                finally { setIsProcessing(false); }
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 rounded-xl font-bold text-sm transition-colors"
                                        >
                                            <Check className="w-4 h-4" /> {t.remove_cabinet}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full flex gap-2">
                                    <button
                                        onClick={() => router.push(`/spirits/${localSpirit.id}`)}
                                        className="flex-2 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:from-amber-600 hover:to-orange-700 hover:scale-105 transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        {localSpirit.userReview ? t.edit_review : t.write_review}
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={async () => {
                                            if (!confirm(t.confirm_remove_cabinet)) return;
                                            setIsProcessing(true);
                                            try {
                                                await import('@/app/[lang]/actions/cabinet').then(({ removeFromCabinet }) =>
                                                    removeFromCabinet(user!.uid, spirit.id)
                                                );
                                                setCabinetStatus({ isOwned: false, isWishlist: false });
                                                if (onStatusChange) onStatusChange();
                                            } catch (e) { console.error(e); }
                                            finally { setIsProcessing(false); }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> {t.remove_cabinet}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {(isEn ? localSpirit.metadata?.description_en : localSpirit.metadata?.description_ko) && (
                            <div className="mb-2">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.description}</h3>
                                <p className="text-sm text-gray-200 leading-relaxed font-light">
                                    {isEn ? localSpirit.metadata?.description_en : localSpirit.metadata?.description_ko}
                                </p>
                            </div>
                        )}

                        {/* User Rating Summary (if exists) */}
                        {localSpirit.userReview && (
                            <div className="bg-primary/5 rounded-2xl p-4 border-2 border-primary/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1 text-primary font-black text-xl">
                                        <span>★</span> {localSpirit.userReview.ratingOverall.toFixed(1)}
                                    </div>
                                    <div className="h-4 w-px bg-primary/20"></div>
                                    <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Master Review</span>
                                </div>
                                <p className="text-sm text-gray-200 italic leading-relaxed">
                                    "{localSpirit.userReview.comment}"
                                </p>
                            </div>
                        )}

                        {/* Tasting Profile - N/P/F */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                Tasting Profile
                            </h3>

                            <div className="space-y-5">
                                {/* Nose */}
                                {(localSpirit.userReview?.tagsN?.length || localSpirit.nose_tags?.length) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-white">👃 Aroma</span>
                                            <div className="h-px flex-1 bg-white/20"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsN || localSpirit.nose_tags || []).map((tag: string, i: number) => {
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
                                {(localSpirit.userReview?.tagsP?.length || localSpirit.palate_tags?.length) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-white">👅 Palate</span>
                                            <div className="h-px flex-1 bg-white/20"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsP || localSpirit.palate_tags || []).map((tag: string, i: number) => {
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
                                {(localSpirit.userReview?.tagsF?.length || localSpirit.finish_tags?.length) && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-white">🏁 Finish</span>
                                            <div className="h-px flex-1 bg-white/20"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(localSpirit.userReview?.tagsF || localSpirit.finish_tags || []).map((tag: string, i: number) => {
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

                        {/* AI Global Pairing Guide */}
                        {/* Skeleton Loading State */}
                        {!localSpirit.metadata && isProcessing ? (
                            <div className="mt-6 space-y-3">
                                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                                <div className="h-24 w-full bg-gray-800 rounded-2xl animate-pulse" />
                            </div>
                        ) : (
                            ((isEn ? localSpirit.metadata?.pairing_guide_en : localSpirit.metadata?.pairing_guide_ko) || localSpirit.metadata?.pairing_guide_en) && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 uppercase tracking-widest flex items-center gap-1">
                                            ✨ {isEn ? 'Pairing Guide' : '페어링 추천'}
                                        </span>
                                        <div className="h-px flex-1 bg-white/20"></div>
                                    </div>

                                    <div className="relative overflow-hidden rounded-2xl p-px bg-linear-to-br from-purple-500/30 via-pink-500/30 to-orange-500/30">
                                        <div className="relative bg-neutral-900/80 backdrop-blur-xl p-4 rounded-2xl">
                                            <p className="text-sm text-gray-200 leading-relaxed wrap-break-word font-medium">
                                                {isEn
                                                    ? localSpirit.metadata?.pairing_guide_en
                                                    : (localSpirit.metadata?.pairing_guide_ko || localSpirit.metadata?.pairing_guide_en)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </motion.div>

                <SuccessToast
                    isVisible={showToast}
                    message={toastMessage}
                    variant={toastVariant}
                    onClose={() => setShowToast(false)}
                />
            </motion.div>
        </AnimatePresence>
    );
}
