'use client';

export function ExploreSkeleton() {
    return (
        <div className="flex gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 animate-pulse">
            {/* Image area skeleton */}
            <div className="shrink-0 w-20 h-20 rounded-lg bg-muted border border-border" />

            {/* Content skeleton */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5 space-y-2">
                <div className="h-4 bg-muted rounded-full w-3/4" />
                <div className="flex gap-2">
                    <div className="h-3 bg-muted rounded-full w-20" />
                    <div className="h-3 bg-muted rounded-full w-10" />
                </div>
                <div className="h-2 bg-muted rounded-full w-1/2" />
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center gap-1.5 pl-1 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-muted" />
                <div className="w-9 h-9 rounded-xl bg-muted" />
            </div>
        </div>
    );
}

export function ExploreGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ExploreSkeleton key={i} />
            ))}
        </div>
    );
}
