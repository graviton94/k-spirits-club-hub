import { SpiritCategory } from '../types'

export const petiteSirah: SpiritCategory = {
    slug: 'petite-sirah',
    emoji: '🌑',
    nameKo: '프티 시라',
    nameEn: 'Petite Sirah (Durif)',
    taglineKo: '어둠의 매혹, 작은 포도알이 빚어낸 거대한 타닌과 잉크빛 농축미',
    taglineEn: 'The fascination of darkness, giant tannins and inky concentration from small berries',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '프티 시라(Petite Sirah), 또는 유럽에서 "뒤리프(Durif)"로 불리는 이 품종은 이름과 달리 결코 "작지 않은" 거구의 레드 품종입니다. 빛을 투과하지 않는 잉크 같은 짙은 색상과 강력한 타닌, 그리고 입안을 저미는 블랙베리와 블루베리의 농축된 풍미가 특징입니다. 작은 포도알 속에 응축된 에너지는 전 세계 레드 와인 중 가장 묵직하고 강렬한 인상을 남깁니다.',
        history: '1880년대 프랑스의 식물학자 프랑수아 뒤리프(François Durif)에 의해 시라(Syrah)와 펠루르쟁(Peloursin)의 교배로 탄생했습니다. 고향인 프랑스에서는 거의 자취를 감췄으나, 미국 캘리포니아로 건너가 "프티 시라"라는 이름으로 불리며 제2의 전성기를 맞았습니다. 척박한 땅과 뜨거운 태양 아래에서 더욱 강인한 개성을 뽐내며, 오늘날 캘리포니아 레드의 파워를 상징하는 품종이 되었습니다.',
        classifications: [
            { name: 'Varietal Petite Sirah', criteria: '단독 스타일', description: '압도적인 타닌과 색상을 지닌, 장기 숙성력이 경이로운 순수 프티 시라' },
            { name: 'Field Blend Component', criteria: '블렌딩 역할', description: '진판델 등과 섞여 와인의 골격을 잡고 색을 진하게 만드는 비밀병기' },
            { name: 'Luxury Reserve', criteria: '최고급 등급', description: '새 오크통 숙성을 통해 바닐라와 초콜릿 풍미를 극대화한 프리미엄 와인' }
        ],
        sensoryMetrics: [
            { label: '타닌 (Tannins)', metric: '수렴성', value: '10/10', description: '레드 와인 중 가장 강력하고 견고한 타닌의 소유자' },
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '빛을 전혀 투과하지 않는 칠흑 같은 루비-퍼플' },
            { label: '바디 (Body)', metric: '무게감', value: '10/10', description: '입안을 꽉 채우는 육중한 무게감과 질감' }
        ],
        flavorTags: [
            { label: '블루베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '검은 후추', color: 'bg-stone-700/20 text-stone-900' },
            { label: '다크 초콜릿', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: '관리', name: '초정밀 침출', description: '타닌이 과도하게 거칠어지지 않도록 온도와 침출 시간을 극도로 정교하게 관리합니다.' },
            { step: '숙성', name: '장기 오크 숙성', description: '강력한 골격에 살을 붙이고 타닌을 부드럽게 만들기 위해 수개월~수년간 오크통에서 숙성합니다.' }
        ],
        majorRegions: [
            { name: '캘리포니아 (California)', description: '프티 시라가 가장 웅장하고 파워풀하게 표현되는 절대적 성지', emoji: '🇺🇸' },
            { name: '빅토리아 (Australia)', description: '뒤리프라는 이름으로 매우 진하고 풍부한 스타일을 생산하는 곳', emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 매우 넓고 깊은 초대형 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '강력한 타닌과 농축된 과실미가 가장 우아하게 펼쳐지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['강력한 숯불 스테이크', '진한 풍미의 양고기 요리', '블루 치즈', '매운 풍미의 바비큐']
    },
    sectionsEn: {
        definition: "Petite Sirah, known as 'Durif' in much of the world, is despite its name a formidable giant in the world of red wine. It is defined by its nearly opaque inky-black coloration, monumental tannin structure, and a deep concentration of blueberry and blackberry fruit. The intense energy packed into its small, thick-skinned berries results in some of the most powerful and long-lived red wines in existence.",
        history: "Created in the 1880s by French botanist François Durif, searching for a disease-resistant grape, it was born from a cross between Syrah and the rare Peloursin. While it nearly disappeared in its native France, it found a second and much more grand life in California under the name Petite Sirah. Here, it has flourished under the intense sun, becoming a hallmark of Californian winemaking strength and resilience.",
        classifications: [
            { name: 'Varietal Petite Sirah', criteria: 'Singular Style', description: 'Pure expressions of the grape, noted for their astounding longevity and relentless tannic grip.' },
            { name: 'Field Blend Component', criteria: 'Blending Role', description: "Used as a 'secret weapon' to add structural backbone and deep color to Zinfandel-based blends." },
            { name: 'Luxury Reserve', criteria: 'Premium Tier', description: 'Select vintages aged in new oak to introduce layers of vanilla, spice, and espresso to the dark fruit.' }
        ],
        sensoryMetrics: [
            { label: 'Tannins', metric: 'Astringency', value: '10/10', description: 'Possesses some of the most aggressive and robust tannins in the oenological world.' },
            { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Produces wines that are consistently opaque and inky in their purple-black depth.' },
            { label: 'Body', metric: 'Weight', value: '10/10', description: 'Features a massive, palate-staining, and authoritative full-bodied presence.' }
        ],
        flavorTags: [
            { label: 'Blueberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Cracked Black Pepper', color: 'bg-stone-700/20 text-stone-900' },
            { label: 'Dark Cacao', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: 'Extraction', name: 'Cold Soak & Temp Management', description: 'Vital for ensuring that the massive tannins are extracted cleanly without becoming overly bitter or rustic.' },
            { step: 'Aging', name: 'Protracted Oak Maturation', description: 'Requires extended time in barrel to round out its enormous structure and integrate its intense primary flavors.' }
        ],
        majorRegions: [
            { name: 'California', description: 'The absolute global epicenter for high-quality, large-scale Petite Sirah.', emoji: '🇺🇸' },
            { name: 'Victoria, Australia', description: 'Grown as Durif, producing exceptionally rich, dark, and spicy styles.', emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Over-sized, deep-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Essential for allowing its structural complexity and dark fruit depth to breathe.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Charcoal-grilled ribeye', 'Rich venison or wild boar', 'Strong blue cheeses', 'Smoky, highly seasoned BBQ']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['프티 시라', 'petite sirah', '뒤리프', 'durif']
}
