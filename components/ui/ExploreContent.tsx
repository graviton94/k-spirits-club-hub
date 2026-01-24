'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SpiritCard from "@/components/ui/SpiritCard";
import SearchBar from "@/components/ui/SearchBar";
import type { Spirit } from "@/lib/db/schema";
import { db } from "@/lib/db";

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const page = Number(searchParams.get('page')) || 1;
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadSpirits() {
      const { data, total, totalPages: pages } = await db.getSpirits(
        { searchTerm, category, isPublished: true },
        { page, pageSize: 24 } // 4*6 grid
      );
      setSpirits(data);
      setTotalPages(pages);
      setTotalCount(total);
    }
    loadSpirits();
  }, [searchTerm, category, page]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">🔍 주류 탐색</h1>
        <SearchBar />
      </header>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryFilter label="전체" value="" current={category || ''} />
          <CategoryFilter label="소주" value="소주" current={category || ''} />
          <CategoryFilter label="맥주" value="맥주" current={category || ''} />
          <CategoryFilter label="탁주 (막걸리)" value="탁주" current={category || ''} />
          <CategoryFilter label="위스키" value="위스키" current={category || ''} />
          <CategoryFilter label="과실주 (와인)" value="과실주" current={category || ''} />
          <CategoryFilter label="리큐르" value="리큐르" current={category || ''} />
          <CategoryFilter label="브랜디" value="브랜디" current={category || ''} />
          <CategoryFilter label="일반증류주" value="일반증류주" current={category || ''} />
        </div>
        {totalCount > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            총 {totalCount.toLocaleString()}건의 검색 결과
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {spirits.map((spirit) => (
          <SpiritCard key={spirit.id} spirit={spirit} />
        ))}
      </div>

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
            category={category}
            current={page}
            total={totalPages}
          />
        </div>
      )}
    </div>
  );
}

function CategoryFilter({ label, value, current }: { label: string; value: string; current: string }) {
  const isActive = current === value;
  return (
    <a
      href={value ? `/explore?category=${encodeURIComponent(value)}` : '/explore'}
      className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border hover:bg-secondary'
        }`}
    >
      {label}
    </a>
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
