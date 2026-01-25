'use client';

import type { Review } from '@/lib/db/schema';
import { useState } from 'react';
import { Star, MessageSquare, Wind, Utensils, Zap, Quote } from 'lucide-react';

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
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${showForm
            ? 'bg-secondary text-foreground hover:bg-secondary/80'
            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
            }`}
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
      <div className="flex justify-center gap-0.5 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(Number(value)) ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
        ))}
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
            <h3 className="font-black text-lg leading-tight">{review.title}</h3>
            <p className="text-sm text-muted-foreground font-medium">{review.userName} • {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`} />
            ))}
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
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < rating ? `bg-${color}-500` : 'bg-muted'}`}
            style={{ backgroundColor: i < rating ? (color === 'blue' ? '#3b82f6' : color === 'orange' ? '#f97316' : '#a855f7') : undefined }}
          />
        ))}
      </div>
      {tags && (
        <div className="flex flex-wrap gap-1">
          {tags.split(',').map((t, idx) => (
            <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-secondary border border-border font-bold text-muted-foreground">
              {t.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewForm({ spiritId, onCancel }: { spiritId: string; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    nose: '',
    noseRating: 5,
    palate: '',
    palateRating: 5,
    finish: '',
    finishRating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting review:', formData);
    alert('리뷰가 제출되었습니다! (데모 모드)');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-primary/5">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-primary rounded-full"></span>
        리뷰 작성하기
      </h3>

      <div className="space-y-8">
        {/* Overall Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-muted-foreground uppercase">제목</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold"
              placeholder="리뷰의 핵심 내용을 요약해주세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-muted-foreground uppercase">총합 평점</label>
            <div className="flex gap-2 py-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: r })}
                  className={`text-2xl transition-transform hover:scale-125 ${r <= formData.rating ? 'text-amber-500' : 'text-muted'}`}
                >
                  <Star className={r <= formData.rating ? 'fill-current' : ''} />
                </button>
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
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-medium min-h-[100px]"
            placeholder="전반적인 시음 느낌을 자유롭게 적어주세요..."
          />
        </div>

        {/* Detailed Ratings */}
        <div className="grid sm:grid-cols-3 gap-8">
          <RatingField
            label="NOSE (향)"
            rating={formData.noseRating}
            tags={formData.nose}
            onRatingChange={(r: number) => setFormData({ ...formData, noseRating: r })}
            onTagsChange={(t: string) => setFormData({ ...formData, nose: t })}
            placeholder="#바닐라, #오크..."
            color="blue"
          />
          <RatingField
            label="PALATE (맛)"
            rating={formData.palateRating}
            tags={formData.palate}
            onRatingChange={(r: number) => setFormData({ ...formData, palateRating: r })}
            onTagsChange={(t: string) => setFormData({ ...formData, palate: t })}
            placeholder="#스파이시, #달콤..."
            color="orange"
          />
          <RatingField
            label="FINISH (여운)"
            rating={formData.finishRating}
            tags={formData.finish}
            onRatingChange={(r: number) => setFormData({ ...formData, finishRating: r })}
            onTagsChange={(t: string) => setFormData({ ...formData, finish: t })}
            placeholder="#긴피니시, #스모키..."
            color="purple"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-secondary text-foreground font-black rounded-2xl hover:bg-secondary/80 transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-8 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
          >
            리뷰 제출하기
          </button>
        </div>
      </div>
    </form>
  );
}

function RatingField({ label, rating, tags, onRatingChange, onTagsChange, placeholder, color }: any) {
  const starColor = color === 'blue' ? 'text-blue-500' : color === 'orange' ? 'text-orange-500' : 'text-purple-500';
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{label}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRatingChange(r)}
              className={`text-lg transition-all ${r <= rating ? starColor : 'text-muted'}`}
            >
              <Star className={r <= rating ? 'fill-current' : ''} size={20} />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">태그 (쉼표구분)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-bold"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
