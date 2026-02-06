export const runtime = 'edge';

import { newArrivalsDb, reviewsDb } from "@/lib/db/firestore-rest";
import HomeClient from "@/components/home/HomeClient";
import NewsSection from "@/components/home/NewsSection";
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
  const [newArrivals, recentReviews] = await Promise.all([
    newArrivalsDb.getAll().catch(() => []),
    reviewsDb.getRecent().catch(() => [])
  ]);

  return (
    <HomeClient
      lang={lang}
      dict={dictionary.home}
      initialNewArrivals={newArrivals}
      initialTrending={[]} // Deprecated
      initialReviews={recentReviews}
      newsSection={<NewsSection lang={lang} />}
    />
  );
}
