'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet, removeFromCabinet, checkCabinetStatus } from "@/app/actions/cabinet";
import CabinetSelectionModal from "./CabinetSelectionModal";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { UserReview } from "@/lib/utils/flavor-engine";

interface SpiritCardProps {
  spirit: Spirit;
  onClick?: (spirit: Spirit) => void;
  onCabinetChange?: () => void;
}

export function SpiritCard({ spirit, onClick, onCabinetChange }: SpiritCardProps) {
  const { user } = useAuth();
  const [isInCabinet, setIsInCabinet] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Check cabinet status on mount
  useEffect(() => {
    if (user) {
      checkCabinetStatus(user.uid, spirit.id).then(({ isOwned, isWishlist }) => {
        setIsInCabinet(isOwned || isWishlist);
      });
    }
  }, [user, spirit.id]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      // Trigger login modal
      const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
      if (loginButton) loginButton.click();
      return;
    }

    // If already in cabinet, remove it
    if (isInCabinet) {
      setIsToggling(true);
      try {
        await removeFromCabinet(user.uid, spirit.id);
        setIsInCabinet(false);
        onCabinetChange?.();
      } catch (error) {
        console.error('Failed to remove from cabinet:', error);
      } finally {
        setIsToggling(false);
      }
    } else {
      // Show selection modal for cabinet or wishlist
      setShowSelectionModal(true);
    }
  };

  const handleSelectCabinet = () => {
    // Open review modal for cabinet (owned spirits)
    setShowReviewModal(true);
  };

  const handleSelectWishlist = async () => {
    // Add to wishlist immediately without review
    if (!user) return;
    
    setIsToggling(true);
    try {
      await addToCabinet(user.uid, spirit.id, { isWishlist: true });
      setIsInCabinet(true);
      onCabinetChange?.();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
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
        userReview: review
      });
      setIsInCabinet(true);
      onCabinetChange?.();
    } catch (error) {
      console.error('Failed to add to cabinet with review:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해주세요.');
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
              // On error, use category fallback image
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

      {/* Right: Content */}
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

      {/* Heart Icon */}
      <button
        className={`flex-shrink-0 p-1 transition-colors ${
          isToggling 
            ? 'opacity-50 cursor-wait' 
            : isInCabinet 
              ? 'text-red-500' 
              : 'text-muted-foreground/30 hover:text-red-500'
        }`}
        onClick={handleHeartClick}
        disabled={isToggling}
      >
        <Heart className={`w-5 h-5 ${isInCabinet ? 'fill-current' : ''}`} />
      </button>
    </motion.div>
  );

  if (onClick) return content;

  return (
    <>
      <Link href={`/spirits/${spirit.id}`}>
        {content}
      </Link>
      
      <CabinetSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectCabinet={handleSelectCabinet}
        onSelectWishlist={handleSelectWishlist}
      />
      
      <ReviewModal
        spirit={{
          ...spirit,
          isWishlist: false,
          userReview: (spirit as any).userReview
        } as any}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}
