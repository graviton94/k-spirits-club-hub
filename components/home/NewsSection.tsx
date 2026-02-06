import Link from 'next/link';
import { getGlobalSpiritsNews } from '@/lib/api/news';

export default async function NewsSection({ lang }: { lang: string }) {
    const news = await getGlobalSpiritsNews(lang);
    if (!news || news.length === 0) return null;

    const title = lang === 'ko' ? '글로벌 주류 트렌드' : 'Global Spirits Trends';
    const subtitle = lang === 'ko'
        ? '전 세계 매거진과 면세점에서 엄선한 최신 소식 (AI 번역)'
        : 'Curated news from top magazines & duty-free shops (AI Translated)';

    // 날짜 포맷팅 함수 (안전하게 처리)
    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr === 'Recent') return 'Recent';
        try {
            return dateStr.split('T')[0];
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">🗞️ {title}</h2>
                        <p className="mt-2 text-gray-600">{subtitle}</p>
                    </div>
                    <div className="text-xs text-gray-400">Powered by Google & Gemini</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                        >
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                {item.thumbnail ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100"><span className="text-4xl">🥃</span></div>
                                )}
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{item.source}</div>
                            </div>
                            <div className="flex flex-col flex-1 p-5">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{item.snippet}</p>
                                <div className="text-xs text-gray-400 border-t pt-3 mt-auto flex justify-between">
                                    <span>{formatDate(item.date)}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">Read more →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
