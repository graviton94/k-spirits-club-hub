/**
 * Centralized Firestore path configuration utility
 * Ensures consistent path structure across the application
 * 
 * Path Structure:
 * - spirits: Root collection for spirit master data
 * - users: Root collection for user master data
 * - artifacts/{appId}/public/data/reviews: Public reviews
 * - artifacts/{appId}/users/{userId}/cabinet: User cabinet (private)
 */

export const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';

export type PathType = 'spirits' | 'reviews' | 'userCabinet';

/**
 * Get the Firestore path for a given path type (legacy function-based API)
 * @param type - The type of path to retrieve
 * @param params - Optional parameters (userId for userCabinet)
 * @returns The full Firestore path
 */
export function getAppPathUtil(type: PathType, params?: { userId?: string }): string {
  switch (type) {
    case 'spirits':
      // Root collection
      return 'spirits';

    case 'reviews':
      // Public reviews under artifacts namespace
      return `artifacts/${APP_ID}/public/data/reviews`;

    case 'userCabinet':
      // User cabinet under artifacts namespace (requires userId)
      if (!params?.userId) {
        throw new Error('userId is required for userCabinet path');
      }
      return `artifacts/${APP_ID}/users/${params.userId}/cabinet`;

    default:
      throw new Error(`Unknown path type: ${type}`);
  }
}

/**
 * Get Firestore paths with object-based API (new required format)
 * This is the single source of truth for path configuration
 * @param appId - Application ID (defaults to APP_ID constant)
 * @returns Object with path getters
 */
export const getAppPath = (appId: string = APP_ID) => ({
  spirits: `spirits`, // Root collection
  reviews: `artifacts/${appId}/public/data/reviews`,
  userCabinet: (userId: string) => `artifacts/${appId}/users/${userId}/cabinet`,
  spiritReviews: (spiritId: string) => `artifacts/${appId}/spirits/${spiritId}/reviews`,
  userReviews: (userId: string) => `artifacts/${appId}/users/${userId}/reviews`,
  recentReviews: `artifacts/${appId}/public/data/recent_reviews`,
  trendingDaily: (date: string) => `artifacts/${appId}/public/trending/daily/${date}`,
  trendingGlobal: `artifacts/${appId}/public/trending/global`
});

/**
 * Get the full document path including document ID
 * @param type - The type of path to retrieve
 * @param params - Parameters including document ID
 * @returns The full document path
 */
export function getDocumentPath(
  type: PathType,
  params: { userId?: string; documentId: string }
): string {
  const basePath = getAppPathUtil(type, params);
  return `${basePath}/${params.documentId}`;
}
