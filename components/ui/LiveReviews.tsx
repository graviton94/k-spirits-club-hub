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
    const isEn = lang === 'en';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return isEn ? `${seconds}s ago` : `${seconds}초 전`;
    if (seconds < 3600) return isEn ? `${Math.floor(seconds / 60)}m ago` : `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return isEn ? `${Math.floor(seconds / 3600)}h ago` : `${Math.floor(seconds / 3600)}시간 전`;
    return isEn ? `${Math.floor(seconds / 86400)}d ago` : `${Math.floor(seconds / 86400)}일 전`;
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
    const isEn = lang === 'en';
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{isEn ? "No reviews yet." : "아직 작성된 리뷰가 없습니다."}</p>
        <p className="text-sm mt-2">{isEn ? "Be the first to leave a review!" : "첫 번째 리뷰를 작성해보세요!"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <Link
          key={`${review.id}-${index}`}
          href={`/${lang}/spirits/${review.spiritId}`}
          className="block group"
        >
          <div className="relative bg-card border border-border rounded-[2.5rem] p-5 sm:p-6 transition-all hover:border-amber-500/30 hover:shadow-xl">
            {/* Row 1 & 2: Image + Meta */}
            <div className="flex gap-4 sm:gap-6 mb-4">
              {/* Product Image */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-secondary overflow-hidden flex-shrink-0 border border-border">
                {review.imageUrl ? (
                  <img
                    src={getOptimizedImageUrl(review.imageUrl, 160)}
                    alt={review.spiritName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl bg-primary/5">🥃</div>
                )}
              </div>

              {/* Info Right */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="text-base sm:text-lg font-black text-foreground group-hover:text-amber-600 transition-colors truncate mb-2">
                  {review.spiritName}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Author Capsule */}
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary border border-border rounded-full text-[10px] font-black text-foreground">
                    <span className="truncate max-w-[80px]">{review.userName}</span>
                  </div>

                  {/* Rating Capsule */}
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-600 dark:text-amber-400">
                    ★ {review.rating.toFixed(1)}
                  </div>

                  {/* Date Capsule */}
                  <div className="px-3 py-1 bg-slate-500/10 border border-slate-500/20 rounded-full text-[10px] font-black text-muted-foreground">
                    {getTimeAgo(review.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Flavor Tags (Colorful) */}
            {(() => {
              const allTags = [
                ...(review.nose?.split(',') || []),
                ...(review.palate?.split(',') || []),
                ...(review.finish?.split(',') || [])
              ].map(t => t.trim()).filter(Boolean);

              if (allTags.length === 0) return null;

              return (
                <div className="flex flex-wrap gap-1.5 mb-4 pt-4 border-t border-border/50">
                  {allTags.slice(0, 4).map((tag, idx) => {
                    const colors = [
                      'bg-blue-500/10 text-blue-600 border-blue-500/20',
                      'bg-orange-500/10 text-orange-600 border-orange-500/20',
                      'bg-purple-500/10 text-purple-600 border-purple-500/20',
                      'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    ];
                    return (
                      <span key={idx} className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tight ${colors[idx % colors.length]}`}>
                        #{tag}
                      </span>
                    );
                  })}
                </div>
              );
            })()}

            {/* Row 4: Review Content */}
            <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50 transition-colors group-hover:bg-secondary/50">
              <p className="text-sm leading-relaxed text-foreground/90 font-medium italic line-clamp-2">
                "{review.content}"
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
