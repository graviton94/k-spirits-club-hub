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

import { Bookmark } from "lucide-react";

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
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
        <div>
          <h3 className="font-bold text-foreground leading-tight line-clamp-2 mb-1">
            <span className="mr-1.5 text-lg inline-block align-middle">
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

          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <span>📂</span>
            <span>
              {spirit.category}
              {spirit.subcategory && ` · ${spirit.subcategory}`}
              {spirit.abv > 0 && ` · ${spirit.abv}%`}
            </span>
          </p>

          {spirit.distillery && (
            <p className="text-xs text-muted-foreground/80 mt-0.5 max-w-full truncate">
              🏭 {spirit.distillery}
            </p>
          )}
        </div>

        {tastingTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tastingTags.map((tag, index) => {
              const styles = getTagStyle(tag);
              return (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors whitespace-nowrap"
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
                  #{tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Two Action Buttons */}
      <div className="flex flex-col gap-2 justify-center relative z-10">
        <button
          onClick={handleCabinetAction}
          disabled={isToggling || isLoadingStatus}
          className={`px-5 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-white
            ${isInCabinet
              ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
            }`}
        >
          {isInCabinet ? '➖술장 빼기' : '➕술장 담기'}
        </button>
        <button
          onClick={handleWishlistAction}
          disabled={isToggling || isLoadingStatus}
          className={`px-5 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-white flex items-center justify-center gap-1.5
            ${isWishlist
              ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
            }`}
        >
          <Bookmark className={`w-4 h-4 ${isWishlist ? 'fill-current' : ''}`} />
          <span className="text-xs font-bold">
            {isWishlist ? '위시 빼기' : '위시 담기'}
          </span>
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
