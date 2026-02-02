'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';

interface LiveReview {
  id: string;
  spiritId: string;
  spiritName: string;
  imageUrl?: string;
  nose?: string;
  palate?: string;
  finish?: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface LiveReviewsProps {
  initialReviews?: LiveReview[];
}

export function LiveReviews({ initialReviews = [] }: LiveReviewsProps) {
  const pathname = usePathname() || "";
  const lang = pathname.split('/')[1] === 'en' ? 'en' : 'ko';

  const [reviews, setReviews] = useState<LiveReview[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews?mode=recent');
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

    // Listen for custom events when a review is submitted or deleted
    const handleReviewSubmitted = () => {
      fetchReviews();
    };

    const handleReviewDeleted = () => {
      fetchReviews();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('reviewSubmitted', handleReviewSubmitted);
      window.addEventListener('reviewDeleted', handleReviewDeleted);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
        window.removeEventListener('reviewDeleted', handleReviewDeleted);
      }
    };
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
          href={`/${lang}/spirits/${review.spiritId}`}
          className="block group"
        >
          <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
            {/* Section 1: Product Image */}
            <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg bg-secondary overflow-hidden flex-shrink-0 border border-border">
              {review.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(review.imageUrl, 160)}
                  alt={review.spiritName}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl bg-primary/5">🥃</div>
              )}
            </div>

            {/* Section 2: Text Content Area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm text-foreground">{review.userName}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{getTimeAgo(review.createdAt)}</span>
              </div>
              <div className="text-xs text-primary font-bold mb-1 group-hover:text-primary/80 transition-colors">
                {review.spiritName}
              </div>
              <p className="text-sm text-foreground line-clamp-2 italic opacity-80 mb-2">
                "{review.content}"
              </p>

              {/* Tags Section */}
              {(() => {
                const allTags = [
                  ...(review.nose?.split(',') || []),
                  ...(review.palate?.split(',') || []),
                  ...(review.finish?.split(',') || [])
                ].map(t => t.trim()).filter(Boolean);

                if (allTags.length === 0) return null;

                return (
                  <div className="flex flex-wrap gap-1">
                    {allTags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-md bg-secondary border border-border font-bold text-muted-foreground whitespace-nowrap"
                      >
                        #{tag}
                      </span>
                    ))}
                    {allTags.length > 4 && (
                      <span className="text-[8px] font-bold text-muted-foreground/50 self-center ml-1">
                        +{allTags.length - 4}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Section 3: Overall Score Card */}
            <div className="shrink-0">
              {(() => {
                const score = review.rating;
                const colorClass = score >= 4.0
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : score >= 2.5
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20";

                return (
                  <div className={`flex flex-col items-center justify-center px-4 py-3 sm:py-4 rounded-2xl border ${colorClass} min-w-[72px] shadow-sm`}>
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] mb-1 opacity-80">Overall</span>
                    <span className="text-xl font-black leading-none">{score.toFixed(2)}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
