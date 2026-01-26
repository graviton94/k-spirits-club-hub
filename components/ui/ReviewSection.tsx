'use client';

import type { Review } from '@/lib/db/schema';
import { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, Wind, Utensils, Zap, Quote, X, Check } from 'lucide-react';
import metadata from '@/lib/constants/spirits-metadata.json';
import { useAuth } from '@/app/context/auth-context';

interface ExtendedReview extends Review {
  noseRating?: number;
  palateRating?: number;
  finishRating?: number;
}

interface ReviewSectionProps {
  spiritId: string;
  spiritName: string;
  reviews: ExtendedReview[];
}

export default function ReviewSection({ spiritId, spiritName, reviews }: ReviewSectionProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [liveReviews, setLiveReviews] = useState<ExtendedReview[]>(reviews);

  // Synchronize internal state when reviews prop changes (e.g., after fetching from API)
  useEffect(() => {
    setLiveReviews(reviews);
  }, [reviews]);

  const hasReviewed = !!user && liveReviews.some(r => r.userId === user.uid);

  // Calculate averages
  const avgOverall = liveReviews.length > 0
    ? (liveReviews.reduce((acc, r) => acc + r.rating, 0) / liveReviews.length).toFixed(2)
    : "0.00";

  const avgNose = liveReviews.length > 0
    ? (liveReviews.reduce((acc, r) => acc + (r.noseRating || r.rating), 0) / liveReviews.length).toFixed(1)
    : "0.0";

  const avgPalate = liveReviews.length > 0
    ? (liveReviews.reduce((acc, r) => acc + (r.palateRating || r.rating), 0) / liveReviews.length).toFixed(1)
    : "0.0";

  const avgFinish = liveReviews.length > 0
    ? (liveReviews.reduce((acc, r) => acc + (r.finishRating || r.rating), 0) / liveReviews.length).toFixed(1)
    : "0.0";

  const handleReviewSubmitted = (newReview: ExtendedReview) => {
    setLiveReviews(prev => {
      // Filter out existing review by same user to prevent duplicate keys
      const filtered = prev.filter(r => r.userId !== newReview.userId);
      return [newReview, ...filtered];
    });
    setShowForm(false);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            리뷰 <span className="text-amber-500">{liveReviews.length}</span>
          </h2>
          <p className="text-sm text-muted-foreground">시음 경험을 공유해주세요</p>
        </div>
        <button
          onClick={() => {
            if (!showForm && hasReviewed) {
              alert('이미 제품에 대한 리뷰를 작성하셨습니다. 한 제품에는 하나의 리뷰만 작성 가능합니다.');
              return;
            }
            setShowForm(!showForm);
          }}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${hasReviewed && !showForm ? 'bg-secondary text-muted-foreground cursor-not-allowed' : 'text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-primary/30'}`}
        >
          {showForm ? '취소하기' : hasReviewed ? '리뷰 작성 완료' : '+ 리뷰 작성하기'}
        </button>
      </div>

      {/* Average Summary Card */}
      {liveReviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-6 bg-card border border-border rounded-3xl shadow-sm">
          <RatingSummaryItem label="OVERALL" value={avgOverall} icon={<Quote className="w-4 h-4" />} />
          <RatingSummaryItem label="NOSE" value={avgNose} icon={<Wind className="w-4 h-4" />} color="text-blue-500" />
          <RatingSummaryItem label="PALATE" value={avgPalate} icon={<Utensils className="w-4 h-4" />} color="text-orange-500" />
          <RatingSummaryItem label="FINISH" value={avgFinish} icon={<Zap className="w-4 h-4" />} color="text-purple-500" />
        </div>
      )}

      {showForm && <ReviewForm spiritId={spiritId} spiritName={spiritName} onCancel={() => setShowForm(false)} onSubmitted={handleReviewSubmitted} />}

      <div className="space-y-8 mt-6">
        {liveReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {liveReviews.length === 0 && !showForm && (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">
              아직 작성된 리뷰가 없습니다.<br />
              소중한 첫 리뷰를 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingSummaryItem({ label, value, icon, color = "text-amber-500" }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center gap-1.5 text-[10px] font-black ${color} mb-1 tracking-tighter`}>
        {icon} {label}
      </div>
      <div className="text-2xl font-black text-foreground">{value}</div>
      <div className="flex justify-center gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const rating = Number(value);
          const isFull = i + 1 <= rating;
          const isHalf = i + 0.5 <= rating && i + 1 > rating;
          return (
            <div key={i} className="relative">
              <Star className={`w-6 h-6 ${isFull ? 'fill-amber-500 text-amber-500' : isHalf ? 'text-amber-500' : 'text-muted-foreground/20'}`} />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ExtendedReview }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm transition-hover hover:border-primary/20">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black border border-border">
            {review.userName.substring(0, 1)}
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold">{review.userName} • {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {(() => {
            const score = review.rating;
            const colorClass = score >= 4.0
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : score >= 2.5
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20";

            return (
              <div className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl border ${colorClass} min-w-[80px] shadow-sm`}>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Overall</span>
                <span className="text-2xl font-black leading-none">{score.toFixed(2)}</span>
              </div>
            );
          })()}
        </div>
      </div>

      <p className="text-foreground leading-relaxed mb-6 font-medium bg-secondary/30 p-4 rounded-2xl border border-border/50 italic">
        "{review.content}"
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        <ReviewMetricsItem
          title="NOSE"
          rating={review.noseRating || review.rating}
          tags={review.nose}
          icon={<Wind className="w-4 h-4" />}
          color="blue"
        />
        <ReviewMetricsItem
          title="PALATE"
          rating={review.palateRating || review.rating}
          tags={review.palate}
          icon={<Utensils className="w-4 h-4" />}
          color="orange"
        />
        <ReviewMetricsItem
          title="FINISH"
          rating={review.finishRating || review.rating}
          tags={review.finish}
          icon={<Zap className="w-4 h-4" />}
          color="purple"
        />
      </div>
    </div>
  );
}

function ReviewMetricsItem({ title, rating, tags, icon, color }: { title: string, rating: number, tags: string | null, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${colors[color]}`}>
            {icon}
          </div>
          <span className="text-xs font-black tracking-widest">{title}</span>
        </div>
        <div className="text-sm font-black">{rating.toFixed(1)}</div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i + 1 <= rating;
          const isHalf = i + 0.5 <= rating && i + 1 > rating;
          const starColor = color === 'blue' ? 'text-blue-500' : color === 'orange' ? 'text-orange-500' : 'text-purple-500';
          const fillClass = color === 'blue' ? 'fill-blue-500' : color === 'orange' ? 'fill-orange-500' : 'fill-purple-500';

          return (
            <div key={i} className="relative">
              <Star className={`w-5 h-5 ${isFull ? `${fillClass} ${starColor}` : isHalf ? starColor : 'text-muted-foreground/20'}`} />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={`w-5 h-5 ${fillClass} ${starColor}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {tags && (
        <div className="flex flex-wrap gap-1">
          {tags.split(',').map((t, idx) => {
            const cleanTag = t.trim();
            if (!cleanTag) return null;
            return (
              <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-secondary border border-border font-bold text-muted-foreground">
                {cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReviewForm({ spiritId, spiritName, onCancel, onSubmitted }: {
  spiritId: string;
  spiritName: string;
  onCancel: () => void;
  onSubmitted: (review: ExtendedReview) => void;
}) {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    content: '',
    rating: 0,
    nose: [] as string[],
    noseRating: 0,
    palate: [] as string[],
    palateRating: 0,
    finish: [] as string[],
    finishRating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Automatically calculate overall rating whenever component ratings change
  useEffect(() => {
    const total = formData.noseRating + formData.palateRating + formData.finishRating;
    if (total > 0) {
      const avg = total / 3;
      // Round up from the 2nd decimal place (ceil to 2 decimal)
      const ceiled = Math.ceil(avg * 100) / 100;
      setFormData(prev => ({ ...prev, rating: ceiled }));
    }
  }, [formData.noseRating, formData.palateRating, formData.finishRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (formData.rating === 0) {
      alert('별점을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewPayload = {
        spiritId,
        spiritName,
        rating: formData.rating,
        noseRating: formData.noseRating,
        palateRating: formData.palateRating,
        finishRating: formData.finishRating,
        content: formData.content,
        nose: formData.nose.join(', '),
        palate: formData.palate.join(', '),
        finish: formData.finish.join(', '),
        userName: profile?.nickname || user.email?.split('@')[0] || 'Anonymous'
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid
        },
        body: JSON.stringify(reviewPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();

      // Create a review object to add to the list
      const newReview: ExtendedReview = {
        id: result.id,
        spiritId,
        userId: user.uid,
        userName: reviewPayload.userName,
        rating: formData.rating,
        noseRating: formData.noseRating,
        palateRating: formData.palateRating,
        finishRating: formData.finishRating,
        title: '',
        content: formData.content,
        nose: formData.nose.join(', '),
        palate: formData.palate.join(', '),
        finish: formData.finish.join(', '),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true
      };

      onSubmitted(newReview);

      // Dispatch custom event to notify LiveReviews component on home page
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('reviewSubmitted'));
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-12 mb-10 shadow-xl shadow-primary/5 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/20">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-black mb-2">리뷰 제출 완료!</h3>
        <p className="text-muted-foreground font-medium mb-8">
          소중한 경험을 공유해주셔서 감사합니다.<br />
          당신의 리뷰가 다른 분들에게 큰 도움이 될 거예요.
        </p>
        <button
          onClick={onCancel}
          className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all"
        >
          확인
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-primary/5">
      <div className="mb-10">
        <h3 className="text-xl font-black flex items-center gap-2 mb-1">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          리뷰 작성하기
        </h3>
        <p className="text-xs text-muted-foreground font-medium ml-4">
          (점수 클릭 시 0.1점 단위로 조정 가능합니다!)
        </p>
      </div>

      <div className="space-y-12">
        {/* N / P / F Sequential Flow */}
        <div className="space-y-6">
          <RatingSection
            label="향기와 맛(Nose&Flavor)"
            shortLabel="Nose"
            placeholder="어떤 향기가 느껴졌나요?"
            rating={formData.noseRating}
            tags={formData.nose}
            onRatingChange={(r) => setFormData({ ...formData, noseRating: r })}
            onTagsChange={(t) => setFormData({ ...formData, nose: t })}
            color="blue"
            icon={<Wind className="w-4 h-4" />}
            metadataKey="nose"
          />
          <RatingSection
            label="바디감과 질감(Palate)"
            shortLabel="Palate"
            placeholder="머금었을 때는 어떤 느낌인가요?"
            rating={formData.palateRating}
            tags={formData.palate}
            onRatingChange={(r) => setFormData({ ...formData, palateRating: r })}
            onTagsChange={(t) => setFormData({ ...formData, palate: t })}
            color="orange"
            icon={<Utensils className="w-4 h-4" />}
            metadataKey="palate"
          />
          <RatingSection
            label="여운과 끝맛(Finish)"
            shortLabel="Finish"
            placeholder="피니시는 어땠나요?"
            rating={formData.finishRating}
            tags={formData.finish}
            onRatingChange={(r) => setFormData({ ...formData, finishRating: r })}
            onTagsChange={(t) => setFormData({ ...formData, finish: t })}
            color="purple"
            icon={<Zap className="w-4 h-4" />}
            metadataKey="finish"
          />
        </div>

        {/* Bottom Section: Overall Score & Content */}
        <div className="pt-8 border-t border-border space-y-8">
          <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-3xl border border-border/50">
            <label className="text-xs font-black tracking-widest text-muted-foreground uppercase mb-2">종합 평점 (자동 계산)</label>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-foreground">{formData.rating.toFixed(2)}</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const s = i + 1;
                  const visualRating = Math.round(formData.rating * 2) / 2;
                  const isFull = s <= visualRating;
                  const isHalf = s - 0.5 === visualRating;
                  return (
                    <div key={i} className="relative">
                      <Star className={`w-8 h-8 ${isFull ? 'fill-amber-500 text-amber-500' : isHalf ? 'text-amber-500' : 'text-muted-foreground/30'}`} />
                      {isHalf && (
                        <div className="absolute inset-0 overflow-hidden w-[50%]">
                          <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-muted-foreground uppercase">총평</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-6 py-4 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-medium min-h-[120px] text-lg"
              placeholder="후기를 자유롭게 적어주세요!"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-8 py-4 bg-secondary text-foreground font-black rounded-2xl hover:bg-secondary/80 transition-all border border-border disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                제출 중...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" /> 리뷰 제출하기
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function RatingSection({ label, shortLabel, rating, tags, onRatingChange, onTagsChange, color, icon, metadataKey, placeholder }: {
  label: string;
  shortLabel: string;
  rating: number;
  tags: string[];
  onRatingChange: (r: number) => void;
  onTagsChange: (t: string[]) => void;
  color: string;
  icon: any;
  metadataKey: string;
  placeholder: string;
}) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRating = hoverRating !== null ? hoverRating : rating;

  const starColor = color === 'blue' ? 'fill-blue-500 text-blue-500' : color === 'orange' ? 'fill-orange-500 text-orange-500' : 'fill-purple-500 text-purple-500';

  const handlePointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(1, x / width));
    const rawRating = percent * 5;
    const snappedRating = Math.ceil(rawRating * 2) / 2;
    setHoverRating(snappedRating);

    // If clicking/dragging (pointer down)
    if (e.buttons === 1) {
      const fineRating = Math.round(rawRating * 10) / 10;
      onRatingChange(fineRating);
    }
  };

  return (
    <div className={`group p-5 rounded-3xl border border-border/60 bg-card/50 hover:border-${color}-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/5 space-y-4`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Label and Icon */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-500 ring-1 ring-${color}-500/20 shrink-0`}>
            {icon}
          </div>
          <label className={`text-sm font-black tracking-tight ${activeRating > 0 ? `text-${color}-500` : 'text-muted-foreground'} transition-colors truncate`}>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
          </label>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          {/* Star Rating */}
          <div
            ref={containerRef}
            onPointerMove={handlePointer}
            onPointerLeave={() => setHoverRating(null)}
            onPointerDown={handlePointer}
            className="flex justify-between gap-1 px-3 py-2 rounded-xl bg-secondary/30 cursor-pointer touch-none select-none hover:bg-secondary/50 transition-colors"
          >
            {[1, 2, 3, 4, 5].map((s) => {
              const visualRating = Math.round(activeRating * 2) / 2;
              const isFull = s <= visualRating;
              const isHalf = s - 0.5 === visualRating;
              return (
                <div key={s} className="relative transition-transform hover:scale-110 duration-200">
                  <Star className={`w-6 h-6 ${isFull ? starColor : isHalf ? 'text-' + color + '-500' : 'text-muted-foreground/10'}`} />
                  {isHalf && (
                    <div className="absolute inset-0 overflow-hidden w-[50%]">
                      <Star className={`w-6 h-6 ${starColor}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rating Value Number */}
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={activeRating > 0 ? activeRating : ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onRatingChange(Math.min(5, Math.max(0, Math.round(val * 10) / 10)));
              } else {
                onRatingChange(0);
              }
            }}
            className={`w-14 bg-transparent text-right font-black text-lg focus:outline-none focus:ring-2 focus:ring-${color}-500/20 rounded-lg px-1 ${activeRating > 0 ? `text-${color}-500` : 'text-muted-foreground/30'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            placeholder="0.0"
          />
        </div>
      </div>

      <TagInput
        tags={tags}
        onTagsChange={onTagsChange}
        color={color}
        metadataKey={metadataKey}
        placeholder={placeholder}
      />
    </div>
  );
}

function TagInput({ tags, onTagsChange, color, metadataKey, placeholder }: { tags: string[], onTagsChange: (t: string[]) => void, color: string, metadataKey: string, placeholder: string }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract all relevant recommendations for this section
  const recommendations = Object.values((metadata.tag_index as any)[metadataKey]).flatMap((group: any) =>
    group.tags.map((t: string) => t.split(' (')[0].replace('#', ''))
  );

  const filteredRecs = recommendations
    .filter(r => r.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(r))
    .slice(0, 10);

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().replace('#', '');
    if (cleanTag && !tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
    }
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    // Delay blur to allow clicking suggestions
    setTimeout(() => {
      addTag(inputValue);
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 p-3 min-h-[52px] bg-secondary/30 border border-border rounded-2xl transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border text-[11px] font-black text-foreground group">
            #{tag}
            <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted rounded-full">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setShowSuggestions(true)}
          className="flex-1 bg-transparent border-none outline-none text-xs font-bold min-w-[60px] placeholder:text-muted-foreground"
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>

      {showSuggestions && (inputValue || showSuggestions) && filteredRecs.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {filteredRecs.map(rec => (
            <button
              key={rec}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(rec); }}
              className="px-2.5 py-1 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary border border-border text-[10px] font-bold transition-colors"
            >
              {rec}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
