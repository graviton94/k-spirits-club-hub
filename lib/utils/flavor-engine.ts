/**
 * Flavor Analysis Engine
 * 
 * Analyzes user's spirit collection to extract:
 * - Category distribution
 * - Top flavor keywords
 * - Taste persona
 */

export interface Spirit {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  abv: number;
  imageUrl?: string;
  distillery?: string;
  isWishlist: boolean;
  metadata?: {
    tasting_note?: string;
    nose?: string;
    palate?: string;
    finish?: string;
  };
}

export interface FlavorAnalysis {
  totalSpirits: number;
  categoryDistribution: { category: string; count: number; percentage: number }[];
  topKeywords: { keyword: string; count: number }[];
  persona: string;
  coreFlavorProfile: string[];
  dominantCategory: string;
}

/**
 * Mock spirits data based on "달홀진주25" for rich sample visualization
 */
export const MOCK_CELLAR_SPIRITS: Spirit[] = [
  {
    id: "1",
    name: "달홀진주25",
    category: "소주",
    subcategory: "증류식 소주",
    abv: 25,
    imageUrl: "https://via.placeholder.com/300x600/8B4513/FFFFFF?text=달홀진주25",
    distillery: "달홀",
    isWishlist: false,
    metadata: { 
      tasting_note: "깔끔한, 부드러운, 곡물향",
      nose: "곡물향, 바닐라",
      palate: "부드러운, 깔끔한, 미네랄",
      finish: "긴여운, 곡물향"
    }
  },
  {
    id: "2",
    name: "화요",
    category: "소주",
    subcategory: "증류식 소주",
    abv: 41,
    imageUrl: "https://via.placeholder.com/300x600/4A5568/FFFFFF?text=화요",
    distillery: "국순당",
    isWishlist: false,
    metadata: { 
      tasting_note: "스파이시한, 곡물향, 강렬한",
      nose: "곡물향, 후추",
      palate: "스파이시한, 강렬한",
      finish: "긴여운, 따뜻한"
    }
  },
  {
    id: "3",
    name: "문배주",
    category: "전통주",
    subcategory: "증류식 소주",
    abv: 40,
    imageUrl: "https://via.placeholder.com/300x600/2D3748/F0E68C?text=문배주",
    distillery: "문배주양조원",
    isWishlist: false,
    metadata: { 
      tasting_note: "과일향, 달콤한, 부드러운",
      nose: "배향, 과일향",
      palate: "달콤한, 부드러운",
      finish: "깔끔한"
    }
  },
  {
    id: "4",
    name: "Hibiki Harmony",
    category: "위스키",
    subcategory: "Japanese Whisky",
    abv: 43,
    imageUrl: "https://via.placeholder.com/300x600/B8860B/FFFFFF?text=Hibiki",
    distillery: "Suntory",
    isWishlist: false,
    metadata: { 
      tasting_note: "플로랄, 허니, 부드러운",
      nose: "플로랄, 꿀향",
      palate: "부드러운, 달콤한, 복합적",
      finish: "긴여운, 우아한"
    }
  },
  {
    id: "5",
    name: "Glenfiddich 12",
    category: "위스키",
    subcategory: "Single Malt Scotch",
    abv: 40,
    imageUrl: "https://via.placeholder.com/300x600/228B22/FFFFFF?text=Glenfiddich",
    distillery: "Glenfiddich",
    isWishlist: false,
    metadata: { 
      tasting_note: "오크, 바닐라, 부드러운",
      nose: "사과, 배향, 오크",
      palate: "바닐라, 부드러운, 크리미한",
      finish: "긴여운, 오크"
    }
  },
  {
    id: "6",
    name: "Jameson Irish Whiskey",
    category: "위스키",
    subcategory: "Irish Whiskey",
    abv: 40,
    imageUrl: "https://via.placeholder.com/300x600/006400/FFFFFF?text=Jameson",
    distillery: "Jameson",
    isWishlist: false,
    metadata: { 
      tasting_note: "스무스, 과일향, 부드러운",
      nose: "바닐라, 과일향",
      palate: "스무스, 부드러운, 곡물향",
      finish: "깔끔한, 부드러운"
    }
  },
  {
    id: "7",
    name: "안동소주",
    category: "전통주",
    subcategory: "증류식 소주",
    abv: 45,
    imageUrl: "https://via.placeholder.com/300x600/8B4513/FFFFFF?text=안동소주",
    distillery: "안동소주",
    isWishlist: false,
    metadata: { 
      tasting_note: "전통적인, 강렬한, 곡물향",
      nose: "곡물향, 발효향",
      palate: "강렬한, 깔끔한",
      finish: "긴여운, 따뜻한"
    }
  },
  {
    id: "8",
    name: "Hendrick's Gin",
    category: "일반증류주",
    subcategory: "Gin",
    abv: 44,
    imageUrl: "https://via.placeholder.com/300x600/1A202C/90EE90?text=Hendricks",
    distillery: "Hendrick's",
    isWishlist: false,
    metadata: { 
      tasting_note: "큐컴버, 로즈, 플로랄",
      nose: "큐컴버, 장미향",
      palate: "플로랄, 부드러운, 신선한",
      finish: "깔끔한, 상쾌한"
    }
  },
];

/**
 * Extract all flavor keywords from spirits metadata
 */
function extractKeywords(spirits: Spirit[]): Map<string, number> {
  const keywordMap = new Map<string, number>();

  spirits.forEach(spirit => {
    if (!spirit.metadata) return;

    // Combine all metadata fields
    const allText = [
      spirit.metadata.tasting_note,
      spirit.metadata.nose,
      spirit.metadata.palate,
      spirit.metadata.finish,
    ]
      .filter(Boolean)
      .join(', ');

    // Split by comma and trim
    const keywords = allText
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    keywords.forEach(keyword => {
      keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
    });
  });

  return keywordMap;
}

/**
 * Calculate category distribution
 */
function calculateCategoryDistribution(spirits: Spirit[]) {
  const categoryCount = new Map<string, number>();

  spirits.forEach(spirit => {
    categoryCount.set(spirit.category, (categoryCount.get(spirit.category) || 0) + 1);
  });

  const total = spirits.length;
  return Array.from(categoryCount.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate persona string based on dominant flavors and categories
 */
function generatePersona(
  topKeywords: { keyword: string; count: number }[],
  dominantCategory: string
): string {
  if (topKeywords.length === 0) {
    return "술을 사랑하는 탐험가";
  }

  const primaryFlavor = topKeywords[0]?.keyword || "";
  const secondaryFlavor = topKeywords[1]?.keyword || "";

  // Category-based personas
  const categoryPersonas: Record<string, string> = {
    "소주": "전통 증류주 마니아",
    "위스키": "세련된 위스키 애호가",
    "전통주": "한국 전통주 수호자",
    "일반증류주": "글로벌 스피릿 컬렉터",
    "탁주": "전통 발효주 마스터",
  };

  // Flavor-based modifiers
  const flavorModifiers: Record<string, string> = {
    "부드러운": "부드러움을 추구하는",
    "깔끔한": "깔끔함을 선호하는",
    "곡물향": "곡물향 애호가인",
    "과일향": "프루티한 향을 사랑하는",
    "스파이시한": "강렬한 맛을 즐기는",
    "플로랄": "꽃향기를 좋아하는",
    "달콤한": "달콤함을 선호하는",
    "강렬한": "진한 풍미를 찾는",
  };

  const categoryBase = categoryPersonas[dominantCategory] || "다양한 술을 즐기는 애호가";
  const flavorMod = flavorModifiers[primaryFlavor] || "";

  if (flavorMod) {
    return `${flavorMod} ${categoryBase}`;
  }

  return categoryBase;
}

/**
 * Main analysis function
 * Analyzes localStorage spirits or uses mock data
 */
export function analyzeCellar(spirits?: Spirit[]): FlavorAnalysis {
  // Use provided spirits or mock data
  const cellarSpirits = spirits && spirits.length > 0 ? spirits : MOCK_CELLAR_SPIRITS;
  
  // Filter out wishlist items - only analyze owned spirits
  const ownedSpirits = cellarSpirits.filter(s => !s.isWishlist);

  if (ownedSpirits.length === 0) {
    return {
      totalSpirits: 0,
      categoryDistribution: [],
      topKeywords: [],
      persona: "아직 술장이 비어있습니다",
      coreFlavorProfile: [],
      dominantCategory: "",
    };
  }

  // Extract keywords
  const keywordMap = extractKeywords(ownedSpirits);
  const topKeywords = Array.from(keywordMap.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate category distribution
  const categoryDistribution = calculateCategoryDistribution(ownedSpirits);
  const dominantCategory = categoryDistribution[0]?.category || "";

  // Core flavor profile (top 3)
  const coreFlavorProfile = topKeywords.slice(0, 3).map(k => k.keyword);

  // Generate persona
  const persona = generatePersona(topKeywords, dominantCategory);

  return {
    totalSpirits: ownedSpirits.length,
    categoryDistribution,
    topKeywords,
    persona,
    coreFlavorProfile,
    dominantCategory,
  };
}

/**
 * Load spirits from localStorage
 */
export function loadCellarFromStorage(): Spirit[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('kspirits_cellar');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cellar from storage:', error);
  }

  return [];
}
