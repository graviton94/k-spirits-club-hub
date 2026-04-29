// Server-safe helper — no 'use client' so server components can import freely
export function getRelatedIconKey(label: string, href: string): string {
    const l = label.toLowerCase();
    const h = href.toLowerCase();

    if (h.includes('mbti')) return 'mbti';
    if (h.includes('worldcup')) return 'worldcup';
    if (h.includes('wiki') || l.includes('백과') || l.includes('가이드')) return 'wiki';
    if (h.endsWith('/contents')) return 'hub';
    if (h.includes('news')) return 'news';
    if (h.includes('reviews') || l.includes('리뷰')) return 'reviews';
    if (h.includes('explore') || l.includes('탐색')) return 'explore';

    return 'arrow';
}
