'use client';

import { useEffect, useState } from 'react';

const SPIRIT_EMOJIS = ['🍶', '🥃', '🍺', '🍷', '🍾', '🥂', '🍹'];

// Skeleton card that matches CabinetSpiritCard dimensions exactly
function CabinetSpiritCardSkeleton() {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 p-px shadow-sm animate-pulse" style={{ aspectRatio: '2/3' }}>
            <div className="relative h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                {/* Image placeholder with same aspect ratio */}
                <div className="absolute inset-0 bg-muted/30" />
                
                {/* Content overlay at bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4">
                    <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                        {/* Badge skeleton */}
                        <div className="w-8 h-4 bg-muted/50 rounded-md" />
                        {/* Name skeleton */}
                        <div className="h-3 sm:h-4 bg-muted/50 rounded w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CabinetLoading() {
    const [currentEmoji, setCurrentEmoji] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmoji((prev) => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header skeleton */}
            <div className="mb-12">
                <div className="text-center mb-10">
                    <div className="h-12 bg-muted/50 rounded w-64 mx-auto mb-3 animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-48 mx-auto animate-pulse" />
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 max-w-2xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 text-center shadow-xl animate-pulse">
                            <div className="h-8 bg-muted/50 rounded w-12 mx-auto mb-2" />
                            <div className="h-3 bg-muted/50 rounded w-16 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid of skeleton cards matching cabinet layout */}
            <section className="mb-16">
                <div className="relative bg-[#0f172a] rounded-[2.5rem] px-3 py-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <CabinetSpiritCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Centered loading animation */}
            <div className="flex items-center justify-center mt-8">
                <div className="flex flex-col items-center gap-6">
                    {/* Rotating Spirit Emoji */}
                    <div className="text-7xl animate-bounce">
                        {SPIRIT_EMOJIS[currentEmoji]}
                    </div>

                    {/* Loading Dots */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
