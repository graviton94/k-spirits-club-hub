'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MBTI_QUESTIONS, MBTI_RESULTS, MBTI_TYPE, MBTIResult } from '@/lib/constants/mbti-data';
import { Share2, RefreshCw, Search, Loader2, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import SuccessToast from '@/components/ui/SuccessToast';

type GameStep = 'intro' | 'quiz' | 'loading' | 'result';

const SPIRIT_EMOJIS = ['🥃', '🍷', '🍺', '🍸', '🧉', '🍶', '🍹', '🥂'];
const GRAPH_COLORS = ['#475569', '#944d5e', '#a68b5e', '#5a6b5d'];

export function MBTIClient({ lang }: { lang: string }) {
    const [step, setStep] = useState<GameStep>('intro');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({
        E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
    });
    const [resultType, setResultType] = useState<MBTI_TYPE | null>(null);
    const [introEmojiIdx, setIntroEmojiIdx] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle global bottom nav positioning
        const bottomNav = document.querySelector('nav')?.parentElement;

        if (bottomNav) {
            if (step === 'quiz') {
                bottomNav.classList.remove('fixed', 'bottom-0');
                bottomNav.classList.add('relative', 'mt-10');
            } else {
                bottomNav.classList.add('fixed', 'bottom-0');
                bottomNav.classList.remove('relative', 'mt-10');
            }
        }

        if (step !== 'intro') return;

        const emojiInterval = setInterval(() => {
            setIntroEmojiIdx(prev => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 2000);

        return () => {
            clearInterval(emojiInterval);
            // Always ensure the bottom nav is restored when leaving MBTI or unmounting
            if (bottomNav) {
                bottomNav.classList.add('fixed', 'bottom-0');
                bottomNav.classList.remove('relative', 'mt-10');
            }
        };
    }, [step]);

    const isEn = lang === 'en';

    const startQuiz = () => setStep('quiz');

    const handleAnswer = (value: string) => {
        setScores(prev => ({ ...prev, [value]: prev[value] + 1 }));

        if (currentIdx < MBTI_QUESTIONS.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            calculateResult();
        }
    };

    const calculateResult = () => {
        setStep('loading');

        const mbti = [
            scores.E >= scores.I ? 'E' : 'I',
            scores.N >= scores.S ? 'N' : 'S',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'J' : 'P'
        ].join('') as MBTI_TYPE;

        setResultType(mbti);

        setTimeout(() => {
            setStep('result');
        }, 3000);
    };

    const reset = () => {
        setStep('intro');
        setCurrentIdx(0);
        setScores({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
        setResultType(null);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
    };

    const saveImage = async () => {
        if (!resultRef.current) return;

        try {
            const dataUrl = await toPng(resultRef.current, {
                quality: 0.95,
                backgroundColor: '#000000',
                style: {
                    borderRadius: '0',
                }
            });
            const link = document.createElement('a');
            link.download = `k-spirit-mbti-${resultType}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to save image:', err);
            alert(isEn ? 'Failed to save image' : '이미지 저장에 실패했습니다.');
        }
    };

    const t = {
        titlePrefix: isEn ? "Spirit " : "주류 ",
        titleSuffix: isEn ? " Test" : " 테스트",
        subtitle: isEn ? "If I were alcohol, what would I be?!" : "내가 술이라면, 어떤 술일까?!",
        startBtn: isEn ? "Start" : "시작하기",
        progress: isEn ? "Progress" : "진행률",
        loadingTitle: isEn ? "Analyzing alcohol type..." : "알코올 유형 분석 중...",
        loadingSub: isEn ? "Your taste cells are reacting." : "당신의 취향 세포가 반응하고 있습니다.",
        bestFriend: isEn ? "Best Drink Buddy" : "최고의 술친구",
        worstFriend: isEn ? "Not a Good Buddy" : "안 맞는 술친구",
        explorePrefix: isEn ? "Find " : "나에게 딱 맞는 \"",
        exploreSuffix: isEn ? " right now!" : "\" 보러가기!",
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

                        <div className="relative w-72 h-64 mx-auto flex items-center justify-center">
                            {/* Subtle decorative glow */}
                            <div className="absolute w-40 h-40 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl" />

                            {/* Static Container (No bounce) */}
                            <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={introEmojiIdx}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.5 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-8xl select-none"
                                    >
                                        {SPIRIT_EMOJIS[introEmojiIdx]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
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
                        {/* Sticky Progress Bar */}
                        <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-md py-4 -mx-4 px-4 space-y-2 border-b border-white/5">
                            <div className="flex justify-between text-xs font-bold tracking-tighter uppercase text-amber-500/80">
                                <span>{t.progress}</span>
                                <span>{Math.round(((currentIdx + 1) / MBTI_QUESTIONS.length) * 100)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIdx + 1) / MBTI_QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-card border p-5 md:p-6 rounded-3xl shadow-sm text-center space-y-4">
                            {MBTI_QUESTIONS[currentIdx].imagePath && (
                                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={MBTI_QUESTIONS[currentIdx].imagePath}
                                        alt="Question"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}
                            <h2 className="text-xl md:text-2xl font-bold leading-tight whitespace-pre-line">
                                {isEn ? MBTI_QUESTIONS[currentIdx].question_en : MBTI_QUESTIONS[currentIdx].question_ko}
                            </h2>

                            <div className="grid gap-2.5">
                                {MBTI_QUESTIONS[currentIdx].answers.map((ans, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(ans.value)}
                                        className="w-full p-4 text-base md:text-lg border-2 border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/5 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all active:scale-98 text-center whitespace-pre-line"
                                    >
                                        {isEn ? ans.text_en : ans.text_ko}
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
                        className="flex flex-col items-center justify-center space-y-8 mt-[15vh] md:mt-[20vh]"
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
                        className="w-full space-y-8 pb-20"
                    >
                        {/* Final Result Display to Capture */}
                        <div
                            ref={resultRef}
                            className="bg-black p-6 rounded-[40px] border border-white/5 space-y-8"
                        >
                            {/* Result Profile */}
                            <div className="text-center space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-3xl md:text-4xl font-black">
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

                                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                    <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line text-left md:text-center">
                                        {isEn ? MBTI_RESULTS[resultType].description_en : MBTI_RESULTS[resultType].description_ko}
                                    </p>
                                </div>

                                {/* Tasting Tags (Pills) */}
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {(isEn ? MBTI_RESULTS[resultType].tastingNotes_en : MBTI_RESULTS[resultType].tastingNotes_ko).map((tag: string, i: number) => {
                                        const colors = [
                                            "bg-pink-500/10 text-pink-500 border-pink-500/20",
                                            "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                            "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                            "bg-violet-500/10 text-violet-500 border-violet-500/20"
                                        ];
                                        return (
                                            <span
                                                key={i}
                                                className={`px-3 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${colors[i % colors.length]}`}
                                            >
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Harmony Section */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center min-h-[90px] md:min-h-[100px]">
                                    <p className="text-[9px] md:text-[10px] text-blue-400 font-black mb-1.5 uppercase tracking-widest">{t.bestFriend}</p>
                                    <p className="font-bold text-[11px] md:text-xs leading-tight whitespace-pre-line text-blue-100/90 text-center">
                                        {MBTI_RESULTS[resultType].compatible.map(type =>
                                            isEn ? MBTI_RESULTS[type].title_en : MBTI_RESULTS[type].title_ko
                                        ).join('\n')}
                                    </p>
                                </div>
                                <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/20 backdrop-blur-sm flex flex-col items-center justify-center min-h-[90px] md:min-h-[100px]">
                                    <p className="text-[9px] md:text-[10px] text-red-400 font-black mb-1.5 uppercase tracking-widest">{t.worstFriend}</p>
                                    <p className="font-bold text-[11px] md:text-xs leading-tight whitespace-pre-line text-red-100/90 text-center">
                                        {MBTI_RESULTS[resultType].incompatible.map(type =>
                                            isEn ? MBTI_RESULTS[type].title_en : MBTI_RESULTS[type].title_ko
                                        ).join('\n')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Explore Link */}
                        <div className="px-1">
                            {resultType && (
                                <Link
                                    href={`/${lang}/explore?q=${encodeURIComponent(
                                        (isEn ? MBTI_RESULTS[resultType].title_en : MBTI_RESULTS[resultType].title_ko)
                                            .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '') // Remove emojis
                                            .split(' ').pop() || "" // Get the last word (usually the spirit name)
                                    )}`}
                                    className="group relative flex items-center justify-between w-full p-6 bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all"
                                >
                                    <div className="z-10 flex flex-col">
                                        <span className="text-[11px] font-bold text-amber-500/80 mb-1 uppercase tracking-widest">
                                            {isEn ? "Find your perfect" : "나에게 딱 맞는"}
                                        </span>
                                        <span className="text-xl md:text-2xl font-black text-amber-500 tracking-tight leading-tight">
                                            "{(isEn ? MBTI_RESULTS[resultType].title_en : MBTI_RESULTS[resultType].title_ko)
                                                .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()}"
                                        </span>
                                        <span className="text-[11px] font-bold text-foreground/50 mt-1 uppercase tracking-widest">
                                            {isEn ? "right now!" : "보러가기"}
                                        </span>
                                    </div>
                                    <div className="z-10 bg-amber-500 text-white p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                                        <Search size={24} />
                                    </div>
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                                </Link>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={saveImage}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
                                >
                                    <Download size={18} className="text-blue-400" /> {isEn ? "Save Image" : "이미지 저장"}
                                </button>

                                <button
                                    onClick={copyLink}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
                                >
                                    <Share2 size={18} className="text-purple-400" /> {isEn ? "Share" : "결과 공유"}
                                </button>
                            </div>

                            <button
                                onClick={reset}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                            >
                                <RefreshCw size={20} /> {t.retryBtn}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Toast for Sharing */}
            <SuccessToast
                isVisible={showToast}
                message={isEn ? "Link copied to clipboard!" : "링크가 클립보드에 복사되었습니다!"}
                onClose={() => setShowToast(false)}
            />
        </div >
    );
}
