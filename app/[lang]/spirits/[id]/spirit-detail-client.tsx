'use client';

import { useState, useEffect } from "react";
import SaveButton from "@/components/ui/SaveButton";
import ReviewSection from "@/components/ui/ReviewSection";
import GoogleAd from "@/components/ui/GoogleAd";
import ModificationRequestButton from "@/components/spirits/ModificationRequestButton";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowLeft, ShoppingBag, Activity } from "lucide-react";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { addToCabinet } from "@/app/[lang]/actions/cabinet";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { UserReview } from "@/lib/utils/flavor-engine";
import { toFlavorSpirit, triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "@/components/ui/SuccessToast";
import { Locale } from "@/i18n-config";

import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import { CATEGORY_NAME_MAP } from "@/lib/constants/categories";

interface SpiritDetailClientProps {
    spirit: Spirit;
    reviews: any[];
    relatedSpirits?: any[];
    lang: Locale;
    dict: any;
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
        nose: "향",
        palate: "맛",
        finish: "피니시",
        add_cabinet: "내 술장에 담기",
        remove_cabinet: "내 술장에서 빼기",
        add_wishlist: "위시리스트에 담기",
        remove_wishlist: "위시리스트에서 제거",
        processing: "처리 중...",
        source: "데이터 출처",
        source_manual: "운영진 수동 등록",
        source_external: "기타 외부 데이터",
        disclaimer: "본 데이터는 각 출처의 공공데이터 및 AI로 수집된 정보를 바탕으로 제공되며, 실제 제품의 정보와 차이가 있을 수 있습니다. 잘못된 정보가 있다면 위의 버튼을 통해 제보 부탁드립니다.",
        specs: "제품 스펙",
        tastingNote: "테이스팅 노트",
        pairing: "추천 페어링",
        reviews: "리뷰",
        writeReview: "리뷰 쓰기",
        noDescription: "설명이 없습니다.",
        whereToBuy: "구매처 찾기",
        buyInfo: "현재 본 사이트에서는 직접 판매를 하지 않습니다. 아래 링크를 통해 판매 정보를 확인해보세요.",
        searchNaver: "네이버 쇼핑 검색",
        searchGoogle: "구글 쇼핑 검색",
        searchWineSearcher: "Wine-Searcher",
        searchDailyshot: "데일리샷 검색",
        viewDetail: "상세보기",
        relatedSpirits: "이런 주류는 어때요?"
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
        nose: "NOSE",
        palate: "PALATE",
        finish: "FINISH",
        add_cabinet: "Add to Cabinet",
        remove_cabinet: "Remove",
        add_wishlist: "Add to Wishlist",
        remove_wishlist: "Remove",
        processing: "Processing...",
        source: "Data Source",
        source_manual: "Manual Entry",
        source_external: "External Data",
        disclaimer: "This data is provided based on public data and information from various sources include AI, and may differ from the actual product information. If there is incorrect information, please report it via the button above.",
        specs: "Specifications",
        tastingNote: "Tasting Notes",
        pairing: "Best Pairing",
        reviews: "Reviews",
        writeReview: "Write Review",
        noDescription: "No description available.",
        whereToBuy: "Where to Buy & Compare Prices",
        buyInfo: "We do not sell spirits directly. Check the links below for the best prices and availability.",
        searchNaver: "Search on Naver",
        searchGoogle: "Search on Google",
        searchWineSearcher: "Wine-Searcher",
        searchDailyshot: "Search on Dailyshot",
        viewDetail: "View Details",
        relatedSpirits: "You Might Also Like"
    }
};

import { formatSpiritFieldValue, localizeDataSource } from "@/lib/utils/localize-field";
import Link from "next/link"; // added for crawlable internal linking

export default function SpiritDetailClient({ spirit, reviews, relatedSpirits = [], lang, dict }: SpiritDetailClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isEn = lang === 'en';
    const t = isEn ? UI_TEXT.en : UI_TEXT.ko;

    // Helpers for localized display (Strict Schema)
    const displayName = isEn ? (spirit.metadata?.name_en || spirit.name_en || spirit.name) : spirit.name;
    const displayDistillery = isEn ? (spirit.metadata?.distillery_en || spirit.distillery) : spirit.distillery;

    const displayDescription = isEn
        ? (spirit.metadata?.description_en || spirit.metadata?.description_ko || dict?.noDescription || UI_TEXT.en.noDescription)
        : (spirit.metadata?.description_ko || spirit.metadata?.description_en || dict?.noDescription || UI_TEXT.ko.noDescription);

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
                await import('@/app/[lang]/actions/cabinet').then(({ removeFromCabinet }) =>
                    removeFromCabinet(user.uid, spirit.id)
                );
                setIsInCabinet(false);
                setSuccessMessage(t.remove_cabinet + ' 🗑️');
            } else {
                // Add to cabinet
                await import('@/app/[lang]/actions/cabinet').then(({ addToCabinet }) =>
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
                await import('@/app/[lang]/actions/cabinet').then(({ removeFromCabinet }) =>
                    removeFromCabinet(user.uid, spirit.id)
                );
                setIsWishlist(false);
                setSuccessMessage(t.remove_wishlist + ' 🗑️');
            } else {
                // Add to wishlist
                await import('@/app/[lang]/actions/cabinet').then(({ addToCabinet }) =>
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
            <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start">
                <div className="w-40 sm:w-56 shrink-0 mx-auto sm:mx-0">
                    <ExpandableImage imageUrl={spirit.imageUrl} name={displayName} category={spirit.category} />
                </div>

                <div className="flex-1 w-full min-w-0 pt-2">
                    <h1 className="text-2xl sm:text-4xl font-black mb-1 leading-tight text-foreground uppercase tracking-tight">
                        {displayName}
                    </h1>
                    {spirit.metadata?.name_en && (
                        <p className="text-lg text-muted-foreground font-medium mb-3 italic">
                            {spirit.metadata.name_en}
                        </p>
                    )}
                    <div className="flex flex-col gap-1 mb-6">
                        <p className="text-amber-500 font-bold tracking-wider">{displayDistillery}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-secondary rounded-md border border-border">
                                {spirit.abv}% ABV
                            </span>
                            {spirit.volume && (
                                <span className="hidden px-2 py-0.5 bg-secondary rounded-md border border-border">
                                    {spirit.volume}ml
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2. Enhanced Info Grid moved inside Right Header on larger screens */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {/* Category Card */}
                        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{dict?.specs || t.specs}</h3>
                            <dl className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <dt className="text-muted-foreground">{t.category}</dt>
                                    <dd className="font-bold">{formatSpiritFieldValue('category', spirit.category, lang)}</dd>
                                </div>
                                {spirit.mainCategory && (
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="text-muted-foreground">{t.main}</dt>
                                        <dd className="font-bold">{formatSpiritFieldValue('mainCategory', spirit.mainCategory, lang)}</dd>
                                    </div>
                                )}
                                {spirit.subcategory && (
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="text-muted-foreground">{t.sub}</dt>
                                        <dd className="font-bold text-amber-500">{formatSpiritFieldValue('subcategory', spirit.subcategory, lang)}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Origin Card */}
                        <div className="p-4 bg-card border border-border rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{t.origin}</h3>
                            <dl className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <dt className="text-muted-foreground">{t.country}</dt>
                                    <dd className="font-bold">{formatSpiritFieldValue('country', spirit.country, lang) || "Unknown"}</dd>
                                </div>
                                {spirit.region && (
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="text-muted-foreground">{t.region}</dt>
                                        <dd className="font-bold">{spirit.region}</dd>
                                    </div>
                                )}
                                {spirit.bottler && (
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="text-muted-foreground">{t.bottler}</dt>
                                        <dd className="font-bold">{spirit.bottler}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section (Full Width) */}
            {displayDescription && (
                <div className="mb-8 p-6 bg-secondary/10 border border-border rounded-3xl shadow-sm">
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed md:leading-loose whitespace-pre-wrap">
                        <FormattedText text={displayDescription} highlightClass="text-foreground" />
                    </p>
                </div>
            )}

            {/* In-Feed Ad: between Description and Tasting Notes */}
            {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT && (
                <div className="mb-8 flex justify-center w-full overflow-hidden">
                    <GoogleAd
                        client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT}
                        format="fluid"
                        responsive={true}
                        style={{ display: 'block', width: '100%' }}
                    />
                </div>
            )}

            {/* 3. Flavor Profile with Dynamic Colors */}
            {(spirit.nose_tags || spirit.palate_tags || spirit.finish_tags || (spirit.metadata as any)?.nose_tags) && (
                <div className="mb-10 p-6 bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        {dict?.tastingNote || t.tastingNote || t.flavor}
                    </h2>
                    <div className="space-y-6">
                        {spirit.nose_tags && spirit.nose_tags.length > 0 && (
                            <FlavorSection title={t.nose} tags={spirit.nose_tags} />
                        )}
                        {spirit.palate_tags && spirit.palate_tags.length > 0 && (
                            <FlavorSection title={t.palate} tags={spirit.palate_tags} />
                        )}
                        {spirit.finish_tags && spirit.finish_tags.length > 0 && (
                            <FlavorSection title={t.finish} tags={spirit.finish_tags} />
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
            {(spirit.metadata?.pairing_guide_en || spirit.metadata?.pairing_guide_ko) && (
                <div className="mb-10 p-6 rounded-3xl bg-secondary/20 border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            ✨ {dict?.pairing || (isEn ? 'Pairing Guide' : '페어링 추천')}
                        </span>
                        <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap">
                        <FormattedText text={isEn
                            ? (spirit.metadata?.pairing_guide_en || spirit.metadata?.pairing_guide_ko)
                            : (spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en)} />
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
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

            {/* Price Search / Buying Guide (회생 대책 - 수익성 연결고리) */}
            <div className="mb-12 p-6 rounded-3xl border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                <h3 className="text-sm font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    {t.whereToBuy}
                </h3>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {t.buyInfo}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a
                        href={`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(spirit.name.replace(/\([^)]*\)/g, '').trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-transparent border border-border hover:border-emerald-500 transition-colors text-xs font-bold"
                    >
                        <span className="text-emerald-500 font-black">N</span>
                        {t.searchNaver}
                    </a>
                    <a
                        href={`https://dailyshot.co/m/search/result?q=${encodeURIComponent(spirit.name.replace(/\([^)]*\)/g, '').trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-transparent border border-border hover:border-purple-500 transition-colors text-xs font-bold"
                    >
                        <Activity className="w-3.5 h-3.5 text-purple-500" />
                        {t.searchDailyshot}
                    </a>
                    <a
                        href={`https://www.wine-searcher.com/find/${encodeURIComponent((spirit.metadata?.name_en || spirit.name_en || spirit.name).replace(/\([^)]*\)/g, '').trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-transparent border border-border hover:border-amber-500 transition-colors text-xs font-bold"
                    >
                        <span className="text-amber-500 font-black">W</span>
                        {t.searchWineSearcher}
                    </a>
                </div>
            </div>

            {/* Related Spirits (Internal Linking P3 Requirements) */}
            {relatedSpirits && relatedSpirits.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        {t.relatedSpirits}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedSpirits.map((item: any) => {
                            const itemName = isEn ? (item.name_en || item.name) : item.name;
                            const fallbackImage = getCategoryFallbackImage(item.category);

                            return (
                                <Link
                                    href={`/${lang}/spirits/${item.id}`}
                                    key={item.id}
                                    className="group block p-3 bg-card border border-border hover:border-amber-500 rounded-2xl transition-all hover:-translate-y-1 shadow-sm"
                                >
                                    <div className="aspect-square bg-secondary rounded-xl mb-3 overflow-hidden flex items-center justify-center relative">
                                        {item.imageUrl ? (
                                            <img
                                                src={getOptimizedImageUrl(item.imageUrl, 200)}
                                                alt={itemName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = fallbackImage;
                                                    target.classList.add('opacity-50');
                                                }}
                                            />
                                        ) : (
                                            <img src={fallbackImage} className="w-1/2 h-1/2 object-contain opacity-20 grayscale" alt="placeholder" />
                                        )}
                                        {item.abv !== null && item.abv !== undefined && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                {item.abv}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-1">
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1 truncate">
                                            {formatSpiritFieldValue('subcategory', item.subcategory || item.category, lang)}
                                        </div>
                                        <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                                            {itemName}
                                        </h3>
                                        {item.distillery && (
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.distillery}</p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ... ReviewSection (passed prop? No, ReviewSection might handle its own logic, or I need to pass lang) */}
            {/* ... ReviewSection */}
            <ReviewSection
                spiritId={spirit.id}
                spiritName={spirit.name}
                spiritImageUrl={spirit.imageUrl}
                reviews={reviews}
                lang={lang}
                dict={dict}
            />

            {/* 5. Data Source */}
            <div className="mt-12 p-6 bg-secondary/20 rounded-2xl border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.source}</h4>
                        <p className="text-sm font-medium text-foreground">
                            {localizeDataSource(spirit.source, lang, t.source_manual, t.source_external)}
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

// Helper component to format basic markdown-style text 
// (e.g., **bold** and handles typoes like *&bold**)
function FormattedText({ text, highlightClass = "text-amber-600 dark:text-amber-500" }: { text?: string | null, highlightClass?: string }) {
    if (!text) return null;

    // Split by **bold** or *&bold** (typo tolerance)
    const parts = text.split(/(\*\*.*?\*\*|\*\&.*?\*\*)/g);

    return (
        <>
            {parts.map((part, i) => {
                if ((part.startsWith('**') || part.startsWith('*&')) && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return <strong key={i} className={`${highlightClass} font-bold`}>{content}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
