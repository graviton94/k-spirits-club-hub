import type { Spirit } from '@/lib/db/schema'
import type { SpiritCategory, SpiritSection } from '@/lib/constants/wiki/types'
import { formatSpiritFieldValue } from '@/lib/utils/localize-field'

type WikiMatchSpirit = Pick<Spirit, 'id' | 'category' | 'subcategory' | 'mainCategory' | 'updatedAt'>

function getWikiSection(category: SpiritCategory): SpiritSection | undefined {
    return category.sections || category.sectionsEn
}

function normalizeMatchValue(value: string | null | undefined): string {
    if (!value) return ''

    return value
        .toLowerCase()
        .replace(/[\s/()_-]+/g, '')
        .trim()
}

function getMatchCandidates(spirit: Pick<Spirit, 'subcategory' | 'mainCategory'>): string[] {
    const candidates = new Set<string>()
    const fields: Array<{ kind: 'subcategory' | 'mainCategory'; value: string | null | undefined }> = [
        { kind: 'subcategory', value: spirit.subcategory },
        { kind: 'mainCategory', value: spirit.mainCategory },
    ]

    for (const field of fields) {
        if (!field.value) continue

        candidates.add(field.value)
        candidates.add(formatSpiritFieldValue(field.kind, field.value, 'en'))
    }

    return Array.from(candidates)
        .map((value) => normalizeMatchValue(value))
        .filter(Boolean)
}

function getKeywordScore(candidate: string, keyword: string): number {
    if (!candidate || !keyword) return 0
    if (candidate === keyword) return 400 + keyword.length
    if (candidate.includes(keyword)) return 240 + keyword.length
    if (keyword.includes(candidate) && candidate.length >= 3) return 120 + candidate.length
    return 0
}

function scoreSpiritForKeywordGroup(
    spirit: Pick<Spirit, 'subcategory' | 'mainCategory'>,
    keywords: string[],
): number {
    const normalizedKeywords = keywords
        .map((keyword) => normalizeMatchValue(keyword))
        .filter(Boolean)

    if (normalizedKeywords.length === 0) return 0

    const candidates = getMatchCandidates(spirit)
    let bestScore = 0

    for (const candidate of candidates) {
        for (const keyword of normalizedKeywords) {
            bestScore = Math.max(bestScore, getKeywordScore(candidate, keyword))
        }
    }

    return bestScore
}

export function scoreSpiritForWikiCategory(
    spirit: Pick<Spirit, 'category' | 'subcategory' | 'mainCategory'>,
    category: SpiritCategory,
): number {
    const section = getWikiSection(category)
    const dbCategories = section?.dbCategories || []

    if (!spirit.category || !dbCategories.includes(spirit.category)) {
        return -1
    }

    const keywords = (section?.dbSubcategoryKeywords || [])
        .map((keyword) => normalizeMatchValue(keyword))
        .filter(Boolean)

    if (keywords.length === 0) {
        return 10
    }

    const candidates = getMatchCandidates(spirit)
    let bestScore = 0

    for (const candidate of candidates) {
        for (const keyword of keywords) {
            bestScore = Math.max(bestScore, getKeywordScore(candidate, keyword))
        }
    }

    return 10 + bestScore
}

export function sortFeaturedSpiritsForWiki<T extends WikiMatchSpirit>(
    spirits: T[],
    category: SpiritCategory,
): T[] {
    return [...spirits]
        .map((spirit, index) => ({
            spirit,
            index,
            score: scoreSpiritForWikiCategory(spirit, category),
        }))
        .filter((item) => item.score >= 0)
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score
            }

            const aTime = new Date(a.spirit.updatedAt).getTime()
            const bTime = new Date(b.spirit.updatedAt).getTime()

            if (bTime !== aTime) {
                return bTime - aTime
            }

            return a.index - b.index
        })
        .map((item) => item.spirit)
}

export function selectFeaturedSpiritsForWiki<T extends WikiMatchSpirit>(
    spirits: T[],
    category: SpiritCategory,
    limit: number,
): T[] {
    const section = getWikiSection(category)
    const groups = (section?.dbSubcategoryKeywordGroups || []).filter((group) => group.length > 0)
    const sorted = sortFeaturedSpiritsForWiki(spirits, category)

    if (groups.length === 0) {
        return sorted.slice(0, limit)
    }

    const picked = new Set<string>()
    const balanced: T[] = []

    const groupLists = groups.map((group) =>
        sorted.filter((spirit) => scoreSpiritForKeywordGroup(spirit, group) > 0),
    )

    let madeProgress = true
    while (balanced.length < limit && madeProgress) {
        madeProgress = false

        for (const groupList of groupLists) {
            const nextSpirit = groupList.find((spirit) => !picked.has(spirit.id))
            if (!nextSpirit) continue

            picked.add(nextSpirit.id)
            balanced.push(nextSpirit)
            madeProgress = true

            if (balanced.length >= limit) break
        }
    }

    for (const spirit of sorted) {
        if (picked.has(spirit.id)) continue

        picked.add(spirit.id)
        balanced.push(spirit)

        if (balanced.length >= limit) break
    }

    return balanced
}
