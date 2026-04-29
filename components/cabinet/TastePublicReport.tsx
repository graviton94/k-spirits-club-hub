'use client';

import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, ChevronLeft } from 'lucide-react';
import TasteRadar from './TasteRadar';
import { UserTasteProfile } from '@/lib/db/schema';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TastePublicReportProps {
    profile: UserTasteProfile;
    isPublic?: boolean;
}

export default function TastePublicReport({ profile, isPublic = false }: TastePublicReportProps) {
    const pathname = usePathname() || "";
    const isEn = pathname.split('/')[1] === 'en';
    const analyzedAt = new Date(profile.analyzedAt);

    const getChartData = (stats: any) => [
        { subject: isEn ? 'Sweet' : '단맛', A: stats.sweet || 0, fullMark: 100 as const },
        { subject: isEn ? 'Fruity' : '과일향', A: stats.fruity || 0, fullMark: 100 as const },
        { subject: isEn ? 'Floral' : '꽃향', A: stats.floral || 0, fullMark: 100 as const },
        { subject: isEn ? 'Spicy' : '스파이시', A: stats.spicy || 0, fullMark: 100 as const },
        { subject: isEn ? 'Woody' : '우디함', A: stats.woody || 0, fullMark: 100 as const },
        { subject: isEn ? 'Peaty' : '피트향', A: stats.peaty || 0, fullMark: 100 as const },
    ];

    const chartData = getChartData(profile.stats);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            {isPublic && (
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/${isEn ? 'en' : 'ko'}`} className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground tracking-tight">{isEn ? 'Taste DNA Report' : '미각 DNA 리포트'}</h1>
                        <p className="text-xs text-muted-foreground font-medium">{isEn ? 'Analyzed flavor profile' : '분석된 미각 데이터입니다'}</p>
                    </div>
                </div>
            )}

            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[40px] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left: Radar Chart */}
                    <div className="w-full relative flex flex-col items-center justify-center">
                        <div className="w-full max-w-[360px]">
                           <TasteRadar data={chartData} />
                        </div>
                        <div className="mt-8 text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase bg-foreground/5 px-4 py-1.5 rounded-full border border-border">
                            Updated: {analyzedAt.toLocaleDateString()}
                        </div>
                    </div>

                    {/* Right: Insights */}
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 tracking-widest uppercase">
                                    Scoring Scope: 6D Vector
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter italic leading-none">
                                "{profile.persona.title}"
                            </h2>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-lg font-medium">
                                {profile.persona.description}
                            </p>
                            <div className="flex flex-wrap gap-2.5 mt-8">
                                {profile.persona.keywords.map((tag) => (
                                    <span key={tag} className="px-4 py-2 bg-secondary border border-border rounded-xl text-[11px] text-foreground/80 font-black tracking-wider uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Direct Recommendation Highlight */}
                        {profile.recommendation && (
                            <div className="p-8 bg-background/50 backdrop-blur-md rounded-[32px] border border-border hover:border-amber-500/30 transition-all group/ad shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-amber-500 font-black mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <Sparkles className="w-3" /> Recommended Bottle
                                        </span>
                                        <h3 className="text-2xl font-black text-foreground group-hover/ad:text-amber-500 transition-colors tracking-tight italic">
                                            {profile.recommendation.name}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-foreground flex items-baseline gap-0.5 tracking-tighter">
                                            {profile.recommendation.matchRate}
                                            <span className="text-sm font-black text-amber-500">%</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-70">DNA Match</div>
                                    </div>
                                </div>

                                <Link
                                    href={`/${isEn ? 'en' : 'ko'}/explore?q=${encodeURIComponent(profile.recommendation.name)}`}
                                    className="w-full mt-4 bg-foreground text-background py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.93] shadow-xl"
                                >
                                    {isEn ? 'Examine Bottle' : '제품 상세 정보 확인'}
                                    <ExternalLink className="w-4 h-4" />
                                </Link>

                                {profile.recommendation.reason && (
                                    <div className="mt-6 p-4 bg-secondary/50 rounded-2xl border border-border">
                                         <p className="text-xs text-muted-foreground leading-relaxed font-medium italic opacity-80">
                                            {profile.recommendation.reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isPublic && (
                <div className="text-center space-y-8 pt-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.2em]">
                            {isEn ? 'Want to decode your DNA?' : '나만의 취향 지도를 만드세요'}
                        </p>
                        <h3 className="text-3xl font-black text-foreground tracking-tighter italic">
                            {isEn ? 'Join K-Spirits to map your taste' : 'K-Spirits에서 나만의 취향 지도를 시작하세요'}
                        </h3>
                    </div>

                    <Link
                        href={`/${isEn ? 'en' : 'ko'}`}
                        className="inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background font-black rounded-2xl transition-all shadow-2xl hover:bg-primary hover:text-primary-foreground active:scale-[0.93] uppercase tracking-tight text-sm"
                    >
                        {isEn ? 'Start My DNA Map' : '나도 분석하러 가기'} <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
