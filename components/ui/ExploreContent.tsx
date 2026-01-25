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
  LEGAL_CATEGORIES,
  getCategoryStructure,
  getSubCategoriesForMain
} from "@/lib/constants/categories";
import { useDragScroll } from "@/lib/hooks/useDragScroll";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const { searchIndex, searchSpirits, getSpiritById, publishedSpirits, isLoading: isCacheLoading } = useSpiritsCache();

  // Drag scroll refs for category filters
  const legalCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const mainCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const subCategoryScrollRef = useDragScroll<HTMLDivElement>();

  const searchTerm = searchParams.get('search') || '';
  const selectedLegal = searchParams.get('category') || null;
  const selectedMain = searchParams.get('main') || null;
  const selectedSub = searchParams.get('sub') || null;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 24;

  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);

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

  // Pagination on filtered results
  const totalCount = filteredSpirits.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedSpirits = useMemo(() =>
    filteredSpirits.slice((page - 1) * pageSize, page * pageSize),
    [filteredSpirits, page]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, searchTerm, selectedLegal, selectedMain, selectedSub]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
          DISCOVER SPIRITS
        </h1>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
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

            {LEGAL_CATEGORIES.map(cat => (
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
          paginatedSpirits.map((spirit) => (
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

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            searchTerm={searchTerm}
            category={selectedLegal || undefined}
            current={page}
            total={totalPages}
          />
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

function Pagination({ searchTerm, category, current, total }: { searchTerm?: string, category?: string, current: number, total: number }) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  const getUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category) params.set('category', category);
    params.set('page', p.toString());
    return `/explore?${params.toString()}`;
  };

  return (
    <div className="flex gap-1 items-center">
      {current > 1 && <PageLink href={getUrl(current - 1)} label="이전" />}

      {start > 1 && (
        <>
          <PageLink href={getUrl(1)} label="1" />
          <span className="px-2">...</span>
        </>
      )}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
        <PageLink
          key={p}
          href={getUrl(p)}
          label={p.toString()}
          active={p === current}
        />
      ))}

      {end < total && (
        <>
          <span className="px-2">...</span>
          <PageLink href={getUrl(total)} label={total.toString()} />
        </>
      )}

      {current < total && <PageLink href={getUrl(current + 1)} label="다음" />}
    </div>
  );
}

function PageLink({ href, label, active }: { href: string, label: string, active?: boolean }) {
  return (
    <a
      href={href}
      className={`px-3 py-1 min-w-[40px] text-center rounded border transition-colors ${active
        ? 'bg-primary text-primary-foreground border-primary font-bold'
        : 'border-border hover:bg-secondary'
        }`}
    >
      {label}
    </a>
  );
}
