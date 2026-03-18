import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import SpiritDetailClient from "./spirit-detail-client";
import { reviewsDb } from "@/lib/db/firestore-rest";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { getCanonicalUrl, getHreflangAlternates } from "@/lib/utils/seo-url";
import { getSpiritRobotsMeta } from "@/lib/utils/indexable-tier";
import { getRelatedSpirits } from "@/lib/utils/related-spirits";
import { resolveSpiritPageState } from "@/lib/utils/spirit-page-resolver";
import { formatSpiritFieldValue } from "@/lib/utils/localize-field";
import { Spirit } from "@/lib/db/schema";
import { getSpiritCategory } from "@/lib/constants/spirits-guide-data";
import { scoreSpiritForWikiCategory } from "@/lib/utils/wiki-spirit-match";


const DESCRIPTION_MAX_LENGTH = 155;

// SEO suffix for spirit descriptions
const SEO_SUFFIX_KO = "K-Spirits Club";
const SEO_SUFFIX_EN = "K-Spirits Club";

// Regex pattern for detecting ending punctuation
const ENDING_PUNCTUATION_REGEX = /[.!?…。！？]$/;
const KOREAN_CHAR_REGEX = /[가-힣]/;
const HASH_SPLIT_REGEX = /[#,\n]+/;
const CAMEL_CASE_BOUNDARY_REGEX = /([a-z])([A-Z])/g;

// Category-to-wiki-slug mappings for internal linking from spirit detail pages
const CATEGORY_TO_WIKI_SLUG: Record<string, string> = {
  '소주': 'soju-guide',
  '막걸리': 'makgeolli-guide',
  '약주': 'yakju',
  '청주': 'cheongju',
  '위스키': 'single-malt',
  '버번': 'bourbon',
  '진': 'gin',
  '럼': 'rum',
  '보드카': 'vodka',
  '데킬라': 'tequila',
  '메스칼': 'mezcal',
  '사케': 'sake',
  '쇼추': 'shochu',
  '코냑': 'cognac',
  '브랜디': 'brandy',
  '와인': 'wine',
  '레드와인': 'red-wine',
  '화이트와인': 'white-wine',
  '샴페인': 'champagne',
  '맥주': 'beer',
  '리큐어': 'liqueur',
  '백주': 'baijiu',
};

const CATEGORY_TO_WIKI_LABEL_EN: Record<string, string> = {
  '소주': 'Korean Soju Guide',
  '막걸리': 'Makgeolli Guide',
  '약주': 'Yakju — Premium Rice Wine Guide',
  '청주': 'Cheongju Guide',
  '위스키': 'Single Malt Whisky Guide',
  '버번': 'Bourbon Whiskey Guide',
  '진': 'Gin Distillation & Botanicals',
  '럼': 'Rum Varieties & Origins',
  '보드카': 'Vodka Production & Styles',
  '데킬라': 'Tequila & Agave Spirits',
  '메스칼': 'Mezcal Guide',
  '사케': 'Japanese Sake Brewing Guide',
  '쇼추': 'Shochu Guide',
  '코냑': 'Cognac & Brandy Guide',
  '브랜디': 'Cognac & Brandy Guide',
  '와인': 'Wine Guide',
  '레드와인': 'Red Wine Guide',
  '화이트와인': 'White Wine Guide',
  '샴페인': 'Champagne Guide',
  '맥주': 'Beer Guide',
  '리큐어': 'Liqueur Guide',
  '백주': 'Baijiu Guide',
};

const CATEGORY_TO_WIKI_LABEL_KO: Record<string, string> = {
  '소주': '소주 가이드',
  '막걸리': '막걸리 가이드',
  '약주': '약주 가이드',
  '청주': '청주 가이드',
  '위스키': '싱글 몰트 위스키 가이드',
  '버번': '버번 위스키 가이드',
  '진': '진 가이드',
  '럼': '럼 가이드',
  '보드카': '보드카 가이드',
  '데킬라': '데킬라 가이드',
  '메스칼': '메스칼 가이드',
  '사케': '일본 사케 가이드',
  '쇼추': '쇼추 가이드',
  '코냑': '코냑 & 브랜디 가이드',
  '브랜디': '코냑 & 브랜디 가이드',
  '와인': '와인 가이드',
  '레드와인': '레드 와인 가이드',
  '화이트와인': '화이트 와인 가이드',
  '샴페인': '샴페인 가이드',
  '맥주': '맥주 가이드',
  '리큐어': '리큐어 가이드',
  '백주': '바이주 가이드',
};

function resolveSpiritWikiGuide(
  category: string,
  subcategory: string | null | undefined,
  mainCategory: string | null | undefined,
) {
  if (!category) return null;

  let slug = CATEGORY_TO_WIKI_SLUG[category];

  if (category === '청주') {
    const sakeCategory = getSpiritCategory('sake');
    const cheongjuCategory = getSpiritCategory('cheongju');
    const wikiTarget = {
      category,
      subcategory: subcategory || null,
      mainCategory: mainCategory || null,
    };

    const sakeScore = sakeCategory ? scoreSpiritForWikiCategory(wikiTarget, sakeCategory) : -1;
    const cheongjuScore = cheongjuCategory ? scoreSpiritForWikiCategory(wikiTarget, cheongjuCategory) : -1;

    slug = sakeScore > cheongjuScore ? 'sake' : 'cheongju';
  }

  if (!slug) return null;

  const wikiCategory = getSpiritCategory(slug);
  const useWikiCategoryLabel = category === '청주';

  return {
    slug,
    labelEn: useWikiCategoryLabel
      ? (wikiCategory?.nameEn || 'Cheongju Guide')
      : (CATEGORY_TO_WIKI_LABEL_EN[category] || wikiCategory?.nameEn || 'Spirit Category Guide'),
    labelKo: useWikiCategoryLabel
      ? (wikiCategory?.nameKo || '청주 가이드')
      : (CATEGORY_TO_WIKI_LABEL_KO[category] || wikiCategory?.nameKo || '주류 카테고리 가이드'),
  };
}

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

function truncateMetaDescription(text: string, maxLength: number = DESCRIPTION_MAX_LENGTH): string {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (!normalized) return '';
  if (normalized.length <= maxLength) {
    return ENDING_PUNCTUATION_REGEX.test(normalized) ? normalized : `${normalized}.`;
  }

  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  const safeCut = lastSpace >= maxLength - 30 ? shortened.slice(0, lastSpace) : shortened;

  return `${safeCut.replace(/[,:;/-]+$/, '').trim()}…`;
}

function normalizeSnippetToken(token: string): string {
  return token
    .replace(/^#+/, '')
    .replace(CAMEL_CASE_BOUNDARY_REGEX, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeTokens(tokens: string[]): string[] {
  const seen = new Set<string>();

  return tokens.filter((token) => {
    const key = token.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractTastingNoteTags(rawValue: string | null | undefined): string[] {
  if (!rawValue) return [];

  return dedupeTokens(
    rawValue
      .split(HASH_SPLIT_REGEX)
      .map(normalizeSnippetToken)
      .filter(Boolean)
  );
}

function getPreferredMetaTags(spirit: Spirit, lang: 'ko' | 'en'): string[] {
  const tastingNoteTags = extractTastingNoteTags(spirit.tasting_note || spirit.metadata?.tasting_note);
  const sensoryTags = dedupeTokens(
    [
      ...(spirit.nose_tags || spirit.metadata?.nose_tags || []),
      ...(spirit.palate_tags || spirit.metadata?.palate_tags || []),
      ...(spirit.finish_tags || spirit.metadata?.finish_tags || []),
    ]
      .map((tag) => normalizeSnippetToken(String(tag)))
      .filter(Boolean)
  );

  if (lang === 'en') {
    return (sensoryTags.length > 0 ? sensoryTags : tastingNoteTags).slice(0, 3);
  }

  const tastingHasKorean = tastingNoteTags.some((tag) => KOREAN_CHAR_REGEX.test(tag));
  if (tastingHasKorean) {
    return tastingNoteTags.slice(0, 3);
  }

  return (tastingNoteTags.length > 0 ? tastingNoteTags : sensoryTags).slice(0, 3);
}

function getBrandPrefix(brand: string, displayName: string): string {
  if (!brand) return '';

  const normalizedBrand = brand.trim().toLowerCase();
  const normalizedName = displayName.trim().toLowerCase();

  if (!normalizedBrand || normalizedName.startsWith(normalizedBrand)) {
    return '';
  }

  return `${brand} `;
}

function toAbsoluteSeoImageUrl(url: string | null | undefined, baseUrl: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
}

function getSpiritSeoImageCandidates(spirit: Spirit, baseUrl: string): string[] {
  const candidates = [
    toAbsoluteSeoImageUrl(spirit.imageUrl, baseUrl),
    toAbsoluteSeoImageUrl(spirit.thumbnailUrl, baseUrl),
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates));
}

function getSpiritSeoRobots(spirit: Spirit) {
  const baseRobots = getSpiritRobotsMeta(spirit) || { index: true, follow: true };

  return {
    ...baseRobots,
    googleBot: {
      index: baseRobots.index,
      follow: baseRobots.follow,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

function buildSpiritMetaDescription(
  spirit: Spirit,
  lang: 'ko' | 'en',
  reviewCount: number,
  fallbackName: string
): string {
  const isEn = lang === 'en';
  const typeLabel = spirit.category
    ? (isEn ? formatSpiritFieldValue('category', spirit.category, 'en') : spirit.category)
    : (isEn ? 'Spirit' : '주류');
  const countryLabel = spirit.country ? formatSpiritFieldValue('country', spirit.country, lang) : '';
  const tags = getPreferredMetaTags(spirit, lang);
  const abvLine = typeof spirit.abv === 'number'
    ? (isEn ? `ABV ${spirit.abv}%. ` : `${spirit.abv}% 도수. `)
    : '';
  const typeLine = isEn
    ? `${typeLabel}${countryLabel ? ` from ${countryLabel}` : ''}. `
    : `${countryLabel ? `${countryLabel} ` : ''}${typeLabel}. `;
  const notesLine = tags.length > 0
    ? (isEn ? `Notes: ${tags.join(', ')}. ` : `향/맛 키워드: ${tags.join(', ')}. `)
    : '';
  const reviewLine = reviewCount > 0
    ? (isEn ? `${reviewCount} review${reviewCount === 1 ? '' : 's'}. ` : `리뷰 ${reviewCount}개. `)
    : '';
  const actionLine = isEn ? 'Pairing guide and related spirits.' : '페어링과 비슷한 술까지 확인.';
  const fallback = isEn
    ? `Spirit information for ${fallbackName} on K-Spirits Club.`
    : `${fallbackName} 주류 정보. K-Spirits Club.`;

  return truncateMetaDescription(
    `${abvLine}${typeLine}${notesLine}${reviewLine}${actionLine}`.trim() || fallback
  );
}

// --- Metadata Generation ---

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;
  const isEn = lang === 'en';

  // Use the shared cached resolver — same fetch as the page component, zero double-fetching.
  // Errors are caught inside resolveSpiritPageState; metadata never throws.
  const [pageState, reviewsData] = await Promise.all([
    resolveSpiritPageState(id),
    reviewsDb.getAllForSpirit(id).catch(() => [])
  ]);

  if (pageState.status === 'NOT_FOUND') {
    return {
      title: "Spirit Not Found",
      description: "The requested spirit could not be found.",
    };
  }

  // For transient failures, return minimal metadata so the request does not throw.
  if (pageState.status === 'TRANSIENT_FAILURE') {
    return {
      title: "Spirit | K-Spirits Club",
      description: "Spirit information on K-Spirits Club.",
      robots: { index: false, follow: true },
    };
  }

  const spirit = pageState.spirit;
  const isIndexable = pageState.status === 'FOUND_INDEXABLE';
  const koName = spirit.name || '';
  const enName = spirit.metadata?.name_en || spirit.name_en || '';
  const brand = spirit.distillery || '';
  const abv = typeof spirit.abv === 'number' ? `${spirit.abv}` : '';
  const type = spirit.category || '';
  const reviewCount = Array.isArray(reviewsData) ? reviewsData.length : 0;

  // Title Building
  let title = '';
  if (isEn) {
    // EN: {Brand} {Name} {ABV}% {Type} Review & Tasting Notes | K-Spirits Club
    const displayName = enName || koName;
    const typeLabel = type ? formatSpiritFieldValue('category', type, 'en') : 'Korean Spirit';
    const brandPrefix = getBrandPrefix(brand, displayName);
    const abvStr = abv ? ` ${abv}% ` : ' ';

    let baseReviewTitle = `${brandPrefix}${displayName}${abvStr}${typeLabel} Review & Tasting Notes`;

    // Length optimization rules
    if (baseReviewTitle.length > 75) {
      baseReviewTitle = `${brandPrefix}${displayName}${abvStr}${typeLabel} Review`;
    }
    if (baseReviewTitle.length > 65 && brandPrefix) {
      baseReviewTitle = `${displayName}${abvStr}${typeLabel} Review`;
    }

    title = baseReviewTitle;
  } else {
    // KO: {브랜드} {제품명} ({원어명}) {ABV}% {주종} 시음노트·리뷰 | K-Spirits Club
    const namePart = enName ? `${koName} (${enName})` : koName;
    const brandPrefix = getBrandPrefix(brand, namePart);
    const abvStr = abv ? ` ${abv}% ` : ' ';
    const typeLabel = type ? `${type} ` : '';

    let baseReviewTitle = `${brandPrefix}${namePart}${abvStr}${typeLabel}시음노트·리뷰`;

    // KO Length optimization
    if (baseReviewTitle.length > 65 && brandPrefix) {
      baseReviewTitle = `${namePart}${abvStr}${typeLabel}시음노트·리뷰`;
    }

    title = baseReviewTitle;
  }

  // Meta Description Building
  const fullDescription = buildSpiritMetaDescription(
    spirit,
    isEn ? 'en' : 'ko',
    reviewCount,
    isEn ? (enName || koName) : koName
  );
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const seoImageCandidates = getSpiritSeoImageCandidates(spirit, baseUrl);
  const preferredImage = seoImageCandidates[0] || `${baseUrl}/default-og.jpg`;

  // 롱테일 키워드 펌핑 (동적 조합)
  const baseKeywords = [
    koName,
    enName,
    spirit.category,
    spirit.distillery,
    isEn ? 'Spirits Review' : '주류 리뷰',
  ].filter(Boolean) as string[];

  const longTailKeywords = isEn
    ? [`${enName || koName} tasting notes`, `buy ${enName || koName}`, `${enName || koName} review`, `${spirit.distillery} ${spirit.category}`]
    : [`${koName} 테이스팅 노트`, `${koName} 가격`, `${koName} 후기`, `${koName} 파는곳`, `${spirit.distillery} ${spirit.category}`];

  const keywords = [...baseKeywords, ...longTailKeywords].filter(Boolean);

  // Keep the actual product image as the primary image signal for search engines.
  let brandedOgImageUrl = `${baseUrl}/default-og.jpg`;
  if (isIndexable) {
    const searchParams = new URLSearchParams();
    searchParams.set('title', isEn ? (enName || koName) : koName);
    searchParams.set('category', spirit.category || 'Spirits');
    if (preferredImage) searchParams.set('image', preferredImage);

    const tagsData = spirit.tasting_note ? spirit.tasting_note.split(/[,\s#]+/) : (spirit.nose_tags || []);
    const validTags = tagsData.filter(Boolean).slice(0, 3);
    if (validTags.length > 0) {
      searchParams.set('tags', validTags.join(','));
    }
    brandedOgImageUrl = `${baseUrl}/api/og/spirit?${searchParams.toString()}`;
  }

  // Canonical URL (current language version, without query strings)
  const canonicalUrl = getCanonicalUrl(`/${lang}/spirits/${id}`);

  // Hreflang alternates (both ko and en versions)
  const hreflangAlternates = getHreflangAlternates(`/spirits/${id}`);

  const robotsMeta = getSpiritSeoRobots(spirit);
  const openGraphImages = [
    {
      url: preferredImage,
      alt: isEn ? `${enName || koName} product image` : `${koName} 제품 이미지`,
    },
  ];

  if (brandedOgImageUrl !== preferredImage) {
    openGraphImages.push({
      url: brandedOgImageUrl,
      alt: `${title} | K-Spirits Club`,
    });
  }

  return {
    title: title, // Handled within logic above
    description: fullDescription,
    keywords: keywords.join(', '),
    robots: robotsMeta,
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: title,
      description: fullDescription,
      images: openGraphImages,
      type: 'website',
      url: canonicalUrl, // Absolute URL for OG
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'K-Spirits Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: fullDescription,
      images: [preferredImage],
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

  // Shared resolver — deduplicates the Firestore fetch already issued by generateMetadata.
  const pageState = await resolveSpiritPageState(id);

  // Permanent absence → real 404 (or 410 if the resource was clearly removed).
  if (pageState.status === 'NOT_FOUND') {
    notFound();
  }

  // Transient backend/data failure → throw so Next.js returns 5xx, NOT a 200 loading shell.
  // This keeps Google from treating an empty/broken page as a soft-404 or indexable content.
  if (pageState.status === 'TRANSIENT_FAILURE') {
    console.error(
      `[SpiritPage] id=${id} Transient failure — throwing to trigger 5xx. error=${pageState.error}`
    );
    throw new Error(
      `Spirit data temporarily unavailable for id=${id}. Please retry.`
    );
  }

  const spirit = pageState.spirit;

  let reviews: TransformedReview[] = [];
  try {
    const reviewsData = await reviewsDb.getAllForSpirit(id);
    if (Array.isArray(reviewsData)) {
      reviews = transformReviewData(reviewsData as DbReview[]);
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

  // --- Fetch Related Spirits Server Side ---
  // Save DB and cache costs: Only fetch related items if this page is indexable (Tier A)
  // Fails open — if related spirits fetch throws, the page still renders.
  const isIndexable = pageState.status === 'FOUND_INDEXABLE';
  let relatedSpirits: any[] = [];
  if (isIndexable) {
    try {
      relatedSpirits = await getRelatedSpirits(spirit.category, spirit.subcategory || undefined, spirit.abv, id);
    } catch (error) {
      console.error(`[SpiritPage] id=${id} Failed to fetch related spirits:`, error);
    }
  }

  // --- [SEO 최적화된 JSON-LD 구조화 데이터] ---

  const realReviewCount = reviews.length;

  // Build rich description with tasting notes and pairing information.
  // Locale-aware: EN routes use English description first; KO routes use Korean first.
  const buildRichDescription = () => {
    const baseDescription = isEn
      ? (spirit.metadata?.description_en || spirit.metadata?.description_ko || `Spirit information for ${spirit.name_en || spirit.name}.`)
      : (spirit.metadata?.description_ko || spirit.metadata?.description_en || `${spirit.name} - ${spirit.category} 상세 정보`);
    const parts = [baseDescription];

    // Add tasting note if available
    const tastingTags = getPreferredMetaTags(spirit, isEn ? 'en' : 'ko');
    if (tastingTags.length > 0) {
      parts.push(
        isEn
          ? `Tasting Notes: ${tastingTags.join(', ')}`
          : `테이스팅 키워드: ${tastingTags.join(', ')}`
      );
    }

    // Add pairing guide if available
    const pairingGuide = isEn
      ? (spirit.metadata?.pairing_guide_en || spirit.metadata?.pairing_guide_ko || spirit.pairing_guide_en || spirit.pairing_guide_ko)
      : (spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en || spirit.pairing_guide_ko || spirit.pairing_guide_en);
    if (pairingGuide) {
      parts.push(`Best Pairing Tips: ${pairingGuide}`);
    }

    return parts.join('. ');
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const pageUrl = `${baseUrl}/${lang}/spirits/${id}`;
  const seoImageCandidates = getSpiritSeoImageCandidates(spirit, baseUrl);
  const preferredImage = seoImageCandidates[0] || `${baseUrl}/default-og.jpg`;

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: spirit.name || "Unknown Spirit",
    // Global SEO: English name for international search
    ...(spirit.name_en && { alternateName: spirit.name_en }),
    description: buildRichDescription(),
    // Image array format for rich snippet
    image: seoImageCandidates.length > 0 ? seoImageCandidates : [`${baseUrl}/default-og.jpg`],
    brand: {
      '@type': 'Brand',
      name: spirit.distillery || 'K-Spirits Club',
    },
    category: formatSpiritFieldValue('category', spirit.category, lang),

    // SEO Enhancement: Add URL for better indexing
    url: pageUrl,

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
      ...(typeof spirit.abv === 'number' && spirit.abv >= 0 ? [{
        '@type': 'PropertyValue',
        name: 'Alcohol By Volume',
        value: `${spirit.abv}%`,
      }] : []),
      ...(spirit.country ? [{
        '@type': 'PropertyValue',
        name: 'Country',
        value: formatSpiritFieldValue('country', spirit.country, lang),
      }] : []),
    ],
  };

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: isEn ? (spirit.name_en || spirit.name) : spirit.name,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl: preferredImage,
      url: preferredImage,
      representativeOfPage: true,
    },
  };

  // --- FAQ Schema (롱테일 질문/답변 타겟) ---
  const faqQuestions = [];

  const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;
  if (tastingNote || spirit.nose_tags?.length) {
    faqQuestions.push({
      '@type': 'Question',
      name: isEn ? `What are the tasting notes of ${spirit.name_en || spirit.name}?` : `${spirit.name}의 맛(테이스팅 노트)은 어떤가요?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: tastingNote || `Nose: ${spirit.nose_tags?.join(', ')} / Palate: ${spirit.palate_tags?.join(', ')} / Finish: ${spirit.finish_tags?.join(', ')}`
      }
    });
  }

  const pairingGuide = isEn
    ? (spirit.metadata?.pairing_guide_en || spirit.metadata?.pairing_guide_ko || spirit.pairing_guide_en || spirit.pairing_guide_ko)
    : (spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en || spirit.pairing_guide_ko || spirit.pairing_guide_en);
  if (pairingGuide) {
    faqQuestions.push({
      '@type': 'Question',
      name: isEn ? `What is a good food pairing for ${spirit.name_en || spirit.name}?` : `${spirit.name}에 잘 어울리는 안주(푸드 페어링)는 무엇인가요?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: pairingGuide
      }
    });
  }

  if (spirit.abv) {
    faqQuestions.push({
      '@type': 'Question',
      name: isEn ? `What is the ABV (alcohol content) of ${spirit.name_en || spirit.name}?` : `${spirit.name}의 도수는 몇 도인가요?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: isEn ? `The ABV of ${spirit.name_en || spirit.name} is ${spirit.abv}%.` : `${spirit.name}의 알코올 도수는 ${spirit.abv}% 입니다.`
      }
    });
  }

  const faqLd = faqQuestions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions
  } : null;
  const category = spirit.category || '';
  const wikiGuide = resolveSpiritWikiGuide(category, spirit.subcategory, spirit.mainCategory);
  const breadcrumbGuideName = category === '청주' && spirit.subcategory
    ? formatSpiritFieldValue('subcategory', spirit.subcategory, lang)
    : formatSpiritFieldValue('category', spirit.category, lang);

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
        name: isEn ? 'Explore Spirits' : '주류 탐색',
        item: `${baseUrl}/${lang}/explore`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: breadcrumbGuideName,
        item: wikiGuide
          ? `${baseUrl}/${lang}/contents/wiki/${wikiGuide.slug}`
          : `${baseUrl}/${lang}/explore?category=${encodeURIComponent(spirit.category)}`,
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
    || (isEn
      ? `${spirit.name_en || spirit.name}${spirit.name_en && spirit.name !== spirit.name_en ? ` (${spirit.name})` : ''}${spirit.category ? ` · ${formatSpiritFieldValue('category', spirit.category, 'en')}` : ''} — K-Spirits Club curated spirit.`
      : `${spirit.name}${spirit.name_en ? ` (${spirit.name_en})` : ''}${spirit.category ? ` · ${spirit.category}` : ''} - K-Spirits Club 큐레이션 주류.`);

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

  const guideBtnBase = 'flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-start px-3 py-2 sm:py-1.5 rounded-full border transition-colors font-medium';
  const guideBtnAmber  = 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/70';
  const guideBtnOrange = 'bg-orange-500/10 border-orange-500/40 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/70';
  const guideBtnSky    = 'bg-sky-500/10 border-sky-500/40 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/70';
  const guideBtnViolet = 'bg-violet-500/10 border-violet-500/40 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/70';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <SpiritDetailClient spirit={spirit} reviews={reviews} relatedSpirits={relatedSpirits} lang={lang as Locale} dict={dictionary.detail} />
      {/* SSR section: crawlable internal links to wiki and contents hub */}
      <section className="bg-background border-t border-border/40 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            {isEn ? 'Explore Related Guides' : '관련 가이드 탐색'}
          </p>
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-sm">
            {wikiGuide && (
              <li className="w-full sm:w-auto">
                <Link href={`/${lang}/contents/wiki/${wikiGuide.slug}`} className={`${guideBtnBase} ${guideBtnAmber}`}>
                  <span>📖</span>{isEn ? wikiGuide.labelEn : wikiGuide.labelKo}
                </Link>
              </li>
            )}
            <li className="w-full sm:w-auto"><Link href={`/${lang}/contents/wiki`} className={`${guideBtnBase} ${guideBtnAmber}`}><span>📚</span>{isEn ? 'Spirits Wiki — All Categories' : '주류 백과사전 전체 카테고리'}</Link></li>
            <li className="w-full sm:w-auto"><Link href={`/${lang}/contents/reviews`} className={`${guideBtnBase} ${guideBtnOrange}`}><span>🥃</span>{isEn ? 'Spirit Tasting Reviews' : '주류 시음 리뷰 보드'}</Link></li>
            <li className="w-full sm:w-auto"><Link href={`/${lang}/contents`} className={`${guideBtnBase} ${guideBtnSky}`}><span>🌐</span>{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
            <li className="w-full sm:w-auto"><Link href={`/${lang}/explore`} className={`${guideBtnBase} ${guideBtnViolet}`}><span>🔍</span>{isEn ? 'Explore All Spirits' : '주류 전체 탐색'}</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
