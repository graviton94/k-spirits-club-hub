export const revalidate = 60;

import { dbListNewArrivals, dbListSpiritReviews } from "@/lib/db/data-connect-client";
import { dbAdminListRawSpirits, dbAdminSearchSpiritsPublic } from "@/lib/db/data-connect-admin";
import HomeClient from "@/components/home/HomeClient";
import NewsSection from "@/components/home/NewsSection";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { getRandomWikiSnippet } from "@/lib/utils/wiki-snippet";
import Script from "next/script";
import type { SpiritSearchIndex } from "@/lib/db/schema";

function toBootstrapIndexItem(spirit: any): SpiritSearchIndex {
  return {
    i: spirit.id,
    n: spirit.name || '이름 없음',
    en: spirit.nameEn || null,
    c: spirit.category || '기타',
    ce: spirit.categoryEn || null,
    sc: spirit.subcategory || null,
    t: spirit.thumbnailUrl || spirit.imageUrl || null,
    a: spirit.abv || 0,
    d: spirit.distillery || null,
    tn: spirit.tastingNote || null,
  };
}

function pickDailyDiscovery(items: SpiritSearchIndex[]) {
  if (!items.length) return null;

  const kstKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const seed = Number(kstKey.replaceAll('-', '')) || 0;

  return items[seed % items.length];
}

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const [rawNewArrivals, rawReviews, rawBootstrapSpirits] = await Promise.all([
    dbAdminListRawSpirits({ limit: 10, offset: 0, isPublished: true })
      .catch(() => dbListNewArrivals(10).catch(() => [])),
    dbListSpiritReviews(5, 0).catch(() => []),
    dbAdminSearchSpiritsPublic({ limit: 120 }).catch(() => []),
  ]);

  const newArrivals = rawNewArrivals.slice(0, 10).map((s: any) => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    imageUrl: s.imageUrl,
    thumbnailUrl: s.thumbnailUrl,
    name_en: s.nameEn,
  }));

  const recentReviews = rawReviews.map((r: any) => ({
    ...r,
    spiritName: r.spirit?.name,
    userName: r.user?.nickname || (lang === 'en' ? 'Anonymous' : '익명'),
  }));

  const bootstrapSearchIndex = rawBootstrapSpirits.map(toBootstrapIndexItem);
  const initialDiscovery = pickDailyDiscovery(bootstrapSearchIndex);

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
        initialSearchIndex={bootstrapSearchIndex}
        initialDiscovery={initialDiscovery}
        dailySnippet={dailySnippet}
      >
        <NewsSection lang={lang} />
      </HomeClient>
    </>
  );
}
