'use client';

import { useState } from 'react';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { addReviewComment, removeReviewComment } from '@/app/[lang]/actions/social';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { Send, Trash2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    nickname: string | null;
    profileImage: string | null;
  };
}

interface ReviewCommentSectionProps {
  reviewId: string;
  initialComments: any[];
  lang: string;
}

export default function ReviewCommentSection({ reviewId, initialComments, lang }: ReviewCommentSectionProps) {
  const isEn = lang === 'en';
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dateLocale = lang === 'ko' ? ko : enUS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await addReviewComment(user.uid, reviewId, newComment);

    if (res.success) {
      setNewComment('');
      // In a real app, revalidatePath would update the server data, 
      // but for instant feedback we add locally.
      const optimisticComment: Comment = {
        id: res.id || Math.random().toString(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: user.uid,
          nickname: user.displayName || 'Me', // Fallback for optimistic UI
          profileImage: user.photoURL
        }
      };
      setComments([optimisticComment, ...comments]);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(isEn ? 'Delete this comment?' : '댓글을 삭제하시겠습니까?')) return;
    
    const res = await removeReviewComment(commentId, reviewId);
    if (res.success) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-black">{isEn ? 'Discussion' : '댓글 토론'}</h3>
        <span className="bg-secondary px-2.5 py-0.5 rounded-full text-xs font-black text-muted-foreground">
          {comments.length}
        </span>
      </div>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isEn ? "Share your thoughts on this spirit..." : "맛에 대한 의견을 나누어보세요..."}
            className="w-full bg-secondary/30 border border-border rounded-2xl p-5 pr-14 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[100px] resize-none font-medium transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="absolute bottom-4 right-4 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-[0.93]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-8 bg-secondary/20 border border-dashed border-border rounded-2xl text-center">
           <p className="text-sm text-muted-foreground font-medium mb-4">
             {isEn ? 'Please log in to participate in the discussion.' : '토론에 참여하려면 로그인이 필요합니다.'}
           </p>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
             className="px-6 py-2 bg-foreground text-background font-black rounded-lg text-xs"
           >
             {isEn ? 'Log In' : '로그인하기'}
           </button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <div className="shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-black text-xs text-muted-foreground overflow-hidden">
               {comment.user.profileImage ? (
                 <img src={comment.user.profileImage} alt="User" />
               ) : (
                 comment.user.nickname?.substring(0, 1) || 'U'
               )}
            </div>
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-foreground">{comment.user.nickname || 'Unknown'}</span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: dateLocale })}
                    </span>
                  </div>
                  {user?.uid === comment.user.id && (
                    <button 
                      onClick={() => handleDelete(comment.id)} 
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
               </div>
               <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                  {comment.content}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
