'use client';

import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { addToCabinet, removeFromCabinet, checkCabinetStatus } from "@/app/[lang]/actions/cabinet";
import { triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "./SuccessToast";

import { Bookmark, Plus, Minus, Loader2 } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import metadata from "@/lib/constants/spirits-metadata.json";
import { surfaces, chips } from "@/lib/design/patterns";

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

  const originLabel = [spirit.country, spirit.region].filter(Boolean).join(' · ');
  const profileFacts = [
    spirit.volume ? `${spirit.volume}ml` : null,
    originLabel || null,
    spirit.bottler || null,
  ].filter(Boolean) as string[];

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
    if (spirit.tastingNote) {
      return spirit.tastingNote.split(/[,\s#]+/).filter(Boolean).slice(0, 2);
    }
    const mergedTags = [
      ...(spirit.noseTags || []),
      ...(spirit.palateTags || []),
      ...(spirit.finishTags || []),
    ].filter(Boolean);
    if (mergedTags.length > 0) {
      return mergedTags.slice(0, 2);
    }
    return [];
  }, [spirit.tastingNote, spirit.noseTags, spirit.palateTags, spirit.finishTags]);

  const tastingPreview = useMemo(() => {
    if (spirit.tastingNote && spirit.tastingNote.trim().length > 0) return spirit.tastingNote;
    if (tastingTags.length > 0) return tastingTags.map((tag) => `#${tag}`).join(' ');
    return '';
  }, [spirit.tastingNote, tastingTags]);

  const content = (
    <motion.div
      ref={observerRef}
      className={`group flex gap-4 p-4 rounded-[2rem] ${surfaces.panelSoft} hover:bg-card/60 transition-all cursor-pointer shadow-lg relative overflow-hidden`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={() => onClick?.(spirit)}
    >
      {/* 🖼️ Thumbnail */}
      <div className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-muted/50 border border-border/50 relative shadow-inner group-hover:border-primary/30 transition-colors">
        <Image
          src={spirit.imageUrl && spirit.imageUrl.trim() ? getOptimizedImageUrl(spirit.imageUrl, 200) : getCategoryFallbackImage(spirit.category)}
          alt={displayName}
          fill
          className={`object-contain p-3 transition-transform duration-700 group-hover:scale-110 drop-shadow-xl ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-30 grayscale' : 'opacity-100'}`}
          sizes="96px"
          priority={priority}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getCategoryFallbackImage(spirit.category);
          }}
          unoptimized={true}
        />
      </div>

      {/* 📄 Intelligence Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <div className="flex items-center gap-2">
            <span className={`${chips.primarySm} !px-2 !py-0.5 !rounded-lg`}>
                {displayCategory}
            </span>
             {spirit.abv > 0 && (
              <span className="text-xs font-black text-foreground/30 uppercase italic">
                    {spirit.abv}% ABV
                </span>
            )}
        </div>

        <h3 className="font-black text-base md:text-lg text-foreground leading-[1.1] tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {displayName}
        </h3>

        <div className="flex items-center gap-2">
             {displayDistillery && (
                <p className="text-[11px] font-bold text-foreground/40 truncate">
                    {displayDistillery}
                </p>
            )}
            {displaySubCategory !== displayCategory && (
                <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <p className="text-xs font-black text-foreground/20 uppercase tracking-tighter">
                        {displaySubCategory}
                    </p>
                </>
            )}
        </div>

        {profileFacts.length > 0 && (
          <p className="text-[11px] font-bold text-foreground/35 truncate">
            {profileFacts.join(' · ')}
          </p>
        )}

        {tastingPreview && (
          <p className="text-xs text-foreground/55 line-clamp-1 italic">
            {tastingPreview}
          </p>
        )}

        {/* 🛡️ Expert Rating & Badges */}
        <div className="flex items-center gap-3">
          {spirit.aggregateRating && spirit.aggregateRating.ratingValue > 0 && (
            <div className={`flex items-center gap-1.5 ${chips.primarySm} !px-2 !py-1 !rounded-xl`}>
              <span className="text-xs">★</span>
              <span>{Number(spirit.aggregateRating.ratingValue).toFixed(1)}</span>
              {(spirit.aggregateRating.reviewCount ?? 0) > 0 && (
                 <span className="opacity-40 ml-0.5">({spirit.aggregateRating.reviewCount})</span>
              )}
            </div>
          )}
          {spirit.hasTastingNotes && (
             <div className="capsule-premium">
               {isEn ? 'NOTES' : '노트'}
             </div>
          )}
        </div>
      </div>

      {/* 🔮 Premium Action Command Bar */}
      <div className="flex items-center gap-2 relative z-10 pl-2">
        <button
          onClick={handleCabinetAction}
          disabled={isToggling || isLoadingStatus}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-75 disabled:opacity-50 
            ${isInCabinet
              ? 'bg-primary text-primary-foreground shadow-primary/20'
              : 'bg-muted/50 text-foreground border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
            }`}
          title={isInCabinet ? 'Remove from cabinet' : 'Add to cabinet'}
        >
          {isToggling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isInCabinet ? (
            <Minus className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={handleWishlistAction}
          disabled={isToggling || isLoadingStatus}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-2xl active:scale-75 disabled:opacity-50
            ${isWishlist
              ? 'bg-accent text-accent-foreground border-accent shadow-accent/20'
              : 'bg-muted/30 text-foreground/40 border-border/30 hover:bg-accent/10 hover:text-accent hover:border-accent/40'
            }`}
          title={isWishlist ? 'Remove from wishlist' : 'Save for later'}
        >
          {isToggling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Bookmark className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
          )}
        </button>
      </div>

      {/* Accent Glow */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-primary/30 via-primary/60 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
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
