'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getTagColor } from "@/lib/constants/tag-colors";
import type { Spirit, UserReview } from "@/lib/utils/flavor-engine";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { Bookmark, Plus, Pencil, Check, Loader2, X, Sparkles } from "lucide-react";
import NextImage from "next/image";
import { addToCabinet } from "@/app/[lang]/actions/cabinet";
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
        remove_cabinet: "제거하기",
        edit_review: "리뷰 수정하기",
        write_review: "리뷰 쓰기",
        master_review: "Master Review",
        tastingProfile: "테이스팅 프로필",
        aroma: "👃 향",
        palate: "👅 맛",
        finish: "🏁 피니시",
        description: "설명",
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
        tastingProfile: "Tasting Profile",
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
                    <div className="relative h-[42vw] max-h-[300px] w-full bg-white shrink-0 overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-30 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-xl rounded-xl text-foreground/70 transition-all active:scale-90 border border-black/10 group shadow-sm"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        </button>

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
                    <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border/20">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="capsule-premium bg-primary text-primary-foreground border-none text-[10px] mb-2 inline-block">
                                    {getLocalizedCategory(localSpirit.category)}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tighter">
                                    {localSpirit.name}
                                </h2>
                                {localSpirit.distillery && (
                                    <p className="text-sm text-primary font-bold opacity-70 uppercase tracking-widest mt-1">{localSpirit.distillery}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 📄 2. Detailed Intelligence Section */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 bg-card text-foreground pb-24 md:pb-8 scrollbar-hide">
                        
                        {/* Enterprise Meta Grid: DISTILLERY, ABV, CATEGORY, SUBCATEGORY */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {[
                                { label: isEn ? 'DISTILLERY' : '증류소', value: localSpirit.distillery || '—' },
                                { label: 'ABV', value: localSpirit.abv ? `${localSpirit.abv}%` : '—' },
                                { label: isEn ? 'CATEGORY' : '주종', value: getLocalizedCategory(localSpirit.category) || '—' },
                                { label: isEn ? 'STYLE' : '세부주종', value: (localSpirit as any).subcategory || (localSpirit as any).mainCategory || '—' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-3 rounded-2xl bg-muted/30 border border-border/30">
                                    <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                    <p className="text-xs font-black text-foreground truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Flavor Tags Section */}
                        {(localSpirit.noseTags?.length || localSpirit.palateTags?.length || localSpirit.finishTags?.length) && (
                            <div className="mb-6 p-4 rounded-2xl bg-muted/20 border border-border/20">
                                <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-3">{isEn ? 'FLAVOR PROFILE' : '플레이버 태그'}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {[...(localSpirit.noseTags || []), ...(localSpirit.palateTags || []), ...(localSpirit.finishTags || [])].map((tag: string, i: number) => (
                                        <span key={i} className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Command Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            {!cabinetStatus.isOwned ? (
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
                                        className={`btn-premium-outline flex-1 py-4 text-sm ${cabinetStatus.isWishlist ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : ''}`}
                                    >
                                        <Bookmark className={`w-5 h-5 ${cabinetStatus.isWishlist ? 'fill-current' : ''}`} />
                                        <span>{cabinetStatus.isWishlist ? 'WISHLISTED' : 'SAVE FOR LATER'}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push(`/${isEn ? 'en' : 'ko'}/spirits/${localSpirit.id}`)}
                                        className="btn-premium flex-1 py-4 text-sm"
                                    >
                                        <Pencil className="w-5 h-5" />
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
                                        className="btn-premium-outline flex-1 py-4 text-sm border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                                    >
                                        <Check className="w-5 h-5" /> {t.remove_cabinet}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Description Block */}
                        {(isEn ? localSpirit.descriptionEn : localSpirit.descriptionKo) && (
                            <div className="mb-6 relative p-6 rounded-2xl bg-foreground text-background">
                                <h3 className="text-[10px] font-black opacity-40 uppercase tracking-[0.25em] mb-3">{t.description}</h3>
                                <p className="text-sm leading-relaxed font-medium">
                                    {isEn ? localSpirit.descriptionEn : localSpirit.descriptionKo}
                                </p>
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                            </div>
                        )}

                        {/* 📊 Tasting Profile Intelligence */}
                        <div className="space-y-6 mb-6">
                            <div>
                                <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-border/50"></div>
                                    {t.tastingProfile}
                                    <div className="h-px flex-1 bg-border/50"></div>
                                </h3>

                                <div className="grid gap-6">
                                    {/* Aroma, Palate, Finish Sections */}
                                    {[
                                        { label: t.aroma, tags: localSpirit.userReview?.tagsN || localSpirit.noseTags, color: 'primary' },
                                        { label: t.palate, tags: localSpirit.userReview?.tagsP || localSpirit.palateTags, color: 'accent' },
                                        { label: t.finish, tags: localSpirit.finishTags || localSpirit.userReview?.tagsF, color: 'primary' }
                                    ].map((section, idx) => section.tags?.length ? (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-black text-foreground uppercase tracking-widest">{section.label}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {section.tags.map((tag: string, i: number) => (
                                                    <span key={i} className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all hover:scale-105 cursor-default
                                                        ${section.color === 'primary' 
                                                            ? 'bg-primary/5 text-primary border-primary/20' 
                                                            : 'bg-accent/5 text-accent border-accent/20'}`}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null)}
                                </div>
                            </div>
                        </div>

                        {/* 🍹 Institutional Pairing Guide */}
                        {(isEn ? localSpirit.pairingGuideEn : (localSpirit.pairingGuideKo || localSpirit.pairingGuideEn)) && (
                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-accent/10 border border-border/50 p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-md">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tighter italic">
                                        {isEn ? 'Sommelier Pairing Selection' : '소믈리에 페어링 가이드'}
                                    </h3>
                                </div>
  
                                <p className="text-sm text-foreground/90 leading-relaxed font-medium pl-3 border-l-4 border-primary/30">
                                    {isEn
                                        ? localSpirit.pairingGuideEn
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
