import { SpiritCategory } from './types'

export const koreanSoju: SpiritCategory = {
    slug: 'korean-soju',
    emoji: '🍶',
    nameKo: 'Korean Soju Guide',
    nameEn: 'Korean Soju Guide',
    taglineKo: '쌀과 누룩으로 빚어낸 한국 전통의 정수',
    taglineEn: 'The traditional Korean spirit, distilled from rice and koji',
    color: 'sky',
    sections: {
        definition: "Soju is arguably the most recognizable spirit from Korea. Originally a traditional distilled spirit made from rice, it evolved into both the ubiquitously popular diluted green-bottle format and the premium traditional distilled format.",
        history: "Historically imported from the Yuan Dynasty during the Goryeo period, Soju was traditionally a distilled spirit. In modern times, to combat rice shortages, diluted soju made from neutral spirits and sweeteners became a staple.",
        classifications: [
            {
                name: "Distilled Soju (Traditional)",
                criteria: "Distilled from rice and fermentation starters (Nuruk).",
                description: "Offers a deep, complex flavor profile retaining the rich savory notes of the underlying grain. Ranges from 20% to over 50% ABV."
            },
            {
                name: "Diluted Soju (Green Bottle)",
                criteria: "Made by diluting neutral spirits and adding sweeteners.",
                description: "Clean, crisp, and slightly sweet. Easily accessible and pairs perfectly with casual Korean dining and spicy foods."
            }
        ],
        sensoryMetrics: [
            {
                metric: "ABV",
                label: "Alcohol By Volume",
                value: "16% ~ 53%",
                description: "Diluted soju usually sits around 16-17%, while premium distilled soju can reach over 40-50%."
            }
        ],
        coreIngredients: [
            {
                type: "Primary",
                name: "Rice or Tapioca/Sweet Potato",
                description: "Distilled soju relies on high-quality rice. Diluted soju uses cheaper starches like tapioca."
            }
        ],
        manufacturingProcess: [
            {
                step: "Fermentation",
                name: "Nuruk Fermentation",
                description: "Traditional soju relies on Nuruk (a fermentation starter) to breakdown rice starches into alcohol."
            },
            {
                step: "Distillation",
                name: "Pot Still vs Column Still",
                description: "Premium soju is pot-distilled to retain flavor, while diluted soju is continuously distilled into pure ethanol."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Soju shot glass or tulip tasting glass for premium.",
            optimalTemperatures: [
                {
                    temp: "Chilled (4-8°C)",
                    description: "Best for diluted green-bottle soju to mask the harsh alcohol bite."
                },
                {
                    temp: "Room Temperature (18-20°C)",
                    description: "Best for premium distilled soju to release complex grain aromas."
                }
            ]
        },
        flavorTags: [
            { label: "Clean", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" },
            { label: "Savory Grain", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "Subtle Sweetness", color: "bg-pink-500/20 text-zinc-950 dark:text-pink-300" }
        ],
        foodPairing: [
            "Korean BBQ (Pork Belly / Samgyeopsal)",
            "Spicy Stews (Kimchi Jjigae)",
            "Sashimi",
            "Korean Fried Chicken"
        ],
        dbCategories: ['소주']
    }
}
