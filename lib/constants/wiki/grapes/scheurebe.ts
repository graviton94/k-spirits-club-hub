import { SpiritCategory } from '../types'

export const scheurebe: SpiritCategory = {
    slug: 'scheurebe',
    emoji: '🍂',
    nameKo: '쇼이레베',
    nameEn: 'Scheurebe',
    taglineKo: '독일의 향기로운 발견, 자몽과 블랙커런트 잎의 화사한 조화',
    taglineEn: 'The aromatic discovery of Germany, a brilliant harmony of grapefruit and blackcurrant leaves',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '쇼이레베(Scheurebe)는 독일에서 탄생한 가장 성공적인 교배 품종 중 하나로, 리슬링과 실바너의 특징을 절묘하게 결합한 화이트 품종입니다. 매우 강렬하고 개성 있는 아로마를 지녀 "독일의 소비뇽 블랑" 이라는 별칭으로도 불립니다. 잘 익은 자몽, 꿀, 그리고 블랙커런트 잎(Cassis)의 독특한 향이 특징이며, 드라이한 스타일부터 달콤한 디저트 와인까지 넓은 스펙트럼에서 뛰어난 품질을 보여줍니다.',
        history: '1916년 독일의 식물육종가 게오르크 쇼(Georg Scheu)에 의해 탄생했습니다. 오랫동안 실바너와 리슬링의 교배종으로 알려졌으나, 최근 유전자 분석 결과 리슬링과 불명의 야생 품종이 섞인 것으로 밝혀졌습니다. 제2차 세계대전 이후 독일에서 큰 인기를 얻었으며, 특히 팔츠(Pfalz)와 라인헤센(Rheinhessen) 지역의 뜨거운 태양 아래에서 쇼이레베 특유의 이국적인 향기가 완성되었습니다.',
        classifications: [
            { name: 'Dry Scheurebe', criteria: '당도 스타일', description: '자몽과 허브의 신선함이 돋보이는 모던하고 깔끔한 드라이 화이트' },
            { name: 'Scheurebe Beerenauslese', criteria: '디저트 스타일', description: '귀부 현상을 통해 꿀과 열대 과실의 농축미를 극대화한 프리미엄 디저트 와인' },
            { name: 'Pfalz Classic', criteria: '산지 스타일', description: '일조량이 풍부한 팔츠 지역에서 생산되는 전형적인 이국적 풍미의 쇼이레베' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '강도', value: '10/10', description: '블랙커런트 잎과 자몽의 코를 찌르는 강렬한 아로마' },
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '리슬링을 닮은 활기차고 날카로운 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '적당한 바디감과 매끄러운 목 넘김' }
        ],
        flavorTags: [
            { label: '자몽', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '블랙커런트 잎', color: 'bg-green-100/20 text-green-800' },
            { label: '패션프루트', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '단기 침출', description: '쇼이레베 특유의 강렬한 테르펜 성분을 추출하기 위해 짧은 시간 껍질과 함께 침출합니다.' },
            { step: '발효', name: '중립적 저온 발효', description: '이국적인 아로마를 보존하기 위해 산소를 차단하고 차가운 스테인리스 탱크에서 발효합니다.' }
        ],
        majorRegions: [
            { name: '팔츠 (Pfalz)', description: '가장 화려하고 농축된 쇼이레베가 탄생하는 독일의 대표 산지', emoji: '🇩🇪' },
            { name: '라인헤센 (Rheinhessen)', description: '다양한 스타일의 쇼이레베를 탐구하는 혁신적인 생산자들이 모인 곳', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 화이트 또는 리슬링 전용 글라스',
            optimalTemperatures: [
                { temp: '8-11°C', description: '특유의 이국적인 아로마와 산미가 가장 세련되게 살아나는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['태국식 샐러드', '매콤한 아시안 퀴진', '디저트 소르베', '강한 향의 치즈']
    },
    sectionsEn: {
        definition: "Scheurebe is one of Germany's most successful crossings, a white variety that ingeniously combines the elegance of Riesling with its own distinctively bold personality. Often dubbed as 'Germany's answer to Sauvignon Blanc,' it is prized for its intensely aromatic profile. Characterized by ripe grapefruit, honey, and the unmistakable scent of blackcurrant (cassis) leaves, it achieves excellence across a broad spectrum of styles, from bone-dry to luscious dessert wines.",
        history: "Created in 1916 by the viticulturist Georg Scheu, the grape was long thought to be a cross between Silvaner and Riesling. Recent DNA analysis, however, has identified it as a cross between Riesling and an unknown variety. It gained significant popularity in post-WWII Germany, particularly in the Pfalz and Rheinhessen regions, where the warmer climate allowed its exotic and tropical nuances to fully develop.",
        classifications: [
            { name: 'Dry Scheurebe', criteria: 'Sugar Style', description: 'Modern, clean expressions focused on the freshness of grapefruit and crushed herbs.' },
            { name: 'Scheurebe Beerenauslese', criteria: 'Dessert Style', description: 'Premium botrytized wines offering extreme concentrations of honey and exotic fruit.' },
            { name: 'Pfalz Classic', criteria: 'Regional Style', description: 'Representing the quintessential Scheurebe profile: solar, concentrated, and unapologetically aromatic.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Intensity', value: '10/10', description: 'A powerful and sharp bouquet led by blackcurrant leaf and pink grapefruit.' },
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Vibrant and Riesling-like, providing a refreshing structural frame.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Possesses a medium bodily presence and a supple, silken texture.' }
        ],
        flavorTags: [
            { label: 'Grapefruit', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Blackcurrant Leaf', color: 'bg-green-100/20 text-green-800' },
            { label: 'Passion Fruit', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Short Skin Contact', description: 'Utilized to extract the variety’s specific terpene compounds that carry its intense aromatic load.' },
            { step: 'Fermentation', name: 'Cool Stainless Steel Fermentation', description: 'Conducted in an oxygen-free environment to protect the variety’s volatile exotic aromatics.' }
        ],
        majorRegions: [
            { name: 'Pfalz', description: 'Germany’s premier region for the most opulent and aromatic expressions of Scheurebe.', emoji: '🇩🇪' },
            { name: 'Rheinhessen', description: 'Home to innovative producers exploring the full stylistic versatility of the variety.', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White or dedicated Riesling glass',
            optimalTemperatures: [
                { temp: '8–11°C', description: 'The ideal range for letting the exotic aromatics and zesty acidity shine with precision.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Thai beef salad', 'Spicy Asian fusion', 'Fruit sorbets', 'Strongly flavored cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['쇼이레베', 'scheurebe']
}
