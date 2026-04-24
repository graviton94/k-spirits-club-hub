'use client';

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { Spirit } from "@/lib/utils/flavor-engine";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";

interface CabinetSpiritCardProps {
    spirit: Spirit;
    onReviewClick: (e: React.MouseEvent, spirit: Spirit) => void;
    onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
    index?: number;
}

function CabinetSpiritCardComponent({
    spirit,
    onReviewClick,
    onInfoClick,
    index = 10
}: CabinetSpiritCardProps) {
    const pathname = usePathname() || "";
    const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
    const isEn = lang === 'en';

    // Image Error Fallback State
    const [imgSrc, setImgSrc] = useState(
        spirit.imageUrl && spirit.imageUrl.trim() ? getOptimizedImageUrl(spirit.imageUrl, 240) : getCategoryFallbackImage(spirit.category)
    );

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="cursor-pointer group relative"
            onClick={(e) => onInfoClick(e, spirit)}
        >
            {spirit.userReview && (
                <div className="absolute -top-2 -right-2 z-30 bg-primary text-primary-foreground text-[8px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.4)] flex items-center gap-1 border border-white/20">
                    <span className="text-[10px]">★</span> {spirit.userReview.ratingOverall.toFixed(1)}
                </div>
            )}

            <div className="relative aspect-2/3 rounded-[2rem] overflow-hidden bg-card/20 backdrop-blur-2xl border border-white/5 p-px shadow-2xl transition-all duration-700 group-hover:border-primary/40 group-hover:shadow-primary/20">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative h-full rounded-[1.8rem] overflow-hidden bg-black/40 group-hover:scale-[0.98] transition-all duration-700">
                    <Image
                        src={imgSrc}
                        alt={spirit.name}
                        fill
                        className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-20 blur-sm' : 'opacity-80'} group-hover:opacity-100`}
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 150px"
                        priority={index < 8}
                        onError={() => setImgSrc(getCategoryFallbackImage(spirit.category))}
                        unoptimized={true}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 sm:p-5 bg-linear-to-t from-black/90 via-black/20 to-transparent">
                        <div className="flex flex-col items-start gap-1.5 sm:gap-2">
                            {/* Badge */}
                            <span className={`inline-flex px-2 py-0.5 text-[8px] sm:text-[10px] font-black text-white rounded-lg uppercase shadow-xl backdrop-blur-3xl border border-white/10 ${spirit.isWishlist ? 'bg-rose-600/60' : 'bg-emerald-600/60'}`}>
                                {spirit.isWishlist ? '🔖' : '✅️'}
                            </span>
                            {/* Name */}
                            <p className="text-[10px] sm:text-xs font-black text-white/90 text-left leading-tight line-clamp-2 italic uppercase tracking-tight">
                                {spirit.name_en && isEn ? spirit.name_en : spirit.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const CabinetSpiritCard = memo(CabinetSpiritCardComponent);
export default CabinetSpiritCard;
