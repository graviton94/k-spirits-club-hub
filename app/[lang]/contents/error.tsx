'use client';

import { useEffect } from 'react';

export default function ContentsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[Contents Error Boundary]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-card flex items-center justify-center mb-6 border border-border text-4xl">
                🍾
            </div>
            <h2 className="text-2xl font-black mb-3 tracking-tighter text-foreground">
                잠시 준비 중입니다
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
                <br />
                <span className="text-xs opacity-60 mt-1 block">
                    Page loading issue. Please try again.
                </span>
            </p>
            <button
                onClick={reset}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
            >
                다시 시도 / Retry
            </button>
            {error.digest && (
                <p className="mt-4 text-[10px] text-muted-foreground/40 font-mono">
                    Digest: {error.digest}
                </p>
            )}
        </div>
    );
}
