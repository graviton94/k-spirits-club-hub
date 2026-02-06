'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/[lang]/context/auth-context";
import { addToCabinet, removeFromCabinet } from "@/app/[lang]/actions/cabinet";
import CabinetSelectionModal from "./CabinetSelectionModal";
import ReviewModal from "@/components/cabinet/ReviewModal";
import { UserReview } from "@/lib/utils/flavor-engine";
import { toFlavorSpirit, triggerLoginModal } from "@/lib/utils/spirit-adapters";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";
import SuccessToast from "./SuccessToast";
import Image from 'next/image';
import metadata from "@/lib/constants/spirits-metadata.json";

interface SpiritCardProps {
  spirit: Spirit;
  onClick?: (spirit: Spirit) => void;
  onCabinetChange?: () => void;
  index?: number; // Added for LCP priority control
  size?: 'default' | 'compact';
  lang?: string;
}

export function SpiritCard({ spirit, onClick, onCabinetChange, index = 10, size = 'default', lang: propLang }: SpiritCardProps) {
  const pathname = usePathname() || "";
  const lang = propLang || (pathname.split('/')[1] === 'en' ? 'en' : 'ko');
  const { user } = useAuth();
  const [isInCabinet, setIsInCabinet] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isEn = lang === 'en';

  // Image Error Fallback State
  const [imgSrc, setImgSrc] = useState(
    spirit.imageUrl ? getOptimizedImageUrl(spirit.imageUrl, 200) : getCategoryFallbackImage(spirit.category)
  );

  // Sync image source with prop changes
  useEffect(() => {
    setImgSrc(spirit.imageUrl ? getOptimizedImageUrl(spirit.imageUrl, 200) : getCategoryFallbackImage(spirit.category));
  }, [spirit.imageUrl, spirit.category]);

  const observerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Intersection Observer to stagger status checks
  useEffect(() => {
    if (hasBeenVisible || !user) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasBeenVisible(true);
      }
    }, { rootMargin: '200px' });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [user, hasBeenVisible]);

  // Check cabinet status on mount
  useEffect(() => {
    if (user && hasBeenVisible) {
      fetch(`/api/cabinet/check?uid=${user.uid}&sid=${spirit.id}`)
        .then(res => res.json())
        .then(({ isOwned, isWishlist }) => {
          setIsInCabinet(isOwned || isWishlist);
        })
        .catch(err => console.error('Failed to check status:', err));
    }
  }, [user, spirit.id, hasBeenVisible]);

  // Generic handler for adding (cabinet or wishlist)
  const handleAdd = async (isWishlist: boolean, review?: any) => {
    if (!user) {
      triggerLoginModal();
      return;
    }
    setIsToggling(true);
    try {
      await addToCabinet(user.uid, spirit.id, {
        isWishlist,
        userReview: review,
        name: spirit.name,
        distillery: spirit.distillery ?? undefined,
        imageUrl: spirit.imageUrl || undefined,
        category: spirit.category,
        abv: spirit.abv
      });

      // Notify parent to refresh if needed
      onCabinetChange?.();

      if (isWishlist) setSuccessMessage(isEn ? '🔖 Added to wishlist!' : '🔖 위시리스트에 추가되었습니다!');
      else setSuccessMessage(isEn ? '🥃 Saved to cabinet!' : '🥃 술장에 저장되었습니다!');

      if (review) setSuccessMessage(isEn ? '✅ Saved with review!' : '✅ 리뷰와 함께 술장에 저장되었습니다!');

      setShowSuccessToast(true);

      // Update local state if adding to cabinet/wishlist (not just review update)
      if (!isInCabinet) setIsInCabinet(true);

    } catch (error: any) {
      console.error('Failed to add:', error);
      setSuccessMessage(`❌ ${error.message || '실패했습니다.'}`);
      setShowSuccessToast(true);
    } finally {
      setIsToggling(false);
    }
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      triggerLoginModal();
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

  const handleSelectCabinet = async () => {
    setShowSelectionModal(false);
    await handleAdd(false); // Add to cabinet
  };

  const handleSelectWishlist = async () => {
    setShowSelectionModal(false);
    await handleAdd(true); // Add to wishlist
  };

  const handleReviewSubmit = async (review: UserReview) => {
    setShowReviewModal(false);
    await handleAdd(false, review); // Add to cabinet with review
  };

  // Extract first 2-3 tags (Strict Schema)
  const tastingTags = (() => {
    // 1. Try Root Tasting Note (New hashtag-style)
    if (spirit.tasting_note) {
      return spirit.tasting_note
        .split(/[,\s#]+/)
        .filter(t => t.length > 0 && !t.startsWith('#')) // Handle both with/without #
        .slice(0, 3);
    }
    // 2. Strict Fallback to Root Nose Tags
    if (spirit.nose_tags && spirit.nose_tags.length > 0) {
      return spirit.nose_tags.slice(0, 3);
    }
    return [];
  })();

  const content = (
    <motion.div
      ref={observerRef}
      className="group flex gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm"
      whileHover={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={() => onClick?.(spirit)}
    >
      {/* Left: 80x80 Thumbnail */}
      <div className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border aspect-square">
        <Image
          src={imgSrc}
          alt={spirit.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="80px" // Optimized sizes for 80x80
          priority={index < 4} // LCP Boost
          onError={() => setImgSrc(getCategoryFallbackImage(spirit.category))}
        />
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
            {isEn ? (spirit.metadata?.name_en || spirit.name_en || spirit.name) : spirit.name}
          </h3>

          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <span>📂</span>
            <span>
              {isEn ? ((metadata as any).display_names_en?.[spirit.category] || spirit.category) : spirit.category}
              {spirit.subcategory && ` · ${isEn ? ((metadata as any).display_names_en?.[spirit.subcategory] || spirit.subcategory) : spirit.subcategory}`}
              {spirit.abv > 0 && ` · ${spirit.abv}%`}
            </span>
          </p>

          {spirit.distillery && (
            <p className="text-xs text-muted-foreground/80 mt-0.5 max-w-full truncate">
              🏭 {isEn ? (spirit.metadata?.distillery_en || spirit.distillery) : spirit.distillery}
            </p>
          )}
        </div>

        {tastingTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tastingTags.map((tag: string, index: number) => {
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
        className={`shrink-0 p-1 transition-colors ${isToggling
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
      <Link href={`/${lang}/spirits/${spirit.id}`}>
        {content}
      </Link>

      <CabinetSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectCabinet={handleSelectCabinet}
        onSelectWishlist={handleSelectWishlist}
      />

      <ReviewModal
        spirit={toFlavorSpirit(spirit)}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />

      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}
