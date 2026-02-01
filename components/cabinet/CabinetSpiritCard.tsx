'use client';

import { motion } from "framer-motion";
import { Spirit } from "@/lib/utils/flavor-engine";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";

interface CabinetSpiritCardProps {
    spirit: Spirit;
    onReviewClick: (e: React.MouseEvent, spirit: Spirit) => void;
    onInfoClick: (e: React.MouseEvent, spirit: Spirit) => void;
}

export default function CabinetSpiritCard({
    spirit,
    onReviewClick,
    onInfoClick
}: CabinetSpiritCardProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="cursor-pointer group relative"
            onClick={(e) => onInfoClick(e, spirit)}
        >
            {spirit.userReview && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1">
                    <span>★</span> {spirit.userReview.ratingOverall.toFixed(1)}
                </div>
            )}

            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 p-[1px] shadow-sm transition-all duration-500 group-hover:shadow-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 group-hover:blur-[1px] group-hover:scale-[0.98] transition-all duration-500">
                    <img
                        src={getOptimizedImageUrl(spirit.imageUrl && spirit.imageUrl.trim() ? spirit.imageUrl : getCategoryFallbackImage(spirit.category), 240)}
                        alt={spirit.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!spirit.imageUrl || !spirit.imageUrl.trim() ? 'opacity-30 blur-sm' : 'opacity-100'} group-hover:opacity-90`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getCategoryFallbackImage(spirit.category);
                            target.classList.add('opacity-50');
                        }}
                    />

                    {/* Content Overlay (Always Visible, Top Layer) */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-2 sm:p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                            {/* Badge */}
                            <span className={`inline-block px-1.5 py-0.5 text-[8px] sm:text-[11px] font-bold text-white rounded-md uppercase shadow-sm backdrop-blur-md ${spirit.isWishlist ? 'bg-red-600/80' : 'bg-green-600/80'}`}>
                                {spirit.isWishlist ? '🔖' : '✅️'}
                            </span>
                            {/* Name */}
                            <p className="text-[10px] sm:text-sm font-bold text-white text-left leading-tight line-clamp-2 drop-shadow-md">
                                {spirit.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
