import { SpiritCategory } from '../types'

export const mazuelo: SpiritCategory = {
    slug: 'mazuelo',
    emoji: '🍇',
    nameKo: '마주엘로',
    nameEn: 'Mazuelo',
    taglineKo: '리오하의 숨은 척추, 강렬한 색조와 높은 산미의 클래식한 조연',
    taglineEn: 'The hidden spine of Rioja, a classic supporting role with intense color and high acidity',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '마주엘로(Mazuelo, 프랑스명 Carignan)는 스페인 리오하(Rioja) 지역에서 숙성 잠재력을 높이기 위해 필수적으로 사용되는 레드 품종입니다. 매우 짙은 색상과 함께 높은 산도, 그리고 강력한 타닌을 지녀 와인의 골격을 형성하는 데 탁월합니다. 단독으로는 다소 거칠 수 있으나, 템프라니요와 섞였을 때 그 진가를 발휘하며 장기 숙성용 그란 레세르바 와인의 완성도를 높여줍니다.',
        history: '스페인 아라곤 지역의 카리녜나(Cariñena) 마을이 고향으로 알려져 있으나, 리오하에서는 마주엘로라는 이름으로 수 세기 동안 재배되어 왔습니다. 프랑스로 건너가 "카리냥"이라는 이름으로 한때 세계에서 가장 많이 재배되는 품종이 되기도 했습니다. 오늘날에는 수확량을 엄격히 제한한 오래된 나무(Old Vine)에서 생산되는 고품질 마주엘로가 그 고유의 야성미와 우아함으로 새롭게 재평가받고 있습니다.',
        classifications: [
            { name: 'Modern Rioja Blend', criteria: '블렌딩 역할', description: '템프라니요 와인에 산도와 색상을 더해 숙성 잠재력을 보완하는 역할' },
            { name: 'Old Vine Varietal', criteria: '나무 수령', description: '수십 년 된 고목에서 생산되어 부드러운 타닌과 높은 농축미를 지닌 단일 품종 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '장기 숙성을 가능케 하는 날카롭고 강한 산미' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '8/10', description: '입안을 꽉 죄는 단단하고 강력한 타닌 구조' },
            { label: '색상 (Color)', metric: '농도', value: 'High', description: '깊고 어두운 루비에서 보랏빛 색조' }
        ],
        flavorTags: [
            { label: '블랙체리', color: 'bg-red-900/20 text-red-900' },
            { label: '감초', color: 'bg-stone-800/20 text-stone-700' },
            { label: '말린 허브', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '탄산 침출 (일부 스타일)', description: '거친 타닌을 완화하고 과실향을 살리기 위해 때때로 송이째 발효를 진행합니다.' },
            { step: '숙성', name: '아메리칸/프렌치 오크 숙성', description: '강한 골격을 다듬고 풍미를 입히기 위해 최소 12개월 이상의 오크 숙성을 선호합니다.' }
        ],
        majorRegions: [
            { name: '리오하 (Rioja)', description: '마주엘로라는 이름으로 보석 같은 결과물을 만들어내는 곳', emoji: '🇪🇸' },
            { name: '랑그독-루시용 (Languedoc-Roussillon)', description: '카리냥이라는 이름으로 방대한 양이 재배되는 프랑스 남부 산지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 또는 볼이 깊은 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '강한 타닌과 산미가 음식과 함께 조화롭게 어우러지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['기름진 스테이크', '훈제 육류', '맵고 짠 풍미의 스튜', '숙성된 맨체고 치즈']
    },
    sectionsEn: {
        definition: "Mazuelo (known internationally as Carignan) is an essential red grape variety in Spain's Rioja region, prized for its contribution to aging potential. Its signature traits are an intensely deep color, high acidity, and powerful tannins, which provide a robust structural frame for premium blends. While it can be rustic on its own, it shines when blended with Tempranillo, elevating the complexity and longevity of Gran Reserva wines.",
        history: "Believed to have originated in the town of Cariñena in Aragón, Spain, it has been cultivated in Rioja for centuries as Mazuelo. It migrated to France as Carignan, where it once became one of the most widely planted varieties in the world. Today, low-yielding old vines are being rediscovered, as winemakers produce high-quality, concentrated expressions that balance its natural wildness with newfound elegance.",
        classifications: [
            { name: 'Modern Rioja Blend', criteria: 'Blending Role', description: 'Adds critical acidity and stable color to Tempranillo-based wines to ensure long-term aging.' },
            { name: 'Old Vine Varietal', criteria: 'Vine Age', description: 'Concentrated, single-varietal wines from decades-old vines that offer smoother tannins and deep flavor depth.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '9/10', description: 'Provides a sharp, vibrant spine that facilitates extensive bottle aging.' },
            { label: 'Tannins', metric: 'Astringency', value: '8/10', description: 'Firm, powerful tannin structure that gives the wine its grip.' },
            { label: 'Color', metric: 'Intensity', value: 'High', description: 'Yields deep, dark ruby and purple-hued liquids.' }
        ],
        flavorTags: [
            { label: 'Black Cherry', color: 'bg-red-900/20 text-red-900' },
            { label: 'Licorice', color: 'bg-stone-800/20 text-stone-700' },
            { label: 'Dried Herbs', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Carbonic Maceration (Occasional)', description: 'Sometimes used to soften the aggressive natural tannins and emphasize primary fruit aromas.' },
            { step: 'Aging', name: 'Oak Maturation', description: 'Extensive aging in American or French oak is preferred to integrate its structural components.' }
        ],
        majorRegions: [
            { name: 'Rioja', description: "The premier region where Mazuelo is celebrated as an essential component of noble blends.", emoji: '🇪🇸' },
            { name: 'Languedoc-Roussillon', description: 'The vast Southern French region where it is widely planted under its French name, Carignan.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard or Deep-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Ideal for allowing the firm tannins and acidity to harmonize with food.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Fatty steaks', 'Smoked meats', 'Hearty spicy stews', 'Aged Manchego cheese']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['마주엘로', 'mazuelo', '카리냥', 'carignan']
}
