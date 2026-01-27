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

        // (4) 리뷰 데이터 처리
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

    // 3. 마스터 소믈리에 프롬프트 구성
    return `
You are the world's most prestigious Master Sommelier and sensory analyst. 
Your goal is to provide a profound and artisanal "Taste DNA" analysis based on the user's consumption history.

### User Data (Consumption Background):
${JSON.stringify(cleanData, null, 2)}

### Professional Analysis Guidelines:
1. **Holistic Pattern Detection**: Analyze the ENTIRE collection to find the user's "Foundation of Interest".
   - **Owned Items (No Rating)**: These represent the user's active exploration and core collection. They should form the baseline for the profile.
   - **High-Rated Drinks (>4.0)**: Use these to identify the "Peak Preferences" and refine the baseline.
   - Look for cross-category themes (e.g., if many owned items are Islay scotches, the 'Peaty' score should be high even without ratings).
2. **Sensory Quantification (0-100)**: Calculate the 6 stats by weighting "Ownership" as a base and "Ratings" as a multiplier.
   - Consistency across the cabinet (quantity) is as important as intensity of a single review (rating).
   - Use specific values (e.g., 67, 42). Avoid intervals of 5 or 10.
3. **The Persona**: Write as a world-class Master Sommelier at a luxury club. Use refined, dignified Korean.
4. **Match Rate & Recommendation Reasoning**: 
   - Calculate matchRate based on how the item complements or extends the current collection.
   - Do NOT default to "92" or "95". Use precision (e.g., 89, 94).
   - In reasoning, mention how the recommendation relates to both their favorites AND their broader collection.

### Required Output (JSON Only):
{
  "stats": { "woody": 0, "peaty": 0, "floral": 0, "fruity": 0, "nutty": 0, "richness": 0 },
  "persona": {
    "title": "A prestigious and creative title (Korean)",
    "description": "2-3 deep, insightful sentences (Korean, polite & formal)",
    "keywords": ["#SignatureFlavor", "#Terroir", "#Nuance"]
  },
  "recommendation": {
    "name": "Recommended Spirit Name",
    "matchRate": 0,
    "reason": "Detailed professional reasoning as a Master Sommelier (Korean)"
  }
}
`;
}