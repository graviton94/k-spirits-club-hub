'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Check, Zap } from 'lucide-react';
import { submitMicroReviewAction } from '@/app/[lang]/actions/reviews';
import { useAuth } from '@/app/[lang]/context/auth-context';

interface MicroReviewModalProps {
  spiritId: string;
  spiritName: string;
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export default function MicroReviewModal({ spiritId, spiritName, isOpen, onClose, lang = 'ko' }: MicroReviewModalProps) {
  const isEn = lang === 'en';
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Curated tags from spirits-metadata for better taxonomy
  const tags = isEn 
    ? ["Vanilla", "Smoky", "Fruity", "Oak", "Floral", "Spicy", "Citrus", "Honey"]
    : ["바닐라", "스모키", "과일향", "오크", "플로럴", "스파이시", "시트러스", "꿀"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 4) // Max 4 tags
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    if (!user) {
        window.dispatchEvent(new CustomEvent('openLoginModal'));
        return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await submitMicroReviewAction(spiritId, rating, selectedTags, lang, user.uid);
      if (result.success) {
        // Reset state for next potentially different spirit in same session
        setRating(0);
        setSelectedTags([]);
        
        // Show success and close
        onClose();
        
        // Dispatch event for UI sync
        window.dispatchEvent(new CustomEvent('reviewSubmitted'));
      } else {
        alert(isEn ? "Failed to submit review." : "리뷰 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert(isEn ? "An unexpected error occurred." : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-neutral-900 border border-white/10 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black text-white leading-tight">{spiritName}</h3>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">
                {isEn ? "Quick Tasting Review" : "빠른 시음 평가"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-neutral-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Rating Section */}
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="relative group p-1"
                  >
                    <Star 
                      className={`w-10 h-10 transition-all ${
                        rating >= s 
                          ? 'fill-amber-500 text-amber-500 scale-110' 
                          : 'text-neutral-700 group-hover:text-neutral-500'
                      }`} 
                    />
                    {rating >= s && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="absolute -top-1 -right-1"
                      >
                        <Zap className="w-4 h-4 text-amber-200 fill-amber-200 blur-[2px] opacity-50" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-400 mt-4 h-4">
                {rating > 0 && (isEn ? `${rating}.0 / 5.0 Rating` : `${rating}.0 / 5.0 평점`)}
              </span>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block text-center">
                {isEn ? "Select key flavors (Max 4)" : "주요 풍미 선택 (최대 4개)"}
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-white text-black border-white' 
                          : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Section */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all relative overflow-hidden active:scale-[0.98] ${
                rating === 0 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  {isEn ? 'Submitting...' : '제출 중...'}
                </div>
              ) : (
                isEn ? 'Complete Review' : '평가 완료'
              )}
            </button>
          </div>

          <div className="p-4 bg-black/40 text-center">
             <p className="text-[9px] text-neutral-600 font-medium">
                {isEn 
                  ? "Your review activates search snippets and helps the community." 
                  : "회원님의 평가는 검색 엔진 노출을 높이고 커뮤니티에 도움이 됩니다."}
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
