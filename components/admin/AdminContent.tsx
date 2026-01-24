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
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadSpirits() {
      const { data, total: totalCount } = await db.getSpirits(
        { isPublished: filter === 'published', isReviewed: filter === 'unreviewed' ? false : undefined },
        { page: 1, pageSize: 50 }
      );
      setSpirits(data);
      setTotal(totalCount);
    }
    loadSpirits();
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">⚙️ Admin Dashboard</h1>
        <p className="text-muted-foreground">Data review and publishing (검수)</p>
      </header>

      <AdminStats />

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton label="Unreviewed" value="unreviewed" current={filter} />
          <FilterButton label="Published" value="published" current={filter} />
          <FilterButton label="All" value="all" current={filter} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {filter === 'unreviewed' ? 'Pending Review' : filter === 'published' ? 'Published Spirits' : 'All Spirits'} ({total})
        </h2>
        
        <div className="space-y-4">
          {spirits.map((spirit) => (
            <AdminSpiritCard key={spirit.id} spirit={spirit} />
          ))}
        </div>

        {spirits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No spirits found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, value, current }: { label: string; value: string; current: string }) {
  const isActive = current === value;
  return (
    <a
      href={`/admin?filter=${value}`}
      className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
        isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border hover:bg-secondary'
      }`}
    >
      {label}
    </a>
  );
}
