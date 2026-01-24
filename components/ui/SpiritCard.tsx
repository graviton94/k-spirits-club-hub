import type { Spirit } from "@/lib/db/schema";
import Link from "next/link";

interface SpiritCardProps {
  spirit: Spirit;
}

export default function SpiritCard({ spirit }: SpiritCardProps) {
  return (
    <Link href={`/spirits/${spirit.id}`}>
      <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
        <div className="aspect-square bg-secondary flex items-center justify-center">
          {spirit.imageUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
              <span className="text-6xl">🥃</span>
            </div>
          ) : (
            <span className="text-6xl">🥃</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{spirit.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{spirit.distillery}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-semibold">도수 {spirit.abv}%</span>
            <span className="text-muted-foreground">{spirit.country}</span>
          </div>
          {spirit.category && (
            <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-secondary">
              {spirit.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
