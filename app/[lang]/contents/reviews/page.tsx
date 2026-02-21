'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/db/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, getCountFromServer, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getAppPath } from '@/lib/db/paths';
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight, Star, Trash2, User, MessageSquare, Quote, ArrowLeft } from 'lucide-react';
import { getRatingColor } from '@/lib/utils/rating-colors';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessToast from '@/components/ui/SuccessToast';
import { useParams, useRouter } from 'next/navigation';

export const runtime = 'edge';

export default function ReviewBoardPage() {
    const { user, role } = useAuth();
    const params = useParams();
    const lang = (params?.lang as string) || 'ko';
    const isEn = lang === 'en';

    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageMarkers, setPageMarkers] = useState<Record<number, QueryDocumentSnapshot<DocumentData> | null>>({});
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Toast states
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    const pageSize = 12;
    // Hardcoded fallback for reliability
    const ADMIN_EMAILS = ['ruahn49@gmail.com'];
    const isAdmin = role === 'ADMIN' || (user?.email && ADMIN_EMAILS.includes(user.email));

    // UI Dictionary
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

    // 1. 전체 리뷰 개수 가져오기
    const fetchTotalCount = async () => {
        try {
            const reviewsPath = getAppPath().reviews;
            const snapshot = await getCountFromServer(collection(db, reviewsPath));
            setTotalCount(snapshot.data().count);
        } catch (error) {
            console.error('Error fetching reviews count:', error);
        }
    };

    // 2. 특정 페이지 데이터 가져오기
    const fetchPage = async (page: number) => {
        try {
            setLoading(true);
            const reviewsPath = getAppPath().reviews;
            let q;

            if (page === 1) {
                q = query(collection(db, reviewsPath), orderBy('createdAt', 'desc'), limit(pageSize));
            } else {
                const prevDoc = pageMarkers[page - 1];
                if (prevDoc) {
                    q = query(collection(db, reviewsPath), orderBy('createdAt', 'desc'), startAfter(prevDoc), limit(pageSize));
                } else {
                    q = query(collection(db, reviewsPath), orderBy('createdAt', 'desc'), limit(page * pageSize));
                }
            }

            const snapshot = await getDocs(q);
            const docs = snapshot.docs;

            const targetDocs = (page > 1 && !pageMarkers[page - 1]) ? docs.slice(-pageSize) : docs;
            const data = targetDocs.map(doc => {
                const docData = doc.data() as any;
                // Tags processing (comma separated to array)
                const tags = [
                    ...(docData.tagsN ? docData.tagsN.split(',') : []),
                    ...(docData.tagsP ? docData.tagsP.split(',') : []),
                    ...(docData.tagsF ? docData.tagsF.split(',') : []),
                    ...(docData.nose ? docData.nose.split(',') : []),
                    ...(docData.palate ? docData.palate.split(',') : []),
                    ...(docData.finish ? docData.finish.split(',') : [])
                ].map(t => t.trim()).filter(Boolean);

                return {
                    id: doc.id,
                    ...docData,
                    tags: [...new Set(tags)]
                };
            });

            setReviews(data);
            setPageMarkers(prev => ({ ...prev, [page]: docs[docs.length - 1] }));
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching reviews page:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalCount();
        fetchPage(1);
    }, []);

    // 3. 클라이언트 사이드 검색 필터링
    const filteredReviews = useMemo(() => {
        if (!searchQuery.trim()) return reviews;
        const lowQuery = searchQuery.toLowerCase();
        return reviews.filter(item => {
            const spiritName = (item.spiritName || '').toLowerCase();
            const userName = (item.userName || '').toLowerCase();
            const notes = (item.notes || item.content || '').toLowerCase();
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
            const response = await fetch(`/api/reviews?spiritId=${deleteTarget.spiritId}&userId=${deleteTarget.userId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': user.uid
                }
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
        <div className="min-h-screen bg-background text-foreground pt-16 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">{isEn ? 'Back' : '뒤로가기'}</span>
                </button>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">{t.title}</h1>
                    </div>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <Quote className="w-4 h-4 opacity-50" />
                        {t.desc}
                    </p>
                </div>

                {/* Search Bar - Changed from live to button-triggered */}
                <form onSubmit={handleSearch} className="relative mb-12 flex gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-card/50 backdrop-blur-md border border-border rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                    >
                        {t.searchBtn}
                    </button>
                </form>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                        </div>
                        <p className="text-sm font-black text-muted-foreground animate-pulse">{t.loading}</p>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-24 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border text-muted-foreground">
                        <div className="text-4xl mb-4">😶</div>
                        <p className="font-bold">{searchQuery ? t.noResult : t.noReviews}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredReviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-card border border-border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-xl transition-all"
                            >
                                {/* Header: Spirit Name + Author + Rating */}
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    {/* Spirit Name Link */}
                                    <Link
                                        href={`/${lang}/spirits/${review.spiritId}`}
                                        className="text-lg sm:text-xl font-black hover:text-blue-500 transition-colors"
                                    >
                                        {review.spiritName}
                                    </Link>

                                    {/* Author Capsule - Compact */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 border border-border rounded-full shadow-inner">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-black">
                                            {(review.userName || t.anonymous).substring(0, 1).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] font-black text-foreground">{review.userName || t.anonymous}</span>
                                    </div>

                                    {/* Rating Capsule - Color Coded */}
                                    {(() => {
                                        const ratingColors = getRatingColor(review.rating || 0);
                                        return (
                                            <div className={`px-3 py-1 ${ratingColors.bg} border ${ratingColors.border} rounded-full text-xs font-black ${ratingColors.text}`}>
                                                ★ {(review.rating || 0).toFixed(1)}
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="flex justify-between items-start gap-4">

                                    <div className="flex-1">
                                        {/* Tasting Note (Comment) */}
                                        <div className="relative">
                                            <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-500/10" />
                                            <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium italic relative z-10 pl-2">
                                                "{review.notes || review.content}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delete for Admin or Owner */}
                                    {(isAdmin || (user && user.uid === review.userId)) && (
                                        <button
                                            onClick={() => setDeleteTarget(review)}
                                            className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-border/50 self-start"
                                            title={isEn ? "Delete Review" : "리뷰 삭제"}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Attached Images */}
                                {review.imageUrls && review.imageUrls.length > 0 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                        {review.imageUrls.map((url: string, i: number) => (
                                            <img key={i} src={url} alt={`Review photo ${i + 1}`} className="h-32 w-auto object-cover rounded-xl border border-border/50 shrink-0" />
                                        ))}
                                    </div>
                                )}

                                {/* Flavor Tags and Date */}
                                {review.tags && review.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-border/50 relative">
                                        {review.tags.slice(0, 8).map((tag: string, i: number) => {
                                            const colors = [
                                                'bg-blue-500/10 text-blue-600 border-blue-500/20',
                                                'bg-orange-500/10 text-orange-600 border-orange-500/20',
                                                'bg-purple-500/10 text-purple-600 border-purple-500/20',
                                                'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                                'bg-rose-500/10 text-rose-600 border-rose-500/20',
                                                'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                                            ];
                                            return (
                                                <span key={i} className={`text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-tight ${colors[i % colors.length]}`}>
                                                    #{tag}
                                                </span>
                                            );
                                        })}
                                        {/* Date in bottom-right */}
                                        <span className="ml-auto text-[9px] text-muted-foreground/60 font-medium">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                {/* Date fallback if no tags */}
                                {(!review.tags || review.tags.length === 0) && (
                                    <div className="flex justify-end pt-4 mt-4 border-t border-border/50">
                                        <span className="text-[9px] text-muted-foreground/60 font-medium">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* Pagination */}
                        {!searchQuery && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-16 pb-12">
                                <button
                                    onClick={() => fetchPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-2xl bg-card border border-border hover:bg-muted disabled:opacity-20 transition-all font-bold shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                                        .map(num => (
                                            <button
                                                key={num}
                                                onClick={() => fetchPage(num)}
                                                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all shadow-sm ${currentPage === num
                                                    ? 'bg-blue-600 text-white shadow-blue-500/30 scale-110'
                                                    : 'bg-card border border-border text-muted-foreground hover:bg-muted font-bold'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                </div>

                                <button
                                    onClick={() => fetchPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-2xl bg-card border border-border hover:bg-muted disabled:opacity-20 transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => !isDeleting && setDeleteTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-border relative"
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

                                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed font-medium">
                                    <span className="font-black text-slate-900 dark:text-white block text-base mb-1">
                                        "{deleteTarget.spiritName}"
                                    </span>
                                    {t.deleteConfirm}
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setDeleteTarget(null)}
                                        disabled={isDeleting}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all active:scale-[0.98]"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        onClick={handleDeleteReview}
                                        disabled={isDeleting}
                                        className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/30 font-black rounded-2xl transition-all active:scale-[0.98]"
                                    >
                                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t.delete}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                variant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
