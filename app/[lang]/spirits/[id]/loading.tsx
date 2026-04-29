'use client';

function SpiritDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-8 w-20 bg-muted/50 rounded-lg mb-6" />

      {/* Hero image skeleton */}
      <div className="w-full aspect-[3/2] bg-muted/50 rounded-2xl mb-6" />

      {/* Title block */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="h-7 bg-muted/50 rounded w-3/4" />
        <div className="h-4 bg-muted/50 rounded w-1/2" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-20 bg-muted/50 rounded-full" />
          <div className="h-6 w-16 bg-muted/50 rounded-full" />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 h-16 bg-muted/50 rounded-xl" />
        ))}
      </div>

      {/* Description lines */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="h-4 bg-muted/50 rounded w-full" />
        <div className="h-4 bg-muted/50 rounded w-5/6" />
        <div className="h-4 bg-muted/50 rounded w-4/6" />
      </div>

      {/* Tag section */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 bg-muted/50 rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-16 bg-muted/50 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpiritDetailLoading() {
  return <SpiritDetailSkeleton />;
}
