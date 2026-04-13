'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Download, Share2, Info, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/[lang]/context/auth-context';
import TasteRadar from './TasteRadar';
import SuccessToast from '@/components/ui/SuccessToast';
import TasteRecommendationSection from './TasteRecommendationSection';

export default function FlavorView({
    dict,
    spirits = []
}: {
    dict?: any,
    spirits?: any[]
}) {
    const [profile, setProfile] = useState<any | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [usage, setUsage] = useState<{ count: number, remaining: number } | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');

    const pathname = usePathname() || "";
    const isEn = pathname.split('/')[1] === 'en';
    const { user } = useAuth();

    const radarData = useMemo(() => {
        if (!profile?.stats) return [];
        const s = profile.stats;
        return [
            { subject: isEn ? 'Sweet' : '단맛', A: s.sweet || 0, fullMark: 100 as const },
            { subject: isEn ? 'Fruity' : '과일향', A: s.fruity || 0, fullMark: 100 as const },
            { subject: isEn ? 'Floral' : '꽃향', A: s.floral || 0, fullMark: 100 as const },
            { subject: isEn ? 'Spicy' : '스파이시', A: s.spicy || 0, fullMark: 100 as const },
            { subject: isEn ? 'Woody' : '우디함', A: s.woody || 0, fullMark: 100 as const },
            { subject: isEn ? 'Peaty' : '피트향', A: s.peaty || 0, fullMark: 100 as const },
        ];
    }, [profile, isEn]);

    useEffect(() => {
        if (!user) return;
        fetch(`/api/analyze-taste?userId=${user.uid}`).then(res => res.json()).then(data => {
            if (data.profile) setProfile(data.profile);
            if (data.usage) setUsage(data.usage);
        }).catch(e => console.error(e));
    }, [user]);

    const handleAnalyze = async () => {
        if (!user) { setToastMessage(isEn ? 'Login required' : '로그인이 필요합니다'); setToastVariant('error'); setShowToast(true); return; }
        if (usage && usage.remaining <= 0) return;

        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/analyze-taste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, lang: isEn ? 'en' : 'ko' })
            });

            if (!res.ok) throw new Error((await res.json()).message || 'Analysis Failed');
            const data = await res.json();
            setProfile(data.profile);
            if (data.usage) setUsage(data.usage);
        } catch (e: any) {
            setToastMessage(e.message); setToastVariant('error'); setShowToast(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const isLimitReached = usage ? usage.remaining <= 0 : false;

    if (!profile && !isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-border"><Sparkles className="w-8 h-8 text-amber-500" /></div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter text-foreground">{isEn ? "Decode Your Spirits DNA" : "당신의 미각 DNA를 해독하세요"}</h2>
                <p className="text-muted-foreground max-w-sm mb-12 text-sm font-medium">{isEn ? "AI Sommelier analyzes your cellar to build a 6D Flavor Vector." : "AI 소믈리에가 당신의 술장을 분석하여 6차원 풍미 지도를 만듭니다."}</p>
                <button onClick={handleAnalyze} className="h-16 px-12 bg-foreground text-background rounded-2xl font-black hover:bg-amber-500 hover:text-black transition-all shadow-xl flex items-center gap-3 uppercase tracking-tight text-sm"><Sparkles className="w-5 h-5" /> {isEn ? "Generate AI Analysis" : "AI 소믈리에 분석 시작"}</button>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-10">
                <div className="relative"><motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border-t-2 border-amber-500 p-2"><div className="w-full h-full rounded-full border-b-2 border-foreground/10" /></motion.div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">🧬</div></div>
                <div className="text-center font-black tracking-widest text-foreground uppercase animate-pulse">{isEn ? "Synergizing Vectors..." : "풍미 벡터 분석 중..."}</div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Radar Grid */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="flex-1 min-h-[420px]">
                        <TasteRadar data={radarData} />
                    </div>
                    <div className="flex gap-4 h-14">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLimitReached}
                            className={`flex-1 h-full rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 
                                ${isLimitReached
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed grayscale'
                                    : 'bg-card hover:bg-secondary text-foreground border-border shadow-sm'}`}
                        >
                            {isLimitReached ? <Lock className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            {isLimitReached
                                ? (isEn ? "Daily limit reached🥹 (3/day)" : "분석 횟수가 소진되었어요🥹 (일 3회)")
                                : (isEn ? "Sync DNA" : "DNA 동기화")}
                        </button>
                        <button className="w-14 h-full bg-card hover:bg-secondary rounded-2xl border border-border flex items-center justify-center transition-all shadow-sm">
                            <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Persona Grid */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex-1 bg-card/40 p-12 rounded-[40px] border border-border backdrop-blur-md relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute -top-10 -right-10 w-60 h-60 bg-amber-500/5 blur-[100px]" />
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black rounded-full mb-8 uppercase tracking-widest border border-amber-500/20 w-fit">
                            <Info className="w-3" /> {isEn ? "Active Palate DNA" : "활성 미각 DNA"}
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-black text-foreground mb-8 tracking-tighter italic leading-tight">{profile?.persona.title}</h3>
                        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed font-medium mb-10">{profile?.persona.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {profile?.persona.keywords.map((kw: string, i: number) => (
                                <span key={i} className="text-[10px] font-black text-amber-600 dark:text-amber-500/80 bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10 uppercase tracking-widest">{kw}</span>
                            ))}
                        </div>
                    </div>
                    <button className="h-14 w-full bg-foreground text-background hover:bg-amber-500 hover:text-black font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest">
                        <Share2 className="w-4 h-4" /> {isEn ? "Broadcast DNA" : "나의 DNA 공유하기"}
                    </button>
                </div>
            </div>

            <div className="pt-12 border-t border-border">
                <TasteRecommendationSection recommendations={profile?.recommendationEntries || []} dict={dict} />
            </div>

            <SuccessToast isVisible={showToast} message={toastMessage} variant={toastVariant} onClose={() => setShowToast(false)} />
        </div>
    );
}
