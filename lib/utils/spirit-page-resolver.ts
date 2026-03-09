import { cache } from 'react';
import { Spirit } from '@/lib/db/schema';
import { isIndexableSpirit } from './indexable-tier';
import { db } from '@/lib/db/index';

/**
 * Route-level state model for spirit detail pages.
 *
 * FOUND_INDEXABLE  – spirit exists and meets Tier A quality threshold (index, follow)
 * FOUND_THIN       – spirit exists but is below quality threshold (noindex, follow)
 * NOT_FOUND        – spirit document does not exist → must return 404/410
 * TRANSIENT_FAILURE – fetch failed due to a backend/network error → must NOT return 200 shell
 */
export type SpiritPageState =
  | { status: 'FOUND_INDEXABLE'; spirit: Spirit; fetchMs: number }
  | { status: 'FOUND_THIN'; spirit: Spirit; fetchMs: number }
  | { status: 'NOT_FOUND'; fetchMs: number }
  | { status: 'TRANSIENT_FAILURE'; error: string; fetchMs: number };

/**
 * Resolve the render state for a spirit detail page.
 *
 * Uses React's `cache()` so both `generateMetadata` and the page component
 * share a single fetch per request — eliminating any chance of them seeing
 * different data or triggering double network calls.
 *
 * Error classification:
 *   - `null` returned by db.getSpirit  → NOT_FOUND
 *   - thrown error                      → TRANSIENT_FAILURE
 */
export const resolveSpiritPageState = cache(
  async (id: string): Promise<SpiritPageState> => {
    const start = performance.now();

    try {
      const spirit = await db.getSpirit(id);
      const fetchMs = Math.round(performance.now() - start);

      if (!spirit) {
        console.log(
          `[SpiritResolver] id=${id} status=NOT_FOUND fetchMs=${fetchMs}ms`
        );
        return { status: 'NOT_FOUND', fetchMs };
      }

      const indexable = isIndexableSpirit(spirit);
      const status = indexable ? 'FOUND_INDEXABLE' : 'FOUND_THIN';

      console.log(
        `[SpiritResolver] id=${id} status=${status} fetchMs=${fetchMs}ms`
      );

      return { status, spirit, fetchMs };
    } catch (error: unknown) {
      const fetchMs = Math.round(performance.now() - start);
      const errMsg =
        error instanceof Error ? error.message : String(error);

      console.error(
        `[SpiritResolver] id=${id} status=TRANSIENT_FAILURE fetchMs=${fetchMs}ms error=${errMsg}`
      );

      return { status: 'TRANSIENT_FAILURE', error: errMsg, fetchMs };
    }
  }
);
