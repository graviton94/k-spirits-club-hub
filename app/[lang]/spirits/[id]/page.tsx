import { notFound } from "next/navigation";
import { Metadata } from "next";
import SpiritDetailClient from "./spirit-detail-client";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/i18n-config";
import { getCanonicalUrl, getHreflangAlternates } from '@/lib/utils/seo-url'
import { getSpiritRobotsMeta } from '@/lib/utils/indexable-tier'
import RelatedWikiSection from '@/components/spirits/RelatedWikiSection'
import { getRelatedSpirits } from "@/lib/utils/related-spirits";
import { resolveSpiritPageState } from "@/lib/utils/spirit-page-resolver";
import { resolveWikiCategory } from "@/lib/utils/wiki-resolver";
import { formatSpiritFieldValue } from "@/lib/utils/localize-field";
import { Spirit } from "@/lib/db/schema";
import { scoreSpiritForWikiCategory } from "@/lib/utils/wiki-spirit-match";
import { getOptimizedImageUrl } from "@/lib/utils/image-optimization";

const DESCRIPTION_MAX_LENGTH = 155;

// SEO regex patterns
const ENDING_PUNCTUATION_REGEX = /[.!?…。！？]$/;
const KOREAN_CHAR_REGEX = /[가-힣]/;
const HASH_SPLIT_REGEX = /[#,\n]+/;
const CAMEL_CASE_BOUNDARY_REGEX = /([a-z])([A-Z])/g;

// Category-to-wiki-slug mappings
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

// ... labels records ... (Keep them as they were)
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

async function resolveSpiritWikiGuide(
  category: string,
  subcategory: string | null | undefined,
  mainCategory: string | null | undefined,
) {
  if (!category) return null;
  let slug = CATEGORY_TO_WIKI_SLUG[category];
  if (category === '청주') {
    const sakeCategory = await resolveWikiCategory('sake');
    const cheongjuCategory = await resolveWikiCategory('cheongju');
    const wikiTarget = { category, subcategory: subcategory || null, mainCategory: mainCategory || null };
    const sakeScore = sakeCategory ? scoreSpiritForWikiCategory(wikiTarget, sakeCategory) : -1;
    const cheongjuScore = cheongjuCategory ? scoreSpiritForWikiCategory(wikiTarget, cheongjuCategory) : -1;
    slug = sakeScore > cheongjuScore ? 'sake' : 'cheongju';
  }
  if (!slug) return null;
  const wikiCategory = await resolveWikiCategory(slug);
  const useWikiCategoryLabel = category === '청주';
  return {
    slug,
    labelEn: useWikiCategoryLabel ? (wikiCategory?.nameEn || 'Cheongju Guide') : (CATEGORY_TO_WIKI_LABEL_EN[category] || wikiCategory?.nameEn || 'Spirit Category Guide'),
    labelKo: useWikiCategoryLabel ? (wikiCategory?.nameKo || '청주 가이드') : (CATEGORY_TO_WIKI_LABEL_KO[category] || wikiCategory?.nameKo || '주류 카테고리 가이드'),
  };
}

// --- Helper Functions ---
function truncateMetaDescription(text: string, maxLength: number = DESCRIPTION_MAX_LENGTH): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= maxLength) return ENDING_PUNCTUATION_REGEX.test(normalized) ? normalized : `${normalized}.`;
  const shortened = normalized.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  const safeCut = lastSpace >= maxLength - 30 ? shortened.slice(0, lastSpace) : shortened;
  return `${safeCut.replace(/[,:;/-]+$/, '').trim()}…`;
}

function normalizeSnippetToken(token: string): string {
  return token.replace(/^#+/, '').replace(CAMEL_CASE_BOUNDARY_REGEX, '$1 $2').replace(/\s+/g, ' ').trim();
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
  return dedupeTokens(rawValue.split(HASH_SPLIT_REGEX).map(normalizeSnippetToken).filter(Boolean));
}

function getPreferredMetaTags(spirit: Spirit, lang: 'ko' | 'en'): string[] {
  const tastingNoteTags = extractTastingNoteTags(spirit.tastingNote || spirit.tasting_note);
  const sensoryTags = dedupeTokens(
    [...(spirit.noseTags || spirit.nose_tags || []), ...(spirit.palateTags || spirit.palate_tags || []), ...(spirit.finishTags || spirit.finish_tags || [])]
      .map((tag) => normalizeSnippetToken(String(tag))).filter(Boolean)
  );
  if (lang === 'en') return (sensoryTags.length > 0 ? sensoryTags : tastingNoteTags).slice(0, 3);
  const tastingHasKorean = tastingNoteTags.some((tag) => KOREAN_CHAR_REGEX.test(tag));
  if (tastingHasKorean) return tastingNoteTags.slice(0, 3);
  return (tastingNoteTags.length > 0 ? tastingNoteTags : sensoryTags).slice(0, 3);
}

function getBrandPrefix(brand: string, displayName: string): string {
  if (!brand) return '';
  const normalizedBrand = brand.trim().toLowerCase();
  const normalizedName = displayName.trim().toLowerCase();
  if (!normalizedBrand || normalizedName.startsWith(normalizedBrand)) return '';
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
  const primaryUrl = spirit.imageUrl || spirit.thumbnailUrl;
  if (!primaryUrl) return [];
  const candidates = [
    toAbsoluteSeoImageUrl(primaryUrl, baseUrl),
    getOptimizedImageUrl(primaryUrl, 1200, 80, '1:1'),
    getOptimizedImageUrl(primaryUrl, 1200, 80, '4:3'),
    getOptimizedImageUrl(primaryUrl, 1200, 80, '16:9'),
  ].filter(Boolean) as string[];
  return Array.from(new Set(candidates));
}

function getSpiritSeoRobots(spirit: Spirit) {
  const baseRobots = getSpiritRobotsMeta(spirit) || { index: true, follow: true };
  return {
    ...baseRobots,
    googleBot: { index: baseRobots.index, follow: baseRobots.follow, 'max-image-preview': 'large' as const, 'max-snippet': -1, 'max-video-preview': -1 },
  };
}

function buildSpiritMetaDescription(spirit: Spirit, lang: 'ko' | 'en', reviewCount: number, fallbackName: string): string {
  const isEn = lang === 'en';
  const typeLabel = spirit.category ? (isEn ? formatSpiritFieldValue('category', spirit.category, 'en') : spirit.category) : (isEn ? 'Spirit' : '주류');
  const countryLabel = spirit.country ? formatSpiritFieldValue('country', spirit.country, lang) : '';
  const tags = getPreferredMetaTags(spirit, lang);
  const abvLine = typeof spirit.abv === 'number' ? (isEn ? `ABV ${spirit.abv}%. ` : `도수 ${spirit.abv}%. `) : '';
  const typeLine = isEn ? `${typeLabel}${countryLabel ? ` from ${countryLabel}` : ''}. ` : `${countryLabel ? `${countryLabel} ` : ''}${typeLabel}. `;
  const pairingGuideRaw = isEn
    ? (spirit.pairingGuideEn || spirit.pairing_guide_en || spirit.pairingGuideKo || spirit.pairing_guide_ko)
    : (spirit.pairingGuideKo || spirit.pairing_guide_ko || spirit.pairingGuideEn || spirit.pairing_guide_en);
  const firstPairing = pairingGuideRaw ? pairingGuideRaw.split(/[,.,。]/)[0]?.trim().slice(0, 30) : null;
  const pairingLine = firstPairing ? (isEn ? `Pairs well with ${firstPairing}. ` : `${firstPairing}과 페어링. `) : '';
  const notesLine = tags.length > 0 ? (isEn ? `Notes: ${tags.join(', ')}. ` : `향·맛: ${tags.join(', ')}. `) : '';
  const reviewLine = reviewCount > 0 ? (isEn ? `${reviewCount} review${reviewCount === 1 ? '' : 's'}. ` : `리뷰 ${reviewCount}개. `) : '';
  const actionLine = isEn ? 'Full tasting notes & food pairing.' : '상세 시음 후기 및 안주 추천.';
  const fallback = isEn ? `Spirit information for ${fallbackName} on K-Spirits Club.` : `${fallbackName} 주류 정보. K-Spirits Club.`;
  return truncateMetaDescription(`${abvLine}${typeLine}${pairingLine}${notesLine}${reviewLine}${actionLine}`.trim() || fallback);
}

// --- Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ id: string; lang: string }>; }): Promise<Metadata> {
  const { id, lang } = await params;
  const isEn = lang === 'en';
  const pageState = await resolveSpiritPageState(id);

  if (pageState.status === 'NOT_FOUND') return { title: "Spirit Not Found", description: "The requested spirit could not be found." };
  if (pageState.status === 'TRANSIENT_FAILURE') return { title: "Spirit | K-Spirits Club", description: "Spirit information on K-Spirits Club.", robots: { index: false, follow: true } };

  const spirit = pageState.spirit;
  const koName = spirit.name || '';
  const enName = spirit.name_en || '';
  const brand = spirit.distillery || '';
  const abv = typeof spirit.abv === 'number' ? `${spirit.abv}` : '';
  const aggregateRating = spirit.aggregateRating || { ratingValue: 0, reviewCount: 0 };
  
  let title = isEn 
    ? `${brand ? brand + ' ' : ''}${enName || koName}${abv ? ' ' + abv + '%' : ''} Review & Tasting Notes` 
    : `${brand ? brand + ' ' : ''}${koName}${enName ? ' (' + enName + ')' : ''}${abv ? ' ' + abv + '%' : ''} 시음노트·후기`;

  const fullDescription = buildSpiritMetaDescription(spirit, lang as any, aggregateRating.reviewCount, isEn ? (enName || koName) : koName);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const preferredImage = getSpiritSeoImageCandidates(spirit, baseUrl)[0] || `${baseUrl}/default-og.jpg`;

  return {
    title,
    description: fullDescription,
    robots: getSpiritSeoRobots(spirit),
    alternates: { canonical: getCanonicalUrl(`/${lang}/spirits/${id}`), languages: getHreflangAlternates(`/spirits/${id}`) },
    openGraph: { title, description: fullDescription, images: [{ url: preferredImage }], type: 'website', url: getCanonicalUrl(`/${lang}/spirits/${id}`), locale: lang === 'ko' ? 'ko_KR' : 'en_US', siteName: 'K-Spirits Club' },
    twitter: { card: 'summary_large_image', title, description: fullDescription, images: [preferredImage] },
  };
}

export default async function SpiritDetailPage({ params }: { params: Promise<{ id: string; lang: string }>; }) {
  const { id, lang } = await params;
  const isEn = lang === 'en';
  const pageState = await resolveSpiritPageState(id);

  if (pageState.status === 'NOT_FOUND') notFound();
  if (pageState.status === 'TRANSIENT_FAILURE') throw new Error(`Spirit data unavailable for id=${id}.`);

  const spirit = pageState.spirit;
  const reviews = (spirit as any).userReviews || [];
  const expertReview = (spirit as any).expertReview;
  const isIndexable = pageState.status === 'FOUND_INDEXABLE';

  const [dictionary, relatedSpirits, wikiResolved] = await Promise.all([
    getDictionary(lang as Locale),
    isIndexable ? getRelatedSpirits(spirit.category, spirit.subcategory || undefined, spirit.abv, id).catch(() => []) : Promise.resolve([]),
    (async () => {
      const wikiGuide = await resolveSpiritWikiGuide(spirit.category, spirit.subcategory, spirit.mainCategory);
      if (!wikiGuide) return { wikiGuide: null, wikiMetadata: null };
      const wikiCat = await resolveWikiCategory(wikiGuide.slug);
      if (!wikiCat) return { wikiGuide, wikiMetadata: null };
      const section = isEn ? (wikiCat.sectionsEn || wikiCat.sections) : wikiCat.sections;
      return { wikiGuide, wikiMetadata: { title: isEn ? wikiCat.nameEn : wikiCat.nameKo, tagline: isEn ? wikiCat.taglineEn : wikiCat.taglineKo, emoji: wikiCat.emoji, recommendedGlass: section?.servingGuidelines?.recommendedGlass, optimalTemp: section?.servingGuidelines?.optimalTemperatures?.[0]?.temp } };
    })(),
  ]);

  const { wikiGuide, wikiMetadata } = wikiResolved;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kspiritsclub.com';
  const pageUrl = `${baseUrl}/${lang}/spirits/${id}`;
  const aggregateRating = spirit.aggregateRating || { ratingValue: 0, reviewCount: 0 };

  const schemaReviews = [
    ...(expertReview ? [{ '@type': 'Review', author: { '@type': 'Person', name: 'K-Spirits Editor' }, datePublished: spirit.updatedAt ? new Date(spirit.updatedAt).toISOString() : new Date().toISOString(), reviewRating: { '@type': 'Rating', ratingValue: aggregateRating.ratingValue || 5.0, bestRating: 5, worstRating: 1 }, reviewBody: expertReview.content }] : []),
    ...reviews.slice(0, 5).map((r: any) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.userName || 'Guest' }, datePublished: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(), reviewRating: { '@type': 'Rating', ratingValue: r.rating || 5, bestRating: 5, worstRating: 1 }, reviewBody: r.content || 'Great spirit.' }))
  ];

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEn ? (spirit.name_en || spirit.name) : spirit.name,
    image: getSpiritSeoImageCandidates(spirit, baseUrl),
    description: buildSpiritMetaDescription(spirit, lang as any, aggregateRating.reviewCount, isEn ? (spirit.name_en || spirit.name) : spirit.name),
    sku: spirit.id,
    brand: { '@type': 'Brand', name: spirit.distillery || 'K-Spirits Club' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: (aggregateRating.ratingValue || 5.0).toFixed(1), reviewCount: aggregateRating.reviewCount || 1, bestRating: 5, worstRating: 1 },
    review: schemaReviews,
    url: pageUrl,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : '홈',
        item: `https://kspiritsclub.com/${lang}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Explore' : '탐색',
        item: `https://kspiritsclub.com/${lang}/explore`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isEn ? (spirit.name_en || spirit.name) : spirit.name,
        item: pageUrl
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SpiritDetailClient spirit={spirit} reviews={reviews} relatedSpirits={relatedSpirits} lang={lang as Locale} dict={dictionary.detail} />
      {wikiMetadata && wikiGuide && (
        <div className="container mx-auto px-4 max-w-4xl">
          <RelatedWikiSection
            slug={wikiGuide.slug}
            title={wikiMetadata.title}
            tagline={wikiMetadata.tagline}
            emoji={wikiMetadata.emoji}
            recommendedGlass={wikiMetadata.recommendedGlass}
            optimalTemp={wikiMetadata.optimalTemp}
            lang={lang as Locale}
          />
        </div>
      )}
    </>
  );
}
