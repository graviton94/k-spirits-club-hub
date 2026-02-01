/**
 * Utility to provide optimized image URLs via wsrv.nl proxy.
 * This significantly reduces bandwidth and improves loading speed on Cloudflare Pages.
 * 
 * Documentation: https://weserv.nl/
 */
export function getOptimizedImageUrl(url: string | null | undefined, width = 400, quality = 75): string {
    if (!url) return '';

    // Don't optimize local assets or data URLs
    if (url.startsWith('/') || url.startsWith('data:') || url.includes('localhost') || url.includes('127.0.0.1')) {
        return url;
    }

    // Use wsrv.nl proxy for resizing and WebP conversion
    try {
        const encodedUrl = encodeURIComponent(url);
        // w: width, q: quality, output: format (webp), fit: cover (crop to fit)
        // We use contain for product images to avoid cutting off bottles
        return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&q=${quality}&output=webp&fit=contain`;
    } catch (e) {
        console.warn('[ImageOptimization] Failed to encode URL:', url);
        return url; // Fallback to original
    }
}
