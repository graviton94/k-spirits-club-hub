// components/home/NewsSection.tsx

import Link from 'next/link';
import { dbListNewsArticles } from '@/lib/db/data-connect-client';
import { ArrowRight } from 'lucide-react';
import { typography } from '@/lib/design/patterns';

export default async function NewsSection({ lang }: { lang: string }) {
    const isEn = lang === 'en';

    // Fetch latest 3 news articles from PostgreSQL
    const rawNews = await dbListNewsArticles(3, 0);

    if (!rawNews || rawNews.length === 0) return null;

    const news = rawNews.map((item: any) => {
        const t = item.translations?.[lang] || item.translations?.['en'] || item.translations?.['ko'] || {};
        const tagsRaw = item.tags?.[lang] || item.tags?.['en'] || item.tags?.['ko'] || [];
        const fallbackTags = isEn ? ['#Spirits', '#News'] : ['#주류', '#뉴스'];
        const tags = Array.isArray(tagsRaw) && tagsRaw.length > 0 ? tagsRaw : fallbackTags;
        return {
            title: t.title || item.title,
            link: item.link,
            snippet: t.snippet || t.content || (item.content ? item.content.substring(0, 100) : ''),
            source: item.source,
            date: item.date,
            tags: Array.isArray(tags) ? tags.slice(0, 2) : []
        };
    });

    const title = lang === 'ko' ? '글로벌 주류 트렌드' : 'Global Spirits Trends';

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary text-sm md:text-base">
                        <span>📰</span>
                    </div>
                    <h2 className={typography.sectionTitle}>{title}</h2>
                </div>
                <Link
                    href={`/${lang}/contents/news`}
                    className={`${typography.sectionMeta} hover:text-primary transition-all flex items-center gap-1.5 group`}
                >
                    {lang === 'ko' ? '전체 보러가기' : 'View All'}
                    <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="flex flex-col divide-y divide-border border-t border-b border-border">
                {news.map((item, index) => (
                    <Link
                        key={index}
                        href={item.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block py-2 px-1 hover:bg-accent/50 transition-colors"
                    >
                        {/* Top Row: Badges (NEW + Tags) + Date */}
                        <div className="flex items-center gap-2 mb-1.5 h-5 w-full">
                            <span className="bg-destructive text-white text-xs font-bold px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse flex-shrink-0">
                                NEW
                            </span>

                            {item.tags && item.tags.length > 0 && (
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    {item.tags.map((tag: string, i: number) => (
                                        <span key={i} className="capsule-premium border-none shadow-none text-xs px-1.5 py-0.5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Date (Right Aligned) */}
                            <span className="ml-auto text-xs text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">
                                {item.date
                                    ? new Date(item.date)
                                        .toLocaleDateString(isEn ? 'en-US' : 'ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                        .replace(/\.$/, '')
                                    : ''}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors mb-1 truncate">
                            {item.title}
                        </h3>

                        {/* Snippet + More */}
                        <div className="text-xs text-muted-foreground leading-relaxed overflow-hidden">
                            <p className="line-clamp-1 md:line-clamp-1">
                                {item.snippet}
                                <span className="text-primary ml-1 font-black transition-colors whitespace-nowrap">
                                    {lang === 'ko' ? '...더보기' : '...More'}
                                </span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-2 text-right">
                <p className="text-xs text-muted-foreground/50 tracking-tight">
                    {lang === 'ko'
                        ? '* 자동 번역 및 요약으로 실제 기사 내용과 차이가 있을 수 있습니다.'
                        : '* Automatically translated and summarized content may differ from the original article.'}
                </p>
            </div>
        </section>
    );
}
