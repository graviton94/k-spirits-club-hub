import { SpiritCategory } from '../types'

export const furmint: SpiritCategory = {
    slug: 'furmint',
    emoji: '🍯',
    nameKo: '푸르민트',
    nameEn: 'Furmint',
    taglineKo: '황금빛 유산, 토카이의 영혼을 담은 위대한 변주곡',
    taglineEn: 'Golden legacy, a grand variation of the soul of Tokaj',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '푸르민트(Furmint)는 헝가리 토카이(Tokaj) 지역을 상징하는 가장 고귀한 화이트 품종입니다. 놀라울 정도의 산도와 높은 당도 축적 능력을 동시에 지녀, 바삭하고 드라이한 화이트 와인부터 세계 최고의 귀부 와인인 "토카이 아쑤(Tokaji Aszú)"까지 폭넓은 스펙트럼을 자랑합니다. 잘 익은 사과와 살구, 그리고 꿀 같은 풍미와 함께 화산 토양 특유의 강렬한 미네랄리티가 특징입니다.',
        history: '13세기경 헝가리에 정착한 것으로 추정되는 역사가 깊은 품종입니다. 특히 1650년대경 이미 귀부병(Botrytis)을 이용한 아쑤 와인 생산이 문서화되었을 정도로 귀부 와인의 역사와 궤를 같이합니다. 한때 공산 정권 하에서 대량 생산용 품종으로 전락하기도 했으나, 1990년대 이후 전 세계적인 투자와 현대 양조 기술을 통해 다시금 세계 최고의 화이트 와인 중 하나라는 명성을 되찾았습니다.',
        classifications: [
            { name: 'Dry Furmint', criteria: '당도 스타일', description: '귀부병 없이 수확하여 높은 산도와 스틸 같은 미네랄리티를 강조한 드라이 와인' },
            { name: 'Tokaji Aszú', criteria: '귀부 농축 등급', description: '귀부된 포도로 만든 당밀 같은 농축미와 산도가 조화를 이루는 전설적인 디저트 와인' },
            { name: 'Late Harvest', criteria: '수확 시기', description: '아쑤보다는 가볍지만 과실의 달콤함과 풍미가 농축된 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '9/10', description: '설탕 같은 달콤함도 이겨내는 압도적이고 날카로운 산미' },
            { label: '미네랄 (Minerality)', metric: '풍미 강도', value: '8/10', description: '화산 암반의 미네랄과 연기 느낌의 뉘앙스' },
            { label: '숙성력 (Aging)', metric: '잠재력', value: 'High', description: '수십 년간 진화할 수 있는 강력한 구조감' }
        ],
        flavorTags: [
            { label: '살구', color: 'bg-orange-200/20 text-orange-700' },
            { label: '마르멜로', color: 'bg-yellow-200/20 text-yellow-800' },
            { label: '꿀', color: 'bg-amber-100/20 text-amber-700' }
        ],
        manufacturingProcess: [
            { step: '귀부 현상 (Botrytis)', name: '노블 롯 유도', description: '안개 낀 아침과 화창한 오후의 반복을 통해 포도를 자연적으로 건조시키고 농축합니다.' },
            { step: '침출', name: '아쑤 반죽 혼합', description: '건조된 아쑤 포도를 베이스 와인에 담가 풍미를 추출하는 독특한 방식을 거칩니다.' }
        ],
        majorRegions: [
            { name: '토카이-헤지얄라 (Tokaj-Hegyalja)', description: '유네스코 세계 유산으로 지정된 푸르민트의 영원한 성지', emoji: '🇭🇺' },
            { name: '쇼믈로 (Somló)', description: '작지만 강렬한 화산 토양의 미네랄리티를 보여주는 또 다른 헝가리 산지', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '화이트 와인 혹은 스위트 와인 전용 글라스',
            optimalTemperatures: [
                { temp: '10-13°C', description: '복합적인 향과 높은 산도가 가장 아름답게 조화를 이루는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['푸아그라', '블루 치즈', '매우 매콤한 태국 요리(드라이 스타일)', '살구 타르트']
    },
    sectionsEn: {
        definition: "Furmint is the most noble white grape variety of Hungary, especially synonymous with the Tokaj region. Possessing a rare combination of high acidity and immense sugar potential, it spans a breathtaking spectrum from bone-dry, terroir-driven whites to the world’s most legendary botrytized dessert wine, 'Tokaji Aszú.' Its profile is defined by ripe apple, apricot, honey, and an intense volcanic minerality.",
        history: "Believed to have settled in Hungary around the 13th century, Furmint's history is inextricably linked to Tokaji Aszú, with documented botrytized wine production dating back to the 1650s. After a period of volume-focused production during the communist era, the 1990s marked a global renaissance. Today, Furmint is celebrated once again as one of the world's greatest white varieties, capable of profound complexity and longevity.",
        classifications: [
            { name: 'Dry Furmint', criteria: 'Sugar Profile', description: 'A non-botrytized style highlighting steely minerality and vibrant, high acidity.' },
            { name: 'Tokaji Aszú', criteria: 'Botrytis Concentration', description: 'A legendary sweet wine where high residual sugar is perfectly balanced by electric acidity.' },
            { name: 'Late Harvest', criteria: 'Harvest Timing', description: 'A lighter sweet style with concentrated fruit flavors, harvesting later than standard table grapes.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '9/10', description: 'Piercing and sharp, providing a structure that can balance extreme sweetness.' },
            { label: 'Minerality', metric: 'Depth', value: '8/10', description: 'Reflects volcanic soils with notes of smoke and crushed stone.' },
            { label: 'Aging', metric: 'Potential', value: 'High', description: 'Excellent structural integrity that allows for decades of cellar evolution.' }
        ],
        flavorTags: [
            { label: 'Apricot', color: 'bg-orange-200/20 text-orange-700' },
            { label: 'Quince', color: 'bg-yellow-200/20 text-yellow-800' },
            { label: 'Honey', color: 'bg-amber-100/20 text-amber-700' }
        ],
        manufacturingProcess: [
            { step: 'Botrytis', name: 'Noble Rot Induction', description: 'Humid mornings followed by sunny afternoons naturally concentrate sugars and flavors in the berries.' },
            { step: 'Maceration', name: 'Aszú Dough Blending', description: 'Dried Aszú berries are soaked in base wine or must to extract their incredible concentrated essence.' }
        ],
        majorRegions: [
            { name: 'Tokaj-Hegyalja', description: "A UNESCO World Heritage site and the spiritual heart of Furmint production.", emoji: '🇭🇺' },
            { name: 'Somló', description: 'A small but powerful volcanic region known for distinctively mineral Furmint wines.', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'White Wine or Dedicated Sweet Wine Glass',
            optimalTemperatures: [
                { temp: '10–13°C', description: 'The ideal range to harmonize its high acidity with varied flavor profiles.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Foie Gras', 'Blue cheese', 'Spicy Thai cuisine (Dry style)', 'Apricot tart']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['푸르민트', 'furmint']
}
