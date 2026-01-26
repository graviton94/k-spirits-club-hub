'use client';

import { notFound } from "next/navigation";
import SpiritDetailClient from "./spirit-detail-client";
import { useSpiritsCache } from "@/app/context/spirits-cache-context";
import { useEffect, useState } from "react";
import type { Spirit } from "@/lib/db/schema";

export const runtime = 'edge';

export default function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getSpiritDetail } = useSpiritsCache();
  const [id, setId] = useState<string | null>(null);
  const [spirit, setSpirit] = useState<Spirit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Unwrap params promise
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  // Load spirit using on-demand detail loading
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    
    // Use getSpiritDetail which handles caching and on-demand loading
    getSpiritDetail(id)
      .then(fetchedSpirit => {
        if (fetchedSpirit) {
          setSpirit(fetchedSpirit);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch spirit:', error);
        setIsLoading(false);
      });
  }, [id, getSpiritDetail]);

  // Fetch reviews for this spirit
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?spiritId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

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

  return <SpiritDetailClient spirit={spirit} reviews={reviews} />;
}
}
