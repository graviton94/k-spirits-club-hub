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
import { localizeCategory, localizeCountry } from "@/lib/utils/localize-field";

export const runtime = 'edge';

const DESCRIPTION_MAX_LENGTH = 140;

// SEO suffix for spirit descriptions
const SEO_SUFFIX_KO = "K-Spirits Club";
const SEO_SUFFIX_EN = "K-Spirits Club";

// Regex pattern for detecting ending punctuation
const ENDING_PUNCTUATION_REGEX = /[.!?…。！？]$/;

// Category-to-wiki-slug mappings for internal linking from spirit detail pages
const CATEGORY_TO_WIKI_SLUG: Record<string, string> = {
  '소주': 'soju-guide',
  '막걸리': 'makgeolli-guide',
  '약주': 'yakju',
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
    const typeLabel = type ? localizeCategory(type, 'en') : 'Korean Spirit';
    const brandPrefix = brand ? `${brand} ` : '';
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
    const brandPrefix = brand ? `${brand} ` : '';
    const namePart = enName ? `${koName} (${enName})` : koName;
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
  let fullDescription = '';

  if (!isIndexable) {
    // Tier B: Minimize DB calls and logic, simple fallback description.
    fullDescription = isEn
      ? `Korean Spirit ${enName || koName} information on K-Spirits Club.`
      : `${brand} ${koName} 주류 정보. K-Spirits Club.`;
  } else {
    // Tier A: Build the robust CTR-optimized snippet
    const tagsData = spirit.tasting_note ? spirit.tasting_note.split(/[,\s#]+/) : (spirit.nose_tags || []);
    const validTags = tagsData.filter(t => t && t.trim().length > 0).slice(0, 3);
    const tagsString = validTags.join(', ');

    if (isEn) {
      const typeStr = type ? localizeCategory(type, 'en') : 'spirit';
      const abvStr = abv ? `ABV ${abv}%. ` : '';
      const notesStr = validTags.length > 0 ? `Notes: ${tagsString}. ` : '';
      const reviewStr = reviewCount > 0 ? `(${reviewCount} reviews). ` : '';
      fullDescription = `${abvStr}${typeStr} from Korea. ${notesStr}Pairing tips + similar spirits. ${reviewStr}`;
    } else {
      const abvStr = abv ? `${abv}% ` : '';
      const typeStr = type ? `${type}. ` : '';
      const notesStr = validTags.length > 0 ? `향/맛 키워드: ${tagsString}. ` : '';
      const reviewStr = reviewCount > 0 ? `(리뷰 ${reviewCount}개) ` : '';
      fullDescription = `${abvStr}${typeStr}${notesStr}페어링·유사한 술 추천까지. ${reviewStr}`;
    }
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';

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

  // Build Dynamic OG Image URL ONLY if indexable
  let ogImageUrl = `${baseUrl}/default-og.jpg`; // Fallback asset
  if (isIndexable) {
    const searchParams = new URLSearchParams();
    searchParams.set('title', isEn ? (enName || koName) : koName);
    searchParams.set('category', spirit.category || 'Spirits');
    if (spirit.imageUrl) searchParams.set('image', spirit.imageUrl);

    const tagsData = spirit.tasting_note ? spirit.tasting_note.split(/[,\s#]+/) : (spirit.nose_tags || []);
    const validTags = tagsData.filter(Boolean).slice(0, 3);
    if (validTags.length > 0) {
      searchParams.set('tags', validTags.join(','));
    }
    ogImageUrl = `${baseUrl}/api/og/spirit?${searchParams.toString()}`;
  }

  // Canonical URL (current language version, without query strings)
  const canonicalUrl = getCanonicalUrl(`/${lang}/spirits/${id}`);

  // Hreflang alternates (both ko and en versions)
  const hreflangAlternates = getHreflangAlternates(`/spirits/${id}`);

  // SEO Phase 2: Apply Tier-based robots meta
  const robotsMeta = getSpiritRobotsMeta(spirit);

  return {
    title: title, // Handled within logic above
    description: fullDescription,
    keywords: keywords.join(', '),
    // Apply robots meta for Tier B spirits (noindex, follow)
    ...(robotsMeta && { robots: robotsMeta }),
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates,
    },
    openGraph: {
      title: title,
      description: fullDescription,
      images: [ogImageUrl],
      type: 'website',
      url: canonicalUrl, // Absolute URL for OG
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'K-Spirits Club',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
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

  // priceValidUntil: 현재 날짜 기준 1년 후 (rolling window)
  const priceValidUntilDate = new Date();
  priceValidUntilDate.setFullYear(priceValidUntilDate.getFullYear() + 1);
  const priceValidUntil = priceValidUntilDate.toISOString().split('T')[0];

  // Build rich description with tasting notes and pairing information.
  // Locale-aware: EN routes use English description first; KO routes use Korean first.
  const buildRichDescription = () => {
    const baseDescription = isEn
      ? (spirit.metadata?.description_en || spirit.metadata?.description_ko || `${spirit.name_en || spirit.name} - Korean Spirit`)
      : (spirit.metadata?.description_ko || spirit.metadata?.description_en || `${spirit.name} - ${spirit.category} 상세 정보`);
    const parts = [baseDescription];

    // Add tasting note if available
    const tastingNote = spirit.tasting_note || spirit.metadata?.tasting_note;
    if (tastingNote) {
      parts.push(`Tasting Notes: ${tastingNote}`);
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
    category: localizeCategory(spirit.category, lang),

    // SEO Enhancement: Add URL for better indexing
    url: pageUrl,

    // GSC 필수 보완: 직접 판매처가 아니므로 AggregateOffer(제휴 링크/검색 연동) 형식 차용
    // 0원으로 high/low를 설정하여 '가격 누락' 노란색 경고를 방지하면서 허위 재고 논란(OutOfStock) 우회
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KRW',
      lowPrice: '0',
      highPrice: '0',
      offerCount: 3,
      offers: [
        {
          '@type': 'Offer',
          url: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(spirit.name)}`,
          seller: {
            '@type': 'Organization',
            name: 'Naver Shopping'
          }
        },
        {
          '@type': 'Offer',
          url: `https://dailyshot.co/search/result?keyword=${encodeURIComponent(spirit.name)}`,
          seller: {
            '@type': 'Organization',
            name: 'Dailyshot'
          }
        },
        {
          '@type': 'Offer',
          url: `https://www.wine-searcher.com/find/${encodeURIComponent(spirit.name_en || spirit.name)}`,
          seller: {
            '@type': 'Organization',
            name: 'Wine-Searcher'
          }
        }
      ]
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
      ...(typeof spirit.abv === 'number' && spirit.abv >= 0 ? [{
        '@type': 'PropertyValue',
        name: 'Alcohol By Volume',
        value: `${spirit.abv}%`,
      }] : []),
      ...(spirit.country ? [{
        '@type': 'PropertyValue',
        name: 'Country',
        value: localizeCountry(spirit.country, lang),
      }] : []),
    ],
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

  const pairingGuide = spirit.metadata?.pairing_guide_ko || spirit.metadata?.pairing_guide_en || spirit.pairing_guide_ko || spirit.pairing_guide_en;
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
        name: localizeCategory(spirit.category, lang),
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
    || (isEn
      ? `${spirit.name_en || spirit.name}${spirit.name_en && spirit.name !== spirit.name_en ? ` (${spirit.name})` : ''}${spirit.category ? ` · ${localizeCategory(spirit.category, 'en')}` : ''} — K-Spirits Club curated spirit.`
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

  const category = spirit.category || '';
  const wikiSlug = CATEGORY_TO_WIKI_SLUG[category];
  const wikiLabelEn = CATEGORY_TO_WIKI_LABEL_EN[category];
  const wikiLabelKo = CATEGORY_TO_WIKI_LABEL_KO[category];

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
          <ul className="flex flex-wrap gap-2 text-sm">
            {wikiSlug && (
              <li>
                <Link href={`/${lang}/contents/wiki/${wikiSlug}`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">
                  {isEn ? (wikiLabelEn || 'Spirit Category Guide') : (wikiLabelKo || '주류 카테고리 가이드')}
                </Link>
              </li>
            )}
            <li><Link href={`/${lang}/contents/wiki`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Spirits Wiki — All Categories' : '주류 백과사전 전체 카테고리'}</Link></li>
            <li><Link href={`/${lang}/contents/reviews`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Spirit Tasting Reviews' : '주류 시음 리뷰 보드'}</Link></li>
            <li><Link href={`/${lang}/contents`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Contents Hub' : '콘텐츠 허브'}</Link></li>
            <li><Link href={`/${lang}/explore`} className="px-3 py-1.5 rounded-full border border-border hover:border-amber-500/60 hover:text-amber-500 transition-colors">{isEn ? 'Explore All Spirits' : '주류 전체 탐색'}</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
