/**
 * Get the default fallback image for a spirit based on its category
 * @param category - The category of the spirit
 * @returns Path to the default image
 */
export function getCategoryFallbackImage(category: string): string {
    const categoryLower = category.toLowerCase();

    // 위스키, 일반증류주, 브랜디 -> mys(1).png
    if (categoryLower.includes('위스키') ||
        categoryLower.includes('일반증류주') ||
        categoryLower.includes('브랜디') ||
        categoryLower.includes('whisky') ||
        categoryLower.includes('whiskey') ||
        categoryLower.includes('brandy')) {
        return '/mys(1).png';
    }

    // 탁주, 약주 -> mys(2).png
    if (categoryLower.includes('탁주') ||
        categoryLower.includes('약주') ||
        categoryLower.includes('막걸리')) {
        return '/mys(2).png';
    }

    // 청주, 소주 -> mys(4).png
    if (categoryLower.includes('청주') ||
        categoryLower.includes('소주') ||
        categoryLower.includes('sake')) {
        return '/mys(4).png';
    }

    // 기타주류, 맥주, 리큐르 -> mys(3).png
    if (categoryLower.includes('기타') ||
        categoryLower.includes('맥주') ||
        categoryLower.includes('리큐르') ||
        categoryLower.includes('beer') ||
        categoryLower.includes('liqueur')) {
        return '/mys(3).png';
    }

    // 과실주 -> mys(3).png (mys(5).png doesn't exist)
  if (categoryLower.includes('과실주') ||
      categoryLower.includes('fruit') ||
      categoryLower.includes('wine')) {
    return '/mys(3).png';
  }
  
  // Default fallback
  return '/mys(1).png';
}
