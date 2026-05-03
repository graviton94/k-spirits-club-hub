'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { dbListSpiritReviews } from '@/lib/db/data-connect-client';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight, Star, Trash2, User, MessageSquare, Quote, ArrowLeft, Sparkles, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { getRatingColor } from '@/lib/utils/rating-colors';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessToast from '@/components/ui/SuccessToast';
import { useParams, useRouter } from 'next/navigation';
import GoogleAd from '@/components/ui/GoogleAd';

export default function ReviewBoardPage({ initialReviews, initialPage = 1 }: { initialReviews?: any[]; initialPage?: number }) {
    const { user, role } = useAuth();
    const params = useParams();
    const lang = (params?.lang as string) || 'ko';
    const isEn = lang === 'en';

    const t = {
        title: isEn ? "Review Board" : "리뷰 보드",
        desc: isEn ? "Live comments and professional analysis reports from spirits enthusiasts." : "유저들의 생생한 리뷰와 분석",
        searchPlaceholder: isEn ? "Search spirits, authors, or content..." : "술 이름 또는 내용으로 검색",
        searchBtn: isEn ? "Search" : "검색",
        loading: isEn ? "Fetching tastes..." : "불러오는 중...",
        noResult: isEn ? "No search results found." : "검색 결과가 없습니다.",
        noReviews: isEn ? "No reviews registered yet." : "등록된 리뷰가 없습니다.",
        score: isEn ? "SCORE" : "평점",
        deleteTitle: isEn ? "Delete Review" : "리뷰 삭제",
        deleteConfirm: isEn ? "Are you sure you want to delete this review? Deleted reviews cannot be undone." : "이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.",
        deleteSuccess: isEn ? "Review deleted successfully." : "리뷰가 삭제되었습니다.",
        deleteFail: isEn ? "Failed to delete review." : "삭제에 실패했습니다.",
        cancel: isEn ? "Cancel" : "취소",
        delete: isEn ? "Delete" : "삭제하기",
        anonymous: isEn ? "Anonymous" : "익명",
    };

    const mappedInitial = useMemo(() => {
        if (!Array.isArray(initialReviews)) return [];
        return initialReviews.map((r: any) => ({
            ...r,
            spiritId: r.spirit?.id,
            userName: r.user?.nickname || t.anonymous,
            userId: r.user?.id,
            profileImage: r.user?.profileImage,
            tags: [
                ...(typeof r.nose === 'string' ? r.nose.split(',') : []),
                ...(typeof r.palate === 'string' ? r.palate.split(',') : []),
                ...(typeof r.finish === 'string' ? r.finish.split(',') : [])
            ].map((tag: string) => tag.trim()).filter(Boolean)
        }));
    }, [initialReviews, t.anonymous]);

    const [reviews, setReviews] = useState<any[]>(mappedInitial);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalCount, setTotalCount] = useState(initialReviews?.length ?? 0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Toast states
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    const pageSize = 12;
    const ADMIN_EMAILS = ['ruahn49@gmail.com'];
    const isAdmin = role === 'ADMIN' || (user?.email && ADMIN_EMAILS.includes(user.email));

    const fetchPage = async (page: number) => {
        try {
            setLoading(true);
            window.scrollTo({ top: 0, behavior: 'auto' });

            const data = await dbListSpiritReviews(pageSize, (page - 1) * pageSize);
            const mappedData = data.map((r: any) => ({
                ...r,
                spiritId: r.spirit?.id,
                userName: r.user?.nickname || t.anonymous,
                userId: r.user?.id,
                profileImage: r.user?.profileImage,
                tags: [
                    ...(typeof r.nose === 'string' ? r.nose.split(',') : []),
                    ...(typeof r.palate === 'string' ? r.palate.split(',') : []),
                    ...(typeof r.finish === 'string' ? r.finish.split(',') : [])
                ].map((tag: string) => tag.trim()).filter(Boolean)
            }));

            setReviews(mappedData);
            setCurrentPage(page);
            const isLastPage = data.length < pageSize;
            const inferredCount = isLastPage ? ((page - 1) * pageSize + data.length) : (page * pageSize + 1);
            setTotalCount(prev => Math.max(prev, inferredCount));
        } catch (error) {
            console.error('Error fetching reviews page:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mappedInitial.length === 0) {
            fetchPage(initialPage);
        }
    }, [initialPage, mappedInitial.length]);

    const filteredReviews = useMemo(() => {
        if (!searchQuery.trim()) return reviews;
        const lowQuery = searchQuery.toLowerCase();
        return reviews.filter(item => {
            const spiritName = (item.spiritName || '').toLowerCase();
            const userName = (item.userName || '').toLowerCase();
            const notes = (item.content || '').toLowerCase();
            return spiritName.includes(lowQuery) || userName.includes(lowQuery) || notes.includes(lowQuery);
        });
    }, [reviews, searchQuery]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setSearchQuery(searchInput);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDeleteReview = async () => {
        if (!deleteTarget || !user) return;
        setIsDeleting(true);
        try {
                const idToken = await user.getIdToken();
            const response = await fetch(`/api/reviews?spiritId=${deleteTarget.spiritId}&userId=${deleteTarget.userId}`, {
                method: 'DELETE',
                    headers: { 'authorization': `Bearer ${idToken}` }
            });
            if (response.ok) {
                setToastMessage(t.deleteSuccess);
                setToastVariant('success');
                setShowToast(true);
                setReviews(prev => prev.filter(r => r.id !== deleteTarget.id));
                setTotalCount(prev => prev - 1);
                setDeleteTarget(null);
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            setToastMessage(t.deleteFail);
            setToastVariant('error');
            setShowToast(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground pt-16 pb-12 px-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all group"
                >
                    <div className="p-2 bg-card/40 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{isEn ? 'Back' : '뒤로가기'}</span>
                </button>

                {/* Header */}
                <div className="mb-14 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center gap-2">
                             <div className="w-1 h-8 bg-brand-gradient rounded-full" />
                             <h1 className="text-5xl md:text-6xl font-black bg-brand-gradient bg-clip-text text-transparent tracking-tighter italic uppercase leading-none">
                                {t.title}
                             </h1>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium flex items-center gap-3 tracking-tight">
                            <Sparkles className="w-5 h-5 text-primary/60" />
                            {t.desc}
                        </p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-16 flex gap-4 max-w-3xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-card/20 backdrop-blur-3xl border border-white/5 rounded-3xl py-5 pl-14 pr-8 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all shadow-2xl"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-10 py-5 bg-primary text-primary-foreground rounded-3xl font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95 whitespace-nowrap uppercase tracking-widest"
                    >
                        {t.searchBtn}
                    </button>
                </form>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-8">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.5em] animate-pulse">{t.loading}</p>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-40 bg-card/10 backdrop-blur-xl rounded-[4rem] border border-white/5 border-dashed text-muted-foreground">
                        <div className="text-6xl mb-8 grayscale opacity-20">🥃</div>
                        <p className="text-xl font-black tracking-tighter uppercase italic">{searchQuery ? t.noResult : t.noReviews}</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {filteredReviews.map((review, idx) => (
                            <React.Fragment key={review.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden hover:border-primary/30 transition-all duration-700 shadow-2xl hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.4)]"
                                >
                                    {/* Content First Layout */}
                                    <div className="flex flex-col">
                                        {/* Header Row */}
                                        <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-muted/5">
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em] font-mono">
                                                        {review.spirit?.distillery || "Artisanal Producer"}
                                                    </span>
                                                </div>
                                                <Link href={`/${lang}/spirits/${review.spiritId}`} className="block group/title">
                                                    <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover/title:text-primary transition-colors italic uppercase tracking-tighter leading-none">
                                                        {isEn ? (review.spirit?.nameEn || review.spirit?.name) : review.spirit?.name}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
                                                <div className="flex flex-col items-start md:items-end">
                                                    <div className="flex items-center gap-2 bg-background/40 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/5 mb-1.5">
                                                         {review.user?.profileImage ? (
                                                            <img src={review.user.profileImage} alt="" className="w-4 h-4 rounded-full object-cover" />
                                                        ) : (
                                                            <User className="w-3.5 h-3.5 text-primary/60" />
                                                        )}
                                                        <span className="text-[11px] font-black tracking-tight">{review.user?.nickname || t.anonymous}</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                
                                                <div className="flex flex-col items-center justify-center w-20 h-20 bg-primary shadow-2xl shadow-primary/20 rounded-[2rem] text-primary-foreground transform group-hover:scale-105 transition-transform">
                                                    <Star className="w-5 h-5 fill-current mb-0.5" />
                                                    <span className="text-xl font-black italic">{Number(review.rating || 0).toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Body Row */}
                                        <div className="p-10 flex flex-col md:flex-row gap-12">
                                            {/* Body Left: Image */}
                                            <div className="w-full md:w-[280px] shrink-0">
                                                <Link href={`/${lang}/spirits/${review.spiritId}`} className="block relative aspect-square md:aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 bg-black group/img shadow-2xl">
                                                    <img 
                                                        src={review.imageUrls?.[0] || review.spirit?.imageUrl || getCategoryFallbackImage(review.spirit?.category)} 
                                                        alt={review.spirit?.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 opacity-80 group-hover:opacity-100"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                                                    {review.imageUrls && review.imageUrls.length > 1 && (
                                                        <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] text-white font-black tracking-widest uppercase shadow-2xl">
                                                            +{review.imageUrls.length - 1} Shutter
                                                        </div>
                                                    )}
                                                </Link>
                                            </div>

                                            {/* Body Right: Review & Tags */}
                                            <div className="flex-1 flex flex-col min-w-0">
                                                <div className="relative mb-12 flex-1">
                                                    <Quote className="absolute -top-10 -left-10 w-24 h-24 text-primary/5 pointer-events-none" />
                                                    <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed italic line-clamp-6 relative z-10">
                                                        &ldquo;{review.content}&rdquo;
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-end justify-between gap-6 pt-10 border-t border-white/5 mt-auto">
                                                    <div className="flex flex-wrap gap-2.5 flex-1 max-w-md">
                                                        {review.tags?.slice(0, 8).map((tag: string, i: number) => (
                                                            <span key={i} className="text-[10px] px-4 py-1.5 rounded-xl bg-card border border-white/5 text-muted-foreground/60 font-black uppercase tracking-tight group-hover:text-primary group-hover:border-primary/20 transition-all">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                         <Link 
                                                            href={`/${lang}/spirits/${review.spiritId}`}
                                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform"
                                                        >
                                                            {isEn ? 'View Bottle' : '제품 상세'} <ChevronRight className="w-3 h-3" />
                                                        </Link>

                                                        {(isAdmin || (user && user.uid === review.userId)) && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(review); }}
                                                                className="p-4 rounded-2xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {(idx + 1) % 4 === 0 && (
                                    <div className="w-full my-12">
                                        <GoogleAd
                                            key={`ad-review-${currentPage}-${idx}`}
                                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                                            slot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || ''}
                                            format="fluid"
                                            layoutKey="-fb+5w+4e-db+86"
                                            className="rounded-[3rem] overflow-hidden border border-white/5 bg-card/20 backdrop-blur-xl"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {!searchQuery && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-20 pb-20">
                                <Link
                                    href={currentPage > 2 ? `?page=${currentPage - 1}` : '?'}
                                    aria-disabled={currentPage === 1}
                                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) fetchPage(currentPage - 1); }}
                                    className={`p-4 rounded-2xl bg-card border border-white/5 hover:bg-muted transition-all shadow-2xl ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Link>

                                <div className="flex gap-2.5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                                        .map(num => (
                                            <Link
                                                key={num}
                                                href={num === 1 ? '?' : `?page=${num}`}
                                                onClick={(e) => { e.preventDefault(); fetchPage(num); }}
                                                className={`w-14 h-14 rounded-2xl text-base font-black transition-all shadow-2xl flex items-center justify-center ${currentPage === num ? 'bg-primary text-primary-foreground shadow-primary/30 scale-110' : 'bg-card border border-white/5 text-muted-foreground font-bold hover:bg-muted/50'}`}
                                            >
                                                {num}
                                            </Link>
                                        ))}
                                </div>

                                <Link
                                    href={`?page=${currentPage + 1}`}
                                    aria-disabled={currentPage === totalPages}
                                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) fetchPage(currentPage + 1); }}
                                    className={`p-4 rounded-2xl bg-card border border-white/5 hover:bg-muted transition-all shadow-2xl ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4"
                        onClick={() => !isDeleting && setDeleteTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-card/40 backdrop-blur-3xl w-full max-w-sm rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-40 bg-brand-gradient opacity-10 z-0" />
                            <div className="relative z-10 p-12 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 shadow-inner border border-rose-500/20">
                                    <Trash2 className="w-10 h-10 text-rose-500" />
                                </div>
                                <h2 className="text-3xl font-black text-foreground mb-4 italic uppercase tracking-tighter leading-none">{t.deleteTitle}</h2>
                                <p className="text-muted-foreground mb-10 text-sm leading-relaxed font-medium">
                                    <span className="font-black text-foreground block text-lg mb-2">"{deleteTarget.spiritName}"</span>
                                    {t.deleteConfirm}
                                </p>
                                <div className="flex gap-4 w-full">
                                    <button onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="flex-1 py-4 bg-muted/20 text-foreground font-black rounded-2xl border border-white/5 uppercase text-[10px] tracking-widest">
                                        {t.cancel}
                                    </button>
                                    <button onClick={handleDeleteReview} disabled={isDeleting} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 uppercase text-[10px] tracking-widest">
                                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.delete}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SuccessToast isVisible={showToast} message={toastMessage} variant={toastVariant} onClose={() => setShowToast(false)} />
        </div>
    );
}
