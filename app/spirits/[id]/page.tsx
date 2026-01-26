import { notFound } from "next/navigation";
import { Metadata } from "next";
import SpiritDetailClient from "./spirit-detail-client";
import { db } from "@/lib/db/index";
import { reviewsDb } from "@/lib/db/firestore-rest";
import type { Spirit } from "@/lib/db/schema";

export const runtime = 'edge';

const DESCRIPTION_MAX_LENGTH = 100;

// Utility function to transform review data from DB format to client format
function transformReviewData(reviewsData: any[]): any[] {
  return reviewsData.map(r => ({
    id: `${r.spiritId}_${r.userId}`,
    ...r,
    noseRating: r.ratingN,
    palateRating: r.ratingP,
    finishRating: r.ratingF,
    content: r.notes,
    nose: r.tagsN,
    palate: r.tagsP,
    finish: r.tagsF
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    return {
      title: "Spirit Not Found | K-Spirits Club",
      description: "The requested spirit could not be found.",
    };
  }

  const koName = spirit.name;
  const enName = spirit.metadata?.name_en;
  const title = enName ? `${koName} (${enName}) | K-Spirits Club` : `${koName} | K-Spirits Club`;
  
  const description = [
    spirit.distillery,
    spirit.region,
    spirit.country,
    `${spirit.abv}% ABV`,
    spirit.category,
  ]
    .filter(Boolean)
    .join(' · ') + (spirit.metadata?.description ? ` - ${spirit.metadata.description.substring(0, DESCRIPTION_MAX_LENGTH)}` : '');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: spirit.imageUrl ? [spirit.imageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: spirit.imageUrl ? [spirit.imageUrl] : [],
    },
  };
}

// Note: generateStaticParams is not compatible with edge runtime
// Edge runtime is required for Cloudflare Pages deployment

export default async function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch spirit data server-side
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    notFound();
  }

  // Fetch reviews server-side
  let reviews: any[] = [];
  try {
    const reviewsData = await reviewsDb.getAllForSpirit(id);
    reviews = transformReviewData(reviewsData);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: spirit.name,
    description: spirit.metadata?.description || `${spirit.name} from ${spirit.distillery || 'Unknown Distillery'}`,
    image: spirit.imageUrl,
    brand: {
      '@type': 'Brand',
      name: spirit.distillery || 'Unknown',
    },
    category: spirit.category,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KRW',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Alcohol By Volume',
        value: `${spirit.abv}%`,
      },
      spirit.country && {
        '@type': 'PropertyValue',
        name: 'Country',
        value: spirit.country,
      },
      spirit.region && {
        '@type': 'PropertyValue',
        name: 'Region',
        value: spirit.region,
      },
    ].filter(Boolean),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Client Component with Initial Data */}
      <SpiritDetailClient spirit={spirit} reviews={reviews} />
    </>
  );
}
