import { dbAdminGetReviewDetail } from '@/lib/db/data-connect-admin';
import { getRatingColor } from '@/lib/utils/rating-colors';
import { Star, Heart, MessageSquare, Quote, Wind, Utensils, Zap, ChevronLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import { SpiritCard } from '@/components/ui/SpiritCard';
import { Suspense } from 'react';
import ReviewCommentSection from '@/components/reviews/ReviewCommentSection';

interface PageProps {
  params: Promise<{ id: string; lang: string }>;
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id, lang } = await params;
  const isEn = lang === 'en';
  
  // Fetch detailed review data via Data Connect (SSR)
  // Note: We don't have currentUserId here easily in SSR without cookies/headers auth
  // But common public info is fine.
  const review = await dbAdminGetReviewDetail(id);

  if (!review) {
    notFound();
  }

  const dateLocale = lang === 'ko' ? ko : enUS;
  const ratingColors = getRatingColor(review.rating);

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href={`/${lang}/contents/news`} 
            className="flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {isEn ? 'BACK TO FEED' : '목록으로 돌아가기'}
          </Link>
          <div className="flex items-center gap-4">
             <button className="p-2.5 rounded-full bg-secondary/50 border border-border hover:bg-secondary transition-all">
                <Share2 className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Review Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-card border border-border rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative Quote Mark */}
              <Quote className="absolute -top-6 -left-6 w-32 h-32 text-amber-500/5 rotate-12" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {review.user.nickname?.substring(0, 1) || 'U'}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-foreground">{review.user.nickname}</h1>
                    <p className="text-xs text-muted-foreground font-bold">
                      {format(new Date(review.createdAt), 'PPPP', { locale: dateLocale })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-10">
                  <div className={`px-5 py-2 ${ratingColors.bg} border ${ratingColors.border} rounded-full text-lg font-black ${ratingColors.text} shadow-sm`}>
                    ★ {review.rating.toFixed(1)}
                  </div>
                  <div className="h-10 w-[1px] bg-border mx-2" />
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i + 1 <= review.rating ? 'fill-current' : 'opacity-20'}`} />
                    ))}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                   <p className="text-xl sm:text-2xl text-foreground leading-relaxed font-medium italic mb-12">
                     "{review.content}"
                   </p>
                </div>

                {/* Flavor Tags Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border/50">
                  <FlavorItem title="NOSE" tags={review.nose ?? null} icon={<Wind className="w-4 h-4" />} color="text-primary" />
                  <FlavorItem title="PALATE" tags={review.palate ?? null} icon={<Utensils className="w-4 h-4" />} color="text-accent" />
                  <FlavorItem title="FINISH" tags={review.finish ?? null} icon={<Zap className="w-4 h-4" />} color="text-purple-500" />
                </div>
              </div>
            </div>

            {/* Comment Section Integration */}
            <ReviewCommentSection 
               reviewId={id} 
               initialComments={review.comments || []} 
               lang={lang} 
            />

            {/* Attached Images */}
            {review.imageUrls && review.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {review.imageUrls.map((url: string, i: number) => (
                  <img 
                    key={i} 
                    src={url} 
                    alt={`Review photo ${i+1}`} 
                    className="w-full aspect-square object-cover rounded-[2rem] border border-border hover:scale-[1.02] transition-transform cursor-zoom-in shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spirit Info & Social */}
          <div className="lg:col-span-4 space-y-8">
            {/* Subject Spirit Card */}
            <div className="space-y-4">
               <h3 className="text-xs font-black tracking-[0.2em] text-muted-foreground uppercase ml-2">
                 {isEn ? 'THE SPIRIT' : '제품 정보'}
               </h3>
               <Suspense fallback={<div className="h-64 bg-secondary/20 rounded-[2rem] animate-pulse" />}>
                 <SpiritCard spirit={review.spirit} lang={lang} />
               </Suspense>
            </div>

            {/* Quick Stats */}
            <div className="bg-secondary/20 border border-border rounded-[2.5rem] p-8">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Heart className={(review.likes ?? 0) > 0 ? "fill-current" : ""} />
                     </div>
                     <div>
                        <div className="text-xl font-black text-foreground">{review.likes ?? 0}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{isEn ? 'CHEERS' : '좋아요'}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                     <div>
                        <div className="text-xl font-black text-foreground">{review.comments?.length || 0}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{isEn ? 'TALK' : '댓글'}</div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <MessageSquare />
                     </div>
                  </div>
               </div>
               
               <p className="text-xs text-muted-foreground font-medium leading-relaxed italic text-center">
                 {isEn ? 'Share this tasting note with other club members.' : '다른 회원들과 이 시음 노트를 공유해보세요.'}
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FlavorItem({ title, tags, icon, color }: { title: string, tags: string | null, icon: React.ReactNode, color: string }) {
  if (!tags) return null;
  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 text-[10px] font-black ${color} tracking-widest uppercase`}>
        {icon} {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.split(',').map((tag, idx) => (
          <span key={idx} className="px-3 py-1 bg-secondary/50 border border-border rounded-full text-[10px] font-black text-foreground/80 hover:border-amber-500/30 transition-colors">
            #{tag.trim()}
          </span>
        ))}
      </div>
    </div>
  );
}
