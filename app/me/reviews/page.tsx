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
        const reviewSpirits = data.reviews.map((review: any) => ({
          id: review.spiritId,
          name: review.spiritName || 'Unknown Spirit',
          category: 'Unknown', // We don't store category in reviews
          imageUrl: undefined, // Will use fallback
          userReview: {
            ratingOverall: review.rating,
            comment: review.content || review.notes,
            createdAt: review.createdAt,
            ratingN: review.ratingN || review.noseRating,
            ratingP: review.ratingP || review.palateRating,
            ratingF: review.ratingF || review.finishRating
          }
        }));
        
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
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <Link href={`/spirits/${spirit.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <Link 
                        href={`/spirits/${spirit.id}`}
                        className="font-bold text-lg hover:text-amber-500 transition-colors"
                      >
                        {spirit.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{spirit.category}</p>
                    </div>
                    
                    {/* Rating */}
                    {spirit.userReview && (
                      <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                        <span className="text-amber-500 font-bold">★</span>
                        <span className="font-bold text-sm">{spirit.userReview.ratingOverall.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Review Details */}
                  {spirit.userReview && (
                    <div className="space-y-2">
                      {/* Individual Ratings */}
                      <div className="flex gap-4 text-xs">
                        {spirit.userReview.ratingN && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">향:</span>
                            <span className="font-semibold">{spirit.userReview.ratingN.toFixed(1)}</span>
                          </div>
                        )}
                        {spirit.userReview.ratingP && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">맛:</span>
                            <span className="font-semibold">{spirit.userReview.ratingP.toFixed(1)}</span>
                          </div>
                        )}
                        {spirit.userReview.ratingF && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">여운:</span>
                            <span className="font-semibold">{spirit.userReview.ratingF.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Comment */}
                      {spirit.userReview.comment && (
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {spirit.userReview.comment}
                        </p>
                      )}

                      {/* Date and Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(spirit.userReview.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                        
                        <button
                          onClick={() => setDeleteTarget(spirit)}
                          className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
