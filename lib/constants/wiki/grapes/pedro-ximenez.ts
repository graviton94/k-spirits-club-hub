import { SpiritCategory } from '../types'

export const pedroXimenez: SpiritCategory = {
    slug: 'pedro-ximenez',
    emoji: '🍯',
    nameKo: '페드로 히메네스 (PX)',
    nameEn: 'Pedro Ximénez',
    taglineKo: '액체 상태의 보석, 안달루시아의 태양이 응축된 달콤함의 극치',
    taglineEn: 'Liquid gemstones, the ultimate sweetness condensed by the Andalusian sun',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '페드로 히메네스(Pedro Ximénez, 줄여서 PX)는 세계에서 가장 달콤하고 농축된 와인을 만드는 화이트 품종입니다. 수확한 포도를 강렬한 태양 아래서 말려 당분을 극대화하는 과정을 거치며, 이렇게 탄생한 와인은 잉크처럼 짙은 갈색을 띠고 건포도, 무화과, 대추야자, 그리고 다크 초콜릿의 폭발적인 풍미를 선사합니다. 셰리의 가장 화려한 변주이자 디저트 와인의 황제라 불립니다.',
        history: '이름에 대해서는 네덜란드 군인 "피터 시몬(Peter Siemens)"이 독일에 있던 포도를 스페인으로 가져왔다는 전설이 있으나, 실제로는 스페인 남부 안달루시아의 토착 품종인 것으로 알려져 있습니다. 제레즈(Jerez)와 몬티야-모릴레스(Montilla-Moriles) 지역에서 수 세기 동안 재배되어 왔으며, 특히 몬티야 지역의 뜨거운 열기가 이 품종의 당도를 예술의 경지로 끌어올리는 주무대가 되어 왔습니다.',
        classifications: [
            { name: 'PX Sherry', criteria: '주정 강화 스타일', description: '극강의 당도를 가진 시럽 같은 질감의 프리미엄 디저트 셰리' },
            { name: 'Montilla-Moriles PX', criteria: '산지 스타일', description: '전 세계 PX 포도의 대부분이 자라며, 자연스러운 높은 도수와 당도를 지닌 스타일' },
            { name: 'VOS / VORS', criteria: '숙성 등급', description: '20년(VOS) 또는 30년(VORS) 이상 숙성된 깊은 세월의 흔적을 담은 PX' }
        ],
        sensoryMetrics: [
            { label: '당도 (Sweetness)', metric: '농도', value: '10/10', description: '천연 설탕 시럽을 능가하는 압도적인 달콤함' },
            { label: '바디 (Body)', metric: '무게감', value: '10/10', description: '잔을 따라 끈적하게 흐르는 극도로 묵직한 질감' },
            { label: '복합미 (Complexity)', metric: '풍미', value: '9/10', description: '말린 과일, 가죽, 꿀, 커피가 어우러진 다층적인 맛' }
        ],
        flavorTags: [
            { label: '건포도', color: 'bg-stone-800/20 text-stone-900' },
            { label: '말린 무화과', color: 'bg-red-800/20 text-red-950' },
            { label: '다크 초콜릿', color: 'bg-stone-500/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: '건조', name: '아솔레오 (Soleo)', description: '수확한 포도를 볏짚이나 매트 위에 깔고 태양 아래서 열흘 이상 말려 수분을 제거하고 당분을 응축합니다.' },
            { step: '숙성', name: '솔레라 시스템 (Solera)', description: '산화 숙성을 견디며 수십 년간 오크통에서 숙성되어 특유의 짙은 색과 깊은 맛을 얻습니다.' }
        ],
        majorRegions: [
            { name: '몬티야-모릴레스', description: '가장 뛰어난 PX 포도가 자라나는 스페인 안달루시아의 핵심 산지', emoji: '🇪🇸' },
            { name: '제레즈 (Jerez)', description: 'PX 셰리가 최종적으로 완성되고 숙성되는 세계적인 명지', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '소형 디저트 와인 또는 셰리 글라스',
            optimalTemperatures: [
                { temp: '12-14°C', description: '너무 차가우면 점도가 높아지므로 약간 서늘한 상태에서 향을 즐기기에 좋은 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['바닐라 아이스크림 (위에 부어 먹기)', '다크 초콜릿 케이크', '강한 블루 치즈(로크포르 등)', '견과류 타르트']
    },
    sectionsEn: {
        definition: "Pedro Ximénez (often abbreviated as PX) is a white grape variety used to produce some of the world's sweetest and most intensely concentrated dessert wines. By drying the harvested grapes under the fierce Andalusian sun—a process that concentrates their sugars—vintners craft wines that are as dark as ink and thick as syrup. The resulting palate is an explosion of raisins, dried figs, dates, and dark chocolate, widely regarded as the 'Emperor of Dessert Wines.'",
        history: "A charming legend suggests the grape was brought from Germany to Spain by a Dutch soldier named 'Peter Siemens,' but genomic evidence points to it being an indigenous variety of Andalusia. It has flourished for centuries in the Montilla-Moriles and Jerez regions. The intense heat of Montilla, in particular, has proven to be the perfect stage for raising this grape's natural sugar levels to artistic heights.",
        classifications: [
            { name: 'PX Sherry', criteria: 'Fortified Style', description: 'A premium, syrupy dessert Sherry with overwhelming sweetness and depth.' },
            { name: 'Montilla-Moriles PX', criteria: 'Regional Style', description: "The heartland for PX grapes, often reaching such high natural sugars that little or no fortification is required." },
            { name: 'VOS / VORS', criteria: 'Aging Tier', description: 'Extraordinarily old wines aged for over 20 (VOS) or 30 (VORS) years in the Solera system.' }
        ],
        sensoryMetrics: [
            { label: 'Sweetness', metric: 'Intensity', value: '10/10', description: 'Supreme sweetness that exceeds typical natural syrups.' },
            { label: 'Body', metric: 'Weight', value: '10/10', description: 'Extremely viscous, coating the glass with rich, slow-moving legs.' },
            { label: 'Complexity', metric: 'Flavor Profile', value: '9/10', description: 'Multi-layered notes of sundried fruits, molasses, coffee, and roasted nuts.' }
        ],
        flavorTags: [
            { label: 'Raisin', color: 'bg-stone-800/20 text-stone-900' },
            { label: 'Dried Fig', color: 'bg-red-800/20 text-red-950' },
            { label: 'Dark Chocolate', color: 'bg-stone-500/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: 'Drying', name: 'Soleo Process', description: 'Grapes are laid out on mats under the sun for over ten days to dehydrate the berries and concentrate sugars.' },
            { step: 'Maturation', name: 'Solera System', description: 'Decades of oxidative aging in oak barrels develop the wine’s iconic dark color and profound depth.' }
        ],
        majorRegions: [
            { name: 'Montilla-Moriles', description: 'The premier Spanish region where the highest quality PX grapes are naturally cultivated.', emoji: '🇪🇸' },
            { name: 'Jerez', description: 'The absolute benchmark for the aging and finishing of world-class PX Sherries.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Small Dessert Wine or Sherry glass (Copita)',
            optimalTemperatures: [
                { temp: '12–14°C', description: 'Allows the complex aromatics to unfurl without the viscosity becoming too heavy from over-chilling.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Vanilla Ice Cream (poured over as a topping)', 'Dark chocolate cake', 'Piquant blue cheeses (like Roquefort)', 'Nut-based tarts']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['페드로 히메네스', 'pedro ximenez', 'px 셰리', 'px sherry']
}
