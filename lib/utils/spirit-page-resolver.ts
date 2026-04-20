import { cache } from 'react';
import { Spirit } from '@/lib/db/schema';
import { isIndexableSpirit } from './indexable-tier';
import { dbGetSpirit } from '@/lib/db/data-connect-client';

/**
 * Route-level state model for spirit detail pages.
 */
export type SpiritPageState =
  | { status: 'FOUND_INDEXABLE'; spirit: Spirit; fetchMs: number }
  | { status: 'FOUND_THIN'; spirit: Spirit; fetchMs: number }
  | { status: 'NOT_FOUND'; fetchMs: number }
  | { status: 'TRANSIENT_FAILURE'; error: string; fetchMs: number };

/**
 * Resolve the render state for a spirit detail page.
 */
export const resolveSpiritPageState = cache(
  async (id: string): Promise<SpiritPageState> => {
    const start = performance.now();

    try {
      const sqlSpirit = await dbGetSpirit(id) as any;
      const fetchMs = Math.round(performance.now() - start);

      if (!sqlSpirit) {
        console.log(
          `[SpiritResolver] id=${id} status=NOT_FOUND fetchMs=${fetchMs}ms`
        );
        return { status: 'NOT_FOUND', fetchMs };
      }

      // Public page guard: unpublished spirits must never resolve to a visible page.
      if (sqlSpirit.isPublished !== true) {
        console.warn(
          `[SpiritResolver] id=${id} status=UNPUBLISHED_GUARD fetchMs=${fetchMs}ms`
        );
        return { status: 'NOT_FOUND', fetchMs };
      }

      // Map SQL fields (Data Connect) to the Spirit interface
      const spirit: Spirit = {
        ...sqlSpirit,
        name_en: sqlSpirit.nameEn,
        category: sqlSpirit.category || 'Other',
        mainCategory: sqlSpirit.mainCategory,
        subcategory: sqlSpirit.subcategory,
        description_ko: sqlSpirit.descriptionKo,
        description_en: sqlSpirit.descriptionEn,
        pairing_guide_ko: sqlSpirit.pairingGuideKo,
        pairing_guide_en: sqlSpirit.pairingGuideEn,
        nose_tags: sqlSpirit.noseTags,
        palate_tags: sqlSpirit.palateTags,
        finish_tags: sqlSpirit.finishTags,
        tasting_note: sqlSpirit.tastingNote,
        aggregateRating: {
          ratingValue: sqlSpirit.rating || 0,
          reviewCount: sqlSpirit.reviewCount || 0
        },
        // Attached joined data
        userReviews: sqlSpirit.reviews?.map((r: any) => ({
          ...r,
          userName: r.user?.nickname || 'Guest',
          profileImage: r.user?.profileImage
        })) || [],
        expertReview: sqlSpirit.reviews?.find((r: any) => r.user?.role === 'ADMIN') || null
      } as any;

      const indexable = isIndexableSpirit(spirit);
      const status = indexable ? 'FOUND_INDEXABLE' : 'FOUND_THIN';

      return { status, spirit, fetchMs };
    } catch (error: unknown) {
      const fetchMs = Math.round(performance.now() - start);
      const errMsg = error instanceof Error ? error.message : String(error);
      return { status: 'TRANSIENT_FAILURE', error: errMsg, fetchMs };
    }
  }
);
