'use client';

import { notFound } from "next/navigation";
import SpiritDetailClient from "./spirit-detail-client";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import type { Spirit } from "@/lib/db/schema";

export default function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getSpiritById } = useSpiritsCache();
  const [id, setId] = useState<string | null>(null);
  const [spirit, setSpirit] = useState<Spirit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap params promise
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  // Load spirit from cache or fetch from DB
  useEffect(() => {
    if (!id) return;

    // Try to get from cache first for instant transition
    const cachedSpirit = getSpiritById(id);
    
    if (cachedSpirit) {
      setSpirit(cachedSpirit);
      setIsLoading(false);
    } else {
      // Fallback to fetching from DB if not in cache
      setIsLoading(true);
      db.getSpirit(id).then(fetchedSpirit => {
        if (fetchedSpirit) {
          setSpirit(fetchedSpirit);
        }
        setIsLoading(false);
      });
    }
  }, [id, getSpiritById]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl pb-32">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-card/50 rounded w-1/4"></div>
          <div className="flex gap-6">
            <div className="w-48 h-64 bg-card/50 rounded-2xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-10 bg-card/50 rounded"></div>
              <div className="h-6 bg-card/50 rounded w-3/4"></div>
              <div className="h-6 bg-card/50 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spirit) {
    notFound();
  }

  // TODO: Implement reviews feature in Firestore
  const reviews: any[] = [];

  return <SpiritDetailClient spirit={spirit} reviews={reviews} />;
}
