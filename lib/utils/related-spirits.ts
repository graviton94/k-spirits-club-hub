import { db } from "@/lib/db/index";
import { isIndexableSpirit } from "@/lib/utils/indexable-tier";
import { unstable_cache } from "next/cache";

/**
 * Fetch up to 6 related spirits based on category, subcategory, and ABV.
 * Guaranteed to only return Indexable Tier A spirits.
 * Results are cached heavily (revalidated every 24 hours).
 */
export const getRelatedSpirits = unstable_cache(
    async (category: string | undefined, subcategory: string | undefined, abv: number | undefined | null, currentSpiritId: string) => {
        if (!category) return [];

        // Fetch a broader pool to filter from
        // (We use a broad filter rather than exact ABV matches since Firestore REST doesn't easily support complex range queries with ORs without composite indexes)
        const candidatesRes = await db.getSpirits({
            category,
            isPublished: true,
        });
        const candidates = Array.isArray(candidatesRes) ? candidatesRes : [];

        // 1. Filter out the current spirit
        // 2. Filter out non-indexable Tier B spirits
        let validCandidates = candidates.filter((s: any) => s.id !== currentSpiritId && isIndexableSpirit(s));

        // Sort by relevance (subcategory match first, then closest ABV)
        const validAbv = typeof abv === 'number' ? abv : null;

        validCandidates.sort((a: any, b: any) => {
            // Boost exact subcategory matches
            const aSubMatch = a.subcategory === subcategory ? 1 : 0;
            const bSubMatch = b.subcategory === subcategory ? 1 : 0;
            if (aSubMatch !== bSubMatch) {
                return bSubMatch - aSubMatch;
            }

            // If both match or neither match, sort by closest ABV
            if (validAbv !== null) {
                const aAbv = typeof a.abv === 'number' ? a.abv : 0;
                const bAbv = typeof b.abv === 'number' ? b.abv : 0;
                const aDiff = Math.abs(aAbv - validAbv);
                const bDiff = Math.abs(bAbv - validAbv);
                return aDiff - bDiff;
            }

            return 0;
        });

        // Return top 6
        return validCandidates.slice(0, 6);
    },
    ['related-spirits-cache'], // Cache key prefix
    {
        revalidate: 86400, // Revalidate every 24 hours (86400 seconds)
        tags: ['related-spirits'],
    }
);
