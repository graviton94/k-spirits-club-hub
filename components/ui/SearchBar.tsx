'use client';

import { Search } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function SearchBar({ isHero = false }: { isHero?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Navigate to explore page with search query
      router.push(`/explore?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-30">
      <motion.div
        className={`
                relative flex items-center gap-3 px-5 py-4 
                ${isHero
            ? 'bg-neutral-900 border-white dark:border-border text-white'
            : 'bg-card border-border hover:border-primary/40 text-foreground'} 
                border-2 backdrop-blur-sm rounded-2xl shadow-lg
                transition-all duration-300
                ${isFocused ? 'ring-2 ring-primary/50 border-primary' : ''}
            `}
        layout
      >
        <Search className="w-5 h-5 text-primary shrink-0" />
        <input
          type="text"
          placeholder="Search spirits, distilleries..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent border-none outline-none text-lg ${isHero ? 'text-white placeholder:text-neutral-400' : 'text-foreground placeholder:text-muted-foreground'
            }`}
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
            className={`absolute top-full left-0 right-0 mt-3 p-2 backdrop-blur-md border-2 rounded-2xl shadow-2xl overflow-hidden ${isHero ? 'bg-neutral-900/90 border-white/20 text-white' : 'bg-popover border-border'
              }`}
          >
            <div className={`p-3 text-center text-sm ${isHero ? 'text-neutral-400' : 'text-muted-foreground'}`}>
              {searchValue.trim() ? `Press Enter to search for "${searchValue}"` : 'Type to search across published spirits'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
