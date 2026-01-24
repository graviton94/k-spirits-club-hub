'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import AdminSpiritCard from "@/components/admin/AdminSpiritCard";
import AdminStats from "@/components/admin/AdminStats";
import type { Spirit } from "@/lib/db/schema";
import { db } from "@/lib/db";

export default function AdminContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'unreviewed';
  const page = Number(searchParams.get('page')) || 1;
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function loadSpirits() {
      const { data, total: totalCount, totalPages: pages } = await db.getSpirits(
        {
          isPublished: filter === 'published',
          isReviewed: filter === 'unreviewed' ? false : undefined
        },
        { page, pageSize: 50 }
      );
      setSpirits(data);
      setTotal(totalCount);
      setTotalPages(pages);
    }
    loadSpirits();
  }, [filter, page]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">⚙️ 관리자 대시보드</h1>
        <p className="text-muted-foreground">데이터 검수 및 발행 관리</p>
      </header>

      <AdminStats />

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton label="미검수" value="unreviewed" current={filter} />
          <FilterButton label="발행됨" value="published" current={filter} />
          <FilterButton label="전체" value="all" current={filter} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {filter === 'unreviewed' ? '검수 대기 중' : filter === 'published' ? '발행된 주류' : '모든 주류'} ({total})
        </h2>

        <div className="space-y-4">
          {spirits.map((spirit) => (
            <AdminSpiritCard key={spirit.id} spirit={spirit} />
          ))}
        </div>

        {spirits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">이 카테고리에 해당하는 술이 없습니다.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Pagination filter={filter} current={page} total={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({ filter, current, total }: { filter: string, current: number, total: number }) {
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  return (
    <div className="flex gap-1">
      {current > 1 && <PageLink filter={filter} page={current - 1} label="Prev" />}
      {start > 1 && <span className="px-2">...</span>}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
        <PageLink key={p} filter={filter} page={p} label={p.toString()} active={p === current} />
      ))}
      {end < total && <span className="px-2">...</span>}
      {current < total && <PageLink filter={filter} page={current + 1} label="Next" />}
    </div>
  );
}

function PageLink({ filter, page, label, active }: { filter: string, page: number, label: string, active?: boolean }) {
  return (
    <a
      href={`/admin?filter=${filter}&page=${page}`}
      className={`px-3 py-1 rounded border transition-colors ${active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-secondary'
        }`}
    >
      {label}
    </a>
  );
}

function FilterButton({ label, value, current }: { label: string; value: string; current: string }) {
  const isActive = current === value;
  return (
    <a
      href={`/admin?filter=${value}`}
      className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${isActive
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-secondary'
        }`}
    >
      {label}
    </a>
  );
}
