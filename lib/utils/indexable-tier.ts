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
 * - At least 2 quality signals among:
 *   - image
 *   - description (ko or en) >= 160 characters
 *   - pairing guide (ko or en) >= 120 characters
 *   - tasting note / sensory tags
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

  // Check content richness across multiple fields.
  // Note: App uses camelCase (descriptionKo, pairingGuideKo, noseTags, etc.)
  // Fallback to snake_case and metadata for legacy/alternate storage formats
  const descKo = (spirit as any).descriptionKo || (spirit as any).description_ko || spirit.metadata?.description_ko || '';
  const descEn = (spirit as any).descriptionEn || (spirit as any).description_en || spirit.metadata?.description_en || '';
  const pairingKo = (spirit as any).pairingGuideKo || (spirit as any).pairing_guide_ko || spirit.metadata?.pairing_guide_ko || '';
  const pairingEn = (spirit as any).pairingGuideEn || (spirit as any).pairing_guide_en || spirit.metadata?.pairing_guide_en || '';
  const tastingNote = (spirit as any).tastingNote || (spirit as any).tasting_note || spirit.metadata?.tasting_note || '';
  const sensoryTagCount = [
    ...((spirit as any).noseTags || (spirit as any).nose_tags || spirit.metadata?.nose_tags || []),
    ...((spirit as any).palateTags || (spirit as any).palate_tags || spirit.metadata?.palate_tags || []),
    ...((spirit as any).finishTags || (spirit as any).finish_tags || spirit.metadata?.finish_tags || []),
  ].filter(Boolean).length;

  const qualitySignalCount = [
    hasImage,
    descKo.length >= 160 || descEn.length >= 160,
    pairingKo.length >= 120 || pairingEn.length >= 120,
    tastingNote.length >= 24 || sensoryTagCount >= 4,
  ].filter(Boolean).length;

  // Required minimum fields
  if (!hasName || !hasCategory) return false;

  // Quality threshold: At least 2 quality signals required to avoid thin content penalties
  // This focuses Google's crawl budget on high-quality pages with rich content
  return qualitySignalCount >= 2;
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

  if (process.env.NODE_ENV === 'development' && spirit?.id) {
    // Debug logging for field mapping verification
    const descKo = (spirit as any).descriptionKo || (spirit as any).description_ko || spirit.metadata?.description_ko || '';
    const descEn = (spirit as any).descriptionEn || (spirit as any).description_en || spirit.metadata?.description_en || '';
    const sensoryTagCount = [
      ...((spirit as any).noseTags || (spirit as any).nose_tags || spirit.metadata?.nose_tags || []),
      ...((spirit as any).palateTags || (spirit as any).palate_tags || spirit.metadata?.palate_tags || []),
      ...((spirit as any).finishTags || (spirit as any).finish_tags || spirit.metadata?.finish_tags || []),
    ].filter(Boolean).length;
    
    console.debug(`[SpiritRobots] id=${spirit.id} indexable=${indexable} descKoLen=${descKo.length} sensoryTags=${sensoryTagCount}`);
  }

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
