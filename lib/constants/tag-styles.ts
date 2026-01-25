import metadata from './spirits-metadata.json';

export interface TagStyle {
    bg: string;
    text: string;
    border: string;
}

export interface DualThemeTagStyle {
    light: TagStyle;
    dark: TagStyle;
}

// Pre-calculate tag map for faster lookup
const tagMap: Record<string, DualThemeTagStyle> = {};

const initializeTagMap = () => {
    const { tag_index } = metadata;

    // Iterate through all categories (nose, palate, finish)
    Object.values(tag_index).forEach((category: any) => {
        // Iterate through all groups in category (e.g., fruit_orchard_citrus)
        Object.values(category).forEach((group: any) => {
            if (group.tags && group.colors) {
                group.tags.forEach((tag: string) => {
                    tagMap[tag.toLowerCase()] = group.colors;
                });
            }
        });
    });
};

initializeTagMap();

// Default styles if tag is not found
const DEFAULT_STYLE: DualThemeTagStyle = {
    light: { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
    dark: { bg: "#1F2937", text: "#D1D5DB", border: "#374151" }
};

/**
 * Returns the theme-aware styles for a given spirit tag.
 * @param tagName The tag string (e.g., "#레몬제스트")
 * @returns DualThemeTagStyle containing light and dark schemes.
 */
export function getTagStyle(tagName: string): DualThemeTagStyle {
    const normalized = tagName.toLowerCase().trim();
    return tagMap[normalized] || DEFAULT_STYLE;
}
