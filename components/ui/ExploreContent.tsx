"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getCabinetStatusInfo } from '@/app/[lang]/actions/cabinet';
import { ExploreCard } from './ExploreCard';
import { ExploreGridSkeleton } from './ExploreSkeleton';
import { Search, Loader2, ChevronDown, ArrowRight } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 selection:bg-primary/30">
      
      {/* 🏰 1. Institutional Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-border/50 pb-8">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3 mb-2">
              <span className="capsule-premium">INTELLIGENCE</span>
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest italic">REAL-TIME DB</span>
           </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9]">
            {dict?.title || (isEn ? "Explore spirits" : "전체 둘러보기")}
          </h1>
          <p className="text-foreground/40 text-sm font-medium max-w-md">
            {isEn 
                ? (isSearching && searchResults.length === 0 ? "Analyzing global catalogue..." : `Accessing the institution's primary data vault.`) 
                : (isSearching && searchResults.length === 0 ? "데이터 분석 중..." : `기관의 공식 통합 주류 데이터 센터입니다.`)}
          </p>
        </div>

        {/* Search Command Bar */}
        <div className="relative flex w-full md:w-[400px] gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                <input
                    type="text"
                    placeholder={dict?.filters?.searchPlaceholder || (isEn ? "Search spirit..." : "제품명, 증류소...")}
                    className="w-full pl-14 pr-6 py-4 rounded-3xl bg-muted/30 border border-border/50 shadow-inner focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none font-medium transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                />
            </div>
            <button
                onClick={() => performSearch()}
                disabled={isSearching}
                className="btn-premium px-8 py-4 shrink-0 shadow-primary/20"
            >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
        
        {/* 🛠️ 2. Advanced Filters Sidebar */}
        <aside className="space-y-10">
            <div className="surface-elevated p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                    <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em] italic">Parameters</h3>
                    <button
                        onClick={resetFilters}
                        className="text-[10px] font-black text-foreground/30 hover:text-primary transition-colors underline decoration-dotted"
                    >
                        RESET
                    </button>
                </div>

                {/* Main Category */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Primary Classification</label>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-5 pr-10 py-4 rounded-2xl bg-background border border-border/50 outline-none focus:border-primary/50 appearance-none cursor-pointer font-black text-sm uppercase tracking-tighter"
                        >
                            <option value="">{dict?.filters?.all || (isEn ? "EVERYTHING" : "모든 주종")}</option>
                            {dbCategories.map((cat) => (
                                <option key={cat.ko} value={cat.ko}>
                                    {isEn ? (cat.en || cat.ko) : cat.ko}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20" size={18} />
                    </div>
                </div>

                {/* Sub Category */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Sub Classification</label>
                    <div className="relative">
                        <select
                            value={selectedSubCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                            disabled={!selectedCategory || dbSubCategories.length === 0}
                            className="w-full pl-5 pr-10 py-4 rounded-2xl bg-background border border-border/50 outline-none focus:border-primary/50 appearance-none cursor-pointer font-black text-sm uppercase tracking-tighter disabled:opacity-20"
                        >
                            <option value="">{isEn ? "SELECT SUB TYPE" : "상세 분류"}</option>
                            {dbSubCategories.map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20" size={18} />
                    </div>
                </div>
            </div>

            {/* Quick Exhibit Filters */}
            <div className="p-8 pb-4">
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-6">CURATED EXHIBITS</p>
                <div className="flex flex-col gap-2">
                    {QUICK_CATEGORY_KEYS.map((categoryKey) => {
                        const isActive = selectedCategory === categoryKey;
                        const label = isEn ? QUICK_CATEGORY_LABELS[categoryKey].en : QUICK_CATEGORY_LABELS[categoryKey].ko;

                        return (
                            <button
                                key={categoryKey}
                                onClick={() => applyQuickCategory(categoryKey)}
                                className={`group flex items-center justify-between p-4 rounded-2xl transition-all font-black text-sm uppercase tracking-tighter border
                                    ${isActive 
                                        ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/10 scale-[1.02]' 
                                        : 'bg-muted/30 text-foreground/60 border-transparent hover:bg-muted/50 hover:border-border'}`}
                            >
                                <span>{label}</span>
                                <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>

        {/* 🎬 3. Discovery Grid */}
        <main>
            {isSearching && searchResults.length === 0 ? (
                <ExploreGridSkeleton count={12} />
            ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
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
                        <div className="w-full my-8">
                        <GoogleAd
                            key={`ad-explore-${index}`}
                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                            slot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || ''}
                            format="fluid"
                            layoutKey="-fb+5w+4e-db+86"
                            className="rounded-[3rem] overflow-hidden shadow-2xl bg-card border border-border/30 p-8"
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
                        className="btn-premium-outline px-12 py-5 shadow-2xl"
                    >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isEn ? "DECRYPT MORE DATA" : "더 많은 주류 탐색"}
                    </button>
                    </div>
                )}
                </div>
            ) : hasSearched ? (
                <div className="surface-elevated flex flex-col items-center justify-center py-32 text-center border-dashed border-2">
                    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-8 text-4xl grayscale opacity-30">🔍</div>
                    <h2 className="text-3xl font-black text-foreground tracking-tighter mb-3">
                        {isEn ? "Null Set Detected" : "항목을 찾을 수 없습니다"}
                    </h2>
                    <p className="text-foreground/40 max-w-sm font-medium">
                        {isEn ? "No records matching your parameters were found in the institutional database." : "요청하신 조건에 부합하는 데이터가 데이터베이스에 존재하지 않습니다."}
                    </p>
                    <button 
                        onClick={resetFilters}
                        className="mt-10 btn-premium-outline px-8 py-3 text-xs"
                    >
                        {isEn ? "REBOOT FILTERS" : "필터 리셋"}
                    </button>
                </div>
            ) : (
                <div 
                    className="surface-elevated flex flex-col items-center justify-center py-40 border-dashed border-2 group hover:bg-primary/5 transition-all cursor-pointer" 
                    onClick={() => performSearch()}
                >
                    <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <Search className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-4xl font-black text-foreground tracking-tighter mb-4 text-center">
                        {isEn ? "Institutional Database Access" : "데이터베이스 전체 탐색"}
                    </h2>
                    <p className="text-foreground/40 max-w-md text-center font-medium px-8">
                        {isEn 
                            ? "Initiate a full-spectrum analysis across thousands of curated entries." 
                            : "수천 건의 전문 큐레이션 데이터를 실시간으로 동기화하여 분석을 시작할 수 있습니다."}
                    </p>
                    <button className="mt-12 btn-premium py-5 px-16 shadow-2xl">
                        {isEn ? "EXECUTE GLOBAL SCAN" : "분석 시작"}
                    </button>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
