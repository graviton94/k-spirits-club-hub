'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, ShoppingBag, ExternalLink, Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useAuth } from '@/app/context/auth-context';
import TasteRadar from './TasteRadar';
import SuccessToast from '@/components/ui/SuccessToast';
import { UserTasteProfile } from '@/lib/db/schema';

export default function FlavorView() {
    const [profile, setProfile] = useState<UserTasteProfile | null>(null); // 초기엔 null
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [usage, setUsage] = useState<{ count: number, remaining: number } | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    const reportRef = useRef<HTMLDivElement>(null);

    // 차트 데이터 변환 유틸
    const getChartData = (stats: any) => [
        { subject: 'Woody', A: stats.woody, fullMark: 100 as const },
        { subject: 'Peaty', A: stats.peaty, fullMark: 100 as const },
        { subject: 'Floral', A: stats.floral, fullMark: 100 as const },
        { subject: 'Fruity', A: stats.fruity, fullMark: 100 as const },
        { subject: 'Nutty', A: stats.nutty, fullMark: 100 as const },
        { subject: 'Rich', A: stats.richness, fullMark: 100 as const },
    ];

    // Hooks
    const { user } = useAuth(); // Import useAuth at top level if not imported, or pass as prop? 
    // FlavorView is imported in PreferenceExploration which has 'profile' prop but maybe not 'user' object directly?
    // PreferenceExploration receives 'profile' (User logic). 
    // Let's assume we can get user from useAuth() inside this component.

    // Load existing profile on mount
    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/analyze-taste?userId=${user.uid}`);
                if (res.ok) {
                    const data = await res.json();

                    if (data.profile) {
                        setProfile({
                            ...data.profile,
                            analyzedAt: new Date(data.profile.analyzedAt)
                        });
                    }
                    if (data.usage) {
                        setUsage(data.usage);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch existing profile', e);
            }
        };

        fetchProfile();
    }, [user]);

    const handleAnalyze = async () => {
        if (!user) {
            setToastMessage('로그인이 필요합니다.');
            setToastVariant('error');
            setShowToast(true);
            return;
        }

        if (usage && usage.remaining <= 0) {
            setToastMessage('분석 횟수가 소진되었습니다. 내일 다시 만나요! 😢');
            setToastVariant('error');
            setShowToast(true);
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-taste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '분석에 실패했습니다.');
            }

            const data = await response.json();

            // Update profile
            setProfile({
                ...data.profile,
                analyzedAt: new Date(data.profile.analyzedAt)
            });

            // Update usage
            if (data.usage) {
                setUsage(data.usage);
            }

        } catch (error) {
            console.error('Analysis failed:', error);
            setToastMessage(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
            setToastVariant('error');
            setShowToast(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveImage = async () => {
        if (!reportRef.current) return;

        try {
            const dataUrl = await toPng(reportRef.current, {
                cacheBust: true,
                backgroundColor: '#0a0a0a',
                style: {
                    borderRadius: '0'
                }
            });

            const link = document.createElement('a');
            link.download = `k-spirits-dna-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();

            setToastMessage('이미지가 저장되었습니다!');
            setToastVariant('success');
            setShowToast(true);
        } catch (err) {
            console.error('Failed to save image:', err);
            setToastMessage('이미지 저장에 실패했습니다.');
            setToastVariant('error');
            setShowToast(true);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setToastMessage('🔗공유 링크가 클립보드에 복사되었습니다!');
            setToastVariant('success');
            setShowToast(true);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            setToastMessage('링크 복사에 실패했습니다.');
            setToastVariant('error');
            setShowToast(true);
        }
    };

    // 1. 분석 전: 데이터 없음 상태
    if (!profile && !isAnalyzing) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-pink-500/20">
                    <Sparkles className="w-10 h-10 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3">아직 분석된 취향이 없습니다</h2>
                <p className="text-neutral-400 max-w-md mb-8">
                    보관함에 있는 술과 남기신 리뷰를 바탕으로<br />AI가 당신의 미각 DNA를 분석해드립니다.
                </p>
                <button
                    onClick={handleAnalyze}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-pink-900/50 flex items-center gap-2"
                >
                    <Sparkles className="w-5 h-5" /> 내 취향 분석 시작하기
                </button>
            </motion.div>
        );
    }

    // 2. 분석 중: 로딩 상태
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="relative">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full animate-pulse" />

                    {/* Avatar image with animations */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500/50 shadow-2xl shadow-pink-500/50"
                    >
                        <img
                            src="/icons/user/user-3.webp"
                            alt="AI Analyzing"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
                <p className="text-lg font-medium animate-pulse">당신에게 딱 맞는 취향을 찾는 중...</p>
            </div>
        );
    }

    // 3. 분석 완료: 결과 리포트
    const chartData = getChartData(profile!.stats);

    // Dynamic Button/Message based on limit
    const renderLimitMessage = () => {
        if (!usage) return null; // Loading or unknown

        if (usage.remaining > 0) {
            return (
                <button
                    onClick={handleAnalyze}
                    className="mt-6 w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <RefreshCw className="w-4 h-4" />
                    취향 재분석 (오늘 남은 횟수: {usage.remaining}회)
                </button>
            );
        } else {
            return (
                <div className="mt-6 w-full py-4 bg-neutral-800/50 border border-neutral-800 text-neutral-500 font-medium rounded-xl text-center text-sm">
                    분석 횟수가 소진되었습니다😢 (일 3회)<br />
                    <span className="text-xs opacity-70">내일 다시 만나요!</span>
                </div>
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6 pb-20"
        >
            {/* 메인 리포트 카드 */}
            <div
                ref={reportRef}
                className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 md:p-10 relative overflow-hidden group"
            >
                {/* 은은한 배경 효과 */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                    {/* 왼쪽: 차트 */}
                    <div className="w-full aspect-square max-w-[320px] mx-auto relative flex flex-col">
                        <div className="relative flex-1">
                            {/* 차트 배경 장식 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent rounded-full" />
                            <TasteRadar data={chartData} />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 font-mono tracking-widest bg-neutral-900/80 px-2 py-1 rounded">
                                {profile!.analyzedAt.toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 텍스트 & 추천 */}
                    <div className="space-y-8">
                        {/* 페르소나 정의 */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[10px] font-bold text-pink-400 tracking-wider">
                                    AI REPORT
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                "{profile!.persona.title}"
                            </h2>
                            <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                                {profile!.persona.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {profile!.persona.keywords.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-400 font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 수익화 섹션: 추천 상품 */}
                        {profile!.recommendation && (
                            <div className="p-5 bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 hover:border-pink-500/50 transition-colors group/ad">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-pink-400 font-bold mb-1 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> BEST MATCH
                                        </span>
                                        <h3 className="text-lg font-bold text-white group-hover/ad:text-pink-200 transition-colors">
                                            {profile!.recommendation.name}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white">{profile!.recommendation.matchRate}<span className="text-sm align-top ml-1">%</span></div>
                                    </div>
                                </div>

                                <a
                                    href={profile!.recommendation.linkUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-2 bg-white text-black py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                                >
                                    <ShoppingBag className="w-4 h-4" /> 최저가 확인(🚧개발중) <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </div>
                        )}

                        {/* Limit Message / Regenerate Button */}
                        {renderLimitMessage()}
                    </div>
                </div>
            </div>

            {/* Sharing Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleSaveImage}
                    className="flex items-center justify-center gap-2 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold transition-all transform active:scale-95 border border-neutral-700 shadow-lg"
                >
                    <Download className="w-5 h-5 text-pink-500" />
                    이미지 저장
                </button>
                <button
                    onClick={handleCopyUrl}
                    className="flex items-center justify-center gap-2 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold transition-all transform active:scale-95 border border-neutral-700 shadow-lg"
                >
                    <Share2 className="w-5 h-5 text-purple-500" />
                    친구에게 공유
                </button>
            </div>

            <SuccessToast
                isVisible={showToast}
                message={toastMessage}
                variant={toastVariant}
                onClose={() => setShowToast(false)}
            />
        </motion.div>
    );
}
