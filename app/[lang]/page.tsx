export const runtime = 'edge';
export const revalidate = 60;

import { newArrivalsDb, reviewsDb } from "@/lib/db/firestore-rest";
import HomeClient from "@/components/home/HomeClient";
import NewsSection from "@/components/home/NewsSection";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { getRandomWikiSnippet } from "@/lib/utils/wiki-snippet";
import Script from "next/script";

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

  // 2. Fetch the deterministic daily wiki snippet for the FAQ schema
  const dailySnippet = getRandomWikiSnippet(lang);

  // 3. Build FAQ JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  let faqSchema = null;
  if (dailySnippet) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: dailySnippet.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: dailySnippet.content
          }
        }
      ]
    };
  }

  return (
    <>
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <HomeClient
        lang={lang}
        dict={dictionary.home}
        initialNewArrivals={newArrivals}
        initialTrending={[]} // Deprecated
        initialReviews={recentReviews}
        newsSection={<NewsSection lang={lang} />}
        dailySnippet={dailySnippet}
      />
    </>
  );
}
