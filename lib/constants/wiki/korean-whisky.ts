import { SpiritCategory } from './types'

export const koreanWhisky: SpiritCategory = {
    slug: 'korean-whisky',
    emoji: '🥃',
    nameKo: 'Korean Whisky Guide',
    nameEn: 'Korean Whisky Guide',
    taglineKo: '대한민국 크래프트 위스키의 태동',
    taglineEn: 'The rise of Korean single malt whiskies',
    color: 'amber',
    sections: {
        definition: "Korean Whisky represents a burgeoning sector of the global spirits industry, marked by passionate craft distillers pioneering single malt production in Korea's unique climate.",
        history: "While early 'whiskies' in Korea were often blends of imported scotch and local spirits, the modern era has seen the establishment of true craft distilleries like Ki One (Three Societies) and Gimpo Paju (Kim Chang Soo) focused on authentic single malt production.",
        classifications: [
            {
                name: "Korean Single Malt",
                criteria: "Mashed, fermented, distilled, and matured entirely in Korea.",
                description: "Characterized by rapid maturation due to Korea's extreme seasonal temperature swings, pulling deep oak flavors quickly."
            }
        ],
        sensoryMetrics: [
            {
                metric: "ABV",
                label: "Alcohol By Volume",
                value: "40% ~ 58%",
                description: "Many craft releases are offered at Cask Strength to showcase their intense, unbridled character."
            }
        ],
        coreIngredients: [
            {
                type: "Primary",
                name: "Malted Barley",
                description: "Often imported from traditional sources like the UK or Australia, though some distilleries experiment with local peat and grains."
            }
        ],
        manufacturingProcess: [
            {
                step: "Maturation",
                name: "The Angel's Share & Climate",
                description: "Korea's hot, humid summers and freezing winters cause dramatic expansion and contraction in the barrels, leading to aggressive oak extraction and a uniquely high 'Angel's Share' (evaporation rate) compared to Scotland."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn or traditional snifter.",
            optimalTemperatures: [
                {
                    temp: "Room Temperature (20°C)",
                    description: "Best enjoyed neat to appreciate the rapid maturation profile."
                }
            ],
            methods: [
                {
                    name: "Neat or with a few drops of water",
                    description: "To open up the intense spice and oak notes."
                }
            ]
        },
        flavorTags: [
            { label: "Spicy Oak", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "Intense Vanilla", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "Dried Fruit", color: "bg-red-900/20 text-zinc-950 dark:text-red-300" }
        ],
        foodPairing: [
            "Dark Chocolate",
            "Korean Beef (Hanwoo) Steak",
            "Smoked Charcuterie",
            "Cigar pairings"
        ],
        dbCategories: ['위스키']
    }
}
