/**
 * Get rating color classes based on score
 * 
 * @param rating - Rating score (0-5)
 * @returns Object with background, text, and border color classes
 */
export function getRatingColor(rating: number) {
    if (rating < 3) {
        // Red for poor ratings
        return {
            bg: 'bg-red-500/10',
            text: 'text-red-600 dark:text-red-400',
            border: 'border-red-500/20'
        };
    } else if (rating >= 3 && rating < 3.5) {
        // Yellow for average ratings
        return {
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-600 dark:text-yellow-400',
            border: 'border-yellow-500/20'
        };
    } else if (rating >= 3.5 && rating < 4) {
        // Green for good ratings
        return {
            bg: 'bg-green-500/10',
            text: 'text-green-600 dark:text-green-400',
            border: 'border-green-500/20'
        };
    } else {
        // Blue for excellent ratings
        return {
            bg: 'bg-blue-500/10',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-500/20'
        };
    }
}
