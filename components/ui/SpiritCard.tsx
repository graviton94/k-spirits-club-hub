'use client';

import { motion } from "framer-motion";
import { Heart, ExternalLink, Sparkles, PlusCircle, ShieldCheck } from "lucide-react";
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
import NextImage from 'next/image';
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

  const localizedName = isEn ? (spirit.nameEn || spirit.metadata?.nameEn || spirit.name) : spirit.name;
  const localizedDistillery = isEn ? (spirit.metadata?.distilleryEn || spirit.distillery) : spirit.distillery;
  const localizedCategory = isEn ? ((metadata as any).display_names_en?.[spirit.category] || spirit.category) : spirit.category;
  const matchReason = spirit.analysisReason || spirit.reason;
  const originLabel = [spirit.country, spirit.region].filter(Boolean).join(' · ');
  const profileFacts = [
    spirit.volume ? `${spirit.volume}ml` : null,
    originLabel || null,
    spirit.bottler || null,
  ].filter(Boolean) as string[];
  
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
      className={`group flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-[40px] bg-card border border-border/50 hover:bg-primary/5 transition-all cursor-pointer shadow-xl relative overflow-hidden h-full ${isAiDiscovery ? 'border-primary/40' : ''}`}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => {
          if (isAiDiscovery) window.open(spirit.externalSearchUrl, '_blank');
          else if (onClick) onClick(spirit);
      }}
    >
      {/* Background Glow Layer */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-linear-to-br ${isAiDiscovery ? 'from-accent/5 to-transparent' : 'from-primary/5 to-transparent'}`} />

      {/* 📸 Thumbnail Component */}
      <div className="relative shrink-0 w-full h-[240px] sm:w-[160px] sm:h-full min-h-[160px] rounded-[32px] overflow-hidden bg-muted/50 border border-border/50 shadow-inner group-hover:border-primary/30 transition-all duration-500">
        <NextImage
          src={imgSrc}
          alt={`Thumbnail for ${localizedName}`}
          fill
          className="object-contain p-6 transition-transform duration-1000 group-hover:scale-110 drop-shadow-2xl"
          sizes="(max-width: 640px) 100vw, 160px"
          priority={index < 4}
          onError={() => setImgSrc(getCategoryFallbackImage(spirit.category))}
          unoptimized={true}
        />
        {isAiDiscovery && (
            <div className="absolute inset-0 bg-accent/10 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-8 h-8 text-accent" />
            </div>
        )}
      </div>
      
      {/* 📄 Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                  {matchRate > 0 && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-black rounded-full shadow-lg shadow-primary/20 uppercase tracking-widest">
                          {matchRate}% MATCH
                      </span>
                  )}
                  {isAiDiscovery && (
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-accent/20 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> DISCOVERY
                      </span>
                  )}
              </div>
              
              {!isAiDiscovery ? (
                  <button
                    className={`p-2 rounded-2xl transition-all active:scale-75 ${isInCabinet ? 'bg-primary/10 text-primary' : 'text-foreground/20 hover:text-primary hover:bg-primary/5'}`}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); 
                        if (!user) triggerLoginModal();
                        else setShowSelectionModal(true);
                    }}
                  >
                    <Heart className={`w-5 h-5 ${isInCabinet ? 'fill-current' : ''}`} />
                  </button>
              ) : (
                  <div className="p-2 text-foreground/20">
                      <ExternalLink className="w-5 h-5" />
                  </div>
              )}
          </div>

          <h3 className="font-black text-foreground text-2xl md:text-3xl leading-[1.1] mb-3 tracking-tighter group-hover:text-primary transition-colors duration-500">
            {localizedName}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 bg-muted rounded-lg text-xs font-black text-foreground/40 uppercase tracking-widest border border-border/50">
               {localizedCategory}
            </span>
            {spirit.subcategory && (
               <span className="text-xs font-bold text-foreground/60 uppercase tracking-tighter italic">
                 {isEn ? ((metadata as any).display_names_en?.[spirit.subcategory] || spirit.subcategory) : spirit.subcategory}
               </span>
            )}
          </div>

          {localizedDistillery && (
            <p className="text-[11px] font-black text-foreground/30 mb-4 flex items-center gap-1.5 uppercase tracking-widest">
              <span className="opacity-40 italic">DISTILLERY</span>
              <span className="text-foreground/60">{localizedDistillery}</span>
            </p>
          )}

          {profileFacts.length > 0 && (
            <p className="text-[11px] font-bold text-foreground/40 mb-4 truncate">
              {profileFacts.join(' · ')}
            </p>
          )}

          {/* 🛡️ Performance / Rating */}
          <div className="flex items-center gap-3 mb-6">
            {spirit.aggregateRating && spirit.aggregateRating.ratingValue > 0 && (
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/5 text-primary text-xs font-black border border-primary/20 shadow-sm"
                title={isEn ? "Expert analysis score" : "분석 점수"}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-black">{Number(spirit.aggregateRating.ratingValue).toFixed(1)}</span>
                <span className="opacity-40 font-bold text-xs">
                  / 5.0
                </span>
              </div>
            )}
            {spirit.hasTastingNotes && (
              <div className="capsule-premium border-primary/40 bg-primary/10 shadow-lg shadow-primary/5">
                {isEn ? 'PREMIUM DATA' : '시음노트 포함'}
              </div>
            )}
          </div>

          {matchReason && (
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                <p className="text-[13px] text-foreground/80 leading-relaxed font-medium pl-2 italic">
                    "{matchReason}"
                </p>
              </div>
          )}

          {!matchReason && spirit.tastingNote && (
            <p className="text-[13px] text-foreground/70 leading-relaxed font-medium italic line-clamp-2">
              "{spirit.tastingNote}"
            </p>
          )}
        </div>

        {/* 🏷️ Flavor Tags */}
        {tastingTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 border-t border-border/50 pt-6">
            {tastingTags.map((tag: string, i: number) => {
              return (
                <span key={i} className="text-xs px-3 py-1.5 rounded-xl font-black bg-muted/50 text-foreground/60 border border-border/30 hover:border-primary/40 hover:text-primary transition-all uppercase tracking-tighter">
                  #{tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 💎 Bottom Highlight */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_30px_rgba(var(--primary),0.6)]" />
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
