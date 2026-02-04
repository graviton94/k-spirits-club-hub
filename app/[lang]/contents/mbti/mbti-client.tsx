'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MBTI_QUESTIONS, MBTI_RESULTS, MBTI_TYPE, MBTIResult } from '@/lib/constants/mbti-data';
import { SpiritCard } from '@/components/ui/SpiritCard';
import { Spirit } from '@/lib/db/schema';
import { Loader2, Share2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

type GameStep = 'intro' | 'quiz' | 'loading' | 'result';

export function MBTIClient({ lang }: { lang: string }) {
    const [step, setStep] = useState<GameStep>('intro');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({
        E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
    });
    const [resultType, setResultType] = useState<MBTI_TYPE | null>(null);
    const [recommendedSpirits, setRecommendedSpirits] = useState<Spirit[]>([]);
    const [isLoadingSpirits, setIsLoadingSpirits] = useState(false);

    const isEn = lang === 'en';

    const startQuiz = () => setStep('quiz');

    const handleAnswer = (type: string, score: number) => {
        setScores(prev => ({ ...prev, [type]: prev[type] + score }));

        if (currentIdx < MBTI_QUESTIONS.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            calculateResult();
        }
    };

    const calculateResult = () => {
        setStep('loading');

        // Determine type
        const mbti = [
            scores.E >= scores.I ? 'E' : 'I',
            scores.N >= scores.S ? 'N' : 'S',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'J' : 'P'
        ].join('') as MBTI_TYPE;

        setResultType(mbti);

        // Artificial delay for "analysis" effect
        setTimeout(() => {
            setStep('result');
            fetchRecommendations(mbti);
        }, 3000);
    };

    const fetchRecommendations = async (type: MBTI_TYPE) => {
        setIsLoadingSpirits(true);
        const result = MBTI_RESULTS[type];
        const keyword = result.recommendedKeywords[0]; // Just use first for now

        try {
            const res = await fetch(`/api/spirits?limit=4&keyword=${encodeURIComponent(keyword)}`);
            if (res.ok) {
                const data = await res.json();
                setRecommendedSpirits(data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setIsLoadingSpirits(false);
        }
    };

    const reset = () => {
        setStep('intro');
        setCurrentIdx(0);
        setScores({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
        setResultType(null);
        setRecommendedSpirits([]);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
    };

    const t = {
        titlePrefix: isEn ? "Spirit " : "주류 ",
        titleSuffix: isEn ? " Test" : " 테스트",
        subtitle: isEn ? "Find your perfect life-spirit!" : "나와 찰떡인 인생 술을 찾아보세요!",
        startBtn: isEn ? "Start" : "시작하기",
        progress: isEn ? "Progress" : "진행률",
        loadingTitle: isEn ? "Analyzing alcohol type..." : "알코올 유형 분석 중...",
        loadingSub: isEn ? "Your taste cells are reacting." : "당신의 취향 세포가 반응하고 있습니다.",
        bestFriend: isEn ? "Best Drink Buddy" : "최고의 술친구",
        worstFriend: isEn ? "Not a Good Buddy" : "안 맞는 술친구",
        recommendTitle: isEn ? "Recommended Spirits for You" : "당신을 위한 추천 술",
        shareBtn: isEn ? "Share Results" : "테스트 결과 공유하기",
        retryBtn: isEn ? "Try Again" : "다시 테스트하기",
        linkCopied: isEn ? "Link copied!" : "링크가 복사되었습니다!"
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 min-h-[80vh] flex flex-col items-center">
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                                {t.titlePrefix}<br /><span className="text-amber-500">MBTI{t.titleSuffix}</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="relative w-64 h-64 mx-auto bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-8xl">🥃</span>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-dashed border-amber-500/30 rounded-full"
                            />
                        </div>

                        <button
                            onClick={startQuiz}
                            className="px-12 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xl shadow-lg transition-all active:scale-95"
                        >
                            {t.startBtn}
                        </button>
                    </motion.div>
                )}

                {step === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full space-y-8"
                    >
                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{t.progress}</span>
                                <span>{Math.round(((currentIdx + 1) / MBTI_QUESTIONS.length) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-amber-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIdx + 1) / MBTI_QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-card border p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-12">
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                                {isEn ? MBTI_QUESTIONS[currentIdx].question_en : MBTI_QUESTIONS[currentIdx].question_ko}
                            </h2>

                            <div className="grid gap-4">
                                {MBTI_QUESTIONS[currentIdx].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt.type, opt.score)}
                                        className="w-full p-6 text-lg border-2 border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/5 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all active:scale-98 text-left"
                                    >
                                        {isEn ? opt.text_en : opt.text_ko}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="relative">
                            <Loader2 className="w-20 h-20 text-amber-500 animate-spin" />
                            <span className="absolute inset-0 flex items-center justify-center text-2xl">🧊</span>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">{t.loadingTitle}</h3>
                            <p className="text-muted-foreground animate-pulse">
                                {t.loadingSub}
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && resultType && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full space-y-12 pb-20"
                    >
                        {/* Result Profile */}
                        <div className="text-center space-y-6">
                            <div className="space-y-1">
                                <p className="text-amber-600 font-bold tracking-widest uppercase">Your Type: {resultType}</p>
                                <h2 className="text-4xl md:text-5xl font-black">
                                    {isEn ? MBTI_RESULTS[resultType].title_en : MBTI_RESULTS[resultType].title_ko}
                                </h2>
                            </div>

                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border">
                                <Image
                                    src={MBTI_RESULTS[resultType].imagePath}
                                    alt={resultType}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                <p className="text-lg leading-relaxed text-foreground/90">
                                    {isEn ? MBTI_RESULTS[resultType].description_en : MBTI_RESULTS[resultType].description_ko}
                                </p>
                            </div>
                        </div>

                        {/* Harmony Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
                                <p className="text-xs text-blue-600 font-bold mb-1">{t.bestFriend}</p>
                                <p className="font-bold">{MBTI_RESULTS[resultType].compatible.join(', ')}</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl text-center border border-red-100 dark:border-red-900/30">
                                <p className="text-xs text-red-600 font-bold mb-1">{t.worstFriend}</p>
                                <p className="font-bold">{MBTI_RESULTS[resultType].incompatible.join(', ')}</p>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-xl font-bold">{t.recommendTitle}</h3>
                                <span className="text-sm text-muted-foreground"># {MBTI_RESULTS[resultType].recommendedKeywords.join(' #')}</span>
                            </div>

                            {isLoadingSpirits ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" /></div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {recommendedSpirits.map(spirit => (
                                        <SpiritCard key={spirit.id} spirit={spirit} lang={lang} size="compact" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={copyLink}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-opacity"
                            >
                                <Share2 size={20} /> {t.shareBtn}
                            </button>
                            <button
                                onClick={reset}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-muted text-foreground font-medium rounded-2xl hover:bg-muted/80 transition-colors"
                            >
                                <RefreshCw size={18} /> {t.retryBtn}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
