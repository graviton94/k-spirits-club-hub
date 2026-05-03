'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { dbListNewsArticles, dbGetNewsCount, dbDeleteNews } from '@/lib/db/data-connect-client';
import { useAuth } from '@/app/[lang]/context/auth-context';
import Link from 'next/link';
import { Search, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
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
            const title = (item.translations?.[lang]?.title || item.translations?.['ko']?.title || item.title || '').toLowerCase();
            const content = (item.translations?.[lang]?.content || item.translations?.['ko']?.content || item.content || '').toLowerCase();
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
        <div className="min-h-screen bg-background text-foreground pt-8 md:pt-16 pb-12 px-4 relative overflow-hidden">
            {/* Ambient Atmosphere */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 md:mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all group"
                >
                    <div className="p-1 md:p-2 bg-card/40 rounded-lg md:rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                        <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs md:text-xs font-black uppercase tracking-widest">{isEn ? 'Back' : '뒤로가기'}</span>
                </button>

                {/* Header */}
                <div className="mb-8 md:mb-14 space-y-4 md:space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 md:space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-1 md:w-1.5 h-8 md:h-10 bg-brand-gradient rounded-full shadow-lg shadow-primary/20" />
                             <h1 className="text-3xl md:text-7xl font-black bg-brand-gradient bg-clip-text text-transparent tracking-tighter italic uppercase leading-none">
                                {t.title}
                             </h1>
                        </div>
                        <p className="text-sm md:text-lg text-muted-foreground font-medium flex items-center gap-2 md:gap-3 tracking-tight">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary/60 animate-pulse" />
                            {t.desc}
                        </p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-12 md:mb-20 flex gap-2 md:gap-4 max-w-3xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-card/20 backdrop-blur-3xl border border-white/5 rounded-2xl md:rounded-3xl py-3 pl-11 pr-4 md:py-5 md:pl-14 md:pr-8 text-xs md:text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all shadow-2xl"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 md:px-10 md:py-5 bg-primary text-primary-foreground rounded-2xl md:rounded-3xl font-black text-xs md:text-sm hover:brightness-110 transition-all shadow-xl shadow-primary/20 active:scale-95 whitespace-nowrap uppercase tracking-widest"
                    >
                        {t.searchBtn}
                    </button>
                </form>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-8">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-[0.5em] animate-pulse">{t.loading}</p>
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-40 bg-card/10 backdrop-blur-xl rounded-[4rem] border border-white/5 border-dashed text-muted-foreground">
                        <div className="text-6xl mb-8 grayscale opacity-20">📰</div>
                        <p className="text-xl font-black tracking-tighter uppercase italic">{searchQuery ? t.noResult : t.noNews}</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {filteredNews.map((item, idx) => (
                            <React.Fragment key={item.id}>
                                <motion.article
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative bg-card/20 backdrop-blur-3xl border border-white/5 rounded-3xl md:rounded-[3.5rem] overflow-hidden hover:border-primary/30 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] transition-all duration-700"
                                >
                                    <div className="flex flex-col md:flex-row p-6 md:p-14 gap-6 md:gap-12">
                                        {/* Optional Image Section */}
                                        {item.imageUrl && (
                                            <div className="md:w-1/3 shrink-0">
                                                <Link href={item.link} target="_blank" className="block relative aspect-video md:aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl bg-black">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt="" 
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0 flex flex-col">
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(item.id);
                                                    }}
                                                    className="absolute top-8 right-8 p-3 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all z-30 border border-rose-500/10"
                                                    title={t.deleteBtn}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}

                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-black rounded-full uppercase tracking-[0.2em]">
                                                    {typeof item.source === 'object' ? (item.source?.['#text'] || 'Industry') : (item.source || 'Industry')}
                                                </div>
                                                <div className="h-1 w-1 rounded-full bg-border/40" />
                                                <span className="text-xs font-black text-muted-foreground/40 tracking-widest uppercase">
                                                    {new Date(item.date || item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>

                                            <Link href={item.link} target="_blank" className="block group/title mb-4 md:mb-6">
                                                <h2 className="text-xl md:text-4xl font-black group-hover/title:text-primary transition-all duration-500 leading-tight tracking-tighter italic uppercase">
                                                    {String(item.translations?.[lang]?.title || item.translations?.['ko']?.title || item.title || '')}
                                                </h2>
                                            </Link>

                                            <p className="text-muted-foreground/80 leading-relaxed text-[13px] md:text-lg font-medium mb-6 md:mb-12 line-clamp-4 italic border-l-2 border-primary/10 pl-4 md:pl-6">
                                                &ldquo;{String(item.translations?.[lang]?.content || item.translations?.['ko']?.content || item.content || '')}&rdquo;
                                            </p>

                                            <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6 mt-auto pt-6 md:pt-8 border-t border-white/5">
                                                <div className="flex flex-wrap gap-1.5 md:gap-2.5">
                                                    {(Array.isArray(item.tags?.[lang]) ? item.tags?.[lang] : Array.isArray(item.tags?.['ko']) ? item.tags?.['ko'] : Array.isArray(item.tags) ? item.tags : [])?.slice(0, 4).map((tag: string, i: number) => (
                                                        <span key={i} className="text-xs md:text-xs font-black px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl bg-card border border-white/5 text-muted-foreground/40 uppercase tracking-tight group-hover:text-primary transition-colors">
                                                            #{tag.replace('#', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link 
                                                    href={item.link} 
                                                    target="_blank" 
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 rounded-xl md:rounded-2xl bg-primary text-primary-foreground text-xs md:text-xs font-black hover:brightness-110 transition-all shadow-xl shadow-primary/20 uppercase tracking-[0.2em]"
                                                >
                                                    {t.viewOriginal}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>

                                {(idx + 1) % 4 === 0 && (
                                    <div className="w-full my-12">
                                        <GoogleAd
                                            key={`ad-news-${currentPage}-${idx}`}
                                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                                            slot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || ''}
                                            format="fluid"
                                            layoutKey="-fb+5w+4e-db+86"
                                            className="rounded-[3.5rem] overflow-hidden border border-white/5 bg-card/20 backdrop-blur-3xl shadow-2xl"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {!searchQuery && totalPages > 1 && (
                            <div className="flex flex-col items-center gap-10 mt-20 pb-20">
                                <div className="flex justify-center items-center gap-3">
                                    <Link
                                        href="?"
                                        aria-disabled={currentPage === 1}
                                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) fetchPage(1); }}
                                        className={`p-4 rounded-2xl bg-card border border-white/5 hover:bg-muted transition-all flex items-center shadow-2xl ${currentPage === 1 ? 'pointer-events-none opacity-20' : ''}`}
                                        title={isEn ? "First Page" : "첫 페이지"}
                                    >
                                        <ChevronLeft className="w-6 h-6 -mr-4" />
                                        <ChevronLeft className="w-6 h-6" />
                                    </Link>

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
                                                    className={`w-14 h-14 rounded-2xl text-base font-black transition-all shadow-2xl flex items-center justify-center ${currentPage === num
                                                        ? 'bg-primary text-primary-foreground shadow-primary/30 scale-110'
                                                        : 'bg-card border border-white/5 text-muted-foreground hover:bg-muted/50 font-bold'
                                                        }`}
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

                                    <Link
                                        href={`?page=${totalPages}`}
                                        aria-disabled={currentPage === totalPages}
                                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) fetchPage(totalPages); }}
                                        className={`p-4 rounded-2xl bg-card border border-white/5 hover:bg-muted transition-all flex items-center shadow-2xl ${currentPage === totalPages ? 'pointer-events-none opacity-20' : ''}`}
                                        title={isEn ? "Last Page" : "마지막 페이지"}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                        <ChevronRight className="w-6 h-6 -ml-4" />
                                    </Link>
                                </div>

                                <p className="text-xs sm:text-xs text-muted-foreground/30 font-black uppercase tracking-[0.4em] text-center italic">
                                    {isEn
                                        ? "※ News summaries are generated by AI and may contain inaccuracies."
                                        : "※ AI가 원문 뉴스를 요약 및 번역한 정보로, 실제 내용과 차이가 있을 수 있습니다."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
