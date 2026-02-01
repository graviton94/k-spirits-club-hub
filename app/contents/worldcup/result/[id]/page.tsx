import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/db/firebase';
import { Trophy, ChevronLeft, Download, Share2, Gamepad2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

interface ResultData {
    winner: {
        name: string;
        category: string;
        subcategory: string | null;
        distillery: string | null;
        imageUrl: string | null;
        thumbnailUrl: string | null;
        tags: string[];
    };
    category: string;
    timestamp: any;
}

async function getResult(id: string): Promise<ResultData | null> {
    try {
        const docRef = doc(db, 'worldcup_results', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as ResultData;
        }
    } catch (err) {
        console.error('Error fetching worldcup result:', err);
    }
    return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const result = await getResult(params.id);

    if (!result) {
        return {
            title: '결과를 찾을 수 없습니다 - K-Spirits',
        };
    }

    const { winner } = result;
    const title = `🏆 나의 최종 선택은! [${winner.name}]`;
    const description = `주류 취향 월드컵에서 찾은 나의 원픽! 당신의 취향도 확인해보세요.`;
    const image = winner.imageUrl || winner.thumbnailUrl || '/og-image.png';

    return {
        title: `${winner.name} - 월드컵 결과`,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                    width: 800,
                    height: 800,
                    alt: winner.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function WorldCupResultPage({ params }: { params: { id: string } }) {
    const result = await getResult(params.id);

    if (!result) {
        notFound();
    }

    const { winner } = result;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg mx-auto text-center">
                {/* Header Actions */}
                <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4">
                    <Link
                        href="/contents/worldcup"
                        className="p-2.5 bg-card/50 backdrop-blur-md rounded-2xl border border-border hover:bg-muted transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </Link>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500 text-xs font-black uppercase tracking-widest">World Cup Result</span>
                </div>

                <h2 className="text-3xl font-black text-foreground mb-8 tracking-tighter">
                    나의 최고의 선택!
                </h2>

                {/* Winner Card Container (Forced Light Theme) */}
                <div className="bg-white p-8 rounded-[32px] mb-10 mx-auto w-fit shadow-xl border border-neutral-100">
                    <div className="flex flex-col items-center gap-4">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-1 mb-2">
                            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">
                                K-Spirits World Cup
                            </span>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                <h4 className="text-xl font-black text-[#1a1a1a] tracking-tighter italic">CHAMPION</h4>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="w-64 bg-white border border-[#e5e5e5] rounded-[24px] overflow-hidden shadow-lg relative">
                            <div className="aspect-square relative p-6 bg-[#f8f8f8] border-b border-[#e5e5e5]">
                                <Image
                                    src={winner.imageUrl || winner.thumbnailUrl || ''}
                                    alt={winner.name}
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </div>

                            <div className="p-5 flex flex-col gap-2 text-center bg-white text-[#1a1a1a]">
                                <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                    {winner.category}
                                </span>
                                {winner.subcategory && (
                                    <span className="text-[#737373] text-[10px] font-bold uppercase tracking-tighter line-clamp-1">
                                        {winner.subcategory}
                                    </span>
                                )}
                                <h3 className="text-lg font-black leading-tight line-clamp-2 px-1">
                                    {winner.name}
                                </h3>
                                {winner.distillery && (
                                    <p className="text-[#a3a3a3] text-[10px] font-medium bg-[#f5f5f5] px-2 py-0.5 rounded-full self-center">
                                        {winner.distillery}
                                    </p>
                                )}
                                {winner.tags && winner.tags.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                                        {winner.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-[9px] text-amber-600 font-bold whitespace-nowrap"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-2 opacity-30">
                            <span className="text-[8px] text-[#1a1a1a] font-bold tracking-widest uppercase">
                                k-spirits.club
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-72 mx-auto">
                    <Link
                        href="/contents/worldcup"
                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                        <Gamepad2 className="w-5 h-5" /> 나도 월드컵 하러 가기
                    </Link>

                    <p className="mt-4 text-xs text-muted-foreground font-medium">
                        K-Spirits에서 당신의 술 취향을 찾아보세요
                    </p>
                </div>
            </div>
        </div>
    );
}
