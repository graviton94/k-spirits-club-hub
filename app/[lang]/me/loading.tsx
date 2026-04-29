'use client';

export default function MeLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      {/* Avatar + name block */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-muted/50 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 bg-muted/50 rounded w-1/2" />
          <div className="h-4 bg-muted/50 rounded w-1/3" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-2xl" />
        ))}
      </div>

      {/* Section header + cards */}
      <div className="h-5 bg-muted/50 rounded w-32 mb-4" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-2xl bg-muted/30">
            <div className="w-14 h-14 rounded-lg bg-muted/50 shrink-0" />
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="h-4 bg-muted/50 rounded w-3/4" />
              <div className="h-3 bg-muted/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
