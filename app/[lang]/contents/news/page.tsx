'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/db/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter, getCountFromServer, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/app/[lang]/context/auth-context';
import { getAppPath } from '@/lib/db/paths';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export const runtime = 'edge';

export default function NewsContentPage() {
    const { user } = useAuth();
    const params = useParams();
    const lang = (params?.lang as string) || 'ko';
    const isEn = lang === 'en';

    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageMarkers, setPageMarkers] = useState<Record<number, QueryDocumentSnapshot<DocumentData> | null>>({});
    const [searchQuery, setSearchQuery] = useState('');

    const pageSize = 10;
    const isAdmin = user && (user as any).role === 'ADMIN';

    // UI Dictionary
    const t = {
        title: isEn ? "Global Spirits News" : "글로벌 주류 뉴스",
        desc: isEn ? "In-depth spirits industry reports analyzed by AI." : "AI가 엄선하고 분석한 주류 업계 심층 리포트",
        searchPlaceholder: isEn ? "Search news titles or content..." : "뉴스 제목이나 내용을 검색해보세요...",
        loading: isEn ? "Fetching latest news..." : "소식을 불러오는 중...",
        noResult: isEn ? "No search results found." : "검색 결과가 없습니다.",
        noNews: isEn ? "No news collected yet." : "수집된 뉴스가 없습니다.",
        deleteBtn: isEn ? "🗑️ Delete" : "🗑️ 삭제",
        deleteConfirm: isEn ? "Are you sure you want to delete this news? This cannot be undone." : "진짜 삭제합니까? 되돌릴 수 없습니다.",
        deleteSuccess: isEn ? "Deleted successfully." : "삭제되었습니다.",
        source: isEn ? "Source" : "출처",
        viewOriginal: isEn ? "View Original →" : "원문 보러가기 →",
        page: isEn ? "Page" : "페이지",
        of: isEn ? "of" : "/",
    };

    const fetchTotalCount = async () => {
        try {
            const newsPath = getAppPath().news;
            const snapshot = await getCountFromServer(collection(db, newsPath));
            setTotalCount(snapshot.data().count);
        } catch (error) {
            console.error('Error fetching count:', error);
        }
    };

    const fetchPage = async (page: number) => {
        try {
            setLoading(true);
            const newsPath = getAppPath().news;
            let q;

            if (page === 1) {
                q = query(collection(db, newsPath), orderBy('publishedAt', 'desc'), limit(pageSize));
            } else {
                const prevDoc = pageMarkers[page - 1];
                if (prevDoc) {
                    q = query(collection(db, newsPath), orderBy('publishedAt', 'desc'), startAfter(prevDoc), limit(pageSize));
                } else {
                    q = query(collection(db, newsPath), orderBy('publishedAt', 'desc'), limit(page * pageSize));
                }
            }

            const snapshot = await getDocs(q);
            const docs = snapshot.docs;

            const targetDocs = (page > 1 && !pageMarkers[page - 1]) ? docs.slice(-pageSize) : docs;
            const data = targetDocs.map(doc => ({ id: doc.id, ...doc.data() }));

            setNews(data);
            setPageMarkers(prev => ({ ...prev, [page]: docs[docs.length - 1] }));
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalCount();
        fetchPage(1);
    }, []);

    const filteredNews = useMemo(() => {
        if (!searchQuery.trim()) return news;
        const lowQuery = searchQuery.toLowerCase();
        return news.filter(item => {
            const title = (item.title?.[lang] || item.title?.ko || item.originalTitle || '').toLowerCase();
            const content = (item.content?.[lang] || item.content?.ko || item.snippet?.[lang] || item.snippet?.ko || '').toLowerCase();
            return title.includes(lowQuery) || content.includes(lowQuery);
        });
    }, [news, searchQuery, lang]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDelete = async (id: string) => {
        if (!confirm(t.deleteConfirm)) return;
        try {
            const res = await fetch(`/api/admin/news/delete?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert(t.deleteSuccess);
                setNews(prev => prev.filter(item => item.id !== id));
                setTotalCount(prev => prev - 1);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-black mb-2 text-indigo-600 dark:text-indigo-400 tracking-tight">{t.title}</h1>
                        <p className="text-muted-foreground font-medium">{t.desc}</p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-sm font-bold text-muted-foreground">{t.loading}</p>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-muted-foreground font-bold">
                        {searchQuery ? t.noResult : t.noNews}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredNews.map((item, idx) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 relative group hover:border-indigo-500 transition-all shadow-sm"
                            >
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-4 right-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all z-10"
                                    >
                                        {t.deleteBtn}
                                    </button>
                                )}

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        {item.source}
                                    </span>
                                    <span className="text-muted-foreground text-[10px] font-medium">
                                        {item.publishedAt?.split('T')[0]}
                                    </span>
                                </div>

                                <Link href={item.link} target="_blank">
                                    <h2 className="text-2xl font-bold mb-6 hover:text-indigo-600 transition-colors leading-tight">
                                        {item.title?.[lang] || item.title?.ko || item.originalTitle}
                                    </h2>
                                </Link>

                                <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap text-base md:text-lg font-medium">
                                    {item.content?.[lang] || item.content?.ko || item.snippet?.[lang] || item.snippet?.ko || item.originalSnippet}
                                </div>

                                <div className="mt-8 flex flex-wrap gap-2">
                                    {(item.tags?.[lang] || item.tags?.ko)?.map((tag: string, i: number) => (
                                        <span key={i} className="text-xs font-bold text-muted-foreground/60 bg-muted px-3 py-1 rounded-full border border-border uppercase tracking-tighter">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-border flex justify-end">
                                    <Link href={item.link} target="_blank" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                        {t.viewOriginal}
                                    </Link>
                                </div>
                            </motion.article>
                        ))}

                        {/* Pagination Numbers */}
                        {!searchQuery && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                                <button
                                    onClick={() => fetchPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl bg-card border border-border hover:bg-muted disabled:opacity-20 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                                    .map(num => (
                                        <button
                                            key={num}
                                            onClick={() => fetchPage(num)}
                                            className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === num
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                : 'bg-card border border-border text-muted-foreground hover:bg-muted font-bold'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                <button
                                    onClick={() => fetchPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl bg-card border border-border hover:bg-muted disabled:opacity-20 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
