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
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Write Review'}
        </button>
      </div>

      {showForm && <ReviewForm spiritId={spiritId} onCancel={() => setShowForm(false)} />}

      <div className="space-y-6 mt-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && !showForm && (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review!
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
              <p className="text-sm font-semibold text-muted-foreground mb-1">Nose</p>
              <p className="text-sm">{review.nose}</p>
            </div>
          )}
          {review.palate && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Palate</p>
              <p className="text-sm">{review.palate}</p>
            </div>
          )}
          {review.finish && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Finish</p>
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
    alert('Review submitted! (Demo mode)');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">Write Your Review</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
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
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="Sum up your review"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Review</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            rows={4}
            placeholder="Share your experience..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nose (optional)</label>
            <input
              type="text"
              value={formData.nose}
              onChange={(e) => setFormData({ ...formData, nose: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Aromas..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Palate (optional)</label>
            <input
              type="text"
              value={formData.palate}
              onChange={(e) => setFormData({ ...formData, palate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Taste..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Finish (optional)</label>
            <input
              type="text"
              value={formData.finish}
              onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Aftertaste..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
