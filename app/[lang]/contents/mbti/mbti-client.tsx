'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MBTI_QUESTIONS, MBTI_RESULTS, MBTI_TYPE, MBTIResult } from '@/lib/constants/mbti-data';
import { Share2, RefreshCw, Search, Loader2, Download, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import SuccessToast from '@/components/ui/SuccessToast';
import GoogleAd from '@/components/ui/GoogleAd';

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

    // Preload Game Images
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const imagesToPreload = [
                ...MBTI_QUESTIONS.map(q => q.imagePath).filter(Boolean),
                ...Object.values(MBTI_RESULTS).map(r => r.imagePath)
            ];

            imagesToPreload.forEach(src => {
                const img = new (window as any).Image();
                img.src = src;
            });
        }
    }, []);

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

    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 min-h-[85vh] flex flex-col items-center relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-8 left-6 p-2 bg-card/20 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-muted transition-all group z-50 shadow-2xl"
            >
                <ArrowLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
            </button>

            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="text-center space-y-12 relative z-10"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">
                                    {t.titlePrefix}<br />
                                    <span className="bg-brand-gradient bg-clip-text text-transparent">MBTI{t.titleSuffix}</span>
                                </h1>
                            </motion.div>
                            <p className="text-muted-foreground text-lg font-medium max-w-sm mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="relative w-80 h-72 mx-auto flex items-center justify-center">
                            <div className="absolute w-56 h-56 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                            <div className="relative z-10 w-40 h-40 flex items-center justify-center bg-card/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={introEmojiIdx}
                                        initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 20, scale: 1.5 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                        className="text-8xl select-none"
                                    >
                                        {SPIRIT_EMOJIS[introEmojiIdx]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        <button
                            onClick={startQuiz}
                            className="px-16 py-6 bg-primary text-primary-foreground rounded-[2.5rem] font-black text-xl shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] hover:scale-105 transition-all active:scale-95 italic uppercase tracking-tighter"
                        >
                            {t.startBtn}
                        </button>

                        <div className="w-full mt-10">
                            <GoogleAd
                                client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                                slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
                                format="horizontal"
                                className="rounded-3xl border border-white/5 opacity-80"
                            />
                        </div>
                    </motion.div>
                )}

                {step === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="w-full space-y-12 relative z-10"
                    >
                        {/* Progress Atmosphere */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em]">{t.progress}</p>
                                    <h3 className="text-3xl font-black text-primary italic tracking-tighter">
                                        {Math.round(((currentIdx + 1) / MBTI_QUESTIONS.length) * 100)}%
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground opacity-40 italic">
                                    {currentIdx + 1} / {MBTI_QUESTIONS.length}
                                </span>
                            </div>
                            <div className="h-2.5 w-full bg-card/20 border border-white/5 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    className="h-full bg-brand-gradient shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIdx + 1) / MBTI_QUESTIONS.length) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-card/20 backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />

                            {MBTI_QUESTIONS[currentIdx].imagePath && (
                                <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
                                    <Image
                                        src={MBTI_QUESTIONS[currentIdx].imagePath}
                                        alt="Question"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                            )}

                            <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-foreground italic">
                                {isEn ? MBTI_QUESTIONS[currentIdx].question_en : MBTI_QUESTIONS[currentIdx].question_ko}
                            </h2>

                            <div className="grid gap-3.5">
                                {MBTI_QUESTIONS[currentIdx].answers.map((ans, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(ans.value)}
                                        className="w-full p-6 text-lg md:text-xl font-black bg-card/30 border border-white/5 hover:border-primary/50 hover:bg-primary/5 rounded-3xl transition-all active:scale-[0.98] text-center leading-snug shadow-xl group/btn relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        <span className="relative z-10 italic uppercase tracking-tight">{isEn ? ans.text_en : ans.text_ko}</span>
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
                        className="flex flex-col items-center justify-center space-y-10 mt-[15vh] md:mt-[20vh] relative z-10"
                    >
                        <div className="relative p-10 bg-card/20 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
                            <Loader2 className="w-24 h-24 text-primary animate-spin" />
                            <span className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">🥃</span>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">{t.loadingTitle}</h3>
                            <p className="text-muted-foreground font-medium animate-pulse">
                                {t.loadingSub}
                            </p>
                        </div>
                    </motion.div>
                )}

                {step === 'result' && resultType && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full space-y-10 pb-24 relative z-10"
                    >
                        <div
                            ref={resultRef}
                            className="bg-card p-4 md:p-8 rounded-[3rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden"
                        >
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />

                            <div className="text-center space-y-6 relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-2">My Spirit Persona</p>
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter bg-brand-gradient bg-clip-text text-transparent leading-tight uppercase">
                                        {isEn ? MBTI_RESULTS[resultType].title_en : MBTI_RESULTS[resultType].title_ko}
                                    </h2>
                                </div>

                                <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-neutral-900 shadow-2xl border border-white/10">
                                    <Image
                                        src={MBTI_RESULTS[resultType].imagePath}
                                        alt={resultType}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                <div className="bg-muted/5 p-6 md:p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                                    <p className="text-base md:text-lg leading-relaxed text-foreground/90 font-medium whitespace-pre-line text-center">
                                        {isEn ? MBTI_RESULTS[resultType].description_en : MBTI_RESULTS[resultType].description_ko}
                                    </p>
                                </div>

                                {/* Tasting Tags (Pills) */}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {(isEn ? MBTI_RESULTS[resultType].tastingNotes_en : MBTI_RESULTS[resultType].tastingNotes_ko).map((tag: string, i: number) => {
                                        return (
                                            <span
                                                key={i}
                                                className="px-5 py-2 rounded-full text-[12px] font-black border border-white/5 bg-secondary/30 backdrop-blur-xl text-foreground/80 uppercase tracking-tighter"
                                            >
                                                # {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Harmony Section */}
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/20 backdrop-blur-3xl flex flex-col items-center justify-center min-h-[120px] shadow-xl group/buddy">
                                    <p className="text-[10px] text-primary font-black mb-3 uppercase tracking-widest">{t.bestFriend}</p>
                                    <p className="font-black text-sm md:text-base leading-tight whitespace-pre-line text-foreground italic text-center transition-transform group-hover/buddy:scale-105">
                                        {MBTI_RESULTS[resultType].compatible.map(type =>
                                            isEn ? MBTI_RESULTS[type].title_en : MBTI_RESULTS[type].title_ko
                                        ).join('\n')}
                                    </p>
                                </div>
                                <div className="bg-rose-500/5 p-6 rounded-[2rem] border border-rose-500/20 backdrop-blur-3xl flex flex-col items-center justify-center min-h-[120px] shadow-xl group/nobuddy">
                                    <p className="text-[10px] text-rose-500 font-black mb-3 uppercase tracking-widest">{t.worstFriend}</p>
                                    <p className="font-black text-sm md:text-base leading-tight whitespace-pre-line text-foreground italic text-center transition-transform group-hover/nobuddy:scale-105">
                                        {MBTI_RESULTS[resultType].incompatible.map(type =>
                                            isEn ? MBTI_RESULTS[type].title_en : MBTI_RESULTS[type].title_ko
                                        ).join('\n')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={saveImage}
                                    className="py-5 bg-card/40 backdrop-blur-2xl hover:bg-card/60 text-foreground rounded-3xl font-black text-sm md:text-base flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10 shadow-2xl group"
                                >
                                    <Download size={20} className="text-primary group-hover:scale-110 transition-transform" /> {isEn ? "EXPORT IMAGE" : "이미지 저장"}
                                </button>

                                <button
                                    onClick={copyLink}
                                    className="py-5 bg-card/40 backdrop-blur-2xl hover:bg-card/60 text-foreground rounded-3xl font-black text-sm md:text-base flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10 shadow-2xl group"
                                >
                                    <Share2 size={20} className="text-primary group-hover:scale-110 transition-transform" /> {isEn ? "SHARE URL" : "결과 공유"}
                                </button>
                            </div>

                            <button
                                onClick={reset}
                                className="w-full py-5 bg-foreground text-background rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] italic uppercase tracking-tighter"
                            >
                                <RefreshCw size={24} /> {t.retryBtn}
                            </button>
                        </div>

                        <div className="w-full mt-10 relative z-10">
                            <GoogleAd
                                client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                                slot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
                                format="horizontal"
                                className="rounded-3xl border border-white/5"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SuccessToast
                isVisible={showToast}
                message={isEn ? "Link copied to clipboard!" : "링크가 복사되었습니다!"}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
