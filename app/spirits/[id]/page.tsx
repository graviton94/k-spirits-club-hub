import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import SpiritDetailClient from "./spirit-detail-client";

// Force dynamic rendering and edge runtime
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

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

  return <SpiritDetailClient spirit={spirit} reviews={reviews} />;
}
