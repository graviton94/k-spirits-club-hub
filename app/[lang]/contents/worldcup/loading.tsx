'use client';

function WorldCupCardSkeleton() {
  return (
    <div className="aspect-[3/4] rounded-2xl bg-muted/50" />
  );
}

export default function WorldCupLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="h-7 bg-muted/50 rounded w-48" />
        <div className="h-4 bg-muted/50 rounded w-32" />
      </div>

      {/* VS card pair */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <WorldCupCardSkeleton />
        <WorldCupCardSkeleton />
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted/50 rounded-full w-full mb-2" />
      <div className="h-3 bg-muted/30 rounded-full w-2/3 mx-auto" />
    </div>
  );
}
