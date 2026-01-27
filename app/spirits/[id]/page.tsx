import { notFound } from "next/navigation";
import { Metadata } from "next";
import SpiritDetailClient from "./spirit-detail-client";
import { db } from "@/lib/db/index";
import { reviewsDb } from "@/lib/db/firestore-rest";
import type { Spirit } from "@/lib/db/schema";

export const runtime = 'edge';

const DESCRIPTION_MAX_LENGTH = 100;

// SEO suffix for spirit descriptions
const SEO_SUFFIX = "주류 리뷰, 테이스팅 노트, 가격 정보를 K-Spirits Club에서 확인하세요.";

// Review interface matching the client format
interface TransformedReview {
  id: string;
  spiritId: string;
  userId: string;
  userName: string;
  rating: number;
  noseRating: number;
  palateRating: number;
  finishRating: number;
  content: string;
  nose: string;
  palate: string;
  finish: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

// Database review format interface
interface DbReview {
  spiritId: string;
  userId: string;
  userName: string;
  rating: number;
  ratingN: number;
  ratingP: number;
  ratingF: number;
  notes: string;
  tagsN: string;
  tagsP: string;
  tagsF: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

// Utility function to transform review data from DB format to client format
function transformReviewData(reviewsData: DbReview[]): TransformedReview[] {
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

// Helper function to truncate description with ellipsis
function truncateDescription(description: string, maxLength: number): string {
  if (description.length <= maxLength) {
    return description;
  }
  // Find the last space before maxLength to avoid cutting mid-word
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
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
      title: "Spirit Not Found",
      description: "The requested spirit could not be found.",
    };
  }

  const koName = spirit.name;
  const enName = spirit.metadata?.name_en;
  
  // Enhanced title format with Korean and English names
  const title = enName 
    ? `${koName} (${enName}) 정보 및 리뷰` 
    : `${koName} 정보 및 리뷰`;
  
  // Build comprehensive description with category, ABV, origin
  const descriptionParts = [
    spirit.category,
    spirit.distillery,
    spirit.region,
    spirit.country,
    spirit.abv ? `${spirit.abv}% ABV` : null,
  ].filter(Boolean);
  
  const baseDescription = descriptionParts.join(' · ');
  const extendedDescription = spirit.metadata?.description 
    ? `${baseDescription} - ${truncateDescription(spirit.metadata.description, DESCRIPTION_MAX_LENGTH)}` 
    : baseDescription;
  
  const fullDescription = `${extendedDescription}. ${SEO_SUFFIX}`;

  // OpenGraph title for social sharing
  const ogTitle = enName 
    ? `${koName} (${enName}) 정보 및 리뷰 | K-Spirits Club` 
    : `${koName} 정보 및 리뷰 | K-Spirits Club`;

  return {
    title,
    description: fullDescription,
    openGraph: {
      title: ogTitle,
      description: fullDescription,
      images: spirit.imageUrl ? [spirit.imageUrl] : [],
      type: 'website',
      locale: 'ko_KR',
      siteName: 'K-Spirits Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: fullDescription,
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
  let reviews: TransformedReview[] = [];
  try {
    const reviewsData = await reviewsDb.getAllForSpirit(id);
    // Runtime validation: ensure reviewsData has the expected structure
    if (Array.isArray(reviewsData)) {
      reviews = transformReviewData(reviewsData as DbReview[]);
    }
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
      ...(spirit.country ? [{
        '@type': 'PropertyValue' as const,
        name: 'Country',
        value: spirit.country,
      }] : []),
      ...(spirit.region ? [{
        '@type': 'PropertyValue' as const,
        name: 'Region',
        value: spirit.region,
      }] : []),
    ],
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
