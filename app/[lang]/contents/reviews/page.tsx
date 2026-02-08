'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/db/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, getCountFromServer, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getAppPath } from '@/lib/db/paths';
import { getCategoryFallbackImage } from '@/lib/utils/image-fallback';
import { getOptimizedImageUrl } from '@/lib/utils/image-optimization';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight, Star, Trash2, User, MessageSquare, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessToast from '@/components/ui/SuccessToast';
import { useParams } from 'next/navigation';

export const runtime = 'edge';

export default function ReviewBoardPage() {
    const { user } = useAuth();
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

    // UI States
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    const pageSize = 10;
    const isAdmin = user && (user as any).role === 'ADMIN';

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

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
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
                                className="group relative bg-card/60 backdrop-blur-sm border border-border rounded-[2rem] p-6 hover:border-blue-500/30 hover:bg-card transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="flex flex-row sm:flex-row items-start gap-4 sm:gap-6">
                                    {/* Spirit Image - Smaller on mobile */}
                                    <Link href={`/spirits/${review.spiritId}`} className="shrink-0">
                                        <div className="w-16 h-20 sm:w-24 sm:h-32 rounded-xl sm:rounded-2xl bg-secondary overflow-hidden border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                            <img
                                                src={getOptimizedImageUrl(review.imageUrl || getCategoryFallbackImage(review.category), 160)}
                                                alt={review.spiritName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <div>
                                                <Link href={`/spirits/${review.spiritId}`} className="text-lg sm:text-xl font-black hover:text-blue-500 transition-colors block leading-none mb-1 shadow-sm">
                                                    {review.spiritName}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-blue-500/20">
                                                        <User className="w-2.5 h-2.5" />
                                                        <span className="truncate max-w-[80px] sm:max-w-none">
                                                            {review.userName || t.anonymous}
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 font-bold whitespace-nowrap">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Score Display - Compact on all screens */}
                                            <div className="shrink-0 flex sm:flex-col items-center justify-center px-3 py-1.5 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl sm:rounded-2xl border border-blue-500/10 self-start sm:self-center gap-2 sm:gap-0">
                                                <div className="text-[9px] font-black text-blue-600 dark:text-blue-400 leading-none sm:mb-0.5">{t.score}</div>
                                                <div className="text-base sm:text-xl font-black text-indigo-700 dark:text-indigo-300">{(review.rating || 0).toFixed(1)}</div>
                                            </div>
                                        </div>

                                        {/* Tasting Note (Comment) */}
                                        <div className="relative group/note bg-secondary/30 p-4 rounded-2xl border border-border/50 mb-4 transition-colors hover:bg-secondary/50">
                                            <Quote className="absolute -top-2 -left-2 w-5 h-5 text-blue-500/20" />
                                            <p className="text-sm md:text-base leading-relaxed text-foreground/90 italic font-medium">
                                                {review.notes || review.content}
                                            </p>
                                        </div>

                                        {/* Flavor Tags */}
                                        {review.tags && review.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {review.tags.slice(0, 6).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-500/5 dark:bg-slate-500/10 border border-slate-500/20 text-muted-foreground font-black uppercase tracking-wider">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Delete for Admin or Owner */}
                                {(isAdmin || (user && user.uid === review.userId)) && (
                                    <button
                                        onClick={() => setDeleteTarget(review)}
                                        className="absolute top-6 right-6 p-2 text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        title={isEn ? "Delete Review" : "리뷰 삭제"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
