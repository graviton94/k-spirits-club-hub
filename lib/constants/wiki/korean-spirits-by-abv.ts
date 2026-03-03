import { SpiritCategory } from './types'

export const koreanSpiritsByAbv: SpiritCategory = {
    slug: 'korean-spirits-by-abv',
    emoji: '📈',
    nameKo: 'Spirits by ABV Guide',
    nameEn: 'Korean Spirits by ABV',
    taglineKo: '취향과 주량에 맞춘 도수별 한국 주류 가이드',
    taglineEn: 'Find the perfect Korean spirit for your tolerance and taste',
    color: 'indigo',
    sections: {
        definition: "Korean spirits span an incredibly wide range of alcohol by volume (ABV), from gentle, sessionable fermented rice wines to intensely potent cask-strength craft whiskies.",
        history: "Traditionally, ABV was governed by natural fermentation limits and simple distillation. Today, advanced techniques, strict taxation tiers, and shifting consumer preferences drive the diverse offerings in the modern market.",
        classifications: [
            {
                name: "Low ABV (5% - 15%)",
                criteria: "Fermented brews like Makgeolli, Beer, and light Fruit Wines.",
                description: "Characterized by high residual sugars, natural carbonation, and food-friendly profiles. Ideal for casual dining and extended drinking sessions."
            },
            {
                name: "Mid ABV (16% - 25%)",
                criteria: "Diluted Soju, Cheongju, and sweet Liqueurs.",
                description: "The sweet spot for Korean communal dining. Strong enough to cleanse the palate of rich BBQ or spicy stews, but gentle enough to be consumed neat."
            },
            {
                name: "High ABV (30% - 60%+)",
                criteria: "Premium Distilled Soju, Korean Whisky, and Brandy.",
                description: "Designed for slow sipping, contemplation, and complex flavor journeys. Often barrel-aged or matured in traditional pottery."
            }
        ],
        sensoryMetrics: [
            {
                metric: "The Bite",
                label: "Alcohol Burn",
                value: "Variable",
                description: "While high ABV spirits naturally possess more heat, premium distillation techniques and long maturation periods can make a 45% distilled soju feel smoother than a harsh 16% diluted bottle."
            }
        ],
        coreIngredients: [
            {
                type: "Science",
                name: "Water Quality",
                description: "The quality of the dilution water is paramount, especially for mid-ABV spirits like green-bottle Soju, fundamentally shaping the final mouthfeel."
            }
        ],
        manufacturingProcess: [
            {
                step: "Adjusting Strength",
                name: "Dilution vs Cask Strength",
                description: "Spirits are typically distilled to a high proof and then proofed down with pure water before bottling. 'Cask Strength' offerings skip this dilution step, delivering unfiltered intensity."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Varies wildly depending on the category.",
            optimalTemperatures: [
                {
                    temp: "Rule of Thumb",
                    description: "Generally, lower ABV spirits should be served chilled, while higher ABV, complex spirits benefit from room temperature."
                }
            ],
            methods: [
                {
                    name: "Pacing",
                    description: "High ABV spirits should be sipped slowly or diluted with water/ice to uncover hidden aromas."
                }
            ]
        },
        flavorTags: [
            { label: "Smooth & Light", color: "bg-indigo-400/20 text-indigo-950 dark:text-indigo-300" },
            { label: "Intense Burn", color: "bg-red-600/20 text-red-950 dark:text-red-300" },
            { label: "Warm Chest", color: "bg-orange-500/20 text-orange-950 dark:text-orange-300" }
        ],
        foodPairing: [
            "Low ABV: Savory Pancakes, Spicy Food",
            "Mid ABV: Seafood, Korean BBQ",
            "High ABV: Dark Chocolate, Cigar, Charcuterie"
        ],
        dbCategories: ['소주', '위스키', '탁주']
    }
}
