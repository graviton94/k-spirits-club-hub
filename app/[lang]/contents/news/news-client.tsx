'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { dbListNewsArticles, dbGetNewsCount, dbDeleteNews } from '@/lib/db/data-connect-client';
import { useAuth } from '@/app/[lang]/context/auth-context';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GoogleAd from '@/components/ui/GoogleAd';

export default function NewsContentPage({ initialNews, initialPage = 1 }: { initialNews?: any[]; initialPage?: number }) {
    const { user, role } = useAuth();
    const params = useParams();
    const lang = (params?.lang as string) || 'ko';
    const isEn = lang === 'en';

    const hasInitial = Array.isArray(initialNews) && initialNews.length > 0;
    const [news, setNews] = useState<any[]>(initialNews ?? []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalCount, setTotalCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const pageSize = 10;
    const ADMIN_EMAILS = ['ruahn49@gmail.com'];
    const isAdmin = role === 'ADMIN' || (user?.email && ADMIN_EMAILS.includes(user.email));

    // UI Dictionary
    const t = {
        title: isEn ? "Global Spirits News" : "글로벌 주류 뉴스",
        desc: isEn ? "Global spirits industry news and insights." : "글로벌 주류업계 주요 뉴스 및 인사이트",
        searchPlaceholder: isEn ? "Search news titles or content." : "원하는 키워드를 검색해보세요.",
        searchBtn: isEn ? "Search" : "검색",
        loading: isEn ? "Fetching latest news" : "소식을 불러오는 중",
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
            const count = await dbGetNewsCount();
            setTotalCount(count);
        } catch (error) {
            console.error('Error fetching count:', error);
        }
    };

    const fetchPage = async (page: number) => {
        try {
            setLoading(true);
            window.scrollTo({ top: 0, behavior: 'auto' });

            const data = await dbListNewsArticles(pageSize, (page - 1) * pageSize);
            setNews(data);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalCount();
        if (!hasInitial) {
            fetchPage(initialPage);
        }
    }, [initialPage, hasInitial]);

    const filteredNews = useMemo(() => {
        if (!searchQuery.trim()) return news;
        const lowQuery = searchQuery.toLowerCase();
        return news.filter(item => {
            const title = (item.translations?.[lang]?.title || item.translations?.ko?.title || item.title || '').toLowerCase();
            const content = (item.translations?.[lang]?.content || item.translations?.ko?.content || item.content || '').toLowerCase();
            return title.includes(lowQuery) || content.includes(lowQuery);
        });
    }, [news, searchQuery, lang]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setSearchQuery(searchInput);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDelete = async (id: string) => {
        if (!confirm(t.deleteConfirm)) return;
        try {
            await dbDeleteNews(id);
            alert(t.deleteSuccess);
            setNews(prev => prev.filter(item => item.id !== id));
            setTotalCount(prev => prev - 1);
        } catch (e) {
            console.error(e);
        }
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground pt-16 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">{isEn ? 'Back' : '뒤로가기'}</span>
                </button>
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-black mb-2 text-indigo-600 dark:text-indigo-400 tracking-tight">{t.title}</h1>
                        <p className="text-muted-foreground font-medium">{t.desc}</p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-12 flex gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                    >
                        {t.searchBtn}
                    </button>
                </form>

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
                            <React.Fragment key={item.id}>
                                <motion.article
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 relative group hover:border-indigo-500 transition-all shadow-sm"
                                >
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className="absolute top-6 right-6 p-3 text-rose-500 bg-white/80 dark:bg-black/80 hover:bg-rose-500 hover:text-white rounded-2xl transition-all z-30 shadow-lg border border-rose-100 dark:border-rose-900/30 group/del"
                                            title={t.deleteBtn}
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    )}

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                            {typeof item.source === 'object' ? (item.source?.['#text'] || 'News') : (item.source || 'News')}
                                        </span>
                                        <span className="text-muted-foreground text-[10px] font-medium">
                                            {item.date?.split('T')[0]}
                                        </span>
                                    </div>

                                    <Link href={item.link} target="_blank">
                                        <h2 className="text-xl md:text-2xl font-bold mb-4 hover:text-indigo-600 transition-colors leading-tight">
                                            {String(item.translations?.[lang]?.title || item.translations?.ko?.title || item.title || '')}
                                        </h2>
                                    </Link>

                                    <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base font-medium mb-6">
                                        {String(item.translations?.[lang]?.content || item.translations?.ko?.content || item.content || '')}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {(item.newsTags?.[lang] || item.newsTags?.ko || item.newsTags || [])?.slice(0, 2).map((tag: string, i: number) => {
                                                const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
                                                return (
                                                    <span key={i} className="text-[10px] font-bold text-indigo-500/60 transition-colors">
                                                        #{cleanTag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <Link href={item.link} target="_blank" className="text-[10px] sm:text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                                            {t.viewOriginal}
                                        </Link>
                                    </div>
                                </motion.article>

                                {(idx + 1) % 4 === 0 && (
                                    <div className="w-full my-8">
                                        <GoogleAd
                                            key={`ad-news-${currentPage}-${idx}`}
                                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                                            slot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || ''}
                                            format="fluid"
                                            layoutKey="-fb+5w+4e-db+86"
                                            className="rounded-3xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {!searchQuery && totalPages > 1 && (
                            <div className="flex flex-col items-center gap-6 mt-12 pb-12">
                                <div className="flex justify-center items-center gap-2">
                                    <Link
                                        href="?"
                                        aria-disabled={currentPage === 1}
                                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) fetchPage(1); }}
                                        className={`p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all flex items-center ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                                        title={isEn ? "First Page" : "첫 페이지"}
                                    >
                                        <ChevronLeft className="w-5 h-5 -mr-3" />
                                        <ChevronLeft className="w-5 h-5" />
                                    </Link>

                                    <Link
                                        href={currentPage > 2 ? `?page=${currentPage - 1}` : '?'}
                                        aria-disabled={currentPage === 1}
                                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) fetchPage(currentPage - 1); }}
                                        className={`p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Link>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                                        .map(num => (
                                            <Link
                                                key={num}
                                                href={num === 1 ? '?' : `?page=${num}`}
                                                onClick={(e) => { e.preventDefault(); fetchPage(num); }}
                                                className={`w-10 h-10 rounded-xl text-sm font-black transition-all flex items-center justify-center ${currentPage === num
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                    : 'bg-card border border-border text-muted-foreground hover:bg-muted font-bold'
                                                    }`}
                                            >
                                                {num}
                                            </Link>
                                        ))}

                                    <Link
                                        href={`?page=${currentPage + 1}`}
                                        aria-disabled={currentPage === totalPages}
                                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) fetchPage(currentPage + 1); }}
                                        className={`p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>

                                    <Link
                                        href={`?page=${totalPages}`}
                                        aria-disabled={currentPage === totalPages}
                                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) fetchPage(totalPages); }}
                                        className={`p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all flex items-center ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                                        title={isEn ? "Last Page" : "마지막 페이지"}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                        <ChevronRight className="w-5 h-5 -ml-3" />
                                    </Link>
                                </div>

                                <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium text-center italic">
                                    {isEn
                                        ? "※ News summaries are generated by AI and may contain inaccuracies. Please check the original source for critical information."
                                        : "※ AI가 원문 뉴스를 요약 및 번역한 정보로, 실제 내용과 차이가 있을 수 있습니다. 정확한 정보는 원문을 통해 확인하시기 바랍니다."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
