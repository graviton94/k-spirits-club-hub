/**
 * 주류 백과사전 (Spirits Wiki) — 공통 타입 정의
 */

export interface SpiritSubtype {
    name: string
    description: string
    examples?: string[]
}

export interface SpiritFlavorTag {
    label: string
    /** Tailwind bg color class, e.g. 'bg-amber-500/20' */
    color: string
}

export interface SpiritClassification {
    name: string
    criteria: string
    description: string
    flavorTags?: SpiritFlavorTag[]
}

export interface SpiritSensoryMetric {
    metric: string
    label: string
    value: string
    description: string
}

export interface SpiritIngredient {
    type: string
    name: string
    description: string
}

export interface SpiritProcess {
    step: string
    name: string
    description: string
}

export interface SpiritServingGuideline {
    recommendedGlass?: string
    optimalTemperatures?: { temp: string; description: string }[]
    methods?: { name: string; description: string }[]
    decantingNeeded?: boolean
}

export interface SpiritSection {
    /** "XX란 무엇인가?" */
    definition?: string
    /** 역사 / 원산지 */
    history?: string

    // --- 1. 체계화된 확장 필드 ---
    /** 1. 주종별 등급 및 분류 체계 */
    classifications?: SpiritClassification[]
    /** 2. 객관적 맛/향 지표 */
    sensoryMetrics?: SpiritSensoryMetric[]
    /** 3. 핵심 원재료 및 발효제 */
    coreIngredients?: SpiritIngredient[]
    /** 4. 특수 제조 및 가공 공정 */
    manufacturingProcess?: SpiritProcess[]
    /** 5. 최적의 음용 가이드 */
    servingGuidelines?: SpiritServingGuideline
    // ------------------------------------

    /** 기존 레거시(or 간이) 렌더링용 필드들 */
    subtypes?: SpiritSubtype[]
    flavorTags?: SpiritFlavorTag[]
    production?: string
    howToEnjoy?: string[]
    foodPairing?: string[]
    /** DB 제품 조회용 카테고리 필터 키워드 */
    dbCategories?: string[]
}

export interface SpiritCategory {
    /** URL slug: /contents/wiki/whisky */
    slug: string
    emoji: string
    nameKo: string
    nameEn: string
    /** 한 줄 설명 (한국어) */
    taglineKo: string
    /** 한 줄 설명 (영어) */
    taglineEn: string
    /** Tailwind 테마 색상 키 (amber, rose, sky …) */
    color: string
    /** 본문 섹션 */
    sections?: SpiritSection
}
