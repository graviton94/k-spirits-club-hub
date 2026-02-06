import Link from 'next/link';
import { newsDb } from '@/lib/db/firestore-rest';

export default async function NewsSection({ lang }: { lang: string }) {
    const rawNews = await newsDb.getLatest(3);

    if (!rawNews || rawNews.length === 0) return null;

    const news = rawNews.map((item: any) => {
        const t = item.translations?.[lang] || item.translations?.['en'] || {};
        const tags = item.tags?.[lang] || item.tags?.['en'] || [];
        return {
            title: t.title || item.originalTitle,
            link: item.link,
            snippet: t.snippet || item.originalSnippet,
            source: item.source,
            date: item.date,
            tags: tags.slice(0, 2) // Take top 2 tags
        };
    });

    const title = lang === 'ko' ? '글로벌 주류 트렌드' : 'Global Spirits Trends';
    const subtitle = lang === 'ko' ? '최신 소식' : 'Latest News';

    return (
        <section className="container max-w-4xl mx-auto px-4 mb-12 lg:mb-16">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <span className="text-xl">📰</span>
                <h2 className="text-lg font-black tracking-tight text-foreground">{title}</h2>
            </div>

            <div className="flex flex-col divide-y divide-border border-t border-b border-border">
                {news.map((item, index) => (
                    <Link
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block py-2 px-1 hover:bg-accent/50 transition-colors"
                    >
                        {/* Top Row: Badges (NEW + Tags) + Date */}
                        <div className="flex items-center gap-2 mb-1.5 h-5 w-full">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse flex-shrink-0">
                                NEW
                            </span>

                            {item.tags && item.tags.length > 0 && (
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    {item.tags.map((tag: string, i: number) => (
                                        <span key={i} className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Date (Right Aligned) */}
                            <span className="ml-auto text-[10px] text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">
                                {new Date(item.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '')}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm text-foreground group-hover:text-amber-600 transition-colors mb-1 truncate">
                            {item.title}
                        </h3>

                        {/* Snippet + More */}
                        <div className="text-xs text-muted-foreground leading-relaxed overflow-hidden">
                            <p className="line-clamp-1 md:line-clamp-1">
                                {item.snippet}
                                <span className="text-muted-foreground/60 ml-1 group-hover:text-amber-500 font-medium transition-colors whitespace-nowrap">
                                    {lang === 'ko' ? '...더보기' : '...More'}
                                </span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-2 text-right">
                <p className="text-[10px] text-muted-foreground/50 tracking-tight">
                    {lang === 'ko'
                        ? '* AI 번역 및 요약으로, 실제 기사 내용과 다를 수 있습니다.'
                        : '* Content is AI-summarized and may contain inaccuracies.'}
                </p>
            </div>
        </section>
    );
}
