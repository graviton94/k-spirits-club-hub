import { SpiritCategory } from '../types'

export const aramon: SpiritCategory = {
    slug: 'aramon',
    emoji: '🌿',
    nameKo: '아라몽',
    nameEn: 'Aramon',
    taglineKo: '랑그독의 옛 영광, 다산과 풍요의 역사적 증인',
    taglineEn: 'The old glory of Languedoc, a historic witness to abundance',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '아라몽(Aramon)은 프랑스 남부 랑그독(Languedoc) 지역에서 한때 가장 많이 재배되었던 레드 품종입니다. 엄청난 생산량과 가벼운 타닌, 그리고 낮은 알코올 도수가 특징이며, 과거 프랑스인들의 일상을 책임졌던 대중적인 테이블 와인의 주역이었습니다. 현대에 이르러서는 재배 면적이 크게 줄었으나, 고목(Old Vine)에서 수확한 포도로 만든 아라몽은 예상외의 복합미와 신선한 산미를 보여주며 독특한 테루아를 선사합니다.',
        history: '19세기 중반부터 20세기 중반까지 랑그독-루시용 지역의 광활한 평야를 지배했던 품종입니다. 특히 철도망의 발달로 남부의 와인이 파리 등 대도시로 대량 공급될 때 그 중심에 있었습니다. 필록세라 이후에도 강한 생명력으로 살아남아 "랑그독의 기둥" 역할을 했으나, 20세기 후반 품질 위주의 와인 생산으로 트렌드가 바뀌면서 카베르네 소비뇽이나 시라 등에 자리를 내주게 되었습니다. 현재는 일부 열정적인 생산자들에 의해 역사적 가치를 지닌 품종으로 보존되고 있습니다.',
        classifications: [
            { name: 'Traditional Table Wine', criteria: '역할', description: '매일 마시는 가볍고 편안한 스타일의 대중적인 와인' },
            { name: 'Old Vine Aramon', criteria: '품질 등급', description: '수십 년 된 고목에서 소량 생산되어 집중도 높은 풍미를 가진 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '2/10', description: '매우 가볍고 물처럼 부드러움' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '2/10', description: '거의 느껴지지 않을 정도의 낮은 타닌' },
            { label: '산도 (Acidity)', metric: '청량감', value: '6/10', description: '생기 있고 깨끗한 산미' }
        ],
        flavorTags: [
            { label: '라즈베리', color: 'bg-red-200/20 text-red-600' },
            { label: '야생 딸기', color: 'bg-red-100/20 text-red-500' },
            { label: '허브', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '단기 탄소 침출 (Carbonic Maceration)', description: '품종 고유의 신선한 과실향을 극대화하기 위해 짧은 발효 과정을 거칩니다.' },
            { step: '병입', name: '스테인리스 탱크 보관', description: '오크 숙성 없이 신선함을 유지한 채 빠르게 병입하여 소비합니다.' }
        ],
        majorRegions: [
            { name: '랑그독 (Languedoc)', description: '아라몽의 고향이자 역사적인 최대 생산지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '일반 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '12-14°C', description: '약간 시원하게 마실 때 특유의 청량감이 돋보이는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 파스타', '샤퀴테리(살라미, 하몬)', '간단한 샌드위치'],
    },
    sectionsEn: {
        definition: "Aramon is a historic red grape variety that once dominated the vast plains of the Languedoc in Southern France. Known for its extraordinary yields, light tannins, and lower alcohol content, it was the primary grape behind the everyday table wines that fueled France for over a century. While its presence has significantly decreased, modern expressions from 'Vieilles Vignes' (old vines) offer unexpected complexity and a refreshing, unique terroir experience.",
        history: "From the mid-19th to the mid-20th century, Aramon was the most planted variety in the Languedoc-Roussillon region. It played a central role during the expansion of the French railways, allowing southern wines to be mass-transported to major cities like Paris. Although it survived the Phylloxera crisis due to its vigor, it was gradually replaced by higher-quality international varieties toward the end of the 20th century. Today, dedicated producers preserve it as a vital part of French Viticultural heritage.",
        classifications: [
            { name: 'Traditional Table Wine', criteria: 'Role', description: 'A light-bodied, easy-drinking style intended for daily consumption.' },
            { name: 'Old Vine Aramon', criteria: 'Quality Tier', description: 'Limited production from ancient vines, resulting in more concentrated and structured flavors.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '2/10', description: 'Very light and fluid on the palate.' },
            { label: 'Tannins', metric: 'Astringency', value: '2/10', description: 'Soft, almost imperceptible tannins.' },
            { label: 'Acidity', metric: 'Crispness', value: '6/10', description: 'Vibrant and clean acidity.' }
        ],
        flavorTags: [
            { label: 'Raspberry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Wild Strawberry', color: 'bg-red-100/20 text-red-500' },
            { label: 'Herbs', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Short Carbonic Maceration', description: 'A brief fermentation technique used to maximize the fresh fruit aromas inherent to the variety.' },
            { step: 'Bottling', name: 'Stainless Steel Storage', description: 'Typically bottled early without oak aging to maintain its characteristic freshness.' }
        ],
        majorRegions: [
            { name: 'Languedoc', description: 'The ancestral home and historically the largest production zone for Aramon.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard Red Wine Glass',
            optimalTemperatures: [
                { temp: '12-14°C', description: 'Best served slightly chilled to emphasize its refreshing, fruit-driven character.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light pasta dishes', 'Charcuterie (Salami, Jamón)', 'Casual sandwiches'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['아라몽', 'aramon']
}
