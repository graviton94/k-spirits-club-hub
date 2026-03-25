import { SpiritCategory } from '../types'

export const monastrell: SpiritCategory = {
    slug: 'monastrell',
    emoji: '🌑',
    nameKo: '모나스트렐',
    nameEn: 'Monastrell',
    taglineKo: '스페인의 검은 태양, 야생의 풍미와 강렬한 타닌의 대서사시',
    taglineEn: 'The black sun of Spain, an epic of wild flavors and intense tannins',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '모나스트렐(Monastrell, 프랑스명 Mourvèdre)은 지중해의 가장 뜨거운 태양 아래서 자라난 강인한 레드 품종입니다. 잉크처럼 짙은 색상과 함께 가죽, 육류, 담배 등 야생적(Gamy)이고 묵직한 풍미가 특징입니다. 높은 알코올과 단단한 타닌을 지녀 혼자서도 압도적인 존재감을 뽐내며, 블렌딩에서는 와인에 강력한 구조감과 깊이를 더해주는 역할을 합니다.',
        history: '스페인 레반테(Levante) 지역이 고향인 매우 오래된 품종으로, 중세 시대부터 그 명성이 자자했습니다. 프랑스로 건너가 "무르베드르"라는 이름으로 남부 론과 프로방스 지역의 핵심 품종이 되었으며, 특히 방돌(Bandol) 지역에서 세계에서 가장 묵직하고 복합적인 레드 와인을 생산하며 정점에 달했습니다. 최근에는 고유의 이름인 "모나스트렐"로 불리는 스페인 로컬 고품질 와인으로서 전 세계적인 재평가를 받고 있습니다.',
        classifications: [
            { name: 'Bandol Rouge', criteria: '최고급 산지', description: '최소 18개월 이상 오크 숙성되는 프랑스 프로방스의 가장 강력한 무르베드르 와인' },
            { name: 'Jumilla / Yecla Style', criteria: '스페인 스타일', description: '스페인 남동부의 고온 건조한 사막 기후에서 만들어진 농축된 과실미의 모나스트렐' },
            { name: 'Provencal Rosé', criteria: '로제 블렌딩', description: '로제 와인에 깊이와 숙성 잠재력, 그리고 특유의 스파이시함을 더해주는 역할' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '입안을 가득 채우는 풀바디의 강렬함' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '9/10', description: '매우 견고하고 단단한 타닌 구조' },
            { label: '알코올 (Alcohol)', metric: '강도', value: '9/10', description: '뜨거운 기후에서 오는 높은 알코올 함량' }
        ],
        flavorTags: [
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '가죽 (Leather)', color: 'bg-stone-600/20 text-stone-800' },
            { label: '백후추', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: '포도 관리', name: '수확 시기 결정', description: '완벽하게 익기까지 매우 오랜 시간이 걸리는 만숙형 품종으로, 타닌의 숙성도를 극대화하기 위해 늦게 수확합니다.' },
            { step: '숙성', name: '장기 오크 숙성', description: '거친 야생미를 다듬고 복합미를 더하기 위해 큰 오크통에서의 장기 숙성을 기본으로 합니다.' }
        ],
        majorRegions: [
            { name: '후미야 (Jumilla)', description: '스페인 모나스트렐의 현대적 부흥을 이끄는 산지', emoji: '🇪🇸' },
            { name: '방돌 (Bandol)', description: '무르베드르가 가장 위엄 있게 표현되는 프랑스 프로방스의 심장', emoji: '🇫🇷' },
            { name: '남부 론 (Southern Rhône)', description: 'GSM 블렌딩 와인에 강력한 힘을 실어주는 산지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 크고 넓은 대형 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '풍부한 아로마와 단단한 구조가 조화를 이루며 피어나는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['구운 붉은 육류 요리', '야생 육류(게임, 멧돼지 등)', '향이 강한 블루 치즈', '진한 풍미의 스튜']
    },
    sectionsEn: {
        definition: "Monastrell (known as Mourvèdre in France) is a resilient red grape variety that thrives under the most intense Mediterranean sun. It produces wines as dark as ink, characterized by wild, 'gamy' profiles featuring leather, meat, and tobacco. With its high alcohol content and formidable tannins, it commands an imposing presence as a single-varietal wine while acting as the structural anchor in premium blends.",
        history: "A very ancient variety originating in the Levante region of Spain, its reputation has been established since the Middle Ages. It migrated to France as 'Mourvèdre,' becoming a cornerstone of the Southern Rhône and Provence, reaching its zenith in the Bandol appellation with some of the world's most heavy and complex reds. Recently, its Spanish identity as 'Monastrell' has seen a global resurgence, led by high-quality, concentrated expressions from its ancestral home.",
        classifications: [
            { name: 'Bandol Rouge', criteria: 'Premium Appellation', description: "France's most powerful Mourvèdre-based wines, requiring at least 18 months of oak aging." },
            { name: 'Jumilla / Yecla Style', criteria: 'Spanish Style', description: 'Concentrated, fruit-forward Monastrell from the arid, desert-like conditions of Southeast Spain.' },
            { name: 'Provencal Rosé', criteria: 'Rosé Blending', description: 'Imparts aging potential, color depth, and a distinctive spicy edge to premium rosés.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '9/10', description: 'Full-bodied, intense, and grand on the palate.' },
            { label: 'Tannins', metric: 'Astringency', value: '9/10', description: 'Extremely firm and robust structural integrity.' },
            { label: 'Alcohol', metric: 'Potency', value: '9/10', description: 'High alcohol potential derived from long, hot growing seasons.' }
        ],
        flavorTags: [
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Leather', color: 'bg-stone-600/20 text-stone-800' },
            { label: 'White Pepper', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: 'Vineyard Management', name: 'Late Harvest Timing', description: 'A late-ripening variety that requires a very long season to ensure physiological tannin maturity.' },
            { step: 'Aging', name: 'Long-term Oak Cask Maturation', description: 'Traditional use of large oak foudres to tame its wild tannins and layering in secondary complexity.' }
        ],
        majorRegions: [
            { name: 'Jumilla', description: "Leading the modern renaissance of high-quality, artisanal Monastrell in Spain.", emoji: '🇪🇸' },
            { name: 'Bandol', description: 'The absolute spiritual heart where Mourvèdre achieves its most majestic red wine form.', emoji: '🇫🇷' },
            { name: 'Southern Rhône', description: 'Provides essential structural power to the prestigious GSM blends.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Large, wide-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The best range to allow its dense aromatics and firm structure to unfold harmoniously.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Grilled red meats', 'Game meats (wild boar, etc.)', 'Strong blue cheeses', 'Hearty, rich stews']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['모나스트렐', 'monastrell', '무르베드르', 'mourvedre']
}
