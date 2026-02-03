'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus } from 'lucide-react';

const THUMBNAIL_TEMPLATES = [
    {
        id: 'home',
        title: 'K-Spirits Club',
        description: '나만의 스마트 주류 보관함 & 테이스팅 저널',
        bgColor: 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]',
        accentColor: 'text-amber-500',
        glow: 'bg-amber-500/20'
    },
    {
        id: 'perfect-pour',
        title: 'Perfect Pour',
        description: '황금 비율 소맥 제조의 달인에 도전하세요!',
        bgColor: 'from-[#0f172a] via-[#451a03] to-[#0f172a]',
        accentColor: 'text-orange-500',
        glow: 'bg-orange-500/20'
    },
    {
        id: 'worldcup',
        title: 'Spirit World Cup',
        description: '최고의 술을 가리는 당신만의 토너먼트',
        bgColor: 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]',
        accentColor: 'text-indigo-500',
        glow: 'bg-indigo-500/20'
    },
    {
        id: 'flavor-dna',
        title: 'AI Taste DNA',
        description: 'AI가 분석해주는 당신만의 미각 프로필',
        bgColor: 'from-[#0f172a] via-[#4c1d95] to-[#0f172a]',
        accentColor: 'text-purple-500',
        glow: 'bg-purple-500/20'
    }
];

export default function ThumbnailGenerator() {
    const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async (id: string) => {
        const element = refs.current[id];
        if (!element) return;

        try {
            const dataUrl = await toPng(element, {
                width: 800,
                height: 400,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `og-${id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image:', err);
        }
    };

    const handleDownloadAll = async () => {
        setIsGenerating(true);
        for (const template of THUMBNAIL_TEMPLATES) {
            await handleDownload(template.id);
            await new Promise(r => setTimeout(r, 500));
        }
        setIsGenerating(false);
    };

    return (
        <div className="container mx-auto px-4 py-12 bg-black min-h-screen">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Thumbnail Generator</h1>
                    <p className="text-gray-400">800x400 OG Image templates for K-Spirits Club</p>
                </div>
                <button
                    onClick={handleDownloadAll}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    Download All
                </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {THUMBNAIL_TEMPLATES.map((t) => (
                    <div key={t.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t.id}</h2>
                            <button
                                onClick={() => handleDownload(t.id)}
                                className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-all"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Rendering Target */}
                        <div
                            ref={el => { refs.current[t.id] = el; }}
                            className={`relative w-[800px] h-[400px] overflow-hidden rounded-2xl shadow-2xl flex flex-col items-center justify-center bg-gradient-to-br ${t.bgColor}`}
                            style={{ width: '800px', height: '400px' }}
                        >
                            {/* Decorative Background Elements */}
                            <div className={`absolute top-0 left-0 w-full h-full ${t.glow} blur-[120px] rounded-full scale-150 opacity-50`} />
                            <div className="absolute inset-0 bg-black/20" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center px-12">
                                <div className="mb-6 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center transform rotate-6 shadow-2xl overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                                        <span className="text-4xl relative z-10 transition-transform">
                                            {t.id === 'home' ? '🥃' : t.id === 'perfect-pour' ? '🍺' : t.id === 'worldcup' ? '🏆' : '🧬'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className={`text-6xl font-black mb-4 tracking-tighter ${t.accentColor} drop-shadow-2xl`}>
                                    {t.title}
                                </h3>

                                <div className="h-1.5 w-16 bg-white/20 rounded-full mb-8" />

                                <p className="text-3xl font-bold text-white/95 leading-tight max-w-2xl drop-shadow-lg">
                                    {t.description}
                                </p>

                                <div className="mt-10 flex items-center gap-6">
                                    <div className="h-px w-12 bg-white/10" />
                                    <span className="text-xs font-black uppercase tracking-[0.5em] text-white/30">
                                        K-SPIRITS CLUB
                                    </span>
                                    <div className="h-px w-12 bg-white/10" />
                                </div>
                            </div>

                            {/* Border decoration */}
                            <div className="absolute inset-0 border-[24px] border-white/[0.02] pointer-events-none" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
