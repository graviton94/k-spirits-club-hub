'use client';

import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet, removeFromCabinet, checkCabinetStatus } from "@/app/actions/cabinet";
import { triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "./SuccessToast";

import { Bookmark, Plus, Minus, Loader2 } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import metadata from "@/lib/constants/spirits-metadata.json";

interface ExploreCardProps {
  spirit: Spirit;
  onClick?: (spirit: Spirit) => void;
  onStatusChange?: (id: string, type: 'cabinet' | 'wishlist', status: boolean) => void;
  isEn?: boolean;
  isOwned?: boolean;
  isWishlisted?: boolean;
  priority?: boolean;
}

function ExploreCardComponent({
  spirit,
  onClick,
  onStatusChange,
  isEn: propIsEn,
  isOwned = false,
  isWishlisted = false,
  priority = false
}: ExploreCardProps) {
  const pathname = usePathname() || "";
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
  const isEn = propIsEn ?? (lang === 'en');

  // Helpers for localized display
  const displayName = isEn ? (spirit.name_en || spirit.name) : spirit.name;

  const getLocalizedCategory = (cat: string) => {
    if (!cat) return '';
    const displayNames = isEn ? (metadata as any).display_names_en : metadata.display_names;
    return displayNames[cat] || cat;
  };

  const displayCategory = getLocalizedCategory(spirit.category);
  const displaySubCategory = isEn
    ? (spirit.metadata?.subcategory_en || getLocalizedCategory(spirit.subcategory || '') || displayCategory)
    : (spirit.subcategory || displayCategory);

  const displayDistillery = isEn
    ? (spirit.metadata?.distillery_en || spirit.distillery)
    : spirit.distillery;

  const { user } = useAuth();
  const [isInCabinet, setIsInCabinet] = useState(isOwned);
  const [isWishlist, setIsWishlist] = useState(isWishlisted);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Update internal state if props change (e.g. after batch fetch in parent)
  useEffect(() => {
    setIsInCabinet(isOwned);
    setIsWishlist(isWishlisted);
  }, [isOwned, isWishlisted]);

  const observerRef = useRef<HTMLDivElement>(null);

  const handleCabinetAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      triggerLoginModal();
      return;
    }

    // Optimistic UI Update
    const previousState = isInCabinet;
    const previousWishlist = isWishlist;
    setIsInCabinet(!isInCabinet);
    if (!isInCabinet) setIsWishlist(false);
    setIsToggling(true);

    try {
      if (previousState) {
        // Remove from cabinet
        await removeFromCabinet(user.uid, spirit.id);
        setSuccessMessage(isEn ? '🗑️ Removed from cabinet.' : '🗑️ 술장에서 제거되었습니다.');
      } else {
        // Add to cabinet
        await addToCabinet(user.uid, spirit.id, {
          isWishlist: false,
          name: spirit.name,
          distillery: spirit.distillery ?? undefined,
          imageUrl: spirit.imageUrl || undefined,
          category: spirit.category,
          abv: spirit.abv
        });
        setSuccessMessage(isEn ? '🥃 Saved to cabinet!' : '🥃 술장에 저장되었습니다!');
      }
      onStatusChange?.(spirit.id, 'cabinet', !previousState);
      setShowSuccessToast(true);
    } catch (error: any) {
      // Rollback on error
      setIsInCabinet(previousState);
      setIsWishlist(previousWishlist);
      console.error('Failed to update cabinet:', error);
      setSuccessMessage(`❌ ${error.message || (isEn ? 'Action failed' : '작업 실패')}`);
      setShowSuccessToast(true);
    } finally {
      setIsToggling(false);
    }
  };

  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      triggerLoginModal();
      return;
    }

    // Optimistic UI Update
    const previousState = isWishlist;
    const previousCabinet = isInCabinet;
    setIsWishlist(!isWishlist);
    if (!isWishlist) setIsInCabinet(false);
    setIsToggling(true);

    try {
      if (previousState) {
        // Remove from wishlist
        await removeFromCabinet(user.uid, spirit.id);
        setSuccessMessage(isEn ? '🗑️ Removed from wishlist.' : '🗑️ 위시리스트에서 제거되었습니다.');
      } else {
        // Add to wishlist
        await addToCabinet(user.uid, spirit.id, {
          isWishlist: true,
          name: spirit.name,
          distillery: spirit.distillery ?? undefined,
          imageUrl: spirit.imageUrl || undefined,
          category: spirit.category,
          abv: spirit.abv
        });
        setSuccessMessage(isEn ? '🔖 Added to wishlist!' : '🔖 위시리스트에 추가되었습니다!');
      }
      onStatusChange?.(spirit.id, 'wishlist', !previousState);
      setShowSuccessToast(true);
    } catch (error: any) {
      // Rollback on error
      setIsWishlist(previousState);
      setIsInCabinet(previousCabinet);
      console.error('Failed to update wishlist:', error);
      setSuccessMessage(`❌ ${error.message || (isEn ? 'Action failed' : '작업 실패')}`);
      setShowSuccessToast(true);
    } finally {
      setIsToggling(false);
    }
  };

  // Extract first 2 tags (Strict Schema) - Memoized for performance
  const tastingTags = useMemo(() => {
    if (spirit.tasting_note) {
      return spirit.tasting_note.split(/[,\s#]+/).filter(Boolean).slice(0, 2);
    }
    if (spirit.nose_tags && spirit.nose_tags.length > 0) {
      return spirit.nose_tags.slice(0, 2);
    }
    return [];
  }, [spirit.tasting_note, spirit.nose_tags]);

  const content = (
    <motion.div
      ref={observerRef}
      className="group flex gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm"
      whileHover={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={() => onClick?.(spirit)}
    >
      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border relative" style={{ aspectRatio: '1/1' }}>
        <Image
          src={spirit.imageUrl && spirit.imageUrl.trim() ? getOptimizedImageUrl(spirit.imageUrl, 120, 60) : getCategoryFallbackImage(spirit.category)}
          alt={displayName}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-110 ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-50 grayscale' : 'opacity-100'}`}
          sizes="80px"
          priority={priority}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getCategoryFallbackImage(spirit.category);
          }}
        />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
        <h3 className="font-black text-sm text-foreground leading-tight line-clamp-2 mb-1">
          <span className="mr-1 text-base inline-block align-middle">
            {
              {
                "소주": "🍶", "위스키": "🥃", "맥주": "🍺", "일반증류주": "🍸",
                "기타 주류": "🥂", "탁주": "🥛", "약주": "🍵", "청주": "🍶",
                "과실주": "🍾", "브랜디": "🍷", "리큐르": "🍹"
              }[spirit.category] || "🍾"
            }
          </span>
          {displayName}
        </h3>

        <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <span className="uppercase tracking-widest opacity-70">{displaySubCategory}</span>
          {spirit.abv > 0 && <span className="opacity-40">|</span>}
          {spirit.abv > 0 && <span className="opacity-70">{spirit.abv}%</span>}
        </div>

        {displayDistillery && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">
            {displayDistillery}
          </p>
        )}
      </div>

      {/* Right: Two Action Buttons */}
      <div className="flex items-center gap-1.5 relative z-10 pl-1">
        <button
          onClick={handleCabinetAction}
          disabled={isToggling || isLoadingStatus}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-50 
            ${isInCabinet
              ? 'bg-rose-500 text-white shadow-rose-500/20'
              : 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600'
            }`}
          title={isInCabinet ? '술장에서 제거' : '술장에 추가'}
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isInCabinet ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={handleWishlistAction}
          disabled={isToggling || isLoadingStatus}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border shadow-lg active:scale-90 disabled:opacity-50
            ${isWishlist
              ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20'
              : 'bg-slate-800 text-white border-white/10 hover:bg-slate-700 shadow-black/20'
            }`}
          title={isWishlist ? '위시리스트 삭제' : '위시리스트 담기'}
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className={`w-4 h-4 ${isWishlist ? 'fill-current' : ''}`} />
          )}
        </button>
      </div>
    </motion.div>
  );

  if (onClick) return (
    <>
      {content}
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );

  return (
    <>
      <Link href={`/${lang}/spirits/${spirit.id}`}>
        {content}
      </Link>
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}

export const ExploreCard = memo(ExploreCardComponent);
