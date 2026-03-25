import { SpiritCategory } from '../types'

export const goldriesling: SpiritCategory = {
    slug: 'goldriesling',
    emoji: '🥂',
    nameKo: '골트리슬링',
    nameEn: 'Goldriesling',
    taglineKo: '작센의 숨겨진 보석, 이른 아침의 이슬 같은 청량함',
    taglineEn: 'The hidden gem of Saxony, early morning freshness like dew',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '골트리슬링(Goldriesling)은 독일 작센(Saxony) 지역에서만 주로 발견되는 매우 희귀한 화이트 품종입니다. 리슬링보다 일찍 익는 특성을 지니며, 이름처럼 황금빛을 띠는 와인은 상쾌한 산미와 가벼운 과실향, 그리고 깔끔한 미네랄리티가 조화를 이룹니다. 작센 지역의 독특한 기후와 테루아를 가장 잘 보여주는 로컬 특산주로 사랑받고 있습니다.',
        history: '1893년 프랑스 알자스(Alsace)의 전설적인 육종가 크리스티앙 오베를린(Christian Oberlin)에 의해 탄생했습니다. 리슬링과 쿠르티예 프레코스(Courtiller Précoce)의 교배종으로 알려져 있으며, 원래 알자스에서 재배되다가 독일 최동단의 작센 지방으로 옮겨가 정착했습니다. 다른 지역에서는 거의 사라졌지만 작센에서는 그 고유의 가치를 인정받아 보존되고 있는 "작센의 유산"과 같은 품종입니다.',
        classifications: [
            { name: 'Sachsen Qualitätswein', criteria: '생산 등급', description: '독일 작센 지역에서 엄격한 품질 관리를 거쳐 생산되는 표준 등급' },
            { name: 'Dry Goldriesling', criteria: '당도 스타일', description: '설탕 잔량을 최소화하여 품종 특유의 바삭한 산미를 극대화한 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '리슬링보다는 부드럽지만 충분히 상쾌한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '라이트 바디의 가볍고 투명한 질감' },
            { label: '아로마 (Aroma)', metric: '강도', value: 'Medium', description: '은은한 허브와 감귤류의 아로마' }
        ],
        flavorTags: [
            { label: '시트러스', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '야생화', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '조기 수확', description: '서늘한 기후에서도 잘 익는 특성을 활용하여 신선한 산도가 정점일 때 수확합니다.' },
            { step: '발효', name: '스테인리스 탱크 발효', description: '작센 테루아의 미네랄리티와 과실 본연의 향을 위해 중립적인 탱크에서 발효합니다.' }
        ],
        majorRegions: [
            { name: '작센 (Saxony)', description: '전 세계 골트리슬링의 거의 대부분이 재배되는 독일 최동단 산지', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '작센 와인 특유의 가벼움과 신선함이 극대화되는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['신선한 해물 샐러드', '민물 생선 요리', '독일식 아스파라거스 요리']
    },
    sectionsEn: {
        definition: "Goldriesling is a rare white grape variety found almost exclusively in the Saxony (Sachsen) region of Germany. Characterized by its early ripening—earlier than Riesling—it produces wines with a brilliant golden hue, refreshing acidity, and clean minerality. It is cherished as a local specialty that perfectly reflects the unique, cool-climate terroir of Germany's easternmost wine region.",
        history: "Created in 1893 by the legendary Alsatian viticulturist Christian Oberlin, Goldriesling is a cross between Riesling and Courtiller Précoce (also known as Muscat de Saumur). While it originated in Alsace, it eventually found its spiritual home in Saxony. Though it has largely disappeared elsewhere, it remains a protected 'Saxon heritage' variety through dedicated local preservation.",
        classifications: [
            { name: 'Sachsen Qualitätswein', criteria: 'Production Tier', description: 'The standard quality designation for wines produced under strict regional regulations in Saxony.' },
            { name: 'Dry Goldriesling', criteria: 'Sugar Profile', description: 'The most common style, emphasizing the grape’s crisp, flinty acidity with minimal residual sugar.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Softer than Riesling but provides a lively and refreshing backbone.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Light-bodied with a transparent and ethereal mouthfeel.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Subtle notes of fresh herbs, citrus, and spring blossoms.' }
        ],
        flavorTags: [
            { label: 'Citrus', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Wildflowers', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Early Harvest', description: 'Harvested at the peak of fresh acidity, taking advantage of its ability to ripen in cooler conditions.' },
            { step: 'Fermentation', name: 'Stainless Steel Fermentation', description: 'Focuses on preserving the pure mineral character and primary fruit of the Saxon terroir.' }
        ],
        majorRegions: [
            { name: 'Saxony (Sachsen)', description: 'The historic and only significant region where Goldriesling continues to thrive.', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine Glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The ideal range for showcasing the lightness and vibrancy of the variety.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Fresh seafood salads', 'River fish dishes', 'German-style white asparagus (Spargel)']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['골트리슬링', 'goldriesling']
}
