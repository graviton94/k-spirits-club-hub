"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getCabinetStatusInfo } from '@/app/[lang]/actions/cabinet';
import { ExploreCard } from './ExploreCard';
import { ExploreGridSkeleton } from './ExploreSkeleton';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import GoogleAd from '@/components/ui/GoogleAd';
import metadata from '@/lib/constants/spirits-metadata.json';

const QUICK_CATEGORY_KEYS = ['위스키', '소주', '청주', '약주', '과실주'] as const;

const QUICK_CATEGORY_LABELS: Record<(typeof QUICK_CATEGORY_KEYS)[number], { ko: string; en: string }> = {
  '위스키': { ko: '위스키', en: 'Whisky' },
  '소주': { ko: '소주', en: 'Soju' },
  '청주': { ko: '청주', en: 'Cheongju' },
  '약주': { ko: '약주', en: 'Yakju' },
  '과실주': { ko: '과실주', en: 'Wine & Fruit Wine' },
};

const PAGE_SIZE = 24;

export default function ExploreContent({ dict }: { dict?: any }) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
  const isEn = lang === 'en';

  const { user } = useAuth();

  // Search Results & Pagination States
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Dynamic Metadata States
  const [dbCategories, setDbCategories] = useState<{ ko: string, en: string | null | undefined }[]>([]);
  const [dbSubCategories, setDbSubCategories] = useState<string[]>([]);

  const [cabinetStatus, setCabinetStatus] = useState<{ ownedIds: Set<string>, wishlistIds: Set<string> }>({
    ownedIds: new Set(),
    wishlistIds: new Set()
  });

  // 1. Fetch Dynamic Categories from DB
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch('/api/spirits?mode=meta');
        const data = await res.json();
        if (data.categories) setDbCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchMeta();
  }, []);

  // 2. Fetch Subcategories when Category changes
  useEffect(() => {
    const fetchSubMeta = async () => {
      if (!selectedCategory || selectedCategory === 'ALL') {
        setDbSubCategories([]);
        return;
      }
      try {
        const res = await fetch(`/api/spirits?mode=meta&category=${encodeURIComponent(selectedCategory)}`);
        const data = await res.json();
        if (data.subcategories) setDbSubCategories(data.subcategories);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      }
    };
    fetchSubMeta();
    setSelectedSubCategory(''); // Reset subcategory when category changes
  }, [selectedCategory]);

  // 3. Fetch cabinet status
  useEffect(() => {
    if (user) {
      getCabinetStatusInfo(user.uid).then(status => {
        setCabinetStatus({
          ownedIds: new Set(status.ownedIds),
          wishlistIds: new Set(status.wishlistIds)
        });
      });
    } else {
      setCabinetStatus({ ownedIds: new Set(), wishlistIds: new Set() });
    }
  }, [user]);

  const handleStatusChange = (id: string, type: 'cabinet' | 'wishlist', status: boolean) => {
    setCabinetStatus(prev => {
      const nextOwned = new Set(prev.ownedIds);
      const nextWishlist = new Set(prev.wishlistIds);
      if (type === 'cabinet') {
        if (status) { nextOwned.add(id); nextWishlist.delete(id); } else { nextOwned.delete(id); }
      } else {
        if (status) { nextWishlist.add(id); nextOwned.delete(id); } else { nextWishlist.delete(id); }
      }
      return { ownedIds: nextOwned, wishlistIds: nextWishlist };
    });
  };

  // 4. Core Search Logic (Database Backed)
  const performSearch = useCallback(async (isLoadMore = false) => {
    setIsSearching(true);
    setHasSearched(true);
    
    const currentOffset = isLoadMore ? offset + PAGE_SIZE : 0;
    
    try {
      const params = new URLSearchParams({
        mode: 'search',
        limit: PAGE_SIZE.toString(),
        offset: currentOffset.toString(),
      });

      if (searchTerm) params.append('searchTerm', searchTerm);
      if (selectedCategory && selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedSubCategory) params.append('subcategory', selectedSubCategory);

      const response = await fetch(`/api/spirits?${params.toString()}`);
      const data = await response.json();

      if (data.spirits) {
        if (isLoadMore) {
          setSearchResults(prev => [...prev, ...data.spirits]);
          setOffset(currentOffset);
        } else {
          setSearchResults(data.spirits);
          setOffset(0);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, selectedCategory, selectedSubCategory, offset]);

  const applyQuickCategory = useCallback((category: string) => {
    setSearchTerm('');
    setSelectedCategory(category);
    setSelectedSubCategory('');
    // Auto-trigger search after slight delay to allow state to settle
    // Alternatively, just let user click search. But for quick categories, auto is better.
  }, []);

  // Effect to auto-search on quick category change
  useEffect(() => {
    if (selectedCategory && !selectedSubCategory && !searchTerm) {
        performSearch();
    }
  }, [selectedCategory]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSearchResults([]);
    setHasSearched(false);
    setOffset(0);
    setHasMore(false);
  }, []);

  // 5. Initial load trigger (Always load latest on mount)
  useEffect(() => {
    performSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {dict?.title || (isEn ? "Explore spirits" : "전체 둘러보기")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEn 
                ? (isSearching && searchResults.length === 0 ? "Searching database..." : `Real-time database search results.`) 
                : (isSearching && searchResults.length === 0 ? "데이터베이스 검색 중..." : `실시간 데이터베이스 검색 결과입니다.`)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* Category Filter */}
          <div className="relative w-full sm:w-auto">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px] appearance-none cursor-pointer"
            >
                <option value="">{dict?.filters?.all || (isEn ? "All Categories" : "모든 주종")}</option>
                {dbCategories.map((cat) => (
                <option key={cat.ko} value={cat.ko}>
                    {isEn ? (cat.en || cat.ko) : cat.ko}
                </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={16} />
          </div>

          {/* Subcategory Filter */}
          <div className="relative w-full sm:w-auto">
            <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory || dbSubCategories.length === 0}
                className="w-full sm:w-auto px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px] disabled:opacity-50 appearance-none cursor-pointer"
            >
                <option value="">{isEn ? "Subcategory" : "상세 분류"}</option>
                {dbSubCategories.map((sub) => (
                <option key={sub} value={sub}>
                    {sub}
                </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={16} />
          </div>

          {/* Search Input and Button */}
          <div className="relative flex w-full md:w-80 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder={dict?.filters?.searchPlaceholder || (isEn ? "Search spirit..." : "이름, 증류소 검색...")}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background border border-border shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
            <button
              onClick={() => performSearch()}
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              <span className="hidden sm:inline">{isEn ? "Search" : "검색"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-8 rounded-3xl border border-border/60 bg-card/40 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {isEn ? "Quick Filters" : "빠른 카테고리"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEn
                ? "Select a category and click search to explore the full database."
                : "자주 찾는 주종을 선택하고 검색 버튼을 눌러 전체 데이터베이스를 탐색하세요."}
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="self-start rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            {isEn ? "Reset Filters" : "필터 초기화"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_CATEGORY_KEYS.map((categoryKey) => {
            const isActive = selectedCategory === categoryKey;
            const label = isEn ? QUICK_CATEGORY_LABELS[categoryKey].en : QUICK_CATEGORY_LABELS[categoryKey].ko;

            return (
              <button
                key={categoryKey}
                type="button"
                onClick={() => applyQuickCategory(categoryKey)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'border border-border bg-background hover:border-indigo-500/40 hover:text-indigo-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results View */}
      {isSearching && searchResults.length === 0 ? (
        <ExploreGridSkeleton count={12} />
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {searchResults.map((item, index) => (
            <React.Fragment key={`${item.i}-${index}`}>
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
                  source: 'online',
                  externalId: null,
                  status: 'PUBLISHED',
                  isPublished: true,
                  isReviewed: false,
                  reviewedBy: null,
                  reviewedAt: null,
                  name_en: item.en || null,
                  metadata: item.m || {},
                  aggregateRating: {
                    ratingValue: item.r,
                    reviewCount: item.rc || 0
                  },
                  hasTastingNotes: item.h,
                  createdAt: item.cre ? new Date(item.cre) : new Date(),
                  updatedAt: new Date()
                } as any}
                isEn={isEn}
                isOwned={cabinetStatus.ownedIds.has(item.i)}
                isWishlisted={cabinetStatus.wishlistIds.has(item.i)}
                onStatusChange={handleStatusChange}
                priority={index < 6}
              />

              {/* In-feed Ad Integration */}
              {(index + 1) % 8 === 0 && (
                <div className="w-full my-6">
                  <GoogleAd
                    key={`ad-explore-${index}`}
                    client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                    slot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || ''}
                    format="fluid"
                    layoutKey="-fb+5w+4e-db+86"
                    className="rounded-3xl overflow-hidden shadow-sm bg-card"
                  />
                </div>
              )}
            </React.Fragment>
          ))}

          {hasMore && (
            <div className="flex justify-center mt-12 pb-12">
              <button
                onClick={() => performSearch(true)}
                disabled={isSearching}
                className="px-10 py-4 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 font-bold transition-all flex items-center gap-3 active:scale-95"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isEn ? "Load More" : "더 많은 주류 보기"}
              </button>
            </div>
          )}
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center py-32 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="text-7xl mb-6">🔍</div>
          <p className="text-2xl font-bold text-foreground">
            {isEn ? "No matches found in database" : "데이터베이스에 해당 항목이 없습니다."}
          </p>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            {isEn ? "Try different keywords or broader filter options." : "다른 검색어로나 필터 조건을 조정해 보세요."}
          </p>
          <button 
            onClick={resetFilters}
            className="mt-8 px-6 py-2 border border-border rounded-xl hover:bg-background transition-colors font-medium"
          >
            {isEn ? "Clear all filters" : "필터 모두 지우기"}
          </button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center py-24 bg-indigo-600/5 rounded-3xl border border-dashed border-indigo-500/30 group hover:bg-indigo-600/10 transition-all cursor-pointer" 
          onClick={() => performSearch()}
        >
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Search className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isEn ? "Start Exploring the Spirits database" : "전체 주류 데이터베이스 탐색"}
          </h2>
          <p className="text-muted-foreground max-w-md text-center">
            {isEn 
                ? "Enter keywords or filter by category to search through thousands of records." 
                : "수천 건의 데이터를 실시간으로 탐색할 수 있습니다. 검색어를 입력하거나 카테고리를 선택한 후 검색 버튼을 눌러주세요."}
          </p>
          <button className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-2">
            {isEn ? "Execute Search" : "탐색 시작하기"}
            <Search className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
