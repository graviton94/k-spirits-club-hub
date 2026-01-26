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

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';

export type PathType = 'spirits' | 'reviews' | 'userCabinet';

/**
 * Get the Firestore path for a given path type
 * @param type - The type of path to retrieve
 * @param params - Optional parameters (userId for userCabinet)
 * @returns The full Firestore path
 */
export function getAppPath(type: PathType, params?: { userId?: string }): string {
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
 * Get the full document path including document ID
 * @param type - The type of path to retrieve
 * @param params - Parameters including document ID
 * @returns The full document path
 */
export function getDocumentPath(
  type: PathType,
  params: { userId?: string; documentId: string }
): string {
  const basePath = getAppPath(type, params);
  return `${basePath}/${params.documentId}`;
}
