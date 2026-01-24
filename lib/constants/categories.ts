import metadata from "@/lib/constants/spirits-metadata.json";

/**
 * Category Hierarchy Definitions
 * Level 1 (Legal/Root): '위스키', '브랜디', '일반증류주'... (Matches API)
 * Level 2 (Main): 'scotch', 'gin', 'rum'... (Functional Groups)
 * Level 3 (Sub): 'Single Malt Scotch', 'London Dry Gin'...
 */

// Dynamically load display names from metadata
export const CATEGORY_NAME_MAP: Record<string, string> = (metadata as any).display_names || {};

export const LEGAL_CATEGORIES = Object.keys(metadata.categories);

/**
 * Returns the hierarchy structure for a given Legal Category.
 */
export function getCategoryStructure(legalCategory: string) {
    const data = (metadata.categories as any)[legalCategory];
    if (!data) return null;

    if (Array.isArray(data)) {
        return { type: 'flat', items: data as string[] };
    } else if (typeof data === 'object') {
        return { type: 'nested', mains: Object.keys(data) as string[] };
    }
    return null;
}

export function getSubCategoriesForMain(legalCategory: string, mainCategory: string): string[] {
    const data = (metadata.categories as any)[legalCategory];
    if (!data || Array.isArray(data)) return [];
    return data[mainCategory] || [];
}

/**
 * Infer Full Hierarchy from a specific Sub Category Name.
 */
export function inferHierarchy(subCategory: string): { legal: string, main: string | null } | null {
    if (!subCategory) return null;

    for (const [legalKey, legalValue] of Object.entries(metadata.categories)) {
        if (Array.isArray(legalValue)) {
            if ((legalValue as string[]).includes(subCategory)) {
                return { legal: legalKey, main: null };
            }
        } else if (typeof legalValue === 'object') {
            for (const [mainKey, mainValue] of Object.entries(legalValue)) {
                if (Array.isArray(mainValue) && (mainValue as string[]).includes(subCategory)) {
                    return { legal: legalKey, main: mainKey };
                }
            }
        }
    }
    return null;
}
