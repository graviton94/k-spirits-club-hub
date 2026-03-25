import { SpiritCategory } from '../types'

export const petitManseng: SpiritCategory = {
    slug: 'petit-manseng',
    emoji: '🍯',
    nameKo: '프티 망상',
    nameEn: 'Petit Manseng',
    taglineKo: '피레네의 황금빛 보석, 높은 산도와 감미로운 열대 과실의 변주',
    taglineEn: 'The golden jewel of the Pyrenees, high acidity and luscious tropical fruit variations',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '프티 망상(Petit Manseng)은 프랑스 남서부 쥐랑송(Jurançon) 지역을 대표하는 고귀한 화이트 품종입니다. 껍질이 두꺼워 늦게까지 나무에 매달려 건조(Passerillage)되기에 적합하며, 이를 통해 미칠 듯한 산도와 농축된 당도를 동시에 지닌 경이로운 밸런스를 보여줍니다. 잘 익은 파인애플, 망고 같은 열대 과실 향과 함께 톡 쏘는 레몬 풍미가 일품입니다.',
        history: '피레네 산맥 인근의 베아른(Béarn) 지역이 고향이며, 수 세기 동안 프랑스 왕실의 사랑을 받아왔습니다. 전설에 따르면 나바라의 앙리 4세가 태어났을 때, 그의 입술에 쥐랑송 와인을 발라 축복했다고 전해질 만큼 역사적 권위가 대단합니다. "작은(Petit)"이라는 이름처럼 알이 작고 수확량은 적지만, 그만큼 풍미가 응축되어 세계 최고의 화이트 포도 중 하나로 평가받습니다.',
        classifications: [
            { name: 'Jurançon Moelleux', criteria: '당도 스타일', description: '자연적으로 건조된 포도로 만든 향기롭고 진한 프리미엄 스위트 와인' },
            { name: 'Jurançon Sec', criteria: '드라이 스타일', description: '프티 망상의 높은 산미와 열대 과실향을 깔끔하게 살린 드라이 화이트' },
            { name: 'Late Harvest Virginian', criteria: '신대륙 스타일', description: '최근 미국 버지니아 주에서 생산되어 큰 호평을 받고 있는 상급 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '10/10', description: '달콤한 와인조차 개운하게 만드는 극강의 산미' },
            { label: '당도 (Sweetness)', metric: '농도', value: '9/10', description: '포도나무에서 자연 건조되어 얻은 순수하고 진한 당미' },
            { label: '아로마 (Aroma)', metric: '강도', value: 'High', description: '파인애플, 마르멜로, 오렌지 꽃의 강렬한 조화' }
        ],
        flavorTags: [
            { label: '파인애플', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '마르멜로 (Quince)', color: 'bg-orange-100/20 text-orange-700' },
            { label: '벌꿀', color: 'bg-amber-100/20 text-amber-800' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '파스리아쥬 (Passerillage)', description: '포도를 바로 따지 않고 포도나무에서 자연적으로 말려 수분을 날리고 당분을 농축시킵니다.' },
            { step: '발효', name: '나무 배럴 발효', description: '복합미를 더하기 위해 주로 작은 오크통에서 서서히 발효를 진행합니다.' }
        ],
        majorRegions: [
            { name: '쥐랑송 (Jurançon)', description: '프티 망상의 위대함이 결정되는 피레네 산기슭의 절대 성지', emoji: '🇫🇷' },
            { name: '버지니아 (Virginia)', description: '프티 망상의 새로운 잠재력을 폭발시키고 있는 신세대의 산지', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립형 화이트 또는 소형 디저트 와인 글라스',
            optimalTemperatures: [
                { temp: '10-12°C', description: '특유의 높은 산도와 열대 과실 아로마가 가장 화사하게 피어오르는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['푸아그라와 망고 처트니', '숙성된 블루 치즈', '매운맛의 사천 요리', '말린 과일 디저트']
    },
    sectionsEn: {
        definition: "Petit Manseng is a noble white grape variety of Southwest France, most famously associated with the Jurançon region. Distinguished by its thick skins, it is uniquely suited for 'Passerillage' (natural drying on the vine), resulting in a miraculous balance of electric acidity and concentrated sweetness. Its flavor profile is dominated by exotic notes of ripe pineapple, mango, and a zesty lemon-like finish.",
        history: "Native to the Béarn region near the Pyrenees, Petit Manseng has enjoyed royal favor for centuries. Legend has it that at the birth of Henry IV of France, the infant’s lips were touched with Jurançon wine for blessing, cementing its historical prestige. Though low-yielding and small-berried (hence 'Petit'), its extreme flavor concentration has earned it a reputation as one of the world's finest white grapes.",
        classifications: [
            { name: 'Jurançon Moelleux', criteria: 'Sugar Style', description: 'A fragrant, luscious premium sweet wine made from naturally raisined grapes on the vine.' },
            { name: 'Jurançon Sec', criteria: 'Dry Style', description: "The grape's high acidity and tropical bouquet expressed in a clean, bone-dry format." },
            { name: 'Late Harvest Virginian', criteria: 'New World Style', description: 'Modern, high-quality expressions from Virginia that have gained international acclaim.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '10/10', description: 'Possesses immense natural acidity that cuts through even the richest sweetness.' },
            { label: 'Sweetness', metric: 'Intensity', value: '9/10', description: 'Derived from natural desiccation on the vine, offering pure and dense sugar concentration.' },
            { label: 'Aroma', metric: 'Complexity', value: 'High', description: 'Intense harmony of pineapple, quince, candies citrus, and orange blossom.' }
        ],
        flavorTags: [
            { label: 'Pineapple', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Quince', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Honey', color: 'bg-amber-100/20 text-amber-800' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Passerillage', description: 'Grapes are left on the vine to dry naturally, evaporating water and concentrating sugars and acids.' },
            { step: 'Fermentation', name: 'Barrel Fermentation', description: 'Typically fermented slowly in small oak barrels to introduce textural complexity and longevity.' }
        ],
        majorRegions: [
            { name: 'Jurançon', description: 'The absolute spiritual home for Petit Manseng at the foothills of the Pyrenees.', emoji: '🇫🇷' },
            { name: 'Virginia', description: 'A rising New World powerhouse exploring the versatile potential of the variety.', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped White or Small Dessert Wine glass',
            optimalTemperatures: [
                { temp: '10–12°C', description: 'Ideal for showcasing its aromatic tropical intensity and hallmark high acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Foie Gras with mango chutney', 'Aged blue cheeses', 'Spicy Szechuan cuisine', 'Dried fruit desserts']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['프티 망상', 'petit manseng']
}
