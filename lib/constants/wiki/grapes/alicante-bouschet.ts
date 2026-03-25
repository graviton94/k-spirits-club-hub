import { SpiritCategory } from '../types'

export const alicanteBouschet: SpiritCategory = {
    slug: 'alicante-bouschet',
    emoji: '🩸',
    nameKo: '알리칸트 부셰',
    nameEn: 'Alicante Bouschet',
    taglineKo: '속까지 붉은 강렬함, 와인에 깊은 색채를 더하다',
    taglineEn: 'Red to the core, adding deep intensity to wine',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '알리칸트 부셰(Alicante Bouschet)는 드문 "탱튀리에(Teinturier)" 품종 중 하나로, 껍질뿐만 아니라 과육까지 붉은색을 띠어 매우 진하고 어두운 색상의 와인을 생산합니다. 강력한 바디감과 거친 타닌, 그리고 풍부한 검은 과실 풍미가 특징이며, 주로 와인의 색상과 구조감을 보강하기 위한 블렌딩 파트너로 사랑받아 왔으나 최근에는 포르투갈 등을 중심으로 뛰어난 품질의 단일 품종 와인으로도 각광받고 있습니다.',
        history: '1855년 프랑스의 루이 부셰(Louis Bouschet)와 그의 아들 앙리 부셰(Henri Bouschet)가 프티 부셰(Petit Bouschet)와 그르나슈(Grenache)를 교배하여 탄생시켰습니다. 19세기 후반 필록세라 이후 프랑스에서 널리 재배되었으며, 미국 금주법 시대에는 두꺼운 껍질 덕분에 장거리 운송에 유리하여 가정용 양조 포도로 큰 인기를 끌었습니다. 현재는 포르투갈의 알렌테주 지역에서 가장 고귀한 레드 품종 중 하나로 대우받으며 제2의 전성기를 누리고 있습니다.',
        classifications: [
            { name: 'Single Varietal', criteria: '병입 스타일', description: '알렌테주 등지에서 생산되는 묵직하고 복합적인 스타일' },
            { name: 'Blending Partner', criteria: '역할', description: '색상과 타닌 보강을 위해 소량 첨가되는 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '강력하고 잉크처럼 묵직함' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '8/10', description: '견고하고 힘 있는 타닌' },
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '불투명할 정도로 진한 보랏빛' }
        ],
        flavorTags: [
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-950' },
            { label: '다크 초콜릿', color: 'bg-amber-950/20 text-amber-950' },
            { label: '검은 후추', color: 'bg-stone-600/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: '추출', name: '장기 침출', description: '과육의 색상과 타닌을 최대한 추출하기 위해 발효 전후로 긴 침출 과정을 거칩니다.' },
            { step: '숙성', name: '오크 숙성', description: '거친 타닌을 부드럽게 하고 복합미를 더하기 위해 프렌치 또는 아메리칸 오크통에서 12개월 이상 숙성하는 경우가 많습니다.' }
        ],
        majorRegions: [
            { name: '알렌테주 (Alentejo)', description: '현재 세계에서 가장 고품질의 알리칸트 부셰가 생산되는 곳', emoji: '🇵🇹' },
            { name: '남프랑스 (Southern France)', description: '전통적인 재배지이자 블렌딩의 중심지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '보르도 스타일 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '복합적인 풍미와 타닌이 조화롭게 느껴지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['강렬한 양념의 스테이크', '멧돼지 요리', '숙성된 하드 치즈'],
    },
    sectionsEn: {
        definition: "Alicante Bouschet is one of the rare 'Teinturier' varieties, featuring red flesh in addition to its red skin, which produces wines of exceptionally deep and dark color. Characterized by a powerful body, rugged tannins, and rich black fruit flavors, it has long been prized as a blending partner for reinforcing color and structure. Recently, it has gained acclaim as a stand-alone premium varietal, particularly in regions like Portugal.",
        history: "Created in 1855 by Louis Bouschet and his son Henri, this grape is a cross between Petit Bouschet and Grenache. It saw widespread planting in France after the 19th-century Phylloxera crisis and became immensely popular in the US during Prohibition due to its thick skins, which allowed for safe long-distance shipping. Today, it is revered as one of the most noble red varieties in Portugal's Alentejo region, experiencing a significant renaissance.",
        classifications: [
            { name: 'Single Varietal', criteria: 'Bottling Style', description: 'A bold and complex style commonly produced in Alentejo.' },
            { name: 'Blending Partner', criteria: 'Role', description: 'Added in small amounts to bolster color and tannic structure.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '9/10', description: 'Powerful and inky heaviness.' },
            { label: 'Tannins', metric: 'Astringency', value: '8/10', description: 'Firm and forceful tannins.' },
            { label: 'Color', metric: 'Density', value: '10/10', description: 'Deep purple, reaching near-opacity.' }
        ],
        flavorTags: [
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-950' },
            { label: 'Dark Chocolate', color: 'bg-amber-950/20 text-amber-950' },
            { label: 'Black Pepper', color: 'bg-stone-600/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: 'Extraction', name: 'Long Maceration', description: 'Extensive skin contact before and after fermentation to maximize color and tannin extraction.' },
            { step: 'Aging', name: 'Oak Maturation', description: 'Often aged for 12+ months in French or American oak to refine rugged tannins and add complexity.' }
        ],
        majorRegions: [
            { name: 'Alentejo', description: "The premier global source for high-quality Alicante Bouschet today.", emoji: '🇵🇹' },
            { name: 'Southern France', description: 'The traditional homeland and a primary hub for blending styles.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Bordeaux Style Red Wine Glass',
            optimalTemperatures: [
                { temp: '16-18°C', description: 'The ideal range for balancing its complex aromas and tannic structure.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Richly seasoned steaks', 'Wild boar dishes', 'Aged hard cheeses'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['알리칸트 부셰', 'alicante bouschet']
}
