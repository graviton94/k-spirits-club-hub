'use client';

import { useState, useEffect } from 'react';
export const runtime = 'edge';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import SuccessToast from '@/components/ui/SuccessToast';

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
  const params = useParams();
  const lang = (params?.lang as string) || 'ko';
  const isEn = lang === 'en';

  const [spirits, setSpirits] = useState<SpiritWithReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SpiritWithReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

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
      const response = await fetch(`/api/reviews?spiritId=${deleteTarget.id}&userId=${user.uid}`, {
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
      window.dispatchEvent(new CustomEvent('reviewDeleted'));

      setToastMessage(isEn ? 'Review deleted successfully.' : '리뷰가 삭제되었습니다.');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to delete review:', error);
      setToastMessage(isEn ? 'Failed to delete. Please try again.' : '삭제에 실패했습니다. 다시 시도해주세요.');
      setToastVariant('error');
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥃</div>
          <p className="text-muted-foreground">{isEn ? 'Loading...' : '로딩 중...'}</p>
        </div>
      </div>
    );
  }

  const t = {
    back: isEn ? 'Back' : '뒤로가기',
    title: isEn ? 'My Reviews' : '내가 쓴 리뷰',
    totalPrefix: isEn ? 'Total' : '총',
    totalSuffix: isEn ? 'reviews' : '개의 리뷰',
    emptyTitle: isEn ? 'No reviews found' : '작성한 리뷰가 없습니다',
    emptyDesc: isEn ? 'Start your first spirit review!' : '술을 마시고 첫 리뷰를 작성해보세요!',
    explore: isEn ? 'Explore Spirits →' : '술 탐색하기 →',
    deleteTitle: isEn ? 'Delete Review' : '리뷰 삭제',
    deleteConfirm: isEn ? 'Are you sure you want to delete this review? This cannot be undone.' : '이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.',
    cancel: isEn ? 'Cancel' : '취소',
    delete: isEn ? 'Delete' : '삭제하기',
    deleting: isEn ? 'Deleting...' : '삭제 중...'
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${lang}/me`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">{t.back}</span>
        </Link>

        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.totalPrefix} {spirits.length}{t.totalSuffix}</p>
      </div>

      {/* Reviews List */}
      {spirits.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold mb-2">{t.emptyTitle}</h2>
          <p className="text-muted-foreground mb-6">
            {t.emptyDesc}
          </p>
          <Link
            href={`/${lang}/explore`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {t.explore}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {spirits.map((spirit, idx) => (
            <motion.div
              key={`${spirit.id}-${idx}`}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-card border border-border rounded-[2.5rem] p-5 sm:p-7 hover:border-amber-500/30 hover:shadow-xl transition-all mb-6"
            >
              {/* Row 1 & 2: Image + Meta */}
              <div className="flex gap-4 sm:gap-6 mb-5">
                {/* Spirit Image */}
                <Link href={`/spirits/${spirit.id}`} className="shrink-0">
                  <div className="w-20 h-24 sm:w-28 sm:h-36 rounded-2xl bg-secondary overflow-hidden border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={getOptimizedImageUrl(spirit.imageUrl || getCategoryFallbackImage(spirit.category), 200)}
                      alt={spirit.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Info Right */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <Link
                    href={`/spirits/${spirit.id}`}
                    className="text-xl sm:text-2xl font-black hover:text-amber-600 transition-colors truncate mb-3"
                  >
                    {spirit.name}
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Capsule */}
                    <div className="px-3 py-1.5 bg-secondary/80 border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {spirit.category}
                    </div>

                    {/* Rating Capsule */}
                    <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-600 dark:text-amber-400">
                      ★ {spirit.userReview?.ratingOverall.toFixed(1)}
                    </div>

                    {/* Date Capsule */}
                    <div className="px-3 py-1.5 bg-slate-500/10 border border-slate-500/20 rounded-full text-[10px] font-black text-muted-foreground whitespace-nowrap">
                      {spirit.userReview?.createdAt ? new Date(spirit.userReview.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Flavor Tags (Colorful) */}
              {(spirit.userReview as any)?.tags && (spirit.userReview as any).tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5 pt-4 border-t border-border/50">
                  {(spirit.userReview as any).tags.slice(0, 6).map((tag: string, i: number) => {
                    const colors = [
                      'bg-blue-500/10 text-blue-600 border-blue-500/20',
                      'bg-orange-500/10 text-orange-600 border-orange-500/20',
                      'bg-purple-500/10 text-purple-600 border-purple-500/20',
                      'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                      'bg-rose-500/10 text-rose-600 border-rose-500/20',
                      'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                    ];
                    return (
                      <span key={i} className={`text-[9px] sm:text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-tight ${colors[i % colors.length]}`}>
                        #{tag}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Row 4: Review Comment */}
              {spirit.userReview?.comment && (
                <div className="bg-secondary/20 p-5 rounded-3xl border border-border/50 transition-colors group-hover:bg-secondary/40">
                  <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium italic">
                    "{spirit.userReview.comment}"
                  </p>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => setDeleteTarget(spirit)}
                className="absolute top-5 right-5 p-2 text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="리뷰 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Header Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-rose-500/10 to-orange-500/10 z-0" />

              <div className="relative z-10 p-8 flex flex-col items-center text-center">
                {/* Icon Bubble */}
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-rose-500/20">
                  <Trash2 className="w-10 h-10 text-rose-500" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {t.deleteTitle}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white block text-base mb-1">
                    "{deleteTarget.name}"
                  </span>
                  {t.deleteConfirm}
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 px-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/30 font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    {isDeleting ? t.deleting : t.delete}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessToast
        isVisible={showToast}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
