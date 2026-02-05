'use client';

import { useEffect, useState } from 'react';

const SPIRIT_EMOJIS = ['🍶', '🥃', '🍺', '🍷', '🍾', '🥂', '🍹'];

// Skeleton card that matches ExploreCard height exactly
function ExploreCardSkeleton() {
  return (
    <div className="flex gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 animate-pulse">
      {/* Image skeleton - exact match to ExploreCard */}
      <div className="shrink-0 w-20 h-20 rounded-lg bg-muted/50" />
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5 gap-2">
        <div className="h-4 bg-muted/50 rounded w-3/4" />
        <div className="h-3 bg-muted/50 rounded w-1/2" />
        <div className="h-2 bg-muted/50 rounded w-2/3" />
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex items-center gap-1.5 pl-1">
        <div className="w-9 h-9 rounded-xl bg-muted/50" />
        <div className="w-9 h-9 rounded-xl bg-muted/50" />
      </div>
    </div>
  );
}

export default function ExploreLoading() {
    const [currentEmoji, setCurrentEmoji] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEmoji((prev) => (prev + 1) % SPIRIT_EMOJIS.length);
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="h-8 bg-muted/50 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-muted/50 rounded w-32 animate-pulse" />
                    </div>
                </div>

                {/* Grid of skeleton cards */}
                <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ExploreCardSkeleton key={i} />
                    ))}
                </div>

                {/* Centered loading animation */}
                <div className="flex items-center justify-center mt-12">
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
        </div>
    );
}
