// lib/utils/aiPromptBuilder.ts

// 1. route.ts에서 넘어오는 실제 데이터 구조 정의 (Cabinet 스냅샷 + 리뷰)
export interface AnalysisInputItem {
    name: string;             // 필수 (Cabinet)
    name_en?: string | null;  // [추가] 영문 제품명 (Global Sync)
    category?: string;        // 선택 (Cabinet)
    distillery?: string;      // 선택 (Cabinet)
    abv?: number;             // 선택 (Cabinet)
    country?: string;         // 선택 (원본에만 있을 수 있음)
    region?: string;          // 선택 (원본에만 있을 수 있음)
    subcategory?: string;     // 선택 (원본에만 있을 수 있음)
    isWishlist?: boolean;     // 필수
    addedAt?: string;         // [추가] 술장에 추가된 날짜 (ISO)
    lastActivityAt?: string;  // [추가] 마지막 활동(리뷰 등) 날짜 (ISO)

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
        createdAt?: string;   // [추가] 리뷰 작성 시간
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
 * 데이터가 누락된 필드는 안전하게 제외하며, 최신 활동에 우선순위를 둡니다.
 */
export function buildTasteAnalysisPrompt(items: AnalysisInputItem[]): string {

    // 1. 마신 술만 필터링 (위시리스트 제외)
    const consumedSpirits = items.filter(s => !s.isWishlist);

    // 2. 최신 활동 날짜 기준으로 정렬 (최신 활동이 위로 오도록)
    const sortedSpirits = [...consumedSpirits].sort((a, b) => {
        const timeA = new Date(a.lastActivityAt || a.addedAt || 0).getTime();
        const timeB = new Date(b.lastActivityAt || b.addedAt || 0).getTime();
        return timeB - timeA;
    });

    // 3. 데이터 정제 (없는 필드는 건너뛰기)
    const cleanData = sortedSpirits.map(item => {

        // (1) 기본 정보: 이름과 카테고리는 필수
        const entry: any = {
            name: item.name,
            type: item.category || 'Unknown',
        };

        // [Newness Check] 최근 7일 이내 활동이 있으면 마킹
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const addedDate = new Date(item.addedAt || 0).getTime();
        const activityDate = new Date(item.lastActivityAt || 0).getTime();

        if (addedDate > sevenDaysAgo) entry.isRecentlyAdded = true;
        if (activityDate > sevenDaysAgo) entry.isRecentActivity = true;

        // (2) 출처/스타일
        const originParts = [item.country, item.region, item.subcategory].filter(Boolean);
        if (originParts.length > 0) {
            entry.origin = originParts.join(' > ');
        }

        // (3) 스펙
        const specParts = [];
        if (item.distillery) specParts.push(item.distillery);
        if (item.abv) specParts.push(`${item.abv}% ABV`);
        if (specParts.length > 0) {
            entry.spec = specParts.join(', ');
        }

        // (4) Inherent Flavor DNA
        const inherentTags = [
            ...(item.nose_tags || item.metadata?.nose_tags || []),
            ...(item.palate_tags || item.metadata?.palate_tags || []),
            ...(item.finish_tags || item.metadata?.finish_tags || [])
        ].filter(Boolean);
        const inherentNote = item.tasting_note || item.metadata?.tasting_note;

        if (inherentTags.length > 0) entry.inherentFlavor = inherentTags.join(', ');
        if (inherentNote) entry.inherentNote = inherentNote;

        // (5) 리뷰 데이터 처리
        if (item.userReview) {
            const r = item.userReview;
            let ratingText = `Total:${r.ratingOverall.toFixed(1)}`;
            if (r.ratingOverall >= 4.0) ratingText = `[Favorite] ${ratingText}`;
            else if (r.ratingOverall <= 2.5) ratingText = `[Disliked] ${ratingText}`;

            if (r.ratingN || r.ratingP || r.ratingF) {
                ratingText += ` (N:${r.ratingN || '-'} / P:${r.ratingP || '-'} / F:${r.ratingF || '-'})`;
            }
            entry.userRating = ratingText;

            const allTags = [
                ...(r.tagsN || []),
                ...(r.tagsP || []),
                ...(r.tagsF || [])
            ].filter(Boolean).join(', ');

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
1. **Dynamic Profile Detection**: Pay close attention to items marked with 'isRecentlyAdded' or 'isRecentActivity'. These represent the customer's *current* interests and potential shifts in their taste profile.
   - If recent reviews (ratings/notes) differ from the historical baseline, prioritize the recent data as it indicates an evolving palate.
   - Analyze if the user is moving towards a specific category, flavor profile, or price point recently.

2. **Holistic Pattern Detection**: Analyze the ENTIRE collection while weighting recent activity more heavily.
   - **Owned Items (No Rating)**: These represent active exploration and core collection. They form the baseline.
   - **High-Rated Spirits (>4.0)**: Use these to identify "Peak Preferences".
   - Look for cross-category themes (e.g., if they recently added peated whisky AND smoky mezcal, the 'Peaty' score should reflect this surge in interest).

3. **Sensory Quantification (0-100)**: Calculate the 6 stats. Weight recent activities (last 7 days) as higher priority indicators of the current state.
   - Use specific values (e.g., 67, 42). Avoid intervals of 5 or 10.

4. **Recommendation Strategy**:
   - **Explore Different Categories**: Don't just recommend similar items. If they like Islay whisky, consider peated rum, smoky mezcal, or aged baijiu.
   - **Freshness First**: Do NOT recommend things the user already owns or has reviewed unless it's a significant upgrade/variation.
   - **Introduce New Experiences**: Recommend spirits that complement their collection while expanding their horizons.
   - **Reasoning**: In your reasoning, explicitly mention why this choice is relevant to their *current* taste journey, referencing recent additions or high-rated items if applicable.

5. **Match Rate & Reasoning**: 
   - Calculate matchRate based on how the item complements or extends the current collection.
   - Do NOT default to "92" or "95". Use precision (e.g., 89, 94).

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