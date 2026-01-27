'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SpiritWithReview {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  userReview?: {
    ratingOverall: number;
    comment: string;
    createdAt: string;
    ratingN?: number;
    ratingP?: number;
    ratingF?: number;
  };
}

export default function ReviewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [spirits, setSpirits] = useState<SpiritWithReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SpiritWithReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/me');
      return;
    }

    if (user) {
      loadReviews();
    }
  }, [user, loading]);

  const loadReviews = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch reviews from public reviews collection
      const response = await fetch(`/api/reviews?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();

        // Map reviews to spirit format for display
        const reviewSpirits = data.reviews.map((review: any) => {
          // Processing tags from comma-separated strings
          const tags = [
            ...(review.nose ? review.nose.split(',') : []),
            ...(review.palate ? review.palate.split(',') : []),
            ...(review.finish ? review.finish.split(',') : []),
            // Fallback to old format just in case
            ...(review.tagsN ? review.tagsN.split(',') : []),
            ...(review.tagsP ? review.tagsP.split(',') : []),
            ...(review.tagsF ? review.tagsF.split(',') : [])
          ].map(t => t.trim()).filter(Boolean);

          return {
            id: review.spiritId,
            name: review.spiritName || 'Unknown Spirit',
            category: review.category || 'Unknown', // Category now comes from joined spirit data
            imageUrl: review.imageUrl, // Image now comes from joined spirit data
            userReview: {
              ratingOverall: review.rating,
              comment: review.content || review.notes,
              createdAt: review.createdAt,
              ratingN: review.ratingN || review.noseRating,
              ratingP: review.ratingP || review.palateRating,
              ratingF: review.ratingF || review.finishRating,
              tags: [...new Set(tags)] // Deduplicate tags
            }
          };
        });

        setSpirits(reviewSpirits);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteTarget || !user) return;

    setIsDeleting(true);
    try {
      // Use the review API endpoint to delete the review properly
      const response = await fetch(`/api/reviews?spiritId=${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.uid
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete review:', response.status, errorText);
        throw new Error(`Failed to delete review: ${response.status}`);
      }

      setSpirits(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);

      // Dispatch event to notify LiveReviews component to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('reviewDeleted'));
      }

      alert('리뷰가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥃</div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/me"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">뒤로가기</span>
        </Link>

        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          내가 쓴 리뷰
        </h1>
        <p className="text-muted-foreground">총 {spirits.length}개의 리뷰</p>
      </div>

      {/* Reviews List */}
      {spirits.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold mb-2">작성한 리뷰가 없습니다</h2>
          <p className="text-muted-foreground mb-6">
            술을 마시고 첫 리뷰를 작성해보세요!
          </p>
          <Link
            href="/explore"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            술 탐색하기 →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {spirits.map((spirit) => (
            <motion.div
              key={spirit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-amber-500/50 transition-all shadow-sm">

                {/* 1. Spirit Image (Left) */}
                <Link href={`/spirits/${spirit.id}`} className="flex-shrink-0 pt-1">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-secondary overflow-hidden border border-border flex items-center justify-center">
                    <img
                      src={spirit.imageUrl || getCategoryFallbackImage(spirit.category)}
                      alt={spirit.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getCategoryFallbackImage(spirit.category);
                      }}
                    />
                  </div>
                </Link>

                {/* 2. Content (Center) */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  {/* Row 1: Spirit Name (Top Priority) */}
                  <Link
                    href={`/spirits/${spirit.id}`}
                    className="text-base sm:text-lg font-bold text-foreground hover:text-amber-500 transition-colors line-clamp-1 leading-tight"
                  >
                    {spirit.name}
                  </Link>

                  {/* Row 2: Metadata (Date | Category) */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium bg-secondary px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                      {spirit.category}
                    </span>
                    <span>•</span>
                    <span>
                      {spirit.userReview?.createdAt ? new Date(spirit.userReview.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>

                  {/* Row 3: Comment */}
                  {spirit.userReview?.comment && (
                    <p className="text-sm text-foreground/80 line-clamp-2 italic leading-relaxed">
                      "{spirit.userReview.comment}"
                    </p>
                  )}

                  {/* Row 4: Flavor Tags (Pills) */}
                  {/* We now check tagsN, tagsP, tagsF from the API */}
                  {spirit.userReview && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {/* Combine all tags into a single list for cleaner display, or separate them? 
                          User asked for tagsF, tagsN, tagsP as pills. 
                          The API returns 'ratingN' (number) but also 'nose' (string tags) in '/api/reviews'.
                          Let's verify what 'userReview' object actually holds from 'loadReviews'.
                       */}
                      {/* Checking loadReviews mapping: 
                           ratingN: review.ratingN || review.noseRating 
                           But we need TAGS. 
                           I will update loadReviews in the next step to ensure tags are mapped. 
                           For now, assuming spirit.userReview has 'tags' property.
                       */}

                      {(spirit.userReview as any).tags && (spirit.userReview as any).tags.length > 0 ? (
                        (spirit.userReview as any).tags.map((tag: string, idx: number) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-medium whitespace-nowrap">
                            #{tag}
                          </span>
                        ))
                      ) : null}
                    </div>
                  )}
                </div>

                {/* 3. Score (Right) */}
                {spirit.userReview && (
                  <div className="shrink-0 flex flex-col items-end gap-3 pt-1">
                    {(() => {
                      const score = spirit.userReview.ratingOverall;
                      const colorClass = score >= 4.0
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : score >= 2.5
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20";

                      return (
                        <div className={`flex flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-xl border ${colorClass} min-w-[60px] sm:min-w-[72px]`}>
                          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider opacity-70">Overall</span>
                          <span className="text-lg sm:text-xl font-black leading-none">{score.toFixed(1)}</span>
                        </div>
                      );
                    })()}

                    {/* Delete Button (Restored) */}
                    <button
                      onClick={() => setDeleteTarget(spirit)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      title="리뷰 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border-2 border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 bg-secondary border-b border-border">
                <h2 className="text-xl font-black text-foreground text-center">리뷰 삭제</h2>
              </div>

              <div className="p-6">
                <p className="text-center text-foreground mb-6">
                  <span className="font-bold">{deleteTarget.name}</span>의<br />
                  리뷰를 정말 삭제하시겠습니까?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl border-2 border-border transition-all disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    disabled={isDeleting}
                    className="flex-1 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
