import ingestedData from '../db/ingested-data.json';
import { Review, Spirit as SpiritSchema } from '../db/schema';

/**
 * Flavor Analysis Engine (v2.2 - Multi-Category Diversity)
 */

export interface UserReview {
    ratingN: number;
    ratingP: number;
    ratingF: number;
    ratingOverall: number;
    comment: string;
    tagsN: string[];
    tagsP: string[];
    tagsF: string[];
    createdAt: string;
}

export interface Spirit {
    id: string;
    name: string;
    category: string;
    categoryEn?: string | null;
    // CamelCase — SSoT (Data Connect schema)
    nameEn?: string | null;
    descriptionEn?: string | null;
    descriptionKo?: string | null;
    pairingGuideEn?: string | null;
    pairingGuideKo?: string | null;
    noseTags?: string[];
    palateTags?: string[];
    finishTags?: string[];
    tastingNote?: string | null;
    subcategory?: string | null;
    country?: string | null;
    region?: string | null;
    abv: number;
    volume?: number | null;
    imageUrl?: string;
    thumbnailUrl?: string;
    distillery?: string | null;
    bottler?: string | null;
    status?: string | null;
    importer?: string | null;
    rawCategory?: string | null;
    isPublished?: boolean;
    isReviewed?: boolean;
    rating?: number;
    reviewCount?: number;
    isWishlist: boolean;
    userReview?: UserReview;
    metadata?: any;
    score?: number; // For recommendations
    // Legacy snake_case aliases (ingested-data.json / backward compat)
    category_en?: string | null;
    name_en?: string | null;
    description_en?: string | null;
    description_ko?: string | null;
    nose_tags?: string[];
    palate_tags?: string[];
    finish_tags?: string[];
    tasting_note?: string;
}

export type FlavorVector = [number, number, number, number, number, number];

const TAG_TAXONOMY: Record<string, Record<string, Partial<Record<string, number>>>> = {
    whisky: {
        '#바닐라': { sweet: 0.6, woody: 0.4 },
        '#오크': { woody: 1.0 },
        '#피트': { peaty: 1.0 },
        '#스모키': { peaty: 0.8, woody: 0.2 },
        '#건포도': { fruity: 0.7, sweet: 0.3 },
        '#시트러스': { fruity: 1.0 },
        '#스파이시': { spicy: 1.0 },
        '#초콜릿': { sweet: 0.4, woody: 0.6 },
        '#너티': { woody: 1.0 },
    },
    soju: {
        '#곡물': { woody: 0.6, sweet: 0.4 },
        '#깔끔한': { floral: 0.5 },
        '#부드러운': { sweet: 0.3, floral: 0.2 },
        '#달콤한': { sweet: 1.0 },
        '#청량한': { fruity: 0.4, floral: 0.6 },
    },
    global: {
        '#달콤한': { sweet: 1.0 },
        '#과일향': { fruity: 1.0 },
        '#꽃향기': { floral: 1.0 },
        '#스파이시': { spicy: 1.0 },
        '#우디': { woody: 1.0 },
        '#피티': { peaty: 1.0 },
        '#스모키': { peaty: 1.0 },
        '#바닐라': { sweet: 0.8, woody: 0.2 },
        '#허브': { floral: 0.8, spicy: 0.2 },
        '#너티': { woody: 1.0 },
        '#청사과': { fruity: 1.0 },
        '#서양배': { fruity: 1.0 },
        '#꿀': { sweet: 1.0 },
        '#카라멜': { sweet: 1.0 },
        '#곡물': { woody: 0.5, sweet: 0.5 },
        '#나무': { woody: 1.0 },
        '#상큼한': { fruity: 0.8, floral: 0.2 },
        '#깔끔한': { floral: 0.5 },
        '#부드러운': { sweet: 0.3, floral: 0.2 },
        '#탄산감': { spicy: 0.3, fruity: 0.2 },
    }
};

class FlavorVectorIndex {
    private static instance: FlavorVectorIndex;
    private vectorMap: Map<string, Float32Array> = new Map();

    private constructor() { this.initialize(); }

    public static getInstance(): FlavorVectorIndex {
        if (!FlavorVectorIndex.instance) FlavorVectorIndex.instance = new FlavorVectorIndex();
        return FlavorVectorIndex.instance;
    }

    private initialize() {
        if (typeof window === 'undefined') return;
        try {
            (ingestedData as any).forEach((spirit: any) => {
                const tags = [...(spirit.nose_tags || []), ...(spirit.palate_tags || []), ...(spirit.finish_tags || []), ...(spirit.metadata?.nose_tags || []), ...(spirit.metadata?.palate_tags || []), ...(spirit.metadata?.finish_tags || [])];
                const vector = this.calculateVector(spirit.category || spirit.mainCategory || 'global', tags);
                this.vectorMap.set(spirit.id, new Float32Array(vector));
            });
        } catch (e) { console.error('Failed to initialize FlavorVectorIndex', e); }
    }

    public calculateVector(category: string, tags: string[]): number[] {
        const vec = [0, 0, 0, 0, 0, 0];
        const dimMap = ['sweet', 'fruity', 'floral', 'spicy', 'woody', 'peaty'];
        const normalizedCategory = category.toLowerCase();
        tags.forEach(rawTag => {
            const tag = rawTag.split(' ')[0].trim();
            const mapping = TAG_TAXONOMY[normalizedCategory]?.[tag] || TAG_TAXONOMY['global']?.[tag];
            if (mapping) { Object.entries(mapping).forEach(([dim, weight]) => { const idx = dimMap.indexOf(dim); if (idx !== -1) vec[idx] += (weight as number); }); }
        });
        const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return magnitude > 0 ? vec.map(v => v / magnitude) : vec;
    }

    public getVector(id: string): Float32Array | null { return this.vectorMap.get(id) || null; }
    public getAllVectors() { return this.vectorMap; }
}

export const flavorIndex = FlavorVectorIndex.getInstance();

export function calculateCosineSimilarity(vecA: Float32Array | number[], vecB: Float32Array | number[]): number {
    let dotProduct = 0; let magA = 0; let magB = 0;
    for (let i = 0; i < 6; i++) { dotProduct += vecA[i] * vecB[i]; magA += vecA[i] * vecA[i]; magB += vecB[i] * vecB[i]; }
    const mag = Math.sqrt(magA) * Math.sqrt(magB);
    return mag > 0 ? dotProduct / mag : 0;
}

export function generateUserPalate(reviews: any[]): number[] {
    const userVec = [0, 0, 0, 0, 0, 0];
    reviews.forEach(review => {
        const spiritVec = flavorIndex.getVector(review.spiritId);
        if (spiritVec) {
            let weight = 0.5;
            const rating = review.rating || review.ratingOverall || 0;
            if (rating >= 5) weight = 1.0; else if (rating >= 4) weight = 0.8; else if (rating >= 3) weight = 0.4; else if (rating >= 2) weight = 0.1; else if (rating >= 1) weight = -0.5;
            for (let i = 0; i < 6; i++) { userVec[i] += spiritVec[i] * weight; }
        }
    });
    const magnitude = Math.sqrt(userVec.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? userVec.map(v => Math.max(0, (v / magnitude) * 100)) : userVec.map(() => 0);
}

export function getHybridRecommendations(
    userVector: number[], 
    options: { mode: 'Refine' | 'Discover', currentCategory?: string, excludedIds: string[], limit?: number }
) {
    const { limit = 6 } = options;
    const vectors = flavorIndex.getAllVectors();
    const candidates: any[] = [];
    const normUserVec = userVector.map(v => v / 100);

    vectors.forEach((vec, id) => {
        if (options.excludedIds.includes(id)) return;
        const spirit = (ingestedData as any).find((s: any) => s.id === id);
        if (!spirit || !spirit.isPublished) return;

        let similarity = calculateCosineSimilarity(normUserVec, vec);
        const spiritCategory = (spirit.category || spirit.mainCategory || '').toLowerCase();

        // High Variance / Discovery Logic
        if (options.mode === 'Discover') {
            const isOtherCategory = options.currentCategory && spiritCategory !== options.currentCategory.toLowerCase();
            similarity *= isOtherCategory ? 1.2 : 0.8;
            // Add slight randomness to break "Popularity Bias"
            similarity += (Math.random() - 0.5) * 0.05;
        }

        candidates.push({ ...spirit, score: Math.max(0, similarity) });
    });

    // Sort by score
    const sorted = candidates.sort((a, b) => b.score - a.score);

    // DIVERSITY SHUFFLE: Ensure we don't just pick one category
    const finalSelection: any[] = [];
    const categoryCounts: Record<string, number> = {};

    for (const item of sorted) {
        if (finalSelection.length >= limit) break;
        const cat = item.category || 'unknown';
        
        // Max 2 items per category for high diversity
        if ((categoryCounts[cat] || 0) < 2 || finalSelection.length > limit / 2) {
            finalSelection.push(item);
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
    }

    return finalSelection;
}

export function analyzeCellar(spirits: Spirit[]) {
    const reviews = spirits.filter(s => s.userReview).map(s => ({ spiritId: s.id, rating: s.userReview?.ratingOverall || 0 }));
    const statsArray = generateUserPalate(reviews);
    return {
        totalSpirits: spirits.length,
        stats: { sweet: statsArray[0], fruity: statsArray[1], floral: statsArray[2], spicy: statsArray[3], woody: statsArray[4], peaty: statsArray[5] },
        persona: { title: "Analyzing DNA...", description: "Mapping your flavor DNA...", keywords: ["#DNA"] }
    };
}
