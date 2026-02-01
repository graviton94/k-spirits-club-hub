'use client';

import { Search, Plus, Bookmark } from "lucide-react";
import { useState, KeyboardEvent, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import SuccessToast from "@/components/ui/SuccessToast";
import { useAuth } from "@/app/context/auth-context";
import { addToCabinet } from "@/app/actions/cabinet";
import Link from "next/link";

const BLUR_DELAY_MS = 200; // Delay to allow clicking dropdown results before blur

export function SearchBar({ isHero = false }: { isHero?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname() || "";
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
  const { searchSpirits, isLoading } = useSpiritsCache();
  const { user } = useAuth();
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

  // Get instant search results using search index (lightweight)
  const instantResults = useMemo(() => {
    if (!searchValue.trim() || isLoading) {
      return [];
    }

    const startTime = performance.now();
    const results = searchSpirits(searchValue).slice(0, 5); // Show top 5 results
    const endTime = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[SearchBar] Search completed in ${(endTime - startTime).toFixed(2)}ms`);
    }
    return results;
  }, [searchValue, searchSpirits, isLoading]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Navigate to explore page with search query
      router.push(`/${lang}/explore?search=${encodeURIComponent(searchValue.trim())}`);
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
                {instantResults.map((item) => (
                  <div
                    key={item.i}
                    className={`group flex items-center justify-between p-3 hover:bg-primary/5 transition-colors border-b last:border-b-0 ${isHero ? 'border-white/10' : 'border-border'}`}
                  >
                    <Link
                      href={`/${lang}/spirits/${item.i}`}
                      className="flex gap-3 items-center flex-1 min-w-0"
                    >
                      {item.t ? (
                        <img
                          src={item.t}
                          alt={item.n}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-xl">
                          {/* Fallback Icon based on category could go here, or just generic */}
                          🥃
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate ${isHero ? 'text-white' : 'text-foreground'}`}>
                          {item.n}
                        </div>
                        <div className={`text-sm truncate ${isHero ? 'text-neutral-400' : 'text-muted-foreground'}`}>
                          {item.en ? `${item.en}` : item.d ? `🏭 ${item.d}` : item.c}
                        </div>
                      </div>
                    </Link>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!user) {
                            setToastMessage('로그인이 필요합니다.');
                            setToastVariant('error');
                            setShowToast(true);
                            return;
                          }
                          try {
                            await addToCabinet(user.uid, item.i, {
                              isWishlist: false,
                              name: item.n,
                              distillery: item.d || undefined,
                              imageUrl: item.t || undefined,
                              category: item.c,
                              // abv: item.a // SearchIndex might not have abv, check schema
                            });
                            setToastMessage('술장에 추가되었습니다! 🥃');
                            setToastVariant('success');
                            setShowToast(true);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-500 transition-colors"
                        title="술장에 담기"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!user) {
                            setToastMessage('로그인이 필요합니다.');
                            setToastVariant('error');
                            setShowToast(true);
                            return;
                          }
                          try {
                            await addToCabinet(user.uid, item.i, {
                              isWishlist: true,
                              name: item.n,
                              distillery: item.d || undefined,
                              imageUrl: item.t || undefined,
                              category: item.c,
                            });
                            setToastMessage('위시리스트에 담겼습니다! 🔖');
                            setToastVariant('success');
                            setShowToast(true);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-500 transition-colors"
                        title="위시리스트 담기"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
      <SuccessToast
        isVisible={showToast}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
