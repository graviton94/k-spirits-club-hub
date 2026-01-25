import type { Review } from '@/lib/db/schema';
import { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, Wind, Utensils, Zap, Quote, X, Check } from 'lucide-react';
import metadata from '@/lib/constants/spirits-metadata.json';

interface ExtendedReview extends Review {
  noseRating?: number;
  palateRating?: number;
  finishRating?: number;
}

interface ReviewSectionProps {
  spiritId: string;
  reviews: ExtendedReview[];
}

export default function ReviewSection({ spiritId, reviews }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  // Calculate averages
  const avgOverall = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const avgNose = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.noseRating || r.rating), 0) / reviews.length).toFixed(1)
    : "0.0";

  const avgPalate = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.palateRating || r.rating), 0) / reviews.length).toFixed(1)
    : "0.0";

  const avgFinish = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.finishRating || r.rating), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            리뷰 <span className="text-amber-500">{reviews.length}</span>
          </h2>
          <p className="text-sm text-muted-foreground">시음 경험을 공유해주세요</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-primary/30"
        >
          {showForm ? '취소하기' : '+ 리뷰 작성하기'}
        </button>
      </div>

      {/* Average Summary Card */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-6 bg-card border border-border rounded-3xl shadow-sm">
          <RatingSummaryItem label="OVERALL" value={avgOverall} icon={<Quote className="w-4 h-4" />} />
          <RatingSummaryItem label="NOSE" value={avgNose} icon={<Wind className="w-4 h-4" />} color="text-blue-500" />
          <RatingSummaryItem label="PALATE" value={avgPalate} icon={<Utensils className="w-4 h-4" />} color="text-orange-500" />
          <RatingSummaryItem label="FINISH" value={avgFinish} icon={<Zap className="w-4 h-4" />} color="text-purple-500" />
        </div>
      )}

      {showForm && <ReviewForm spiritId={spiritId} onCancel={() => setShowForm(false)} />}

      <div className="space-y-8 mt-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && !showForm && (
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
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const r = review.rating;
              const isFull = i + 1 <= r;
              const isHalf = i + 0.5 <= r && i + 1 > r;
              return (
                <div key={i} className="relative">
                  <Star className={`w-4 h-4 ${isFull ? 'fill-amber-500 text-amber-500' : isHalf ? 'text-amber-500' : 'text-border'}`} />
                  {isHalf && (
                    <div className="absolute inset-0 overflow-hidden w-[50%]">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <span className="text-[10px] font-black text-amber-500 mt-1 uppercase tracking-widest">Overall Score</span>
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

function ReviewForm({ spiritId, onCancel }: { spiritId: string; onCancel: () => void }) {
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

  // Automatically calculate overall rating whenever component ratings change
  useEffect(() => {
    const total = formData.noseRating + formData.palateRating + formData.finishRating;
    if (total > 0) {
      const avg = total / 3;
      const snapped = Math.round(avg * 2) / 2;
      setFormData(prev => ({ ...prev, rating: snapped }));
    }
  }, [formData.noseRating, formData.palateRating, formData.finishRating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      nose: formData.nose.join(', '),
      palate: formData.palate.join(', '),
      finish: formData.finish.join(', ')
    };
    console.log('Submitting review:', finalData);
    alert('리뷰가 제출되었습니다!');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black mb-10 flex items-center gap-2">
        <span className="w-2 h-6 bg-primary rounded-full"></span>
        리뷰 작성하기
      </h3>

      <div className="space-y-12">
        {/* N / P / F Sequential Flow */}
        <div className="grid md:grid-cols-3 gap-12">
          <RatingSection
            label="NOSE (향)"
            rating={formData.noseRating}
            tags={formData.nose}
            onRatingChange={(r) => setFormData({ ...formData, noseRating: r })}
            onTagsChange={(t) => setFormData({ ...formData, nose: t })}
            color="blue"
            icon={<Wind className="w-4 h-4" />}
            metadataKey="nose"
          />
          <RatingSection
            label="PALATE (맛)"
            rating={formData.palateRating}
            tags={formData.palate}
            onRatingChange={(r) => setFormData({ ...formData, palateRating: r })}
            onTagsChange={(t) => setFormData({ ...formData, palate: t })}
            color="orange"
            icon={<Utensils className="w-4 h-4" />}
            metadataKey="palate"
          />
          <RatingSection
            label="FINISH (여운)"
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
              <div className="text-4xl font-black text-foreground">{formData.rating.toFixed(1)}</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="relative">
                    <Star className={`w-8 h-8 ${i + 1 <= formData.rating ? 'fill-amber-500 text-amber-500' : i + 0.5 === formData.rating ? 'text-amber-500' : 'text-muted-foreground/30'}`} />
                    {i + 0.5 === formData.rating && (
                      <div className="absolute inset-0 overflow-hidden w-[50%]">
                        <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
                      </div>
                    )}
                  </div>
                ))}
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
            className="px-8 py-4 bg-secondary text-foreground font-black rounded-2xl hover:bg-secondary/80 transition-all border border-border"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 py-4 px-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> 리뷰 제출하기
          </button>
        </div>
      </div>
    </form>
  );
}

function RatingSection({ label, rating, tags, onRatingChange, onTagsChange, color, icon, metadataKey }: {
  label: string;
  rating: number;
  tags: string[];
  onRatingChange: (r: number) => void;
  onTagsChange: (t: string[]) => void;
  color: string;
  icon: any;
  metadataKey: string;
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
      onRatingChange(snappedRating);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4">
        {/* Label and Icon moved inline */}
        <div className="flex items-center gap-3 w-full">
          <label className="text-sm font-black tracking-tight uppercase whitespace-nowrap">{label}</label>
          <div className={`p-2.5 rounded-2xl bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 shadow-sm`}>
            {icon}
          </div>
        </div>

        <div
          ref={containerRef}
          onPointerMove={handlePointer}
          onPointerLeave={() => setHoverRating(null)}
          onPointerDown={handlePointer}
          className="w-full flex gap-2 justify-between rating-wrap touch-none select-none cursor-pointer p-1"
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="relative flex-1 aspect-square max-w-[60px]"
            >
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${hoverRating !== null && (s - 0.5) <= hoverRating ? 'opacity-50' : 'opacity-100'}`}>
                <Star className={`w-full h-full ${s <= activeRating ? starColor : s - 0.5 === activeRating ? 'text-' + color + '-500' : 'text-muted-foreground/20'}`} />
                {s - 0.5 === activeRating && (
                  <div className="absolute inset-x-0 overflow-hidden w-[50%] left-0">
                    <Star className={`w-full h-full ${starColor}`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TagInput
        tags={tags}
        onTagsChange={onTagsChange}
        color={color}
        metadataKey={metadataKey}
      />
    </div>
  );
}

function TagInput({ tags, onTagsChange, color, metadataKey }: { tags: string[], onTagsChange: (t: string[]) => void, color: string, metadataKey: string }) {
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
          placeholder={tags.length === 0 ? "풍미 입력..." : ""}
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
