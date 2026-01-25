'use client';

import { Search } from "lucide-react";
import { useState, KeyboardEvent, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import Link from "next/link";

const BLUR_DELAY_MS = 200; // Delay to allow clicking dropdown results before blur

export function SearchBar({ isHero = false }: { isHero?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { searchSpirits, getSpiritById, isLoading } = useSpiritsCache();
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get instant search results using Fuse.js
  const instantResults = useMemo(() => {
    if (!searchValue.trim() || isLoading) {
      return [];
    }
    
    const startTime = performance.now();
    const searchIndex = searchSpirits(searchValue);
    const results = searchIndex
      .slice(0, 5) // Show top 5 results
      .map(item => getSpiritById(item.i))
      .filter(s => s !== undefined);
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SearchBar] Search completed in ${(endTime - startTime).toFixed(2)}ms`);
    }
    return results;
  }, [searchValue, searchSpirits, getSpiritById, isLoading]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Navigate to explore page with search query
      router.push(`/explore?search=${encodeURIComponent(searchValue.trim())}`);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBlur = () => {
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    // Delay blur to allow clicking dropdown results
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, BLUR_DELAY_MS);
  };

  const handleFocus = () => {
    // Clear blur timeout if user refocuses
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsFocused(true);
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </motion.div>

      {/* Instant search results dropdown */}
      <AnimatePresence>
        {isFocused && searchValue.trim() && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full left-0 right-0 mt-3 backdrop-blur-md border-2 rounded-2xl shadow-2xl overflow-hidden ${isHero ? 'bg-neutral-900/90 border-white/20 text-white' : 'bg-popover border-border'
              }`}
          >
            {instantResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {instantResults.map((spirit) => (
                  <Link
                    key={spirit.id}
                    href={`/spirits/${spirit.id}`}
                    className={`block p-3 hover:bg-primary/10 transition-colors border-b last:border-b-0 ${isHero ? 'border-white/10' : 'border-border'
                      }`}
                  >
                    <div className="flex gap-3 items-center">
                      {spirit.thumbnailUrl && (
                        <img
                          src={spirit.thumbnailUrl}
                          alt={spirit.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate ${isHero ? 'text-white' : 'text-foreground'
                          }`}>
                          {spirit.name}
                        </div>
                        <div className={`text-sm truncate ${isHero ? 'text-neutral-400' : 'text-muted-foreground'
                          }`}>
                          {spirit.metadata?.name_en || spirit.distillery || spirit.category}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <button
                  onClick={handleSearch}
                  className={`w-full p-3 text-center text-sm font-medium transition-colors ${isHero
                    ? 'text-amber-400 hover:bg-amber-400/10'
                    : 'text-primary hover:bg-primary/10'
                    }`}
                >
                  View all results for &quot;{searchValue}&quot;
                </button>
              </div>
            ) : (
              <div className={`p-4 text-center text-sm ${isHero ? 'text-neutral-400' : 'text-muted-foreground'
                }`}>
                No results found for &quot;{searchValue}&quot;
              </div>
            )}
          </motion.div>
        )}
        {isFocused && !searchValue.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full left-0 right-0 mt-3 p-2 backdrop-blur-md border-2 rounded-2xl shadow-2xl overflow-hidden ${isHero ? 'bg-neutral-900/90 border-white/20 text-white' : 'bg-popover border-border'
              }`}
          >
            <div className={`p-3 text-center text-sm ${isHero ? 'text-neutral-400' : 'text-muted-foreground'}`}>
              Type to search across published spirits
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
