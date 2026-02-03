'use client';

import { useState, useEffect } from "react";
import SaveButton from "@/components/ui/SaveButton";
import ReviewSection from "@/components/ui/ReviewSection";
import AdSlot from "@/components/common/AdSlot";
import ModificationRequestButton from "@/components/spirits/ModificationRequestButton";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowLeft } from "lucide-react";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet } from "@/app/actions/cabinet";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { UserReview } from "@/lib/utils/flavor-engine";
import { toFlavorSpirit, triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "@/components/ui/SuccessToast";

import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { CATEGORY_NAME_MAP } from "@/lib/constants/categories";

interface SpiritDetailClientProps {
    spirit: Spirit;
    reviews: any[];
}

const UI_TEXT = {
    ko: {
        back: "뒤로가기",
        classification: "주류 분류",
        category: "카테고리",
        main: "메인",
        sub: "세부",
        origin: "원산지 및 정보",
        country: "제조국",
        region: "지역",
        bottler: "병입자",
        flavor: "맛과 향",
        add_cabinet: "내 술장에 담기",
        remove_cabinet: "내 술장에서 빼기",
        add_wishlist: "위시리스트에 담기",
        remove_wishlist: "위시리스트에서 제거",
        processing: "처리 중...",
        source: "데이터 출처",
        source_manual: "운영진 수동 등록",
        source_external: "기타 외부 데이터",
        disclaimer: "본 데이터는 각 출처의 공공데이터 및 AI로 수집된 정보를 바탕으로 제공되며, 실제 제품의 정보와 차이가 있을 수 있습니다. 잘못된 정보가 있다면 위의 버튼을 통해 제보 부탁드립니다."
    },
    en: {
        back: "Back",
        classification: "Classification",
        category: "Category",
        main: "Main",
        sub: "Sub",
        origin: "Origin & Details",
        country: "Country",
        region: "Region",
        bottler: "Bottler",
        flavor: "Flavor Notes",
        add_cabinet: "Add to Cabinet",
        remove_cabinet: "Remove",
        add_wishlist: "Add to Wishlist",
        remove_wishlist: "Remove",
        processing: "Processing...",
        source: "Data Source",
        source_manual: "Manual Entry",
        source_external: "External Data",
        disclaimer: "This data is provided based on public data and information from various sources include AI, and may differ from the actual product information. If there is incorrect information, please report it via the button above."
    }
};

import metadata from "@/lib/constants/spirits-metadata.json";

export default function SpiritDetailClient({ spirit, reviews }: SpiritDetailClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isEn = pathname?.startsWith('/en');
    const t = isEn ? UI_TEXT.en : UI_TEXT.ko;

    // Helpers for localized display
    const displayName = isEn ? (spirit.metadata?.name_en || spirit.name_en || spirit.name) : spirit.name;
    const displayDistillery = isEn ? (spirit.metadata?.distillery_en || spirit.distillery) : spirit.distillery;

    const getLocalizedCategory = (cat: string) => {
        if (!cat) return '';
        const displayNames = isEn ? (metadata as any).display_names_en : metadata.display_names;
        return displayNames[cat] || cat;
    };

    const displayDescription = isEn
        ? (spirit.description_en || spirit.metadata?.description_en || spirit.description_ko || spirit.metadata?.description_ko)
        : (spirit.description_ko || spirit.metadata?.description_ko || spirit.description_en || spirit.metadata?.description_en);

    const { user } = useAuth();
    const [isInCabinet, setIsInCabinet] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isToggling, setIsToggling] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Check status on mount
    useEffect(() => {
        if (spirit.id) {
            // Log 'view' event for trending calculation
            fetch('/api/trending/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spiritId: spirit.id, action: 'view' })
            }).catch(err => console.error('Failed to log view:', err));
        }

        if (user && spirit.id) {
            fetch(`/api/cabinet/check?uid=${user.uid}&sid=${spirit.id}`)
                .then(res => res.json())
                .then(status => {
                    setIsInCabinet(status.isOwned);
                    setIsWishlist(status.isWishlist);
                    setIsLoadingStatus(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoadingStatus(false);
                });
        } else {
            setIsLoadingStatus(false);
        }
    }, [user, spirit.id]);

    const handleCabinetAction = async () => {
        if (!user) {
            triggerLoginModal();
            return;
        }

        setIsToggling(true);
        try {
            if (isInCabinet) {
                // Remove from cabinet
                await import('@/app/actions/cabinet').then(({ removeFromCabinet }) =>
                    removeFromCabinet(user.uid, spirit.id)
                );
                setIsInCabinet(false);
                setSuccessMessage(t.remove_cabinet + ' 🗑️');
            } else {
                // Add to cabinet
                await import('@/app/actions/cabinet').then(({ addToCabinet }) =>
                    addToCabinet(user.uid, spirit.id, {
                        isWishlist: false,
                        name: spirit.name,
                        distillery: spirit.distillery ?? undefined,
                        imageUrl: spirit.imageUrl ?? undefined,
                        category: spirit.category,
                        abv: spirit.abv
                    })
                );
                setIsInCabinet(true);
                setIsWishlist(false); // If it was in wishlist, it's now owned
                setSuccessMessage(t.add_cabinet + ' 🥃');

                // Log 'cabinet' event for trending
                fetch('/api/trending/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spiritId: spirit.id, action: 'cabinet' })
                }).catch(err => console.error('Failed to log cabinet add:', err));
            }
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to update cabinet:', error);
            setSuccessMessage(`❌ ${error.message || 'Error'}`);
            setShowSuccessToast(true);
        } finally {
            setIsToggling(false);
        }
    };

    const handleWishlistAction = async () => {
        if (!user) {
            triggerLoginModal();
            return;
        }

        setIsToggling(true);
        try {
            if (isWishlist) {
                // Remove from wishlist
                await import('@/app/actions/cabinet').then(({ removeFromCabinet }) =>
                    removeFromCabinet(user.uid, spirit.id)
                );
                setIsWishlist(false);
                setSuccessMessage(t.remove_wishlist + ' 🗑️');
            } else {
                // Add to wishlist
                await import('@/app/actions/cabinet').then(({ addToCabinet }) =>
                    addToCabinet(user.uid, spirit.id, {
                        isWishlist: true,
                        name: spirit.name,
                        distillery: spirit.distillery ?? undefined,
                        imageUrl: spirit.imageUrl ?? undefined,
                        category: spirit.category,
                        abv: spirit.abv
                    })
                );
                setIsWishlist(true);
                setIsInCabinet(false); // Can't be both (usually)
                setSuccessMessage(t.add_wishlist + ' 🔖');

                // Log 'wishlist' event for trending
                fetch('/api/trending/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spiritId: spirit.id, action: 'wishlist' })
                }).catch(err => console.error('Failed to log wishlist add:', err));
            }
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to update wishlist:', error);
            setSuccessMessage(`❌ ${error.message || 'Error'}`);
            setShowSuccessToast(true);
        } finally {
            setIsToggling(false);
        }
    };

    const handleReviewSubmit = async (review: UserReview) => {
        if (!user) return;

        setIsToggling(true);
        try {
            await addToCabinet(user.uid, spirit.id, {
                isWishlist: false,
                userReview: review,
                name: spirit.name,
                distillery: spirit.distillery ?? undefined,
                imageUrl: spirit.imageUrl || undefined,
                category: spirit.category,
                abv: spirit.abv
            });
            setIsInCabinet(true);
            setIsWishlist(false);
            setSuccessMessage('Review Saved! ✅');
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to add to cabinet with review:', error);
            setSuccessMessage(`❌ ${error.message || 'Failed'}`);
            setShowSuccessToast(true);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl pb-32">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold">{t.back}</span>
            </button>

            {/* 1. Header: Image Left, Info Right */}
            <div className="flex flex-row gap-6 mb-8 items-start">
                <div className="w-32 sm:w-48 shrink-0">
                    <ExpandableImage imageUrl={spirit.imageUrl} name={displayName} category={spirit.category} />
                </div>

                <div className="flex-1 min-w-0 pt-2">
                    <h1 className="text-2xl sm:text-4xl font-black mb-1 leading-tight text-foreground uppercase tracking-tight">
                        {displayName}
                    </h1>
                    {isEn ? (
                        spirit.name_en && spirit.name !== spirit.name_en && (
                            <p className="text-lg text-muted-foreground font-medium mb-3 italic">
                                {spirit.name}
                            </p>
                        )
                    ) : (
                        spirit.metadata?.name_en && (
                            <p className="text-lg text-muted-foreground font-medium mb-3 italic">
                                {spirit.metadata.name_en}
                            </p>
                        )
                    )}
                    {displayDescription && (
                        <p className="text-sm text-foreground/80 leading-relaxed max-w-xl mb-4 line-clamp-6">
                            {displayDescription}
                        </p>
                    )}
                    <div className="flex flex-col gap-1">
                        <p className="text-amber-500 font-bold tracking-wider">{displayDistillery}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-secondary rounded-md border border-border">
                                {spirit.abv}% ABV
                            </span>
                            {spirit.volume && (
                                <span className="px-2 py-0.5 bg-secondary rounded-md border border-border">
                                    {spirit.volume}ml
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Enhanced Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Category Card */}
                <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{t.classification}</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t.category}</span>
                            <span className="font-bold">{getLocalizedCategory(spirit.category)}</span>
                        </div>
                        {spirit.mainCategory && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.main}</span>
                                <span className="font-bold">{getLocalizedCategory(spirit.mainCategory)}</span>
                            </div>
                        )}
                        {spirit.subcategory && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.sub}</span>
                                <span className="font-bold text-amber-500">{getLocalizedCategory(spirit.subcategory)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Origin Card */}
                <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{t.origin}</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t.country}</span>
                            <span className="font-bold">{spirit.country || "Unknown"}</span>
                        </div>
                        {spirit.region && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.region}</span>
                                <span className="font-bold">{spirit.region}</span>
                            </div>
                        )}
                        {spirit.bottler && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t.bottler}</span>
                                <span className="font-bold">{spirit.bottler}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Flavor Profile with Dynamic Colors */}
            {((spirit.metadata as any)?.nose_tags || (spirit.metadata as any)?.palate_tags || (spirit.metadata as any)?.finish_tags) && (
                <div className="mb-10 p-6 bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        {t.flavor}
                    </h2>
                    {/* ... flavor sections ... */}
                    <div className="space-y-6">
                        {(spirit.metadata as any).nose_tags && (
                            <FlavorSection title="NOSE" tags={(spirit.metadata as any).nose_tags} />
                        )}
                        {(spirit.metadata as any).palate_tags && (
                            <FlavorSection title="PALATE" tags={(spirit.metadata as any).palate_tags} />
                        )}
                        {(spirit.metadata as any).finish_tags && (
                            <FlavorSection title="FINISH" tags={(spirit.metadata as any).finish_tags} />
                        )}
                    </div>
                </div>
            )}

            {/* DNA Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xs font-black tracking-[0.2em] text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-500 uppercase">Flavor DNA</h3>
                    <div className="h-px flex-1 bg-linear-to-r from-amber-500/20 to-transparent"></div>
                </div>
            </div>

            {/* AI Global Pairing Guide */}
            {(spirit.pairing_guide_en || spirit.pairing_guide_ko || (spirit.metadata as any)?.pairing_guide_en) && (
                <div className="mb-10 p-px rounded-3xl bg-linear-to-br from-purple-500/30 via-pink-500/30 to-orange-500/30">
                    <div className="bg-card/95 backdrop-blur-xl p-6 rounded-3xl h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-black text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500 uppercase tracking-widest flex items-center gap-1">
                                ✨ {isEn ? 'Pairing Guide' : '페어링 추천'}
                            </span>
                            <div className="h-px flex-1 bg-border"></div>
                        </div>
                        <p className="text-base text-card-foreground leading-relaxed font-medium">
                            {isEn
                                ? (spirit.pairing_guide_en || (spirit.metadata as any)?.pairing_guide_en)
                                : (spirit.pairing_guide_ko || (spirit.metadata as any)?.pairing_guide_ko || spirit.pairing_guide_en || (spirit.metadata as any)?.pairing_guide_en)}
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <button
                    onClick={handleCabinetAction}
                    disabled={isToggling || isLoadingStatus}
                    className={`flex-1 py-4 px-6 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isInCabinet
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                            : 'bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    <span>{isInCabinet ? '🗑️' : '🥃'}</span>
                    {isToggling ? t.processing : (isInCabinet ? t.remove_cabinet : t.add_cabinet)}
                </button>
                <button
                    onClick={handleWishlistAction}
                    disabled={isToggling || isLoadingStatus}
                    className={`flex-1 py-4 px-6 font-black rounded-2xl border-2 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isWishlist
                            ? 'bg-red-50 bg-opacity-20 hover:bg-red-100 text-red-600 border-red-200 shadow-red-500/10'
                            : 'bg-background hover:bg-secondary text-foreground hover:border-amber-600 border-primary shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    <span>{isWishlist ? '🗑️' : '🔖'}</span>
                    {isToggling ? t.processing : (isWishlist ? t.remove_wishlist : t.add_wishlist)}
                </button>
            </div>

            {/* Middle Ad - Between Info and Reviews */}
            <div className="mb-10">
                <AdSlot
                    slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || "0000000000"}
                    variant="responsive"
                    className="rounded-xl overflow-hidden shadow-sm bg-secondary/10"
                />
            </div>

            {/* ... ReviewSection (passed prop? No, ReviewSection might handle its own logic, or I need to pass lang) */}
            <ReviewSection spiritId={spirit.id} spiritName={spirit.name} spiritImageUrl={spirit.imageUrl} reviews={reviews} />

            {/* 5. Data Source */}
            <div className="mt-12 p-6 bg-secondary/20 rounded-2xl border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.source}</h4>
                        <p className="text-sm font-medium text-foreground">
                            {spirit.source === 'food_safety_korea' ? '식품의약품안전처 (공공데이터)' :
                                spirit.source === 'imported_food_maru' ? '수입식품정보마루' :
                                    spirit.source === 'online' ? 'online' :
                                        spirit.source === 'manual' ? t.source_manual : t.source_external}
                        </p>
                    </div>

                    <ModificationRequestButton
                        spiritId={spirit.id}
                        spiritName={spirit.name}
                    />
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                    {t.disclaimer}
                </p>
            </div>


            {/* Bottom Ad */}
            <div className="mt-12 mb-6">
                <AdSlot
                    slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || "0000000000"}
                    variant="responsive"
                    className="rounded-2xl overflow-hidden border border-border"
                />
            </div>

            {/* Review Modal */}
            <ReviewModal
                spirit={toFlavorSpirit(spirit)}
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleReviewSubmit}
            />

            {/* Success Toast */}
            <SuccessToast
                isVisible={showSuccessToast}
                message={successMessage}
                onClose={() => setShowSuccessToast(false)}
            />

            {/* Scroll Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-10 right-10 z-100 w-12 h-12 bg-amber-500 text-white rounded-full shadow-2xl shadow-amber-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all opacity-0 pointer-events-none group-[.scrolled]:opacity-100 group-[.scrolled]:pointer-events-auto"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
}

function FlavorSection({ title, tags }: { title: string; tags: string[] }) {
    return (
        <div>
            <h3 className="text-xs font-black text-muted-foreground mb-3 tracking-widest">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => {
                    const styles = getTagStyle(tag);
                    return (
                        <span
                            key={index}
                            className="text-xs px-3 py-1.5 rounded-full font-bold border transition-colors"
                            style={{
                                backgroundColor: 'var(--tag-bg)',
                                color: 'var(--tag-text)',
                                borderColor: 'var(--tag-border)'
                            } as any}
                        >
                            <style jsx>{`
                                span {
                                    --tag-bg: ${styles.light.bg};
                                    --tag-text: ${styles.light.text};
                                    --tag-border: ${styles.light.border};
                                }
                                :global(.dark) span {
                                    --tag-bg: ${styles.dark.bg};
                                    --tag-text: ${styles.dark.text};
                                    --tag-border: ${styles.dark.border};
                                }
                            `}</style>
                            {tag}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function ExpandableImage({ imageUrl, name, category }: { imageUrl: string | null; name: string; category: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const fallbackImage = getCategoryFallbackImage(category);

    return (
        <>
            <motion.div
                className="relative aspect-3/4 rounded-2xl overflow-hidden bg-secondary border border-border cursor-pointer shadow-md group"
                whileHover={{ y: -4 }}
                onClick={() => setIsExpanded(true)}
            >
                {imageUrl ? (
                    <img
                        src={getOptimizedImageUrl(imageUrl, 600)}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = fallbackImage;
                            target.classList.add('opacity-50');
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <img src={fallbackImage} className="w-2/3 h-2/3 object-contain opacity-20 grayscale" alt="placeholder" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                </div>
            </motion.div>

            {/* Full Screen Overlay */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                            onClick={() => setIsExpanded(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Expanded Image */}
                        <motion.div
                            className="max-w-2xl max-h-[80vh]"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {imageUrl ? (
                                <img
                                    src={getOptimizedImageUrl(imageUrl, 800, 85)}
                                    alt={name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            ) : (
                                <div className="w-96 h-96 flex items-center justify-center text-9xl bg-neutral-800 rounded-lg">
                                    🥃
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
