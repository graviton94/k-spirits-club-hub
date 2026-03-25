import { SpiritCategory } from '../types'

export const gamay: SpiritCategory = {
    slug: 'gamay',
    emoji: '🍓',
    nameKo: '가메',
    nameEn: 'Gamay',
    taglineKo: '보졸레의 유기적인 기쁨, 붉은 과실의 싱그러움과 매끈한 선율',
    taglineEn: 'The organic joy of Beaujolais, fresh red berries and smooth melodies',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '가메(Gamay, Gamay Noir à Jus Blanc)는 프랑스 보졸레(Beaujolais) 지역을 세계적인 와인 산지로 만든 레드 품종입니다. 껍질이 얇고 타닌이 매우 부드러우며, 신선한 딸기, 라즈베리, 바나나, 그리고 가끔은 캔디 같은 화사한 아로마가 특징입니다. 높은 산도와 경쾌한 바디 덕분에 살짝 차갑게 마셔도 훌륭하며, 누구나 쉽게 즐길 수 있는 접근성을 자랑합니다.',
        history: '원래 부르고뉴의 꼬르 드 오르 지역에서 널리 재배되었으나, 1395년 용맹왕 필립(Philip the Bold) 공작이 "매우 나쁘고 불충실한 품종"이라며 재배를 금지하는 칙령을 내린 것으로 유명합니다. 이 사건을 계기로 가메는 남쪽 보졸레의 화강암 토양으로 밀려났고, 그곳에서 자신의 잠재력을 완벽하게 꽃피우며 오늘날 독보적인 지위를 확립했습니다.',
        classifications: [
            { name: 'Beaujolais Nouveau', criteria: '풍미 스타일', description: '수확 직후 병입하여 신선함과 탄산적 풍미를 극대화한 햇와인' },
            { name: 'Beaujolais-Villages', criteria: '생산 등급', description: '더 복합적인 풍미를 지닌 빌라쥬 등급의 상급 가메 와인' },
            { name: 'Cru Beaujolais', criteria: '최고급 테루아', description: '모르공, 물랭 아 방 등 10개 특정 마을에서 생산되는 장기 숙성이 가능한 최고급 와인' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '매우 가볍고 경쾌한 미디엄 라이트 바디' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '2/10', description: '실크처럼 부드럽고 떫은맛이 거의 없음' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '입을 상쾌하게 만드는 활기찬 산미' }
        ],
        flavorTags: [
            { label: '딸기', color: 'bg-red-200/20 text-red-600' },
            { label: '모란 꽃', color: 'bg-pink-100/20 text-pink-700' },
            { label: '풍선껌', color: 'bg-indigo-100/20 text-indigo-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '탄산 침출 (Carbonic Maceration)', description: '으깨지 않은 포도 송이를 이산화탄소가 가득 찬 탱크에 넣어 안에서부터 발효시키는 독특한 방식으로 바나나향과 부드러운 타닌을 만듭니다.' },
            { step: '숙성', name: '스테인리스/대형 오크 숙성', description: '신선한 과실향을 보존하기 위해 새 오크통보다는 중립적인 용기에서의 숙성을 선호합니다.' }
        ],
        majorRegions: [
            { name: '보졸레 (Beaujolais)', description: '가메 와인의 98%가 생산되는 전 세계 가메의 심장부', emoji: '🇫🇷' },
            { name: '오르가 밸리 (Oregon)', description: '미국에서도 서늘한 기후를 찾아 성공적으로 정착한 산지', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓은 브루고뉴 스타일 글라스',
            optimalTemperatures: [
                { temp: '12-14°C', description: '레드 와인 중에서도 다소 낮게 서빙할 때 특유의 과실 향이 가장 잘 살아납니다.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['로스트 치킨', '샤퀴테리 보드', '가벼운 소스의 생선 요리', '풍성한 샐러드']
    },
    sectionsEn: {
        definition: "Gamay (Gamay Noir à Jus Blanc) is the red grape variety that catapulted France's Beaujolais region to global fame. Characterized by thin skins and low tannins, it features bright, vivacious aromas of strawberry, raspberry, banana, and occasionally confectionery notes. Its naturally high acidity and light-hearted body make it one of the few red wines that performs beautifully when served slightly chilled, offering high accessibility to all levels of enthusiasts.",
        history: "Originally widespread in Burgundy’s Côte d’Or, Gamay was famously outlawed in 1395 by Duke Philip the Bold, who described it as a 'very bad and disloyal plant.' This decree pushed the variety south to the granite-rich soils of Beaujolais, where it found its perfect match. Today, after centuries of refinement, Gamay from Beaujolais is recognized as a unique and indispensable category in the world of wine.",
        classifications: [
            { name: 'Beaujolais Nouveau', criteria: 'Flavor Style', description: 'Bottled immediately after harvest, emphasizing ultra-fresh fruit and carbonic aromas.' },
            { name: 'Beaujolais-Villages', criteria: 'Production Tier', description: 'Wines with greater complexity and concentration from designated villages.' },
            { name: 'Cru Beaujolais', criteria: 'Premium Terroir', description: 'The pinnacle of Gamay production from 10 specific crus like Morgon, capable of deep complexity and aging.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Light-to-medium body with a bright, energetic character.' },
            { label: 'Tannins', metric: 'Astringency', value: '2/10', description: 'Silky smooth with minimal astringency.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Vibrant acidity that keeps the palate refreshed.' }
        ],
        flavorTags: [
            { label: 'Strawberry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Peony', color: 'bg-pink-100/20 text-pink-700' },
            { label: 'Bubblegum', color: 'bg-indigo-100/20 text-indigo-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Carbonic Maceration', description: 'Uncrushed berries ferment from the inside out in a CO2-rich environment, creating characteristic banana flavors and incredibly soft tannins.' },
            { step: 'Aging', name: 'Stainless Steel / Large Oak', description: 'Preferentially aged in neutral vessels to protect its fresh PRIMARY fruit profile.' }
        ],
        majorRegions: [
            { name: 'Beaujolais', description: "The heart of Gamay production, accounting for nearly 98% of the world's plantings.", emoji: '🇫🇷' },
            { name: 'Oregon Higher Valleys', description: 'Successfully established in cooler New World sites for its elegant profile.', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide-bowled Burgundy-style Glass',
            optimalTemperatures: [
                { temp: '12–14°C', description: 'Slightly cooler than typical reds to maximize the expression of its fruit esters.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Roasted chicken', 'Charcuterie boards', 'Lightly sauced fish dishes', 'Fresh salads']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['가메', 'gamay']
}
