"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useSpiritsCache } from '@/app/context/spirits-cache-context';
import { ExploreCard } from './ExploreCard';
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AdSlot from '@/components/common/AdSlot';
import metadata from '@/lib/constants/spirits-metadata.json';

export default function ExploreContent() {
  const pathname = usePathname() || "";
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
  const isEn = lang === 'en';

  const { searchIndex, isLoading, isRefreshing, refreshCache } = useSpiritsCache();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [displayLimit, setDisplayLimit] = useState(24);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term update
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fallbackTimestamp = useMemo(() => new Date(), []);

  // [SYSTEM_CHECK] 데이터 가시성 최종 리포트 로그
  useEffect(() => {
    if (!isLoading) {
      console.log(`[SYSTEM_REPORT] 현재 렌더링 가능한 검색 인덱스: ${searchIndex?.length || 0}개`);
    }
  }, [isLoading, searchIndex]);

  const filteredSpirits = useMemo(() => {
    if (!searchIndex || !Array.isArray(searchIndex)) return [];

    let results = [...searchIndex];

    if (selectedCategory) {
      results = results.filter(s => s.c === selectedCategory);
    }

    if (selectedSubCategory) {
      results = results.filter(s => s.sc === selectedSubCategory);
    }

    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      results = results.filter(s =>
        (s.n && s.n.toLowerCase().includes(lowerSearch)) ||
        (s.en && s.en.toLowerCase().includes(lowerSearch)) ||
        (s.c && s.c.toLowerCase().includes(lowerSearch)) ||
        (s.d && s.d.toLowerCase().includes(lowerSearch))
      );
    }

    return results.slice(0, displayLimit);
  }, [searchIndex, debouncedSearchTerm, selectedCategory, selectedSubCategory, displayLimit]);

  // Get unique subcategories based on selected category from actual data
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory || !searchIndex) return [];

    const subcats = new Set<string>();
    searchIndex.forEach(item => {
      // Only collect subcategories for the selected category
      if (item.c === selectedCategory && item.sc) {
        subcats.add(item.sc);
      }
    });

    return Array.from(subcats).sort();
  }, [searchIndex, selectedCategory]);

  // 로딩 상태 처리
  if (isLoading && (!searchIndex || searchIndex.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="text-7xl animate-bounce">🍶</div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-muted-foreground font-bold tracking-tight mt-2 text-lg">
            {isEn ? "Loading spirit information..." : "제품 정보를 불러오는 중입니다..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 검색 바 및 필터 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {isEn ? "Explore spirits" : "전체 둘러보기"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEn ? `Total ${searchIndex?.length || 0} spirits registered.` : `총 ${searchIndex?.length || 0}개의 주종이 등록되어 있습니다.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory(''); // Reset subcategory on main category change
            }}
            className="px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 min-w-[140px] appearance-none bg-no-repeat bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3-3%203%203m0%206l-3%203-3-3%22%20stroke%3D%22%23000000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3-3%203%203m0%206l-3%203-3-3%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2fsvg%3E')]"
          >
            <option value="" className="bg-white text-black dark:bg-black dark:text-white">
              {isEn ? "All Categories" : "모든 주종"}
            </option>
            {Object.keys(metadata.categories).map((cat) => {
              const displayNames = isEn ? (metadata as any).display_names_en : metadata.display_names;
              return (
                <option key={cat} value={cat} className="bg-white text-black dark:bg-black dark:text-white">
                  {displayNames[cat] || cat}
                </option>
              );
            })}
          </select>

          {/* Subcategory Filter (Dependent on Actual Data) */}
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory || availableSubcategories.length === 0}
            className="px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 min-w-[140px] disabled:opacity-50 disabled:bg-muted appearance-none bg-no-repeat bg-size-[1.5em] bg-position-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3-3%203%203m0%206l-3%203-3-3%22%20stroke%3D%22%23000000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3cpath%20d%3D%22M7%207l3-3%203%203m0%206l-3%203-3-3%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3c%2fsvg%3E')]"
          >
            <option value="" className="bg-white text-black dark:bg-black dark:text-white">
              {isEn ? "Subcategory" : "상세 분류"}
            </option>
            {availableSubcategories.map(sub => {
              const displayNames = isEn ? (metadata as any).display_names_en : metadata.display_names;
              return (
                <option key={sub} value={sub} className="bg-white text-black dark:bg-black dark:text-white">
                  {displayNames[sub] || sub}
                </option>
              );
            })}
          </select>

          <div className="relative z-10 w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={isEn ? "Search name, category, distillery..." : "이름, 주종, 증류소 검색..."}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background border border-border shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all outline-none text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 제품 그리드 */}
      {filteredSpirits.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {filteredSpirits.map((item, index) => (
              <React.Fragment key={item.i}>
                <ExploreCard
                  spirit={{
                    id: item.i,
                    name: item.n,
                    category: item.c,
                    subcategory: item.sc,
                    imageUrl: item.t,
                    thumbnailUrl: item.t,
                    abv: item.a || 0,
                    volume: null,
                    distillery: item.d || null,
                    bottler: null,
                    mainCategory: item.mc,
                    country: null,
                    region: null,
                    source: 'food_safety_korea' as const,
                    externalId: null,
                    status: 'PUBLISHED' as const,
                    isPublished: true,
                    isReviewed: false,
                    reviewedBy: null,
                    reviewedAt: null,
                    name_en: item.en || null,
                    description_en: item.m?.description_en || null,
                    pairing_guide_ko: null,
                    pairing_guide_en: null,
                    metadata: item.m || {}, // Pass metadata for tags
                    createdAt: fallbackTimestamp,
                    updatedAt: fallbackTimestamp,
                  }}
                />
                {/* Insert Ad every 8 items */}
                {(index + 1) % 8 === 0 && (
                  <AdSlot
                    slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || "0000000000"}
                    variant="in-feed"
                    className="rounded-2xl shadow-sm border border-border bg-secondary/30"
                    label="Sponsored"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {searchIndex.length > displayLimit && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => setDisplayLimit(prev => prev + 24)}
                disabled={isRefreshing}
                className="px-10 py-4 bg-background border border-border rounded-2xl font-bold text-foreground hover:bg-muted transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isRefreshing ? (isEn ? "Loading..." : "로딩 중...") : (isEn ? "Show More Products" : "더 많은 제품 보기")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-background rounded-[32px] p-16 text-center border border-dashed border-border shadow-inner">
          <AlertCircle className="mx-auto w-16 h-16 text-muted-foreground/30 mb-6" />
          <h3 className="text-2xl font-bold text-foreground">
            {isEn ? "Couldn't find what you're looking for?" : "찾으시는 제품이 없나요?"}
          </h3>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto">
            {isEn ? "Try changing the search term or refresh to get the latest data." : "검색어를 변경하거나 아래 버튼을 눌러 최신 데이터를 새로고침 해보세요."}
          </p>
          <button
            onClick={() => refreshCache()}
            className="mt-8 px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-500/20 flex items-center gap-2 mx-auto active:scale-95"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            {isEn ? "Refresh Data" : "데이터 새로고침"}
          </button>
        </div>
      )}
    </div>
  );
}
