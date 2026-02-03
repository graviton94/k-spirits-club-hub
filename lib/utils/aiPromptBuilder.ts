// lib/utils/aiPromptBuilder.ts

// 1. route.ts에서 넘어오는 실제 데이터 구조 정의 (Cabinet 스냅샷 + 리뷰)
export interface AnalysisInputItem {
    name: string;             // 필수 (Cabinet)
    category?: string;        // 선택 (Cabinet)
    distillery?: string;      // 선택 (Cabinet)
    abv?: number;             // 선택 (Cabinet)
    country?: string;         // 선택 (원본에만 있을 수 있음)
    region?: string;          // 선택 (원본에만 있을 수 있음)
    subcategory?: string;     // 선택 (원본에만 있을 수 있음)
    isWishlist?: boolean;     // 필수

    // Spirit-level flavor DNA
    nose_tags?: string[];
    palate_tags?: string[];
    finish_tags?: string[];
    tasting_note?: string;

    // 조립된 리뷰 데이터
    userReview?: {
        ratingOverall: number;
        ratingN?: number;
        ratingP?: number;
        ratingF?: number;
        tagsN?: string[];
        tagsP?: string[];
        tagsF?: string[];
        comment?: string;
    } | null;

    metadata?: {
        tasting_note?: string;
        nose_tags?: string[];
        palate_tags?: string[];
        finish_tags?: string[];
        [key: string]: any;
    };
}

/**
 * 유저의 술장 데이터를 바탕으로 AI 분석용 프롬프트를 생성합니다.
 * 데이터가 누락된 필드는 안전하게 제외합니다.
 */
export function buildTasteAnalysisPrompt(items: AnalysisInputItem[]): string {

    // 1. 마신 술만 필터링 (위시리스트 제외)
    const consumedSpirits = items.filter(s => !s.isWishlist);

    // 2. 데이터 정제 (없는 필드는 건너뛰기)
    const cleanData = consumedSpirits.map(item => {

        // (1) 기본 정보: 이름과 카테고리는 필수
        const entry: any = {
            name: item.name,
            type: item.category || 'Unknown',
        };

        // (2) 출처/스타일: 있는 정보만 모아서 문자열로 (예: "Scotland > Islay")
        // 데이터가 없으면 이 필드는 생성되지 않음
        const originParts = [item.country, item.region, item.subcategory].filter(Boolean);
        if (originParts.length > 0) {
            entry.origin = originParts.join(' > ');
        }

        // (3) 스펙: 증류소와 도수
        const specParts = [];
        if (item.distillery) specParts.push(item.distillery);
        if (item.abv) specParts.push(`${item.abv}% ABV`);
        if (specParts.length > 0) {
            entry.spec = specParts.join(', ');
        }

        // (4) Inherent Flavor DNA (System data)
        const inherentTags = [
            ...(item.nose_tags || item.metadata?.nose_tags || []),
            ...(item.palate_tags || item.metadata?.palate_tags || []),
            ...(item.finish_tags || item.metadata?.finish_tags || [])
        ];
        const inherentNote = item.tasting_note || item.metadata?.tasting_note;

        if (inherentTags.length > 0) entry.inherentFlavor = inherentTags.join(', ');
        if (inherentNote) entry.inherentNote = inherentNote;

        // (5) 리뷰 데이터 처리
        if (item.userReview) {
            const r = item.userReview;

            // 점수에 의미 부여 (4.0 이상은 Favorite)
            let ratingText = `Total:${r.ratingOverall.toFixed(1)}`;
            if (r.ratingOverall >= 4.0) ratingText = `[Favorite] ${ratingText}`;
            else if (r.ratingOverall <= 2.5) ratingText = `[Disliked] ${ratingText}`;

            // 상세 평점이 있는 경우 추가
            if (r.ratingN || r.ratingP || r.ratingF) {
                ratingText += ` (N:${r.ratingN || '-'} / P:${r.ratingP || '-'} / F:${r.ratingF || '-'})`;
            }
            entry.userRating = ratingText;

            // 태그 합치기
            const allTags = [
                ...(r.tagsN || []),
                ...(r.tagsP || []),
                ...(r.tagsF || [])
            ].join(', ');

            if (allTags) entry.flavorTags = allTags;
            if (r.comment) entry.userNote = r.comment;
        } else {
            entry.userRating = "No Rating (Owned)";
        }

        return entry;
    });

    // 3. 세계 주류 바 사장 프롬프트 구성
    return `
You are the owner of a prestigious global spirits bar that carries everything from whisky to traditional Korean spirits, rum, gin, vodka, sake, and more.
Your expertise spans ALL categories of spirits worldwide. You analyze customer preferences and recommend diverse options that match their taste profile.

### Customer Data (Purchase & Tasting History):
${JSON.stringify(cleanData, null, 2)}

### Professional Analysis Guidelines:
1. **Holistic Pattern Detection**: Analyze the ENTIRE collection to find the customer's "Taste Foundation".
   - **Owned Items (No Rating)**: These represent active exploration and core collection. They form the baseline.
   - **High-Rated Spirits (>4.0)**: Use these to identify "Peak Preferences" and refine the baseline.
   - Look for cross-category themes (e.g., if they enjoy peated whisky AND smoky mezcal, the 'Peaty' score should be high).
   - **Don't limit yourself to one category** - if they like bourbon, consider recommending rum, cognac, or even traditional Korean spirits with similar profiles.

2. **Sensory Quantification (0-100)**: Calculate the 6 stats by weighting "Ownership" as a base and "Ratings" as a multiplier.
   - Consistency across the cabinet (quantity) is as important as intensity of a single review (rating).
   - Use specific values (e.g., 67, 42). Avoid intervals of 5 or 10.

3. **The Persona**: Write as a knowledgeable bar owner who knows spirits from around the world. Use warm, professional Korean.

4. **Recommendation Strategy**:
   - **Explore Different Categories**: Don't just recommend similar items. If they like Islay whisky, consider peated rum, smoky mezcal, or aged baijiu.
   - **Match Flavor Profiles, Not Categories**: Focus on taste characteristics (smoky, fruity, rich) rather than sticking to the same spirit type.
   - **Introduce New Experiences**: Recommend spirits that complement their collection while expanding their horizons.
   - Examples:
     * Bourbon lover → Try aged rum, cognac, or Korean traditional spirits
     * Gin enthusiast → Explore floral vodka, sake, or botanical liqueurs
     * Peated whisky fan → Consider mezcal, peated rum, or smoky soju

5. **Match Rate & Reasoning**: 
   - Calculate matchRate based on how the item complements or extends the current collection.
   - Do NOT default to "92" or "95". Use precision (e.g., 89, 94).
   - In reasoning, explain how this recommendation connects to their taste profile while offering something new.

### Required Output (JSON Only):
{
  "stats": { "woody": 0, "peaty": 0, "floral": 0, "fruity": 0, "nutty": 0, "richness": 0 },
  "persona": {
    "title": "A creative and fitting title (Korean)",
    "description": "2-3 insightful sentences about their taste journey (Korean, warm & professional)",
    "keywords": ["#SignatureFlavor", "#Exploration", "#Nuance"]
  },
  "recommendation": {
    "name": "Recommended Spirit Name (can be ANY category - whisky, rum, gin, sake, traditional spirits, etc.)",
    "matchRate": 0,
    "reason": "Detailed reasoning as a bar owner, explaining the flavor connection and why this expands their collection (Korean)"
  }
}
`;
}