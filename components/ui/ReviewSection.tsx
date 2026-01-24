'use client';

import type { Review } from '@/lib/db/schema';
import { useState } from 'react';

interface ReviewSectionProps {
  spiritId: string;
  reviews: Review[];
}

export default function ReviewSection({ spiritId, reviews }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">리뷰 ({reviews.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          {showForm ? '취소' : '+ 리뷰 쓰기'}
        </button>
      </div>

      {showForm && <ReviewForm spiritId={spiritId} onCancel={() => setShowForm(false)} />}

      <div className="space-y-6 mt-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && !showForm && (
          <p className="text-center text-muted-foreground py-8">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{review.title}</h3>
          <p className="text-sm text-muted-foreground">{review.userName}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < review.rating ? 'text-primary' : 'text-muted'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="mb-4">{review.content}</p>
      {(review.nose || review.palate || review.finish) && (
        <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          {review.nose && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">향 (Nose)</p>
              <p className="text-sm">{review.nose}</p>
            </div>
          )}
          {review.palate && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">맛 (Palate)</p>
              <p className="text-sm">{review.palate}</p>
            </div>
          )}
          {review.finish && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">여운 (Finish)</p>
              <p className="text-sm">{review.finish}</p>
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

function ReviewForm({ spiritId, onCancel }: { spiritId: string; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    nose: '',
    palate: '',
    finish: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API endpoint
    console.log('Submitting review:', formData);
    alert('리뷰가 제출되었습니다! (데모 모드)');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">리뷰 작성하기</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">평점</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className={`text-2xl ${rating <= formData.rating ? 'text-primary' : 'text-muted'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">제목</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="리뷰 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">내용</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            rows={4}
            placeholder="시음 경험을 공유해주세요..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">향 (선택)</label>
            <input
              type="text"
              value={formData.nose}
              onChange={(e) => setFormData({ ...formData, nose: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="느껴지는 향..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">맛 (선택)</label>
            <input
              type="text"
              value={formData.palate}
              onChange={(e) => setFormData({ ...formData, palate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="입안에서의 맛..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">여운 (선택)</label>
            <input
              type="text"
              value={formData.finish}
              onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="마시고 난 뒤의 여운..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            리뷰 제출
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
          >
            취소
          </button>
        </div>
      </div>
    </form>
  );
}
