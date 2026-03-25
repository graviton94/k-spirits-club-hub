import { SpiritCategory } from '../types'

export const welschriesling: SpiritCategory = {
    slug: 'welschriesling',
    emoji: '🏔️',
    nameKo: '벨슈리슬링',
    nameEn: 'Welschriesling',
    taglineKo: '중부 유럽의 청량한 바람, 바삭한 산도와 기분 좋은 사과 향',
    taglineEn: 'The refreshing breeze of Central Europe, crisp acidity and pleasant apple aroma',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '벨슈리슬링(Welschriesling)은 중앙유럽과 동유럽에서 널리 사랑받는 화이트 품종으로, 이름에 "리슬링"이 포함되어 있지만 독일의 리슬링과는 전혀 다른 독립적인 품종입니다. 매우 바삭하고 높은 산도와 풋사과, 레몬, 그리고 은은한 꽃향기가 특징입니다. 일상에서 마시기 편한 드라이 화이트부터, 전설적인 오스트리아의 귀부 와인까지 넘나드는 놀라운 스펙트럼의 소유자입니다.',
        history: '이름의 "벨슈(Welsch)"는 중부 유럽 사람들이 이웃 유랑 민족이나 외국인을 부르던 표현으로, 아마도 루마니아나 북이탈리아 지역에서 오스트리아로 건너온 것으로 추정됩니다. 오랫동안 헝가리, 크로아티아, 오스트리아 등 과거 오스트로-헝가리 제국 영토 전역에서 가장 중요한 화이트 품종으로 자리 잡았으며, 오늘날에는 각 지역의 테루아를 반영한 개성 넘치는 화이트 와인으로 재평가받고 있습니다.',
        classifications: [
            { name: 'Classic Dry Welschriesling', criteria: '일상 스타일', description: '높은 산도와 가벼운 바디감을 지닌, 갈증 해소에 탁월한 상쾌한 스타일' },
            { name: 'Trockenbeerenauslese (TBA)', criteria: '최고급 디저트', description: '오스트리아의 귀부병을 통해 탄생한, 꿀과 살구 향이 농축된 세계 최정상급 디저트 와인' },
            { name: 'Graševina / Olaszrizling', criteria: '현지 별칭', description: '크로아티아나 헝가리에서 생산되는, 더 정교하고 미네랄이 풍부한 상급 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '입안을 깨끗하게 씻어주는 날카롭고 바삭한 산미' },
            { label: '과실향 (Fruitiness)', metric: '신선함', value: '7/10', description: '풋사과, 레몬 껍질, 초록빛 허브의 화사함' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '경쾌하고 직선적인 라이트 바디' }
        ],
        flavorTags: [
            { label: '풋사과', color: 'bg-green-100/20 text-green-700' },
            { label: '레몬 껍질', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: '흰 꽃', color: 'bg-slate-50/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중립적 저온 발효', description: '품종 고유의 신선함과 산도를 보존하기 위해 오크 사용을 자제하고 시원하게 발효합니다.' },
            { step: '귀부 현상 유도', name: '스위트 와인 제조', description: '노이지들러 호수 주변의 안개를 이용해 귀부병을 유도하여 천연 당분을 농축시킵니다.' }
        ],
        majorRegions: [
            { name: '부르겐란트 (Burgenland)', description: '세계 최고의 벨슈리슬링 디저트 와인이 탄생하는 성지', emoji: '🇦🇹' },
            { name: '슈타이어마르크', description: '날카로운 산도와 활기찬 드라이 스타일의 산지', emoji: '🇦🇹' },
            { name: '크로아티아 & 헝가리', description: '그라세비나(Graševina) 등의 이름으로 널리 재배되는 핵심 산지', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '기본 화이트 와인 전용 글라스',
            optimalTemperatures: [
                { temp: '7-10°C', description: '차갑게 서빙하여 특유의 바삭한 산미와 사과 향을 선명하게 즐겨야 하는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 생선 요리', '해산물 샐러드', '여성용 디저트(TBA 스타일)', '야외 피크닉 음식']
    },
    sectionsEn: {
        definition: "Welschriesling is a widely cherished white variety across Central and Eastern Europe. Despite the name, it is entirely unrelated to the noble German Riesling. It is characterized by its high, razor-sharp acidity and a refreshing aromatic profile of green apples, lemon zest, and delicate white flowers. It possesses a remarkable stylistic range, from zippy, thirst-quenching dry table wines to some of the world's most prestigious Botrytis-affected dessert wines.",
        history: "The prefix 'Welsch' historically referred to 'foreign' or 'Romanic' people in Central Europe, suggesting the grape may have migrated to Austria from Northern Italy or Romania. For over a century, it has been a cornerstone of viticulture across the former Austro-Hungarian Empire. Today, it is undergoing a quality-driven renaissance in countries like Croatia and Hungary, where it is celebrated for its ability to transmit terroir and mineral character.",
        classifications: [
            { name: 'Classic Dry Welschriesling', criteria: 'Daily Style', description: 'Focuses on electric acidity and light-bodied refreshment, ideal for summertime drinking.' },
            { name: 'Trockenbeerenauslese (TBA)', criteria: 'Premium Dessert', description: 'Produced via noble rot, these are world-class sweet wines with extreme concentrations of honey and dried fruit.' },
            { name: 'Graševina / Olaszrizling', criteria: 'Regional Tier', description: 'The local names in Croatia and Hungary for more serious, mineral-inflected, and structured versions.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '9/10', description: 'Provides a clean, bracing structure that is hallmark to the variety.' },
            { label: 'Fruitiness', metric: 'Freshness', value: '7/10', description: 'Dominated by green orchard fruit and zesty citrus notes.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Typically features a light, focused, and un-oaked physical presence.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Lemon Zest', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: 'White Blossoms', color: 'bg-slate-50/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Cool Stainless Steel Fermentation', description: 'Essential for maintaining the grape’s high natural acidity and primary apple aromatics.' },
            { step: 'Botrytis Development', name: 'Dessert Wine Induction', description: 'The vineyards around Lake Neusiedl use autumn mists to encourage noble rot for world-class sweet wines.' }
        ],
        majorRegions: [
            { name: 'Burgenland', description: "The spiritual global center for the variety's most prestigious sweet wines.", emoji: '🇦🇹' },
            { name: 'Styria', description: 'Produces exceptionally crisp, vibrant, and food-friendly dry Welschriesling.', emoji: '🇦🇹' },
            { name: 'Croatia & Hungary', description: 'Grown extensively under local synonyms, yielding serious and complex mineral white wines.', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass',
            optimalTemperatures: [
                { temp: '7–10°C', description: 'Best served well-chilled to emphasize its characteristic crunch and acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Poached white fish', 'Seafood salads', 'Fruit-based desserts (with TBA)', 'Fresh picnic fare']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['벨슈리슬링', 'welschriesling', '그라세비나', 'grasevina', '올라즈리슬링']
}
