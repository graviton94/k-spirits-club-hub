import { Suspense } from "react";
import ExploreContent from "@/components/ui/ExploreContent";

export const runtime = 'edge';

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
