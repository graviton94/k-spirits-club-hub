/**
 * Utility functions for converting between different Spirit type representations
 */

import { Spirit as DbSpirit } from '@/lib/db/schema';
import { Spirit as FlavorSpirit, UserReview } from '@/lib/utils/flavor-engine';

/**
 * Converts a database Spirit to the format expected by flavor-engine components
 */
export function toFlavorSpirit(dbSpirit: DbSpirit, userReview?: UserReview): FlavorSpirit {
  return {
    id: dbSpirit.id,
    name: dbSpirit.name,
    category: dbSpirit.category,
    subcategory: dbSpirit.subcategory || undefined,
    abv: dbSpirit.abv,
    imageUrl: dbSpirit.imageUrl || undefined,
    distillery: dbSpirit.distillery || undefined,
    isWishlist: false,
    userReview: userReview,
    metadata: dbSpirit.metadata as any
  };
}

/**
 * Triggers the login modal by clicking the login button
 * 
 * NOTE: This is a temporary solution using DOM manipulation.
 * In the future, this should be replaced with a proper method
 * from the auth context (e.g., auth.showLoginModal()).
 * 
 * The function looks for a button with aria-label="Login" and clicks it.
 * If not found, it falls back to redirecting to /login page.
 */
export function triggerLoginModal() {
  const loginButton = document.querySelector('[aria-label="Login"]') as HTMLElement;
  if (loginButton) {
    loginButton.click();
  } else {
    // Fallback: redirect to login page if button not found
    window.location.href = '/login';
  }
}

/**
 * Type for cabinet items returned from getUserCabinet
 */
export interface CabinetItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  abv: number;
  imageUrl?: string | null;
  distillery?: string | null;
  isWishlist?: boolean;
  userReview?: UserReview;
  addedAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional fields from DbSpirit
}
