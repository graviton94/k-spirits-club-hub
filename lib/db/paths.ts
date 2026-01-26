/**
 * Compatibility wrapper for path-config.ts
 * Provides object-based API for client-side Firebase SDK usage
 */
import { getAppPath as getAppPathUtil, APP_ID } from './path-config';

export { APP_ID };

/**
 * Get Firestore paths with object-based API
 * Compatible with client-side Firebase SDK
 */
export const getAppPath = (appId: string = APP_ID) => ({
    // Master data (root collection)
    spirits: getAppPathUtil('spirits'),

    // Public reviews (flattened structure for easy product/user queries)
    reviews: getAppPathUtil('reviews'),

    // User-specific private cabinet
    userCabinet: (userId: string) => getAppPathUtil('userCabinet', { userId })
});
