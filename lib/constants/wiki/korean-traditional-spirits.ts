import { SpiritCategory } from './types'

export const koreanTraditionalSpirits: SpiritCategory = {
    slug: 'korean-traditional-spirits',
    emoji: '🏺',
    nameKo: 'Traditional Spirits',
    nameEn: 'Traditional Spirits',
    taglineKo: '다양한 매력의 한국 전통 명주 총망라',
    taglineEn: 'The profound heritage of Korean indigenous liquors',
    color: 'stone',
    sections: {
        definition: "Korean traditional spirits encompass a vast array of indigenous alcoholic beverages meticulously crafted from local agricultural products, preserving the culinary and cultural heritage of the Korean peninsula.",
        history: "Dating back thousands of years to ancient rituals, these spirits were suppressed during the Japanese occupation and subsequent post-war grain preservation laws, but have experienced a vibrant renaissance over the last two decades.",
        classifications: [
            {
                name: "Takju (탁주)",
                criteria: "Cloudy, unfiltered rice wine.",
                description: "The most ancient form, earthy and nourishing. Includes Makgeolli."
            },
            {
                name: "Yakju & Cheongju (약주/청주)",
                criteria: "Clear, refined rice wine.",
                description: "The clarified upper layer of the brew. Delicate, floral, and traditionally reserved for ancestral rites and nobility."
            },
            {
                name: "Soju (소주 - Distilled)",
                criteria: "Distilled from Takju or Cheongju.",
                description: "A potent, clear spirit capturing the fiery essence of the fermented brew."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Complexity",
                label: "Flavor Breadth",
                value: "Exceptionally High",
                description: "Spans from sweet, lactic, and earthy to floral, herbal, and intensely robust."
            }
        ],
        coreIngredients: [
            {
                type: "Foundation",
                name: "Nuruk (누룩)",
                description: "The soul of Korean brewing. A wild fermentation starter that inoculates grains with airborne yeast, fungi, and bacteria, creating flavors irreplicable by pure lab yeasts."
            }
        ],
        manufacturingProcess: [
            {
                step: "Brewing Philosophy",
                name: "Harmony with Nature",
                description: "Rather than isolating specific strains, traditional brewing embraces the chaotic harmony of wild microflora, adapting recipes to the subtle shifts in local climate and seasonal ingredients."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Traditional ceramics or modern wine glasses to capture aromas.",
            optimalTemperatures: [
                {
                    temp: "Varies Wildly",
                    description: "Takju is chilled. Cheongju is often enjoyed slightly chilled or gently warmed. Distilled Soju is enjoyed neat at room temperature."
                }
            ],
            methods: [
                {
                    name: "Ceremonial Respect",
                    description: "Traditionally served with two hands, pouring for others first out of respect."
                }
            ]
        },
        flavorTags: [
            { label: "Earthy Nuruk", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "Floral & Fruity", color: "bg-pink-400/20 text-zinc-950 dark:text-pink-300" },
            { label: "Savory Grain", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "Royal Court Cuisine (Gungjung Eumsik)",
            "Delicate Seafood",
            "Savory Pancakes",
            "Braised Meats"
        ],
        dbCategories: ['소주', '탁주', '약주', '기타주류']
    }
}
