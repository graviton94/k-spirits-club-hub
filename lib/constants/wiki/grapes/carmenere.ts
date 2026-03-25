import { SpiritCategory } from '../types'

export const carmenere: SpiritCategory = {
    slug: 'carmenere',
    emoji: '🍂',
    nameKo: '카르메네르',
    nameEn: 'Carmenère',
    taglineKo: '보르도의 잃어버린 아이, 칠레에서 다시 피어난 매혹적인 스파이스',
    taglineEn: 'The lost child of Bordeaux, captivating spice reborn in Chile',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '카르메네르(Carmenère)는 한때 보르도 블렌딩의 주요 품종이었으나 필록세라 이후 프랑스에서 거의 사라졌다가, 칠레에서 메를로로 오인되어 재배되던 중 극적으로 재발견된 "잃어버린 품종"입니다. 깊은 진홍색과 풍부한 타닌, 그리고 잘 익은 자두와 딸기향에 더해진 피망, 유칼립투스, 코코아 같은 독특한 스파이시함이 특징입니다. 충분히 익지 않았을 때는 강한 풀 향이 날 수 있어, 긴 생육 기간을 통한 완숙이 품질의 핵심입니다.',
        history: '18세기 보르도의 메도크 지역에서 가장 널리 재배되던 품종 중 하나였으나, 1860년대 필록세라 유행 이후 접목이 어렵고 결실 불량(Coulure)에 취약하다는 이유로 프랑스에서 거의 퇴출되었습니다. 그러나 1994년 프랑스의 앰펠로그라피(Ampelography) 전문가인 장 미셸 부르시코가 칠레의 메를로 밭에서 자라던 일부 포도가 사실은 카르메네르임을 밝혀내며 전 세계적인 화제가 되었습니다. 이후 칠레는 카르메네르를 국가 대표 품종으로 육성하여 세계적인 수준으로 끌어올렸습니다.',
        classifications: [
            { name: 'Estate Style', criteria: '품질 등급', description: '신선한 과실향과 카르메네르 특유의 허브향이 잘 살아있는 스타일' },
            { name: 'Gran Reserva', criteria: '숙성 등급', description: '오크 숙성을 통해 초콜릿, 커피, 바닐라 풍미가 더해진 묵직한 스타일' },
            { name: 'Icon Wine', criteria: '최고급 등급', description: '단일 빈야드에서 생산된 압도적인 구조감과 장기 숙성력을 지닌 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '매우 묵직하고 벨벳 같은 질감' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '7/10', description: '부드럽지만 촘촘한 타닌' },
            { label: '산도 (Acidity)', metric: '청량감', value: '5/10', description: '온화하고 부드러운 산미' }
        ],
        flavorTags: [
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-950' },
            { label: '피망', color: 'bg-green-100/20 text-green-700' },
            { label: '다크 초콜릿', color: 'bg-amber-950/20 text-amber-950' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '늦수확 (Late Harvest)', description: '피망 같은 풋내를 줄이고 잘 익은 과실향을 얻기 위해 메를로보다 훨씬 늦게 수확합니다.' },
            { step: '숙성', name: '오크 숙성', description: '강력한 스파이스 풍미를 조화롭게 하기 위해 프렌치 오크통에서 12-18개월간 숙성합니다.' }
        ],
        majorRegions: [
            { name: '콜차구아 밸리 (Colchagua Valley)', description: '칠레 카르메네르의 정점이자 세계적인 산지', emoji: '🇨🇱' },
            { name: '카차포알 밸리 (Cachapoal Valley)', description: '고급 카르메네르 와인이 탄생하는 또 다른 명산지', emoji: '🇨🇱' }
        ],
        servingGuidelines: {
            recommendedGlass: '보르도 스타일 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 스파이시한 향과 리치한 질감이 가장 잘 살아나는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['매콤한 양념의 고기 요리', '구운 야채와 안심 스테이크', '칠레 전통 요리(엠파나다)'],
    },
    sectionsEn: {
        definition: "Carmenère is the 'lost child' of Bordeaux, once a staple of the region's blends but nearly wiped out in France post-Phylloxera. Historically confused with Merlot in Chile, it was dramatically rediscovered in the 1990s. It is characterized by deep crimson color, rich tannins, and a unique flavor profile of ripe plum and strawberry intertwined with green bell pepper, eucalyptus, and cocoa. Achieving full ripeness is crucial to transforming its vegetal notes into complex spices.",
        history: "In the 18th century, it was one of the most widely planted varieties in the Médoc, Bordeaux. However, its susceptibility to coulure (poor fruit set) led to its abandonment in France after the 1860s. Its modern history changed in 1994 when French ampelographer Jean-Michel Boursiquot identified that much of the 'Chilean Merlot' was actually Carmenère. Chile has since embraced it as its national flagship grape, producing world-class expressions that cannot be found elsewhere.",
        classifications: [
            { name: 'Estate Style', criteria: 'Quality Tier', description: 'A style highlighting fresh fruit and the variety’s characteristic herbal notes.' },
            { name: 'Gran Reserva', criteria: 'Aging Tier', description: 'A fuller-bodied style with added notes of chocolate, coffee, and vanilla from oak aging.' },
            { name: 'Icon Wine', criteria: 'Premium Tier', description: 'Exceptional wines from single vineyards with immense structure and aging potential.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'Full-bodied with a velvety, rich texture.' },
            { label: 'Tannins', metric: 'Astringency', value: '7/10', description: 'Smooth, integrated, yet dense tannins.' },
            { label: 'Acidity', metric: 'Crispness', value: '5/10', description: 'Moderate and soft acidity.' }
        ],
        flavorTags: [
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-950' },
            { label: 'Green Bell Pepper', color: 'bg-green-100/20 text-green-700' },
            { label: 'Dark Chocolate', color: 'bg-amber-950/20 text-amber-950' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Late Harvesting', description: 'Harvested much later than Merlot to ensure the green pyrazines (bell pepper notes) convert into ripe fruit and spice.' },
            { step: 'Aging', name: 'Oak Maturation', description: 'Typically aged for 12–18 months in French oak to harmonize its bold spice and structural richness.' }
        ],
        majorRegions: [
            { name: 'Colchagua Valley', description: 'The premier destination for the finest Chilean Carmenère.', emoji: '🇨🇱' },
            { name: 'Cachapoal Valley', description: 'Another world-class region renowned for sophisticated Carmenère production.', emoji: '🇨🇱' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Bordeaux Style Red Wine Glass',
            optimalTemperatures: [
                { temp: '16-18°C', description: 'The range that perfectly showcases its spicy bouquet and rich texture.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Spiced meat dishes', 'Grilled vegetables and tenderloin', 'Traditional Empanadas'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['카르메네르', 'carmenere']
}
