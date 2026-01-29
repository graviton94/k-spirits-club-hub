import { notFound } from "next/navigation";
import { Metadata } from "next";
import SpiritDetailClient from "./spirit-detail-client";
import { db } from "@/lib/db/index";
import { reviewsDb } from "@/lib/db/firestore-rest";

export const runtime = 'edge';

const DESCRIPTION_MAX_LENGTH = 100;

// SEO suffix for spirit descriptions
const SEO_SUFFIX = "주류 리뷰, 테이스팅 노트, 가격 정보를 K-Spirits Club에서 확인하세요.";

// Regex pattern for detecting ending punctuation
const ENDING_PUNCTUATION_REGEX = /[.!?…。！？]$/;

// --- Interfaces ---

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

// --- Helper Functions ---

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
  if (!description || description.length <= maxLength) {
    return description || "";
  }
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

// Helper function to format ABV for SEO descriptions
function formatAbv(abv: number | null | undefined): string | null {
  if (typeof abv === 'number' && abv >= 0 && abv <= 100) {
    return `${abv}% ABV`;
  }
  return null;
}

// Helper function to build SEO-optimized description with suffix
function buildSeoDescription(baseDescription: string, suffix: string): string {
  if (!baseDescription) return suffix;
  const hasEndingPunctuation = ENDING_PUNCTUATION_REGEX.test(baseDescription);
  return `${baseDescription}${hasEndingPunctuation ? '' : '.'} ${suffix}`;
}

// --- Metadata Generation ---

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

  // Build comprehensive description
  const descriptionParts = [
    spirit.category,
    spirit.distillery,
    spirit.region,
    spirit.country,
    formatAbv(spirit.abv),
  ].filter(Boolean);

  const baseDescription = descriptionParts.join(' · ');
  const extendedDescription = spirit.metadata?.description 
    ? `${baseDescription} - ${truncateDescription(spirit.metadata.description, DESCRIPTION_MAX_LENGTH)}` 
    : baseDescription;

  const fullDescription = buildSeoDescription(extendedDescription, SEO_SUFFIX);

  // OpenGraph title
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

// --- Main Page Component ---

export default async function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch spirit data (Server-Side)
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    notFound();
  }

  // 2. Fetch reviews (Server-Side)
  let reviews: TransformedReview[] = [];
  try {
    const reviewsData = await reviewsDb.getAllForSpirit(id);
    if (Array.isArray(reviewsData)) {
      reviews = transformReviewData(reviewsData as DbReview[]);
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

  // 3. Generate JSON-LD (Search Console Fix)
  
  // Calculate Review Aggregates
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : null;

  // Construct JSON-LD Object
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: spirit.name,
    description: spirit.metadata?.description || `${spirit.name} - ${spirit.category} from ${spirit.distillery || 'Unknown Distillery'}`,
    image: spirit.imageUrl ? [spirit.imageUrl] : [],
    brand: {
      '@type': 'Brand',
      name: spirit.distillery || 'Unknown',
    },
    category: spirit.category,
    // Note: 'offers' is REMOVED if price is missing to prevent "lowPrice missing" error
    additionalProperty: [
      ...(formatAbv(spirit.abv) ? [{
        '@type': 'PropertyValue',
        name: 'Alcohol By Volume',
        value: formatAbv(spirit.abv),
      }] : []),
      ...(spirit.country ? [{
        '@type': 'PropertyValue',
        name: 'Country',
        value: spirit.country,
      }] : []),
      ...(spirit.region ? [{
        '@type': 'PropertyValue',
        name: 'Region',
        value: spirit.region,
      }] : []),
    ],
  };

  // Add Aggregate Rating (Fixes "aggregateRating missing")
  if (averageRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1"
    };
  }

  // Add Reviews (Fixes "review missing") - Top 5
  if (reviews.length > 0) {
    jsonLd.review = reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1"
      },
      author: {
        '@type': 'Person',
        name: r.userName || 'Member'
      },
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
      reviewBody: r.content || ''
    }));
  }

  return (
    <>
      {/* Inject Structured Data for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Render Client Component */}
      <SpiritDetailClient spirit={spirit} reviews={reviews} />
    </>
  );
}
