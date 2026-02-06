import { notFound } from "next/navigation";
import { Metadata } from "next";
import SpiritDetailClient from "./spirit-detail-client";
import { db } from "@/lib/db/index";
import { reviewsDb } from "@/lib/db/firestore-rest";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";

export const runtime = 'edge';

const DESCRIPTION_MAX_LENGTH = 100;

// SEO suffix for spirit descriptions
const SEO_SUFFIX = "주류 리뷰, 테이스팅 노트 정보를 K-Spirits Club에서 확인하세요.";

// Regex pattern for detecting ending punctuation
const ENDING_PUNCTUATION_REGEX = /[.!?…。！？]$/;

// --- Interfaces ---

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

function truncateDescription(description: string, maxLength: number): string {
  if (!description || description.length <= maxLength) {
    return description || "";
  }
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

function formatAbv(abv: number | null | undefined): string | null {
  if (typeof abv === 'number' && abv >= 0 && abv <= 100) {
    return `${abv}% ABV`;
  }
  return null;
}

function buildSeoDescription(baseDescription: string, suffix: string): string {
  if (!baseDescription) return suffix;
  const hasEndingPunctuation = ENDING_PUNCTUATION_REGEX.test(baseDescription);
  return `${baseDescription}${hasEndingPunctuation ? '' : '.'} ${suffix}`;
}

// --- Metadata Generation ---

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    return {
      title: "Spirit Not Found",
      description: "The requested spirit could not be found.",
    };
  }

  const koName = spirit.name;
  const enName = spirit.metadata?.name_en || spirit.name_en;

  // Title based on language
  let title = '';
  if (lang === 'en') {
    title = enName ? `${enName} Info & Reviews` : `${koName} Info & Reviews`;
  } else {
    title = enName ? `${koName} (${enName}) 정보 및 리뷰` : `${koName} 정보 및 리뷰`;
  }

  const descriptionParts = [
    spirit.category,
    spirit.distillery,
    spirit.country,
    formatAbv(spirit.abv),
  ].filter(Boolean);

  const baseDescription = descriptionParts.join(' · ');

  // Localized summary (Strict Schema)
  const isEn = lang === 'en';
  const spiritDesc = isEn ? spirit.metadata?.description_en : spirit.metadata?.description_ko;
  const extendedDescription = spiritDesc
    ? `${baseDescription} - ${truncateDescription(spiritDesc, DESCRIPTION_MAX_LENGTH)}`
    : baseDescription;

  const seoSuffix = lang === 'en'
    ? "Check out liquor reviews and tasting notes on K-Spirits Club."
    : SEO_SUFFIX;

  const fullDescription = buildSeoDescription(extendedDescription, seoSuffix);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://k-spirits.club';

  return {
    title,
    description: fullDescription,
    alternates: {
      languages: {
        'ko-KR': `${baseUrl}/ko/spirits/${id}`,
        'en-US': `${baseUrl}/en/spirits/${id}`,
      },
    },
    openGraph: {
      title: `${title} | K-Spirits Club`,
      description: fullDescription,
      images: spirit.imageUrl ? [spirit.imageUrl] : [],
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'K-Spirits Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | K-Spirits Club`,
      description: fullDescription,
      images: spirit.imageUrl ? [spirit.imageUrl] : [],
    },
  };
}

// --- Main Page Component ---

export default async function SpiritDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const spirit = await db.getSpirit(id);

  if (!spirit) {
    notFound();
  }

  let reviews: TransformedReview[] = [];
  try {
    const reviewsData = await reviewsDb.getAllForSpirit(id);
    if (Array.isArray(reviewsData)) {
      reviews = transformReviewData(reviewsData as DbReview[]);
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

  // --- [SEO 최적화된 JSON-LD 구조화 데이터] ---

  const realReviewCount = reviews.length;

  // Build rich description with tasting notes and pairing information
  const buildRichDescription = () => {
    const baseDescription = spirit.metadata?.description_ko || spirit.metadata?.description_en || `${spirit.name} - ${spirit.category} 상세 정보`;
    const parts = [baseDescription];

    // Add tasting note if available
    const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;
    if (tastingNote) {
      parts.push(`[Tasting Note]: ${tastingNote}`);
    }

    // Add pairing guide if available
    const pairingGuide = spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en || spirit.pairing_guide_ko || spirit.pairing_guide_en;
    if (pairingGuide) {
      parts.push(`[Best Pairing]: ${pairingGuide}`);
    }

    return parts.join('. ');
  };

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: spirit.name || "Unknown Spirit",
    // Global SEO: English name for international search
    ...(spirit.name_en && { alternateName: spirit.name_en }),
    description: buildRichDescription(),
    // Image array format for rich snippet
    image: spirit.imageUrl ? [spirit.imageUrl] : ["https://kspiritsclub.com/logo.png"],
    brand: {
      '@type': 'Brand',
      name: spirit.distillery || 'K-Spirits Club',
    },
    category: spirit.category,

    // Required offer schema to help Google recognize this as a product page
    offers: {
      '@type': 'Offer',
      price: "0",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock"
    },

    additionalProperty: [
      ...(formatAbv(spirit.abv) ? [{
        '@type': 'PropertyValue' as const,
        name: 'Alcohol By Volume',
        value: formatAbv(spirit.abv),
      }] : []),
      ...(spirit.country ? [{
        '@type': 'PropertyValue' as const,
        name: 'Country',
        value: spirit.country,
      }] : []),
    ],
  };

  // Only add aggregateRating if real reviews exist (NO FAKE DATA)
  if (realReviewCount > 0) {
    const ratingValue = (reviews.reduce((acc, r) => acc + r.rating, 0) / realReviewCount).toFixed(1);
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue,
      reviewCount: realReviewCount,
      bestRating: "5",
      worstRating: "1"
    };

    // Add actual reviews
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
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      reviewBody: r.content || 'Great spirit.'
    }));
  }

  const dictionary = await getDictionary(lang as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpiritDetailClient spirit={spirit} reviews={reviews} lang={lang as Locale} dict={dictionary.detail} />
    </>
  );
}
