import { SpiritCategory } from '../types'

export const neroDavola: SpiritCategory = {
    slug: 'nero-davola',
    emoji: '🌋',
    nameKo: '네로 다볼라',
    nameEn: 'Nero d\'Avola',
    taglineKo: '시칠리아의 검은 왕자, 화산의 에너지와 달콤한 과실향의 매혹',
    taglineEn: 'The Black Prince of Sicily, the fascination of volcanic energy and sweet fruitiness',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '네로 다볼라(Nero d\'Avola)는 지중해의 가장 큰 섬, 시칠리아(Sicily)를 대표하는 명예로운 레드 품종입니다. "다볼라 마을의 검은색(Nero)"이라는 뜻처럼 매우 짙은 색상을 띠며, 블랙체리와 자두의 풍부한 과실향, 그리고 달콤한 스파이스 풍미가 일품입니다. 시칠리아의 뜨거운 태양과 화산지대의 독특한 토양 에너지를 머금은, 이국적이면서도 세련된 품종입니다.',
        history: '시칠리아 남동부의 아볼라(Avola) 지역에서 수 세기 동안 재배되어 왔으며, 시칠리아 와인의 자부심으로 불립니다. 한때는 이탈리아 본토의 와인에 색과 도수를 더해주는 보조 품종으로 많이 쓰였으나, 21세기 들어 시칠리아 생산자들의 노력으로 그 자체로도 위대한 장기 숙성용 프리미엄 와인을 생산하는 세계적인 품종으로 변모했습니다.',
        classifications: [
            { name: 'Cerasuolo di Vittoria', criteria: '최고급 블렌딩', description: '시칠리아의 유일한 DOCG 등급으로, 프라파토와 섞여 우아함의 정점을 보여주는 와인' },
            { name: 'Varietal Nero d\'Avola', criteria: '단독 스타일', description: '풍부한 타닌과 블랙체리 풍미가 돋보이는 묵직한 풀바디 레드 스타일' },
            { name: 'Oak-Aged Reserve', criteria: '숙성 등급', description: '우수한 빈티지의 포도를 오크 숙성하여 초콜릿과 커피 향을 입힌 프리미엄 와인' }
        ],
        sensoryMetrics: [
            { label: '과실향 (Fruitiness)', metric: '달콤함', value: '9/10', description: '잘 익은 블랙체리와 잼 같은 풍성한 과실의 유혹' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '뜨거운 기후임에도 와인의 생동감을 지켜주는 훌륭한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '입안을 가득 채우는 묵직하고 실키한 질감' }
        ],
        flavorTags: [
            { label: '블랙체리', color: 'bg-red-900/20 text-red-900' },
            { label: '자두잼', color: 'bg-purple-900/20 text-purple-900' },
            { label: '초콜릿', color: 'bg-stone-700/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '온도 조절 발효', description: '특유의 달콤한 과실향을 잃지 않기 위해 발효 온도를 정교하게 조절합니다.' },
            { step: '숙성', name: '프렌치 오크 숙성', description: '타닌을 다듬고 복합적인 스파이시함을 더하기 위해 질 좋은 오크통에서 숙성 과정을 거칩니다.' }
        ],
        majorRegions: [
            { name: '시칠리아 (Sicily)', description: '네로 다볼라의 절대적인 고향이자 유일한 위대한 산지', emoji: '🇮🇹' },
            { name: '노토 & 아볼라', description: '네로 다볼라가 가장 우아하고 고전적으로 표현되는 핵심 지역', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓고 풍만한 레드 와인 전용 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 달콤한 체리 향과 묵직한 바디감이 가장 매력적으로 다가오는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['시칠리아식 가지 요리(카포나타)', '참치 스테이크', '매콤한 파스타', '바비큐 요리']
    },
    sectionsEn: {
        definition: "Nero d'Avola is the honored flagship red variety of Sicily, the largest island in the Mediterranean. Its name, meaning 'The Black (Nero) of Avola,' refers to its deep, concentrated pigment. It is celebrated for its opulent bouquet of black cherry, plum, and sweet peppery spice. Captured within each drop is the electric energy of Sicily’s volcanic soils and intense Mediterranean sun, offering an exotic yet sophisticated drinking experience.",
        history: "Cultivated for centuries in the southeastern region of Avola, the grape is the undisputed pride of Sicilian viticulture. Once relegated to a blending role to boost the color of mainland Italian wines, it has undergone a dramatic prestige revolution in the 21st century. Today, it stands as a world-class varietal capable of producing both vibrant, youthful expressions and monumental, cellar-worthy premium wines.",
        classifications: [
            { name: 'Cerasuolo di Vittoria', criteria: 'Premium Blend', description: 'Sicily’s only DOCG, where Nero d’Avola meets Frappato to create an elegant and refined aromatic masterpiece.' },
            { name: "Varietal Nero d'Avola", criteria: 'Singular Style', description: 'Bold, structured expressions highlighting the variety’s rich tannin and black fruit intensity.' },
            { name: 'Oak-Aged Reserve', criteria: 'Aging Tier', description: 'Select vintages matured in oak to introduce complex notes of chocolate, coffee, and tobacco.' }
        ],
        sensoryMetrics: [
            { label: 'Fruitiness', metric: 'Sweetness', value: '9/10', description: 'Dominated by seductive notes of ripe black cherry and plum jam.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Remarkably high for a hot-climate grape, maintaining vitality and balance.' },
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'Features a substantial, silken, and palate-coating mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Black Cherry', color: 'bg-red-900/20 text-red-900' },
            { label: 'Plum Jam', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Chocolate', color: 'bg-stone-700/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Temp-Controlled Fermentation', description: 'Vital for preserving the delicate aromatic esters that give the grape its signature fruitiness.' },
            { step: 'Aging', name: 'French Oak Maturation', description: 'Maturation in quality oak vats is used to refine tannins and incorporate secondary sweet spice layers.' }
        ],
        majorRegions: [
            { name: 'Sicily', description: 'The absolute spiritual home, where the variety reflects the island’s diverse volcanic terroirs.', emoji: '🇮🇹' },
            { name: 'Noto & Avola', description: 'The ancestral sub-regions where Nero d’Avola achieves its most elegant and classical form.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide, generous Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The ideal range for the marriage of rich cherry aromatics and a substantial physical presence.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Sicilian Eggplant Caponata', 'Seared Tuna Steak', 'Spicy Arrabiata pasta', 'Charcoal-grilled BBQ']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['네로 다볼라', 'nero davola', '시칠리아', 'sicily']
}
