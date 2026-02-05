"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useSpiritsCache } from '@/app/context/spirits-cache-context';
import { useAuth } from '@/app/context/auth-context';
import { getCabinetStatusInfo } from '@/app/actions/cabinet';
import { ExploreCard } from './ExploreCard';
import { Search, Loader2, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import AdSlot from '@/components/common/AdSlot';
import metadata from '@/lib/constants/spirits-metadata.json';
import { SpiritSearchIndex } from '@/lib/db/schema';

export default function ExploreContent() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';
  const isEn = lang === 'en';

  const { publishedSpirits: initialSpirits, isLoading: isInitialLoading } = useSpiritsCache();
  const { user } = useAuth();

  // Search States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [searchResults, setSearchResults] = useState<SpiritSearchIndex[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [displayLimit, setDisplayLimit] = useState(24);
  const [cabinetStatus, setCabinetStatus] = useState<{ ownedIds: Set<string>, wishlistIds: Set<string> }>({
    ownedIds: new Set(),
    wishlistIds: new Set()
  });

  // Fetch cabinet status
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
        if (status) {
          nextOwned.add(id);
          nextWishlist.delete(id);
        } else {
          nextOwned.delete(id);
        }
      } else {
        if (status) {
          nextWishlist.add(id);
          nextOwned.delete(id);
        } else {
          nextWishlist.delete(id);
        }
      }

      return { ownedIds: nextOwned, wishlistIds: nextWishlist };
    });
  };

  /**
   * Perform server-side search
   */
  const performSearch = useCallback(async (isInitial = false) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      params.append('mode', 'index');
      if (searchTerm) params.append('q', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubCategory) params.append('subcategory', selectedSubCategory);

      const response = await fetch(`/api/spirits?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.searchIndex || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, selectedCategory, selectedSubCategory]);

  // Initial search if search params exist
  useEffect(() => {
    if (searchParams.get('search') || searchParams.get('category')) {
      performSearch(true);
    }
  }, []);

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const catData = (metadata.categories as any)[selectedCategory];
    if (!catData || !catData.subcategories) return [];
    return catData.subcategories;
  }, [selectedCategory]);

  const displaySpirits = hasSearched ? searchResults : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {isEn ? "Explore spirits" : "전체 둘러보기"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEn ? (isSearching ? "Searching..." : `Found ${displaySpirits.length} spirits.`) : (isSearching ? "검색 중..." : `총 ${displaySpirits.length}개의 주종이 검색되었습니다.`)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory('');
            }}
            className="w-full sm:w-auto px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px] appearance-none"
          >
            <option value="">{isEn ? "All Categories" : "모든 주종"}</option>
            {Object.keys(metadata.categories).map((cat) => (
              <option key={cat} value={cat}>
                {(isEn ? (metadata as any).display_names_en[cat] : (metadata as any).display_names[cat]) || cat}
              </option>
            ))}
          </select>

          {/* Subcategory Filter */}
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory || availableSubcategories.length === 0}
            className="w-full sm:w-auto px-4 py-3 pr-10 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-border outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px] disabled:opacity-50 appearance-none"
          >
            <option value="">{isEn ? "Subcategory" : "상세 분류"}</option>
            {availableSubcategories.map((sub: string) => (
              <option key={sub} value={sub}>
                {(isEn ? (metadata as any).display_names_en[sub] : (metadata as any).display_names[sub]) || sub}
              </option>
            ))}
          </select>

          {/* Search Input and Button */}
          <div className="relative flex w-full md:w-80 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder={isEn ? "Search spirit..." : "이름, 증류소 검색..."}
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

      {/* Grid */}
      {displaySpirits.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displaySpirits.slice(0, displayLimit).map((item, index) => (
            <ExploreCard
              key={`${item.i}-${index}`}
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
                createdAt: item.cre ? new Date(item.cre) : new Date(),
                updatedAt: new Date()
              } as any}
              isEn={isEn}
              isOwned={cabinetStatus.ownedIds.has(item.i)}
              isWishlisted={cabinetStatus.wishlistIds.has(item.i)}
              onStatusChange={handleStatusChange}
              priority={index < 6}
            />
          ))}

          {displayLimit < displaySpirits.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setDisplayLimit(prev => prev + 24)}
                className="px-8 py-3 rounded-2xl border border-border hover:bg-muted font-bold transition-all"
              >
                {isEn ? "Show More" : "더 보기"}
              </button>
            </div>
          )}
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-bold text-muted-foreground">
            {isEn ? "No spirits found." : "검색 결과가 없습니다."}
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {isEn ? "Try adjusting your search terms or filters." : "검색어나 필터를 조정해 보세요."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border group hover:bg-muted/20 transition-all cursor-pointer" onClick={() => performSearch()}>
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Search className="w-10 h-10 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {isEn ? "Search for spirits" : "원하는 술을 검색해 보세요"}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            {isEn ? "Enter a keyword or select a category and click search to see results." : "검색어를 입력하거나 카테고리를 선택한 후 검색 버튼을 눌러주세요."}
          </p>
          <button className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            {isEn ? "Start Explore" : "탐색 시작하기"}
          </button>
        </div>
      )}
    </div>
  );
}
