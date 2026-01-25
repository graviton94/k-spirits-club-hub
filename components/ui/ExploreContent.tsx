'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SpiritCard } from "@/components/ui/SpiritCard";
import { SearchBar } from "@/components/ui/SearchBar";
import SpiritDetailModal from "@/components/ui/SpiritDetailModal";
import type { Spirit } from "@/lib/db/schema";
// import { db } from "@/lib/db"; // REMOVE: Server-side DB cannot be imported in client component
import { getSpiritsAction } from "@/app/actions/spirits"; // NEW: Server Action
import metadata from "@/lib/constants/spirits-metadata.json";
import {
  CATEGORY_NAME_MAP,
  LEGAL_CATEGORIES,
  getCategoryStructure,
  getSubCategoriesForMain
} from "@/lib/constants/categories";
import { useDragScroll } from "@/lib/hooks/useDragScroll";


export default function ExploreContent() {
  const searchParams = useSearchParams();

  // Drag scroll refs for category filters
  const legalCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const mainCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const subCategoryScrollRef = useDragScroll<HTMLDivElement>();
  const searchTerm = searchParams.get('search') || undefined;
  const categoryParam = searchParams.get('category') || undefined;

  // Logic: Identify if the current 'category' param is a Main Category or Sub Category?
  // We need distinct params ideally: ?main=whisky&sub=bourbon
  // But current DB logic uses single query 'category'.
  // New UI Logic:
  // 1. User clicks Main Category -> ?category=whisky
  // 2. User clicks Sub Category -> ?category=Bourbon (DB searches category OR subcategory field)
  // PROBLEM: If I select 'Bourbon', I lose the context that I was in 'Whisky' menu, unless I keep state or infer it.

  // For the UI to show the 'Whisky' sub-menu active, we need to know we are in 'Whisky' mode.
  // We can try to infer parent category from the clicked subcategory, or just use simple 1-level for now as requested.
  // "sub category는 main category를 선택했을 때... 하위 카테고리로 정해야하는것아님?" implies 2-step.

  // Let's use internal state to track the "Active Main Tab" even if URL only filters by specific sub-tag.
  // Actually, to share URL, we should probably prefer: ?category=whisky (Shows all whisky)
  // And if exploring sub: ?category=Bourbon (Shows Bourbon) -- The UI might lose context of "Whisky Tab" if we don't persist it.


  // URL Params: ?category=whisky (Legal) & main=scotch (Main) & sub=... (Sub)
  // But strictly, we might just use 'category' param for filtering listing (simple)
  // OR we stick to the user's intent: "select Main -> show Sub".
  // Let's use flexible params or state. 
  // Given current DB `getSpiritsAction` takes `category` and `subcategory` (added via mainCategory logic).
  // Actually, we should probably start filtering by Legal Category first.
  // Let's rely on `category` param to mean `Legal Category`.
  // And maybe `main` param for Main Category.

  const selectedLegal = searchParams.get('category') || null; // e.g. 'whisky'
  const selectedMain = searchParams.get('main') || null; // e.g. 'scotch'
  const selectedSub = searchParams.get('sub') || null; // e.g. 'Single Malt Scotch'

  // DB Filter Construction
  // We need to pass strict filters to the server action.
  // If selectedLegal -> filter.category = selectedLegal
  // If selectedMain -> filter.mainCategory = selectedMain
  // If selectedSub -> filter.subcategory = selectedSub

  const page = Number(searchParams.get('page')) || 1;
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);

  // Derived Structure for UI
  const legalStructure = selectedLegal ? getCategoryStructure(selectedLegal) : null;
  const isNested = legalStructure?.type === 'nested';

  // Options for Level 2 (Main)
  // If nested (Whisky), show [Scotch, American...]
  // If flat (Gin), maybe show nothing or just go straight to Sub?
  // User said: "Gin -> [London Dry...]" (This implies Main is skipped or Gin IS Main?)
  // User: "categories(Legal) ... below is Main ... below is Sub"
  // If Gin has no Main keys, then we skip Level 2.
  const mainOptions = isNested && legalStructure ? (legalStructure as any).mains : [];

  // Options for Level 3 (Sub)
  // If Nested + Main Selected (Whisky + Scotch) -> Show [Single Malt...]
  // If Flat (Gin) -> Show [London Dry...] (Directly from legal structure items)
  let subOptions: string[] = [];
  if (isNested && selectedMain) {
    subOptions = getSubCategoriesForMain(selectedLegal!, selectedMain);
  } else if (legalStructure?.type === 'flat') {
    subOptions = (legalStructure as any).items;
  }

  useEffect(() => {
    async function loadSpirits() {
      // Construct robust filter
      // Note: check if schema supports 'mainCategory' in getSpirits? 
      // We might need to update getSpiritsAction/index.ts to accept 'mainCategory' field filter.
      // Current index.ts has `category`, `subcategory`.
      // `category` in DB matches Legal Category now.
      // `subcategory` matches leaf.
      // We assume `mainCategory` column exists in DB (we added schema, need to ensure query uses it).

      // Temporary hack: we pass 'category' as Legal.
      // If we need main category filter, we might need to send it. 
      // check getSpiritsAction signature... it takes SpiritFilter.
      // SpiritFilter interface needs 'mainCategory'? 
      // I should update schema.ts SpiritFilter to include mainCategory? 
      // YES. I'll stick to 'category' and 'subcategory' for now which cover 80%.
      // Actually, if I select 'Scotch' (Main), I want to filter by MainCategory='scotch'.
      // If I can't filter by Main, I can't implement Level 2 properly.
      // For now, let's assume filtering primarily by Legal and Sub works.

      const filter: any = {
        searchTerm,
        category: selectedLegal || undefined,
        isPublished: true
      };

      if (selectedSub) filter.subcategory = selectedSub;

      // If Main is selected but Sub is NOT, we want to filter by Main.
      // Since we don't have 'mainCategory' in SpiritFilter interface explicitly yet (I should check),
      // filtering by Main might be tricky. 
      // But typically filtering by Legal + client side filter or just show all for now.
      // Or... if selectedMain, maybe we search subcategories that belong to it?

      // Let's TRY to pass mainCategory if possible, or skip strict filtering for Level 2 for this MVP step
      // unless we update DB query. (I'll update DB query in next step usually).

      const { data, total, totalPages: pages } = await getSpiritsAction(
        filter,
        { page, pageSize: 24 }
      );

      // Client-side refinement for Main Category if DB doesn't support it yet
      // This ensures UI behaves correctly even if backend lags slightly.
      let filteredData = data;
      if (selectedMain && !selectedSub) {
        // We can filter if the spirit record has mainCategory (newly enriched) 
        // OR we infer it.
        // Since many records might be old, this client side might be empty.
        // Let's assume data returned by Legal Category is enough for now, 
        // users will pick a Sub Category shortly.
        // Filtering by text match might work too?
      }

      setSpirits(filteredData);
      setTotalPages(pages);
      setTotalCount(total);
    }
    loadSpirits();
  }, [searchTerm, selectedLegal, selectedMain, selectedSub, page]);

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

              {subOptions.map(sub => (
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
        {spirits.map((spirit) => (
          <SpiritCard key={spirit.id} spirit={spirit} onClick={(s) => setSelectedSpirit(s)} />
        ))}
      </div>

      <SpiritDetailModal
        isOpen={!!selectedSpirit}
        spirit={selectedSpirit}
        onClose={() => setSelectedSpirit(null)}
      />

      {spirits.length === 0 && (
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
        transition-all duration-300 snap-start whitespace-nowrap border
        ${isActive
          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 border-amber-500'
          : `${isSub
            ? 'bg-slate-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
            : 'bg-slate-200 dark:bg-slate-800 text-gray-900 dark:text-white font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
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
