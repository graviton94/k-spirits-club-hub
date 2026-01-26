'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet, removeFromCabinet, checkCabinetStatus } from "@/app/actions/cabinet";
import { triggerLoginModal } from "@/lib/utils/spirit-adapters";
import SuccessToast from "./SuccessToast";

import { Bookmark, Plus, Minus, Loader2 } from "lucide-react";

interface ExploreCardProps {
  spirit: Spirit;
  onClick?: (spirit: Spirit) => void;
}

export function ExploreCard({ spirit, onClick }: ExploreCardProps) {
  const { user } = useAuth();
  const [isInCabinet, setIsInCabinet] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check cabinet status on mount
  useEffect(() => {
    if (user) {
      checkCabinetStatus(user.uid, spirit.id).then(({ isOwned, isWishlist }) => {
        setIsInCabinet(isOwned);
        setIsWishlist(isWishlist);
        setIsLoadingStatus(false);
      });
    } else {
      setIsLoadingStatus(false);
    }
  }, [user, spirit.id]);

  const handleCabinetAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      triggerLoginModal();
      return;
    }

    setIsToggling(true);
    try {
      if (isInCabinet) {
        // Remove from cabinet
        await removeFromCabinet(user.uid, spirit.id);
        setIsInCabinet(false);
        setSuccessMessage('🗑️ 술장에서 제거되었습니다.');
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

  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      triggerLoginModal();
      return;
    }

    setIsToggling(true);
    try {
      if (isWishlist) {
        // Remove from wishlist
        await removeFromCabinet(user.uid, spirit.id);
        setIsWishlist(false);
        setSuccessMessage('🗑️ 위시리스트에서 제거되었습니다.');
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
        setIsWishlist(true);
        setIsInCabinet(false); // Can't be both
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

  // Extract first 2 tags from tasting_note
  const tastingTags = spirit.metadata?.tasting_note
    ? spirit.metadata.tasting_note.split(',').slice(0, 2).map(tag => tag.trim())
    : [];

  const content = (
    <motion.div
      className="group flex gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm"
      whileHover={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={() => onClick?.(spirit)}
    >
      {/* Left: 80x80 Thumbnail */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
        {spirit.imageUrl ? (
          <img
            src={spirit.imageUrl}
            alt={spirit.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCategoryFallbackImage(spirit.category);
              target.classList.add('opacity-50');
            }}
          />
        ) : (
          <img
            src={getCategoryFallbackImage(spirit.category)}
            alt={spirit.name}
            className="w-full h-full object-cover opacity-50"
          />
        )}
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
          {spirit.name}
        </h3>

        <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <span className="uppercase tracking-widest opacity-70">{spirit.subcategory || spirit.category}</span>
          {spirit.abv > 0 && <span className="opacity-40">|</span>}
          {spirit.abv > 0 && <span className="opacity-70">{spirit.abv}%</span>}
        </div>

        {spirit.distillery && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">
            {spirit.distillery}
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
      <Link href={`/spirits/${spirit.id}`}>
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
