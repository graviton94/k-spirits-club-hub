'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, ExternalLink, Download, Share2, ChevronLeft } from 'lucide-react';
import TasteRadar from './TasteRadar';
import { UserTasteProfile } from '@/lib/db/schema';
import Link from 'next/link';

interface TastePublicReportProps {
    profile: UserTasteProfile;
    isPublic?: boolean;
}

export default function TastePublicReport({ profile, isPublic = false }: TastePublicReportProps) {
    const analyzedAt = new Date(profile.analyzedAt);

    const getChartData = (stats: any) => [
        { subject: 'Woody', A: stats.woody, fullMark: 100 as const },
        { subject: 'Peaty', A: stats.peaty, fullMark: 100 as const },
        { subject: 'Floral', A: stats.floral, fullMark: 100 as const },
        { subject: 'Fruity', A: stats.fruity, fullMark: 100 as const },
        { subject: 'Nutty', A: stats.nutty, fullMark: 100 as const },
        { subject: 'Rich', A: stats.richness, fullMark: 100 as const },
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
                    <Link href="/" className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">미각 DNA 리포트</h1>
                        <p className="text-xs text-neutral-500">AI가 분석한 취향 결과입니다</p>
                    </div>
                </div>
            )}

            <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-[32px] p-6 md:p-10 relative overflow-hidden group shadow-2xl">
                {/* 은은한 배경 효과 */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                    {/* 왼쪽: 차트 */}
                    <div className="w-full aspect-square max-w-[320px] mx-auto relative flex flex-col items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* 차트 배경 장식 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent rounded-full scale-90 border border-neutral-800/50" />
                            <TasteRadar data={chartData} />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 font-mono tracking-widest bg-neutral-900/80 px-2 py-1 rounded border border-neutral-800">
                                {analyzedAt.toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 텍스트 & 추천 */}
                    <div className="space-y-8">
                        {/* 페르소나 정의 */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[10px] font-bold text-pink-400 tracking-wider">
                                    AI TASTE DNA
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
                                "{profile.persona.title}"
                            </h2>
                            <p className="text-neutral-300 leading-relaxed text-sm md:text-lg font-medium opacity-90">
                                {profile.persona.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {profile.persona.keywords.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-neutral-800/80 border border-neutral-700/50 rounded-full text-xs text-neutral-400 font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 추천 상품 */}
                        {profile.recommendation && (
                            <div className="p-6 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md rounded-[24px] border border-neutral-700/50 hover:border-pink-500/30 transition-all group/ad shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-pink-400 font-black mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                                            <Sparkles className="w-3 h-3" /> Best Recommendation
                                        </span>
                                        <h3 className="text-xl font-black text-white group-hover/ad:text-pink-100 transition-colors tracking-tight">
                                            {profile.recommendation.name}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white flex items-baseline gap-0.5">
                                            {profile.recommendation.matchRate}
                                            <span className="text-xs font-bold text-pink-500">%</span>
                                        </div>
                                        <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Match Rate</div>
                                    </div>
                                </div>

                                <Link
                                    href={`/explore?q=${encodeURIComponent(profile.recommendation.name)}`}
                                    className="w-full mt-2 bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-[0.98]"
                                >
                                    제품 상세 정보 확인하기 <ExternalLink className="w-3 h-3 opacity-60" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isPublic && (
                <div className="text-center space-y-6 pt-4">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-neutral-400 text-sm font-medium">당신의 인생 술을 찾고 계신가요?</p>
                        <h3 className="text-2xl font-black text-white tracking-tighter">K-Spirits에서 미각 DNA를 분석해보세요</h3>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-pink-600/20 active:scale-95"
                    >
                        나도 분석하러 가기 <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
