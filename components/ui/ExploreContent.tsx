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
  const [spirits, setSpirits] = useState<Spirit[]>([]);

  useEffect(() => {
    async function loadSpirits() {
      const { data } = await db.getSpirits(
        { searchTerm, category, isPublished: true },
        { page: 1, pageSize: 20 }
      );
      setSpirits(data);
    }
    loadSpirits();
  }, [searchTerm, category]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">🔍 Explore Spirits</h1>
        <SearchBar />
      </header>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <CategoryFilter label="All" value="" />
          <CategoryFilter label="Whisky" value="whisky" />
          <CategoryFilter label="Soju" value="soju" />
          <CategoryFilter label="Vodka" value="vodka" />
          <CategoryFilter label="Gin" value="gin" />
          <CategoryFilter label="Rum" value="rum" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {spirits.map((spirit) => (
          <SpiritCard key={spirit.id} spirit={spirit} />
        ))}
      </div>

      {spirits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No spirits found. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}

function CategoryFilter({ label, value }: { label: string; value: string }) {
  return (
    <a
      href={value ? `/explore?category=${value}` : '/explore'}
      className="px-4 py-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
    >
      {label}
    </a>
  );
}
