'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { SearchBar } from "@/components/ui/SearchBar";
import SpiritDetailModal from "@/components/ui/SpiritDetailModal";
import type { Spirit, SpiritSearchIndex } from "@/lib/db/schema";
import {
  CATEGORY_NAME_MAP,
  getCategoryStructure,
  getSubCategoriesForMain
} from "@/lib/constants/categories";
import { useDragScroll } from "@/lib/hooks/useDragScroll";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const { searchIndex, searchSpirits, getSpiritById, publishedSpirits, isLoading: isCacheLoading, forceRefresh, debugInfo } = useSpiritsCache();

  // Drag scroll refs for category filters
  const legalCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const mainCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const subCategoryScrollRef = useDragScroll<HTMLDivElement>();

  const searchTerm = searchParams.get('search') || '';
  const selectedLegal = searchParams.get('category') || null;
  const selectedMain = searchParams.get('main') || null;
  const selectedSub = searchParams.get('sub') || null;

  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Dynamic filter extraction from search index
  const dynamicFilters = useMemo(() => {
    const categories = new Set<string>();
    const mainCategories = new Set<string>();
    const subCategories = new Set<string>();

    searchIndex.forEach(item => {
      if (item.c) categories.add(item.c);
      if (item.mc) mainCategories.add(item.mc);
      if (item.sc) subCategories.add(item.sc);
    });

    return {
      categories: Array.from(categories).sort(),
      mainCategories: Array.from(mainCategories).sort(),
      subCategories: Array.from(subCategories).sort()
    };
  }, [searchIndex]);

  // Client-side filtering logic using the search index
  const filteredSpirits = useMemo(() => {
    let results = searchIndex;

    // 1. Search term - use Fuse.js for fuzzy search
    if (searchTerm) {
      results = searchSpirits(searchTerm);
    }

    // 2. Legal Category filter
    if (selectedLegal) {
      results = results.filter(spirit => spirit.c === selectedLegal);
    }

    // 3. Main Category filter
    if (selectedMain) {
      results = results.filter(spirit => 
        spirit.mc === selectedMain || spirit.sc === selectedMain
      );
    }

    // 4. Sub Category filter
    if (selectedSub) {
      results = results.filter(spirit => spirit.sc === selectedSub);
    }

    // Map back to full Spirit objects
    return results.map(item => getSpiritById(item.i)).filter((s): s is Spirit => s !== undefined);
  }, [searchIndex, searchSpirits, searchTerm, selectedLegal, selectedMain, selectedSub, getSpiritById]);

  // Derived Structure for UI
  const legalStructure = useMemo(() => selectedLegal ? getCategoryStructure(selectedLegal) : null, [selectedLegal]);
  const isNested = legalStructure?.type === 'nested';
  const mainOptions = isNested && legalStructure ? (legalStructure as any).mains : [];

  const subOptions = useMemo(() => {
    if (isNested && selectedMain) {
      return getSubCategoriesForMain(selectedLegal!, selectedMain);
    } else if (legalStructure?.type === 'flat') {
      return (legalStructure as any).items;
    }
    return [];
  }, [isNested, selectedMain, selectedLegal, legalStructure]);

  // Infinite scroll/load more on filtered results
  const totalCount = filteredSpirits.length;
  const displayedSpirits = useMemo(() =>
    filteredSpirits.slice(0, displayLimit),
    [filteredSpirits, displayLimit]
  );
  const hasMore = displayLimit < totalCount;

  // Reset display limit when filters change
  useEffect(() => {
    setDisplayLimit(20);
  }, [searchTerm, selectedLegal, selectedMain, selectedSub]);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
          DISCOVER SPIRITS
        </h1>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
        
        {/* Force Refresh Button */}
        <div className="mt-4 flex justify-center gap-3 items-center flex-wrap">
          <button
            onClick={handleForceRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <span className="animate-spin">⟳</span>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Clear Cache & Refresh
              </>
            )}
          </button>
          
          {/* Debug Toggle (only in development) */}
          {isDevelopment && (
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="px-3 py-2 bg-gray-700 text-white text-xs font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showDebugPanel ? '🔒 Hide Debug' : '🔍 Show Debug'}
            </button>
          )}
        </div>

        {/* Debug Panel */}
        {showDebugPanel && isDevelopment && (
          <div className="mt-4 p-4 bg-gray-900 text-white text-left rounded-xl text-xs font-mono max-w-2xl mx-auto border-2 border-amber-500">
            <h3 className="font-bold text-amber-400 mb-2">🔍 Debug Information</h3>
            <div className="space-y-1">
              <div>📊 Search Index Length: <span className="text-green-400">{searchIndex.length}</span></div>
              <div>📦 Published Spirits: <span className="text-green-400">{publishedSpirits.length}</span></div>
              <div>💾 Last Load Source: <span className="text-blue-400">{debugInfo.lastLoadSource}</span></div>
              <div>⏰ Last Load Time: <span className="text-blue-400">
                {debugInfo.lastLoadTime ? new Date(debugInfo.lastLoadTime).toLocaleTimeString() : 'N/A'}
              </span></div>
              <div>🔍 Filtered Results: <span className="text-yellow-400">{filteredSpirits.length}</span></div>
              {debugInfo.cacheErrors.length > 0 && (
                <div className="mt-2">
                  <div className="text-red-400 font-bold">⚠️ Cache Errors:</div>
                  {debugInfo.cacheErrors.map((err, i) => (
                    <div key={i} className="text-red-300 ml-2">• {err}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Level 1: Legal Categories (Root) */}
      <div className="mb-4">
        <div className="relative">
          <div ref={legalCategoryScrollRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x justify-start md:justify-center px-4">
            <CategoryFilter
              label="ALL"
              value=""
              isActive={!selectedLegal}
              href="/explore"
            />

            {dynamicFilters.categories.map(cat => (
              <CategoryFilter
                key={cat}
                label={CATEGORY_NAME_MAP[cat] || cat}
                value={cat}
                isActive={selectedLegal === cat}
                href={`/explore?category=${cat}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Level 2: Main Categories (If Nested) */}
      {isNested && mainOptions && mainOptions.length > 0 && (
        <div className="mb-4 animate-fade-in-down">
          <div className="relative">
            <div ref={mainCategoryScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x justify-start md:justify-center px-4">
              <CategoryFilter
                label="전체"
                value=""
                isActive={!selectedMain}
                href={`/explore?category=${selectedLegal}`}
                isSub
              />
              {mainOptions.map((main: string) => (
                <CategoryFilter
                  key={main}
                  label={CATEGORY_NAME_MAP[main] || main}
                  value={main}
                  isActive={selectedMain === main}
                  href={`/explore?category=${selectedLegal}&main=${main}`}
                  isSub
                />
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Level 3: Sub Categories */}
      {subOptions.length > 0 && (
        <div className="mb-10 animate-fade-in-down delay-100">
          <div className="relative">
            <div ref={subCategoryScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x justify-start md:justify-center px-4">
              {!isNested && (
                <CategoryFilter
                  label="전체"
                  value=""
                  isActive={!selectedSub}
                  href={`/explore?category=${selectedLegal}`}
                  isSub
                />
              )}
              {isNested && selectedMain && (
                <CategoryFilter
                  label="전체"
                  value=""
                  isActive={!selectedSub}
                  href={`/explore?category=${selectedLegal}&main=${selectedMain}`}
                  isSub
                />
              )}

              {subOptions.map((sub: string) => (
                <CategoryFilter
                  key={sub}
                  label={CATEGORY_NAME_MAP[sub] || sub}
                  value={sub}
                  isActive={selectedSub === sub}
                  href={
                    isNested
                      ? `/explore?category=${selectedLegal}&main=${selectedMain}&sub=${encodeURIComponent(sub)}`
                      : `/explore?category=${selectedLegal}&sub=${encodeURIComponent(sub)}`
                  }
                  isSub
                />
              ))}
            </div>

          </div>
        </div>
      )}


      {!selectedLegal && (
        <div className="mb-10 text-center text-sm text-muted-foreground animate-pulse">
          Select a category above to start exploring.
        </div>
      )}

      {totalCount > 0 && (
        <p className="mb-4 text-sm text-right text-muted-foreground px-2">
          Found {totalCount.toLocaleString()} spirits
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isCacheLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-card/50 animate-pulse rounded-3xl" />
          ))
        ) : (
          displayedSpirits.map((spirit) => (
            <SpiritCard key={spirit.id} spirit={spirit} onClick={(s) => setSelectedSpirit(s)} />
          ))
        )}
      </div>

      <SpiritDetailModal
        isOpen={!!selectedSpirit}
        spirit={selectedSpirit}
        onClose={() => setSelectedSpirit(null)}
      />

      {totalCount === 0 && (
        <div className="text-center py-20 bg-secondary/30 rounded-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h2>
          <p className="text-muted-foreground">
            다른 검색어를 입력하거나 필터를 변경해보세요.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="mt-12 mb-8 flex justify-center">
          <button
            onClick={() => setDisplayLimit(prev => prev + 20)}
            className="min-h-[48px] px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Load More ({totalCount - displayLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

interface CategoryFilterProps {
  label: string;
  value: string;
  isActive: boolean;
  href: string;
  isSub?: boolean;
}

function CategoryFilter({ label, isActive, href, isSub }: CategoryFilterProps) {
  return (
    <Link
      href={href}
      className={`
        transition-all duration-300 snap-start whitespace-nowrap border-2
        ${isActive
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-primary/30 scale-105 border-primary'
          : `${isSub
            ? 'bg-card text-foreground border-border hover:bg-secondary'
            : 'bg-card text-foreground font-bold border-border hover:bg-secondary'
          }`
        }
        ${isSub ? 'px-3 py-1.5 rounded-lg text-xs' : 'px-4 py-2 rounded-xl text-sm'}
      `}
    >
      {label}
    </Link>
  );
}
