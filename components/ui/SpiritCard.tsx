'use client';

import { motion } from "framer-motion";
import { Heart, ExternalLink, Sparkles, PlusCircle } from "lucide-react";
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
  spirit: any; // Using any to support both DB Spirits and AI Discovery objects
  onClick?: (spirit: any) => void;
  onCabinetChange?: () => void;
  index?: number;
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

  const isAiDiscovery = spirit.isAiDiscovery === true;
  const matchRate = spirit.score ? Math.round(spirit.score * 100) : 0;

  const localizedName = isEn ? (spirit.name_en || spirit.metadata?.name_en || spirit.name) : spirit.name;
  const localizedDistillery = isEn ? (spirit.metadata?.distillery_en || spirit.distillery) : spirit.distillery;
  const localizedCategory = isEn ? ((metadata as any).display_names_en?.[spirit.category] || spirit.category) : spirit.category;
  const matchReason = spirit.analysisReason || spirit.reason;
  
  const [imgSrc, setImgSrc] = useState(
    spirit.imageUrl ? getOptimizedImageUrl(spirit.imageUrl, 200) : getCategoryFallbackImage(spirit.category)
  );

  useEffect(() => {
    setImgSrc(spirit.imageUrl ? getOptimizedImageUrl(spirit.imageUrl, 200) : getCategoryFallbackImage(spirit.category));
  }, [spirit.imageUrl, spirit.category]);

  const observerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (hasBeenVisible || !user || !spirit.id) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setHasBeenVisible(true);
    }, { rootMargin: '200px' });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [user, hasBeenVisible, spirit.id]);

  useEffect(() => {
    if (user && hasBeenVisible && spirit.id) {
      fetch(`/api/cabinet/check?uid=${user.uid}&sid=${spirit.id}`)
        .then(res => res.json())
        .then(({ isOwned, isWishlist }) => setIsInCabinet(isOwned || isWishlist))
        .catch(err => console.error('Failed to check status:', err));
    }
  }, [user, spirit.id, hasBeenVisible]);

  const handleAdd = async (isWishlist: boolean, review?: any) => {
    if (!user) { triggerLoginModal(); return; }
    if (isAiDiscovery) return; // Cannot add external discovery yet (needs automated creation)
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
      onCabinetChange?.();
      setSuccessMessage(isEn ? (isWishlist ? '🔖 Added to wishlist!' : '🥃 Saved to cabinet!') : (isWishlist ? '🔖 위시리스트에 추가되었습니다!' : '🥃 술장은 저장되었습니다!'));
      setShowSuccessToast(true);
      if (!isInCabinet) setIsInCabinet(true);
    } catch (error: any) {
      setSuccessMessage(`❌ Error`);
      setShowSuccessToast(true);
    } finally {
      setIsToggling(false);
    }
  };

  const tastingTags = (() => {
    if (spirit.tasting_note) return spirit.tasting_note.split(/[,\s#]+/).filter((t: string) => t.length > 0 && !t.startsWith('#')).slice(0, 3);
    if (spirit.nose_tags && spirit.nose_tags.length > 0) return spirit.nose_tags.slice(0, 3);
    if (spirit.tastingNotes) return spirit.tastingNotes.split(/[,\s#]+/).slice(0, 3);
    return [];
  })();

  const content = (
    <motion.div
      ref={observerRef}
      className={`group flex flex-col sm:flex-row gap-6 p-5 sm:p-6 rounded-[32px] bg-card border border-border hover:bg-secondary/40 transition-all cursor-pointer shadow-sm relative overflow-hidden h-full ${isAiDiscovery ? 'border-amber-500/30' : ''}`}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => {
          if (isAiDiscovery) window.open(spirit.externalSearchUrl, '_blank');
          else if (onClick) onClick(spirit);
      }}
    >
      {/* Background Glow for Discovery */}
      {isAiDiscovery && <div className="absolute inset-x-0 top-0 h-40 bg-amber-500/5 -z-10 animate-pulse sm:h-full sm:w-40" />}

      {/* Thumbnail */}
      <div className="relative shrink-0 w-full h-52 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted border border-border shadow-inner">
        <Image
          src={imgSrc}
          alt={`Thumbnail for ${localizedName}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, 128px"
          priority={index < 4}
          onError={() => setImgSrc(getCategoryFallbackImage(spirit.category))}
          unoptimized={true}
        />
        {isAiDiscovery && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-8 h-8 text-white" />
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                  {matchRate > 0 && (
                      <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-full shadow-lg shadow-amber-500/20">
                          {matchRate}% MATCH
                      </span>
                  )}
                  {isAiDiscovery && (
                      <span className="text-[10px] font-black bg-foreground text-background px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> AI DISCOVERY
                      </span>
                  )}
              </div>
              
              {!isAiDiscovery ? (
                  <button
                    className={`p-1 transition-colors ${isInCabinet ? 'text-red-500' : 'text-muted-foreground/30 hover:text-red-500'}`}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); 
                        if (!user) triggerLoginModal();
                        else setShowSelectionModal(true);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${isInCabinet ? 'fill-current' : ''}`} />
                  </button>
              ) : (
                  <div className="p-1 text-muted-foreground/20">
                      <ExternalLink className="w-4 h-4" />
                  </div>
              )}
          </div>

          <h3 className="font-black text-foreground text-xl leading-tight mb-2">
            {localizedName}
          </h3>

          <p className="text-[11px] font-black text-muted-foreground flex items-center gap-1 uppercase tracking-widest opacity-70 mb-1">
            <span>{isEn ? "Category" : "분류"}</span>
            <span className="text-foreground/80">
              {localizedCategory}
              {spirit.subcategory && ` · ${isEn ? ((metadata as any).display_names_en?.[spirit.subcategory] || spirit.subcategory) : spirit.subcategory}`}
            </span>
          </p>

          {localizedDistillery && (
            <p className="text-[11px] text-muted-foreground/60 mb-4 max-w-full truncate font-bold">
              🏭 {localizedDistillery}
            </p>
          )}

          {matchReason && (
              <p className="text-[12px] text-foreground/90 leading-relaxed font-medium bg-secondary/30 p-4 rounded-2xl italic border border-secondary/50">
                  "{matchReason}"
              </p>
          )}
        </div>

        {tastingTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {tastingTags.map((tag: string, i: number) => {
              const styles = getTagStyle(tag);
              return (
                <span key={i} className="text-[10px] px-3 py-1 rounded-full font-black border transition-colors whitespace-nowrap opacity-90"
                  style={{ backgroundColor: styles.light.bg, color: styles.light.text, borderColor: styles.light.border }}>
                  #{tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (isAiDiscovery) return content;

  return (
    <>
      {onClick ? content : <Link href={`/${lang}/spirits/${spirit.id}`}>{content}</Link>}
      <CabinetSelectionModal isOpen={showSelectionModal} onClose={() => setShowSelectionModal(false)} onSelectCabinet={() => handleAdd(false)} onSelectWishlist={() => handleAdd(true)} />
      <ReviewModal spirit={toFlavorSpirit(spirit)} isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} onSubmit={(review) => handleAdd(false, review)} />
      <SuccessToast isVisible={showSuccessToast} message={successMessage} onClose={() => setShowSuccessToast(false)} />
    </>
  );
}
