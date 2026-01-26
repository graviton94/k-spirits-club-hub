'use client';

import { useState, useEffect } from "react";
import SaveButton from "@/components/ui/SaveButton";
import ReviewSection from "@/components/ui/ReviewSection";
import GoogleAd from "@/components/ui/GoogleAd";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowLeft } from "lucide-react";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet } from "@/app/actions/cabinet";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { UserReview } from "@/lib/utils/flavor-engine";
import { toFlavorSpirit, triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "@/components/ui/SuccessToast";

import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { CATEGORY_NAME_MAP } from "@/lib/constants/categories";

interface SpiritDetailClientProps {
    spirit: Spirit;
    reviews: any[];
}

export default function SpiritDetailClient({ spirit, reviews }: SpiritDetailClientProps) {
    const router = useRouter();
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
        if (user && spirit.id) {
            import('@/app/actions/cabinet').then(({ checkCabinetStatus }) => {
                checkCabinetStatus(user.uid, spirit.id).then(status => {
                    setIsInCabinet(status.isOwned);
                    setIsWishlist(status.isWishlist);
                    setIsLoadingStatus(false);
                });
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
                setSuccessMessage('🗑️ 술장에서 제거되었습니다.');
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
                setSuccessMessage('🥃 술장에 저장되었습니다!');
            }
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to update cabinet:', error);
            setSuccessMessage(`❌ ${error.message || '작업 실패'}`);
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
                setSuccessMessage('🗑️ 위시리스트에서 제거되었습니다.');
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
                setSuccessMessage('🔖 위시리스트에 추가되었습니다!');
            }
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to update wishlist:', error);
            setSuccessMessage(`❌ ${error.message || '작업 실패'}`);
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
            setSuccessMessage('✅ 리뷰와 함께 술장에 저장되었습니다!');
            setShowSuccessToast(true);
        } catch (error: any) {
            console.error('Failed to add to cabinet with review:', error);
            setSuccessMessage(`❌ ${error.message || '리뷰 저장 실패'}`);
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
                <span className="text-sm font-bold">뒤로가기</span>
            </button>

            {/* 1. Header: Image Left, Info Right */}
            <div className="flex flex-row gap-6 mb-8 items-start">
                <div className="w-32 sm:w-48 flex-shrink-0">
                    <ExpandableImage imageUrl={spirit.imageUrl} name={spirit.name} category={spirit.category} />
                </div>

                <div className="flex-1 min-w-0 pt-2">
                    <h1 className="text-2xl sm:text-4xl font-black mb-1 leading-tight text-foreground uppercase tracking-tight">
                        {spirit.name}
                    </h1>
                    {spirit.metadata?.name_en && (
                        <p className="text-lg text-muted-foreground font-medium mb-3 italic">
                            {spirit.metadata.name_en}
                        </p>
                    )}
                    <div className="flex flex-col gap-1">
                        <p className="text-amber-500 font-bold tracking-wider">{spirit.distillery}</p>
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
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Classification</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Category</span>
                            <span className="font-bold">{CATEGORY_NAME_MAP[spirit.category] || spirit.category}</span>
                        </div>
                        {spirit.mainCategory && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Main</span>
                                <span className="font-bold">{CATEGORY_NAME_MAP[spirit.mainCategory] || spirit.mainCategory}</span>
                            </div>
                        )}
                        {spirit.subcategory && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Sub</span>
                                <span className="font-bold text-amber-500">{CATEGORY_NAME_MAP[spirit.subcategory] || spirit.subcategory}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Origin Card */}
                <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Origin & Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Country</span>
                            <span className="font-bold">{spirit.country || "Unknown"}</span>
                        </div>
                        {spirit.region && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Region</span>
                                <span className="font-bold">{spirit.region}</span>
                            </div>
                        )}
                        {spirit.bottler && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Bottler</span>
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
                        FLAVOR NOTES
                    </h2>
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

            {/* Action Buttons - Moved here from sticky bottom */}
            {/* Action Buttons - Moved here from sticky bottom */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <button
                    onClick={handleCabinetAction}
                    disabled={isToggling || isLoadingStatus}
                    className={`flex-1 py-4 px-6 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isInCabinet
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    <span>{isInCabinet ? '🗑️' : '🥃'}</span>
                    {isToggling ? '처리 중...' : (isInCabinet ? '내 술장에서 빼기' : '내 술장에 담기')}
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
                    {isToggling ? '처리 중...' : (isWishlist ? '위시리스트에서 제거' : '위시리스트에 담기')}
                </button>
            </div>

            {/* 4. Reviews Section */}
            <ReviewSection spiritId={spirit.id} spiritName={spirit.name} reviews={reviews} />

            {/* Bottom Ad */}
            {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT && (
                <div className="mt-12 mb-6">
                    <div className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-widest opacity-50">Advertisement</div>
                    <GoogleAd
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT}
                        format="auto"
                        responsive={true}
                        style={{ display: 'block', minHeight: '100px' }}
                        className="rounded-2xl overflow-hidden border border-border"
                    />
                </div>
            )}

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
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border cursor-pointer shadow-md group"
                whileHover={{ y: -4 }}
                onClick={() => setIsExpanded(true)}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
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
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
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
                                    src={imageUrl}
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
