'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/auth-context";
import type { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { Bookmark, Plus, Loader2, X, Sparkles, BookmarkX, ExternalLink, Trash2 } from "lucide-react";
import NextImage from "next/image";
import { addToCabinet, removeFromCabinet } from "@/app/[lang]/actions/cabinet";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import metadata from "@/lib/constants/spirits-metadata.json";

import { useModal } from "@/app/[lang]/context/modal-context";

interface SpiritDetailModalProps {
    spirit: any; // Flexible for now
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void; // Refresh parent if needed
}

const UI_TEXT = {
    ko: {
        add_cabinet: "술장에 담기",
        move_to_cabinet: "소장중으로 변경",
        remove_cabinet: "술장에서 제거",
        remove_wishlist: "위시리스트에서 제거",
        go_to_review: "리뷰 페이지로 이동",
        edit_review: "리뷰 수정하기",
        write_review: "리뷰 쓰기",
        save_for_later: "위시리스트 저장",
        master_review: "Master Review",
        tastingProfile: "테이스팅 프로필",
        aroma: "👃 향 (Nose)",
        palate: "👅 맛 (Palate)",
        finish: "🏁 피니시 (Finish)",
        tasting_note: "테이스팅 노트",
        description: "설명",
        pairing: "페어링 가이드",
        toast_login: "로그인이 필요한 기능입니다. 👤",
        toast_added: "성공적으로 술장에 담겼습니다! 🥃",
        toast_wishlist: "위시리스트에 담겼습니다! 🔖",
        toast_moved: "소장 목록으로 이동했습니다! 🥃",
        toast_removed: "목록에서 제거되었습니다.",
        confirm_remove_wishlist: "위시리스트에서 제거하시겠습니까?",
        confirm_remove_cabinet: "정말 술장에서 제거하시겠습니까?"
    },
    en: {
        add_cabinet: "Add to Cabinet",
        move_to_cabinet: "Move to Cabinet",
        remove_cabinet: "Remove from Cabinet",
        remove_wishlist: "Remove from Wishlist",
        go_to_review: "Go to Review Page",
        edit_review: "Edit Review",
        write_review: "Write Review",
        save_for_later: "Save for Later",
        master_review: "Master Review",
        tastingProfile: "Tasting Profile",
        aroma: "👃 Aroma (Nose)",
        palate: "👅 Palate",
        finish: "🏁 Finish",
        tasting_note: "Tasting Note",
        description: "Description",
        pairing: "Pairing Guide",
        toast_login: "Login required. 👤",
        toast_added: "Added to Cabinet! 🥃",
        toast_wishlist: "Added to Wishlist! 🔖",
        toast_moved: "Moved to Cabinet! 🥃",
        toast_removed: "Removed from list.",
        confirm_remove_wishlist: "Remove from Wishlist?",
        confirm_remove_cabinet: "Remove from Cabinet?"
    }
};

import SuccessToast from "@/components/ui/SuccessToast";

export default function SpiritDetailModal({ spirit, isOpen, onClose, onStatusChange }: SpiritDetailModalProps) {
    const { user, profile } = useAuth();
    const router = useRouter();
    const pathname = usePathname() || "";
    const isEn = pathname.split('/')[1] === 'en';
    const t = isEn ? UI_TEXT.en : UI_TEXT.ko;
    const { openModal, closeModal } = useModal();

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

    // Body scroll lock + modal context
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            openModal();
        } else {
            document.body.style.overflow = '';
            closeModal();
        }
        return () => {
            document.body.style.overflow = '';
            closeModal();
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

    const handleRemove = async (fromWishlist = false) => {
        if (!user) return;
        const confirmMsg = fromWishlist ? t.confirm_remove_wishlist : t.confirm_remove_cabinet;
        if (!confirm(confirmMsg)) return;
        setIsProcessing(true);
        try {
            await removeFromCabinet(user.uid, spirit.id);
            setCabinetStatus({ isOwned: false, isWishlist: false });
            if (onStatusChange) onStatusChange();
            setToastMessage(t.toast_removed);
            setToastVariant('success');
            setShowToast(true);
        } catch (e) { console.error(e); }
        finally { setIsProcessing(false); }
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
                className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6 bg-background/60 backdrop-blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-2xl bg-card rounded-none md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x md:border border-border/20 h-full md:h-auto md:max-h-[85vh] flex flex-col"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 🏰 1. Product Image Section - Clean White Background */}
                    <div className="relative h-[42vw] max-h-[280px] w-full bg-white shrink-0 overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-xl rounded-xl text-foreground/70 transition-all active:scale-90 border border-black/10 group shadow-sm"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        </button>

                        {/* Capsule badges: Category | Subcategory | ABV */}
                        <div className="absolute bottom-3 left-4 z-20 flex flex-wrap gap-1.5">
                            {localSpirit.category && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-primary text-primary-foreground shadow-sm">
                                    {getLocalizedCategory(localSpirit.category)}
                                </span>
                            )}
                            {(localSpirit as any).subcategory && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/60 text-white shadow-sm">
                                    {(localSpirit as any).subcategory}
                                </span>
                            )}
                            {localSpirit.abv && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/60 text-white shadow-sm">
                                    {localSpirit.abv}%
                                </span>
                            )}
                        </div>

                        {localSpirit.imageUrl ? (
                            <NextImage
                                src={getOptimizedImageUrl(localSpirit.imageUrl, 1200)}
                                alt={localSpirit.name}
                                fill
                                className="object-contain p-8"
                                priority
                                unoptimized={true}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
                                🥃
                            </div>
                        )}
                    </div>

                    {/* Product Identity Block */}
                    <div className="px-6 md:px-8 pt-5 pb-4 border-b border-border/20">
                        <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tighter">
                            {localSpirit.name}
                        </h2>
                        {(() => {
                            const nameEn = (localSpirit as any).nameEn;
                            return nameEn && nameEn !== localSpirit.name ? (
                                <p className="text-sm text-foreground/50 font-medium mt-0.5">{nameEn}</p>
                            ) : null;
                        })()}
                        {localSpirit.distillery && (
                            <p className="text-sm text-primary font-bold opacity-70 uppercase tracking-widest mt-1">{localSpirit.distillery}</p>
                        )}
                    </div>

                    {/* 📄 2. Detailed Intelligence Section */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 bg-card text-foreground pb-24 md:pb-8 scrollbar-hide">

                        {/* Action Command Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            {cabinetStatus.isOwned ? (
                                /* Owned: Remove from Cabinet | Go to Review Page */
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleRemove(false)}
                                        className="btn-premium-outline flex-1 py-4 text-sm border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        <span>{t.remove_cabinet}</span>
                                    </button>
                                    <button
                                        onClick={() => router.push(`/${isEn ? 'en' : 'ko'}/spirits/${localSpirit.id}`)}
                                        className="btn-premium flex-1 py-4 text-sm"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        <span>{localSpirit.userReview ? t.edit_review : t.go_to_review}</span>
                                    </button>
                                </>
                            ) : cabinetStatus.isWishlist ? (
                                /* Wishlist: Move to Cabinet | Remove from Wishlist */
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('add')}
                                        className="btn-premium flex-1 py-4 text-sm"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        <span>{t.move_to_cabinet}</span>
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleRemove(true)}
                                        className="btn-premium-outline flex-1 py-4 text-sm border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookmarkX className="w-5 h-5" />}
                                        <span>{t.remove_wishlist}</span>
                                    </button>
                                </>
                            ) : (
                                /* Default: Add to Cabinet | Save for Later */
                                <>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('add')}
                                        className="btn-premium flex-1 py-4 text-sm"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        <span>{t.add_cabinet}</span>
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleAction('wishlist')}
                                        className="btn-premium-outline flex-1 py-4 text-sm"
                                    >
                                        <Bookmark className="w-5 h-5" />
                                        <span>{t.save_for_later}</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Flavor Tag Sections — Nose / Palate / Finish */}
                        {(localSpirit.noseTags?.length || localSpirit.palateTags?.length || localSpirit.finishTags?.length) && (
                            <div className="mb-6 p-4 rounded-2xl bg-muted/20 border border-border/20 space-y-4">
                                <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em]">{isEn ? 'FLAVOR PROFILE' : '플레이버 프로필'}</p>
                                {[
                                    { label: t.aroma, tags: localSpirit.noseTags, colorCls: 'bg-primary/10 text-primary border-primary/20' },
                                    { label: t.palate, tags: localSpirit.palateTags, colorCls: 'bg-accent/10 text-accent border-accent/20' },
                                    { label: t.finish, tags: localSpirit.finishTags, colorCls: 'bg-primary/10 text-primary border-primary/20' },
                                ].map((section, idx) => section.tags?.length ? (
                                    <div key={idx}>
                                        <p className="text-[10px] font-black text-foreground/50 uppercase tracking-wider mb-2">{section.label}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {section.tags.map((tag: string, i: number) => (
                                                <span key={i} className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${section.colorCls}`}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null)}
                            </div>
                        )}

                        {/* Tasting Note */}
                        {localSpirit.tastingNote && (
                            <div className="mb-6 p-4 rounded-2xl bg-muted/20 border border-border/20">
                                <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-2">{isEn ? 'TASTING NOTE' : '테이스팅 노트'}</p>
                                <p className="text-sm leading-relaxed text-foreground/80 font-medium">{localSpirit.tastingNote}</p>
                            </div>
                        )}

                        {/* Description Block */}
                        {(isEn ? (localSpirit.descriptionEn || localSpirit.descriptionKo) : (localSpirit.descriptionKo || localSpirit.descriptionEn)) && (
                            <div className="mb-6 relative p-6 rounded-2xl bg-foreground text-background">
                                <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[0.25em] mb-3">{t.description}</h3>
                                <p className="text-sm leading-relaxed font-medium">
                                    {isEn ? (localSpirit.descriptionEn || localSpirit.descriptionKo) : (localSpirit.descriptionKo || localSpirit.descriptionEn)}
                                </p>
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                            </div>
                        )}

                        {/* 🍹 Pairing Guide */}
                        {(isEn ? (localSpirit.pairingGuideEn || localSpirit.pairingGuideKo) : (localSpirit.pairingGuideKo || localSpirit.pairingGuideEn)) && (
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/50 p-6 shadow-xl mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tighter italic">
                                        {isEn ? 'Pairing Guide' : '페어링 가이드'}
                                    </h3>
                                </div>
  
                                <p className="text-sm text-foreground/90 leading-relaxed font-medium pl-3 border-l-4 border-primary/30">
                                    {isEn
                                        ? (localSpirit.pairingGuideEn || localSpirit.pairingGuideKo)
                                        : (localSpirit.pairingGuideKo || localSpirit.pairingGuideEn)}
                                </p>
                            </div>
                        )}
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
