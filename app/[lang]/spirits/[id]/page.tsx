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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';

  // Build Dynamic OG Image URL
  const searchParams = new URLSearchParams();
  searchParams.set('title', isEn ? (spirit.name_en || spirit.name) : spirit.name);
  searchParams.set('category', spirit.category || 'Spirits');
  if (spirit.imageUrl) searchParams.set('image', spirit.imageUrl);

  const tagsData = spirit.tasting_note ? spirit.tasting_note.split(/[,\s]+/) : (spirit.nose_tags || []);
  const validTags = tagsData.filter(Boolean).slice(0, 3);
  if (validTags.length > 0) {
    searchParams.set('tags', validTags.join(','));
  }

  const ogImageUrl = `${baseUrl}/api/og/spirit?${searchParams.toString()}`;

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
      images: [ogImageUrl],
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'K-Spirits Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | K-Spirits Club`,
      description: fullDescription,
      images: [ogImageUrl],
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
  const isEn = lang === 'en';
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

  // priceValidUntil: 현재 날짜 기준 1년 후 (rolling window)
  const priceValidUntilDate = new Date();
  priceValidUntilDate.setFullYear(priceValidUntilDate.getFullYear() + 1);
  const priceValidUntil = priceValidUntilDate.toISOString().split('T')[0];

  // Build rich description with tasting notes and pairing information
  const buildRichDescription = () => {
    const baseDescription = spirit.metadata?.description_ko || spirit.metadata?.description_en || `${spirit.name} - ${spirit.category} 상세 정보`;
    const parts = [baseDescription];

    // Add tasting note if available
    const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;
    if (tastingNote) {
      parts.push(`Tasting Notes: ${tastingNote}`);
    }

    // Add pairing guide if available
    const pairingGuide = spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en || spirit.pairing_guide_ko || spirit.pairing_guide_en;
    if (pairingGuide) {
      parts.push(`Best Pairing Tips: ${pairingGuide}`);
    }

    return parts.join('. ');
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://k-spirits.club';
  const pageUrl = `${baseUrl}/${lang}/spirits/${id}`;

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

    // SEO Enhancement: Add URL for better indexing
    url: pageUrl,

    // GSC 필수 필드: offers (정보 페이지임을 명시, 허위 판매가 아님)
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
      // priceValidUntil: GSC 필수 항목 - 1년 rolling window
      priceValidUntil: priceValidUntil,
      availability: 'https://schema.org/OutOfStock',
      url: pageUrl,
      description: 'This is an informational page providing tasting notes and community reviews. Products are not sold here.',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'KR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnDays: 0,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'KR',
        },
        doesNotShip: true,
      },
    },

    // GSC 필수: aggregateRating은 실제 리뷰 있을 때만 포함
    ...(realReviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (reviews.reduce((acc, r) => acc + r.rating, 0) / realReviewCount).toFixed(1),
        reviewCount: realReviewCount,
        ratingCount: realReviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),

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
    ],
  };
  // --- Breadcrumb Schema ---
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : '홈',
        item: `${baseUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Spirits' : '주류 검색',
        item: `${baseUrl}/${lang}/spirits`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: spirit.category,
        item: `${baseUrl}/${lang}/spirits?category=${encodeURIComponent(spirit.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: spirit.name,
        item: pageUrl,
      },
    ],
  };

  // --- 편집부 리뷰 (Editorial Review by K-Spirits Club) ---
  // Google 정책: 사이트 운영자의 편집 리뷰는 Organization author로 허용
  // Rating 없음 → aggregateRating 수치에 영향 없음
  // 한국어 + 영어 이중 구성으로 국문/영문 검색 SEO 동시 확보
  const buildEditorialReviewBody = () => {
    const parts: string[] = [];

    // Korean description
    const descKo = spirit.metadata?.description_ko;
    if (descKo) parts.push(descKo);

    // English description
    const descEn = spirit.metadata?.description_en;
    if (descEn) parts.push(descEn);

    // Tasting tags (nose / palate / finish)
    const noseTags = spirit.nose_tags?.join(', ') || spirit.metadata?.nose_tags?.join(', ');
    const palateTags = spirit.palate_tags?.join(', ') || spirit.metadata?.palate_tags?.join(', ');
    const finishTags = spirit.finish_tags?.join(', ') || spirit.metadata?.finish_tags?.join(', ');
    const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;

    if (noseTags || palateTags || finishTags) {
      const tagParts = [
        noseTags && `Nose: ${noseTags}`,
        palateTags && `Palate: ${palateTags}`,
        finishTags && `Finish: ${finishTags}`,
      ].filter(Boolean);
      parts.push(`Tasting Profile — ${tagParts.join(' / ')}`);
    } else if (tastingNote) {
      parts.push(`Tasting Notes: ${tastingNote}`);
    }

    // Pairing guide
    const pairingKo = spirit.metadata?.pairing_guide_ko || spirit.pairing_guide_ko;
    const pairingEn = spirit.metadata?.pairing_guide_en || spirit.pairing_guide_en;
    if (pairingKo || pairingEn) {
      parts.push([pairingKo, pairingEn].filter(Boolean).join(' / '));
    }

    return parts.join(' | ');
  };

  // description/note 없는 제품도 fallback으로 편집부 리뷰 본문 생성
  // → review 필드 누락 GSC 오류 방지 (reviewRating 없음: aggregateRating 오염 방지)
  const editorialReviewBody = buildEditorialReviewBody()
    || `${spirit.name}${spirit.name_en ? ` (${spirit.name_en})` : ''}${spirit.category ? ` · ${spirit.category}` : ''} - K-Spirits Club 큐레이션 주류.`;

  // 편집부 리뷰: 항상 포함 (reviewRating 없음: 점수를 매기지 않음)
  const editorialReview = {
    '@type': 'Review',
    author: {
      '@type': 'Organization',
      name: 'K-Spirits Club',
      url: 'https://kspiritsclub.com',
    },
    datePublished: spirit.createdAt
      ? new Date(spirit.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    reviewBody: editorialReviewBody,
  };

  // review 배열: 편집부 리뷰 + 실 유저 리뷰 병합
  const userReviews = reviews.slice(0, 5).map((r) => {
    const tags = [r.nose, r.palate, r.finish].filter(Boolean).join(', ');
    const reviewText = r.content ? r.content : '';
    const reviewBody = tags ? `${reviewText} (Tasting Tags: ${tags})` : (reviewText || 'Community review.');

    return {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@type': 'Person',
        name: r.userName || 'Member',
      },
      datePublished: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      reviewBody: reviewBody,
    };
  });

  // 편집부 리뷰는 항상 포함되므로 allReviews는 최소 1개 보장
  const allReviews = [
    editorialReview,
    ...userReviews,
  ];

  jsonLd.review = allReviews;

  const dictionary = await getDictionary(lang as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <SpiritDetailClient spirit={spirit} reviews={reviews} lang={lang as Locale} dict={dictionary.detail} />
    </>
  );
}
