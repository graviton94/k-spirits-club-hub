import { SpiritCategory } from '../types'

export const negroamaro: SpiritCategory = {
    slug: 'negroamaro',
    emoji: '☀️',
    nameKo: '네그로아마로',
    nameEn: 'Negroamaro',
    taglineKo: '풀리아의 검은 태양, 짙은 색상과 쌉싸름한 야성의 미학',
    taglineEn: 'The black sun of Puglia, the aesthetics of deep color and bitter wildness',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '네그로아마로(Negroamaro)는 이탈리아 남부 풀리아(Puglia) 지역의 뜨거운 태양을 상징하는 품종입니다. "검고(Negro) 쌉쌀한(Amaro)"이라는 이름처럼 잉크같이 진한 색조와 특유의 기분 좋은 쌉싸름한 끝 맛이 특징입니다. 자두, 말린 허브, 그리고 지중해의 흙 내음이 어우러진 묵직하고 남성적인 매력을 지닌 품종입니다.',
        history: '고대 그리스 시대에 이탈리아 남부로 건너온 역사적인 품종으로 추정됩니다. 오랫동안 이탈리아 북부 와인의 색과 도수를 높이기 위한 블렌딩용으로 쓰였으나, 최근에는 살리체 살렌티노(Salice Salentino) 등 풀리아 고유의 테루아를 강조한 프리미엄 단일 품종 와인으로 재평가받으며 전 세계 와인 애호가들의 주목을 받고 있습니다.',
        classifications: [
            { name: 'Salice Salentino DOC', criteria: '주요 산지', description: '말바시아 네라와 블렌딩되어 더욱 우아하고 복합적인 풍미를 지닌 풀리아의 대표작' },
            { name: 'Riserva Negroamaro', criteria: '숙성 등급', description: '오랜 시간 숙성되어 타닌이 부드러워지고 가죽과 스파이스 향이 짙어진 상급 스타일' },
            { name: 'Negroamaro Rosato', criteria: '로제 스타일', description: '진한 산호 색상과 과즙미 넘치는 풍미를 지닌, 이탈리아 최고의 로제 와인 중 하나' }
        ],
        sensoryMetrics: [
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '빛을 투과하지 않는 짙고 잉크 같은 루비색' },
            { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '풀리아의 열기를 머금은 묵직하고 뜨거운 힘' },
            { label: '쌉쌀함 (Bitterness)', metric: '미감', value: 'High', description: '네그로아마로 특유의 기분 좋은 한약재나 야생 허브의 끝 맛' }
        ],
        flavorTags: [
            { label: '검은 자두', color: 'bg-purple-900/20 text-purple-900' },
            { label: '말린 한약재', color: 'bg-stone-800/20 text-stone-900' },
            { label: '지중해 흙', color: 'bg-amber-900/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '고온 속성 발효', description: '남부 이탈리아의 전통에 따라 높은 온도에서 빠르게 색과 풍미를 추출합니다.' },
            { step: '숙성', name: '오크 및 대형 슬라보니아 통 숙성', description: '야생적인 타닌을 잠재우고 부드러운 질감을 얻기 위해 중고 오크통이나 대형 통에서 숙성합니다.' }
        ],
        majorRegions: [
            { name: '살렌토 반도 (Salento)', description: '네그로아마로가 가장 고귀하게 자라나는 이탈리아의 장화 뒤꿈치 지역', emoji: '🇮🇹' },
            { name: '풀리아 (Puglia)', description: '이탈리아 남부의 거대한 태양과 대지가 어우러진 네그로아마로의 본거장', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓고 깊은 레드 와인 전용 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 쌉싸름한 풍미와 진한 과실향이 가장 조화롭게 어우러지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['양고기 구이', '미트소스 라자냐', '향이 강한 페코리노 치즈', '숯불 구이 요리']
    },
    sectionsEn: {
        definition: "Negroamaro is the definitive grape of Puglia's sun-drenched plains in Southern Italy. Living up to its name—'Black' (Negro) and 'Bitter' (Amaro)—it is prized for its inky darkness and a characteristically pleasant bitter finish. It offers a rugged, masculine profile dominated by ripe plums, sun-dried Mediterranean herbs, and scorching earthy undertones.",
        history: "A historic variety believed to have been introduced to Southern Italy by ancient Greek settlers. For generations, it was used as a blending workhorse to bolster the color and alcohol of Northern Italian wines. Today, it has achieved its own prestige, centered on appellations like Salice Salentino, where it is celebrated as a premium varietal that captures the unique energy of the Salento peninsula.",
        classifications: [
            { name: 'Salice Salentino DOC', criteria: 'Primary Region', description: 'Puglia’s flagship blend, often featuring a touch of Malvasia Nera for added aromatic elegance.' },
            { name: 'Riserva Negroamaro', criteria: 'Aging Tier', description: 'Concentrated expressions matured for significant periods to soften tannins and enhance notes of leather and dark spice.' },
            { name: 'Negroamaro Rosato', criteria: 'Rosé Style', description: 'Vibrant, salmon-colored wines widely recognized as some of Italy’s most flavorful and structured rosés.' }
        ],
        sensoryMetrics: [
            { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Opaque, inky ruby-black hue.' },
            { label: 'Body', metric: 'Weight', value: '9/10', description: 'Full-bodied and powerful, reflecting the intense South Italian heat.' },
            { label: 'Bitterness', metric: 'Palate Edge', value: 'High', description: 'A signature pleasant savory bitterness reminiscent of wild herbs or medicinal roots.' }
        ],
        flavorTags: [
            { label: 'Black Plum', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Sun-dried Herbs', color: 'bg-stone-800/20 text-stone-900' },
            { label: 'Mediterranean Earth', color: 'bg-amber-900/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Rapid High-Temp Fermentation', description: 'Following local traditions, high temperatures are used to quickly extract deep color and flavor concentration.' },
            { step: 'Aging', name: 'Oak & Large Cask Maturation', description: 'Matured in used barrels or large Slavonian oak vats to tame its wild tannins and develop a supple mouthfeel.' }
        ],
        majorRegions: [
            { name: 'Salento Peninsula', description: 'The heel of Italy’s boot and the spiritual heartland for high-quality Negroamaro.', emoji: '🇮🇹' },
            { name: 'Puglia (General)', description: 'The vast, sun-soaked region responsible for the variety’s global revival.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide, deep-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Ideal for balancing its savory bitterness with its rich, dark fruit core.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Grilled lamb', 'Meaty Lasagna', 'Sharp Pecorino cheese', 'Charcoal-grilled meats']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['네그로아마로', 'negroamaro', '살리체 살렌티노']
}
