'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { getCategoryFallbackImage } from "@/lib/utils/image-fallback";
import { Spirit } from "@/lib/db/schema";
import { getTagStyle } from "@/lib/constants/tag-styles";

interface SpiritCardProps {
  spirit: Spirit;
  onClick?: (spirit: Spirit) => void;
}

export function SpiritCard({ spirit, onClick }: SpiritCardProps) {
  // Extract first 2 tags from tasting_note
  const tastingTags = spirit.metadata?.tasting_note
    ? spirit.metadata.tasting_note.split(',').slice(0, 2).map(tag => tag.trim())
    : [];

  const content = (
    <motion.div
      className="group flex gap-3 p-3 rounded-lg bg-card border border-border hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer shadow-sm"
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
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top: Name */}
        <div>
          <h3 className="font-bold text-foreground leading-tight line-clamp-2 mb-1">
            {spirit.name}
          </h3>

          {/* Subcategory + ABV */}
          <p className="text-sm text-muted-foreground">
            {spirit.subcategory || spirit.category} · {spirit.abv}°
          </p>
        </div>

        {/* Bottom: Tags */}
        {tastingTags.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {tastingTags.map((tag, index) => {
              const styles = getTagStyle(tag);
              return (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors"
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
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Heart Icon */}
      <button
        className="flex-shrink-0 p-1 text-muted-foreground/30 hover:text-red-500 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // TODO: Add to wishlist
        }}
      >
        <Heart className="w-5 h-5" />
      </button>
    </motion.div>
  );

  if (onClick) return content;

  return (
    <Link href={`/spirits/${spirit.id}`}>
      {content}
    </Link>
  );
}
