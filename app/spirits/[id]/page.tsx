import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import SaveButton from "@/components/ui/SaveButton";
import ReviewSection from "@/components/ui/ReviewSection";

// Force dynamic rendering to prevent build-time Firestore access
export const dynamic = 'force-dynamic';

export default async function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    notFound();
  }


  // TODO: Implement reviews feature in Firestore
  const reviews: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-lg flex items-center justify-center">
          <span className="text-9xl">🥃</span>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{spirit.name}</h1>

          <div className="space-y-3 mb-6">
            <DetailRow label="증류소" value={spirit.distillery} />
            {spirit.bottler && <DetailRow label="박틀러" value={spirit.bottler} />}
            <DetailRow label="도수" value={`${spirit.abv}%`} />
            {spirit.volume && <DetailRow label="용량" value={`${spirit.volume}ml`} />}
            <DetailRow label="카테고리" value={spirit.category} />
            {spirit.subcategory && <DetailRow label="종류" value={spirit.subcategory} />}
            <DetailRow label="원산지" value={spirit.country} />
            {spirit.region && <DetailRow label="지역" value={spirit.region} />}
          </div>

          <SaveButton spiritId={spirit.id} />

          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>데이터 소스:</strong> {spirit.source}
              {spirit.externalId && ` (${spirit.externalId})`}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection spiritId={spirit.id} reviews={reviews} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
