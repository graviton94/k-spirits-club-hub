/**
 * Get the default fallback image for a spirit
 * @param _category - (Deprecated) Previously used for category-based fallbacks
 * @returns Path to the universal fallback image (WebP format)
 */
export function getCategoryFallbackImage(_category?: string): string {
    return '/mys-4.webp';
}
