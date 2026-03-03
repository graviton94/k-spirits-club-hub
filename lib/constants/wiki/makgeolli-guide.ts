import { SpiritCategory } from './types'

export const makgeolliGuide: SpiritCategory = {
    slug: 'makgeolli-guide',
    emoji: '🍶',
    nameKo: 'Makgeolli Guide',
    nameEn: 'Makgeolli Guide',
    taglineKo: '한국의 소울, 서민의 술 막걸리 가이드',
    taglineEn: 'The traditional Korean unfiltered rice wine',
    color: 'emerald',
    sections: {
        definition: "Makgeolli is Korea's oldest alcoholic beverage. It is an unfiltered, lightly sparkling rice wine with a milky, opaque color and a slightly sweet, tangy, and astringent flavor profile.",
        history: "Dating back to the Three Kingdoms era, Makgeolli was traditionally brewed by farmers and served as both a nutritional supplement and a refreshing beverage during agricultural labor.",
        classifications: [
            {
                name: "Unpasteurized (Saeng) Makgeolli",
                criteria: "Contains live yeast and lactic acid bacteria.",
                description: "Must be refrigerated and has a short shelf life. Offers complex, evolving flavors and natural carbonation."
            },
            {
                name: "Pasteurized Makgeolli",
                criteria: "Heat-treated to stop fermentation.",
                description: "Can be stored at room temperature for months. Flavor is consistent but lacks the lively tang of the unpasteurized version."
            }
        ],
        sensoryMetrics: [
            {
                metric: "ABV",
                label: "Alcohol By Volume",
                value: "6% ~ 9%",
                description: "Most commercial Makgeolli is around 6% ABV, making it easily drinkable."
            }
        ],
        coreIngredients: [
            {
                type: "Primary",
                name: "Rice and Wheat",
                description: "Traditionally made entirely of rice, though wheat became common during post-war rice shortages. Modern premium brands use 100% domestic rice."
            },
            {
                type: "Fermentation",
                name: "Nuruk",
                description: "A traditional wild fermentation starter containing yeast, lactic acid bacteria, and mold that breaks down starches."
            }
        ],
        manufacturingProcess: [
            {
                step: "Brewing",
                name: "Single or Multiple Stage Fermentation",
                description: "Rice, water, and Nuruk are mixed and fermented. Premium Makgeolli undergoes multiple additions of rice and water to boost alcohol content and sweetness without artificial additives."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Traditional nickel or brass bowls (Yangpun).",
            optimalTemperatures: [
                {
                    temp: "Chilled (4-8°C)",
                    description: "Best served cold to highlight its refreshing, crisp characteristics."
                }
            ],
            methods: [
                {
                    name: "Shake Well",
                    description: "Since it is unfiltered, the rice sediment settles at the bottom. It must be gently shaken or stirred before pouring."
                }
            ]
        },
        flavorTags: [
            { label: "Milky Sweetness", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "Lactic Tang", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "Earthy Nutty", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "Korean Pancakes (Jeon, Pajeon, Bindaetteok)",
            "Spicy Stir-fried Pork",
            "Tofu with Sautéed Kimchi (Dubu Kimchi)",
            "Acorn Jelly Salad (Dotorimuk)"
        ],
        dbCategories: ['탁주']
    }
}
