'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface LiveReview {
  id: string;
  spiritId: string;
  spiritName: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export function LiveReviews() {
  const [reviews, setReviews] = useState<LiveReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews?limit=5');
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
    
    // Refresh reviews every 30 seconds
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}초 전`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    return `${Math.floor(seconds / 86400)}일 전`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border animate-pulse">
            <div className="w-10 h-10 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary rounded w-1/4" />
              <div className="h-16 bg-secondary rounded" />
              <div className="h-3 bg-secondary rounded w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>아직 작성된 리뷰가 없습니다.</p>
        <p className="text-sm mt-2">첫 번째 리뷰를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Link 
          key={review.id} 
          href={`/spirits/${review.spiritId}`}
          className="block group"
        >
          <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {review.userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm text-foreground">{review.userName}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{getTimeAgo(review.createdAt)}</span>
              </div>
              <div className="text-xs text-primary font-bold mb-2 group-hover:text-primary/80 transition-colors">
                {review.spiritName}
              </div>
              <p className="text-sm text-foreground line-clamp-2 mb-2">
                "{review.content}"
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFull = i + 1 <= review.rating;
                  const isHalf = i + 0.5 === review.rating;
                  return (
                    <div key={i} className="relative">
                      <Star className={`w-3 h-3 ${isFull ? 'fill-amber-500 text-amber-500' : isHalf ? 'text-amber-500' : 'text-muted-foreground/30'}`} />
                      {isHalf && (
                        <div className="absolute inset-0 overflow-hidden w-[50%]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
