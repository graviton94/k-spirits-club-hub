'use client';

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Spirit {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  distillery: string | null;
}

interface SpiritCardProps {
  spirit: Spirit;
}

export function SpiritCard({ spirit }: SpiritCardProps) {
  return (
    <Link href={`/spirits/${spirit.id}`}>
      <motion.div
        className="group relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 shadow-xl border border-white/5"
        whileHover={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Image Layer */}
        <div className="absolute inset-0 z-0">
          {spirit.imageUrl ? (
            <img
              src={spirit.imageUrl}
              alt={spirit.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-6xl">
              🥃
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Content Layer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end h-full">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md border border-amber-500/20">
              {spirit.category}
            </span>
            <button className="p-2 -mr-2 -mt-2 text-white/50 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-1 drop-shadow-lg">
            {spirit.name}
          </h3>

          <p className="text-sm text-gray-300 line-clamp-1 opacity-90">
            {spirit.distillery || "Unknown Distillery"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
