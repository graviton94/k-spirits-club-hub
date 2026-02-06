export const runtime = 'edge';

import { newArrivalsDb, trendingDb, spiritsDb, reviewsDb } from "@/lib/db/firestore-rest";
import HomeClient from "@/components/home/HomeClient";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // 1. Parallel fetch essential home page data on the server
  // This eliminates client-side waterfall and shows content instantly
  const [newArrivals, trendingList, recentReviews] = await Promise.all([
    newArrivalsDb.getAll().catch(() => []),
    trendingDb.getTopTrending(5).catch(() => []),
    reviewsDb.getRecent().catch(() => [])
  ]);

  // 2. Fetch full trending spirit details if any exist
  const trendingIds = trendingList.map(t => t.spiritId);
  const trendingSpirits = trendingIds.length > 0
    ? await spiritsDb.getByIds(trendingIds).catch(() => [])
    : [];

  return (
    <HomeClient
      lang={lang}
      dict={dictionary.home}
      initialNewArrivals={newArrivals}
      initialTrending={trendingSpirits}
      initialReviews={recentReviews}
    />
  );
}
