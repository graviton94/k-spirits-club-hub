'use client';

import { Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto z-30">
      <motion.div
        className={`
                relative flex items-center gap-3 px-5 py-4 
                bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl shadow-lg
                transition-all duration-300
                ${isFocused ? 'ring-2 ring-amber-500/50 bg-white/20' : 'hover:bg-white/15'}
            `}
        layout
      >
        <Search className="w-5 h-5 text-amber-500 shrink-0" />
        <input
          type="text"
          placeholder="Search spirits, distilleries..."
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-300 text-lg"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </motion.div>

      {/* Optional: Dropdown results container (Hidden for now) */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-3 p-2 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 text-center text-sm text-muted-foreground">
              Type to search across 1M+ spirits
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
