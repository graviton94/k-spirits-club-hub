'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
metadata ?: {
  tasting_note?: string;
  [key: string]: any;
};
}

interface SpiritCardProps {
  spirit: Spirit;
}

export function SpiritCard({ spirit }: SpiritCardProps) {
  // Extract first 2 tags from tasting_note
  const tastingTags = spirit.metadata?.tasting_note
    ? spirit.metadata.tasting_note.split(',').slice(0, 2).map(tag => tag.trim())
    : [];

  return (
    <Link href={`/spirits/${spirit.id}`}>
      <motion.div
        className="group flex gap-3 p-3 rounded-lg bg-neutral-800/50 border border-white/5 hover:bg-neutral-800 hover:border-white/10 transition-all"
        whileHover={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Left: 80x80 Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-900">
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
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top: Name */}
          <div>
            <h3 className="font-bold text-white leading-tight line-clamp-2 mb-1">
              {spirit.name}
            </h3>

            {/* Subcategory + ABV */}
            <p className="text-sm text-gray-400">
              {spirit.subcategory || spirit.category} · {spirit.abv}°
            </p>
          </div>

          {/* Bottom: Tags */}
          {tastingTags.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {tastingTags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Heart Icon */}
        <button
          className="flex-shrink-0 p-1 text-white/30 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to wishlist
          }}
        >
          <Heart className="w-5 h-5" />
        </button>
      </motion.div>
    </Link>
  );
}
