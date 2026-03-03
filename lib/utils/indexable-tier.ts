import { Spirit } from '@/lib/db/schema';

/**
 * SEO Tier Classification for Spirit Pages
 *
 * Tier A (Indexable): High-quality pages with sufficient content
 * Tier B (Non-indexable): Thin content pages that should use noindex
 *
 * This helps Google focus on quality content and avoid "Discovered - currently not indexed" issues.
 */

/**
 * Determine if a spirit page should be indexed by search engines.
 *
 * Tier A Requirements (ALL must be met):
 * - name exists
 * - abv exists
 * - category exists
 * - At least 1 image (imageUrl or thumbnailUrl)
 * - description (ko or en) >= 300 characters
 *
 * @param spirit - Spirit object to evaluate
 * @returns true if spirit meets Tier A criteria (indexable), false for Tier B (noindex)
 */
export function isIndexableSpirit(spirit: Spirit | null | undefined): boolean {
  if (!spirit) return false;

  // Check required fields
  const hasName = !!spirit.name;
  const hasAbv = typeof spirit.abv === 'number';
  const hasCategory = !!spirit.category;
  const hasImage = !!(spirit.imageUrl || spirit.thumbnailUrl);

  // Check description length (300+ chars in either Korean or English)
  const descKo = spirit.metadata?.description_ko || spirit.description_ko || '';
  const descEn = spirit.metadata?.description_en || spirit.description_en || '';
  const hasDescription = descKo.length >= 300 || descEn.length >= 300;

  // All conditions must be met for Tier A
  return hasName && hasAbv && hasCategory && hasImage && hasDescription;
}

/**
 * Get the robots meta tags for a spirit based on its tier.
 *
 * Tier A: { index: true, follow: true } (implicit default, can be omitted)
 * Tier B: { index: false, follow: true } (noindex but allow link following)
 *
 * @param spirit - Spirit object to evaluate
 * @returns Robots meta object or null if default indexing should apply
 */
export function getSpiritRobotsMeta(spirit: Spirit | null | undefined): { index: boolean; follow: boolean } | null {
  const indexable = isIndexableSpirit(spirit);

  if (indexable) {
    // Tier A: Allow indexing (default behavior, can return null)
    return null;
  }

  // Tier B: Prevent indexing but allow following links
  return {
    index: false,
    follow: true,
  };
}
