import { SpiritCategory } from '../types'

export const macabeo: SpiritCategory = {
    slug: 'macabeo',
    emoji: '🍇',
    nameKo: '마카베오',
    nameEn: 'Macabeo',
    taglineKo: '스페인의 화이트 연금술, 까바(Cava)의 뼈대를 이루는 강인한 아로마',
    taglineEn: 'Spanish white alchemy, the structural backbone of Cava',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '마카베오(Macabeo, 프랑스명 Viura)는 스페인 북부와 프랑스 남부에서 중추적인 역할을 하는 화이트 품종입니다. 특히 스페인의 상징적인 스파클링 와인인 까바(Cava)를 만드는 가장 중요한 세 품종 중 하나로, 와인에 신선한 산미와 꽃향기, 그리고 탄탄한 구조감을 부여합니다. 중성적인 성향 덕분에 오크 숙성에도 잘 어울리며, 시간이 흐를수록 견과류와 꿀 같은 복합미를 꽃피웁니다.',
        history: '스페인 카탈루냐(Catalonia) 지역이 고향인 것으로 추정되며, 현재는 스페인 전역에서 가장 널리 재배되는 화이트 품종 중 하나입니다. 리오하(Rioja) 지역에서는 "비우라(Viura)"라는 이름으로 불리며 장기 숙성용 화이트 와인의 대명사로 자리 잡았습니다. 건조하고 더운 기후에 강한 적응력을 지녀 스페인의 척박한 테루아를 전 세계에 알리는 일등 공신 역할을 해왔습니다.',
        classifications: [
            { name: 'Cava Base', criteria: '주요 역할', description: '까바 생산 시 신선함과 꽃향기를 담당하는 핵심 성분' },
            { name: 'Reserva Rioja Blanco', criteria: '숙성 등급', description: '오크통에서 장기 숙성되어 바닐라와 고소한 견과류 풍미가 폭발하는 고급 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '부드럽지만 힘 있는 균형을 이루는 산미' },
            { label: '아로마 (Aroma)', metric: '꽃향기', value: 'Medium', description: '하얀 꽃과 은은한 야생화의 아로마' },
            { label: '잠재력 (Potential)', metric: '숙성력', value: 'High', description: '오크와 결합했을 때 더욱 깊어지는 숙성 잠재력' }
        ],
        flavorTags: [
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '아몬드', color: 'bg-amber-100/20 text-amber-800' },
            { label: '레몬즙', color: 'bg-yellow-100/20 text-yellow-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '온도 조절 발효', description: '신선한 과실 본연의 향을 보존하기 위해 차가운 스테인리스 탱크에서 발효합니다.' },
            { step: '숙성', name: '전통적 오크 숙성', description: '리오하 스타일의 경우, 공기와의 접촉을 활발히 한 오크통 숙성을 통해 복합적인 풍미를 이끌어냅니다.' }
        ],
        majorRegions: [
            { name: '카탈루냐 (Catalonia)', description: '까바 생산의 중심지이자 마카베오의 최대 재배지', emoji: '🇪🇸' },
            { name: '리오하 (Rioja)', description: '비우라라는 이름으로 위대한 화이트 와인을 생산하는 곳', emoji: '🇪🇸' },
            { name: '루시용 (Roussillon)', description: '프랑스 남부의 뜨거운 태양 아래 자라난 마카베오의 산지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '신선한 까바나 가벼운 테이블 화이트 와인의 경우' },
                { temp: '10-12°C', description: '숙성된 리오하 화이트의 경우 풍부한 향을 위해' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['해산물 파에야', '구운 생선 요리', '다양한 타파스', '볶은 견과류']
    },
    sectionsEn: {
        definition: "Macabeo (known as Viura in Rioja) is a pivotal white grape variety in Northern Spain and Southern France. It is most famous as one of the three primary pillars of Cava, Spain's iconic sparkling wine, to which it contributes fresh acidity, floral aromatics, and a robust structure. Due to its balanced and neutral nature, it responds exceptionally well to oak aging, developing complex notes of nuts and honey over time.",
        history: "Believed to be native to Catalonia, Macabeo has become one of the most widely planted white varieties throughout Spain. In the Rioja region, it is celebrated under the name 'Viura,' forming the basis for some of the world's most long-lived and prestigious white wines. Its adaptability to hot, dry conditions has allowed it to thrive in Spain's rugged interior and Mediterranean coast alike.",
        classifications: [
            { name: 'Cava Base', criteria: 'Primary Role', description: 'Provides the essential freshness and blossom-like aromatics for traditional method sparklers.' },
            { name: 'Reserva Rioja Blanco', criteria: 'Aging Tier', description: 'A sophisticated style aged extensively in oak barrels, characterized by vanilla, toasted nut, and complex secondary flavors.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Offers a firm but supple balance that supports various styles.' },
            { label: 'Aroma', metric: 'Complexity', value: 'Medium', description: 'Defined by white flowers, green apple, and subtle wildflower honey.' },
            { label: 'Potential', metric: 'Aging', value: 'High', description: 'Excellent structural integrity that evolvess beautifully when exposed to oak.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Almond', color: 'bg-amber-100/20 text-amber-800' },
            { label: 'Lemon Zest', color: 'bg-yellow-100/20 text-yellow-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Temperature Controlled Fermentation', description: 'Typically fermented in cool stainless steel to maintain the primary fruit and floral profile.' },
            { step: 'Aging', name: 'Oxidative Oak Aging', description: 'Traditional Rioja styles use extended oak maturation to intentionally introduce complex, nutty character.' }
        ],
        majorRegions: [
            { name: 'Catalonia', description: 'The grand hub of Cava production and the premier growing site for Macabeo.', emoji: '🇪🇸' },
            { name: 'Rioja', description: "The premier region for oak-aged whites based on the grape known locally as Viura.", emoji: '🇪🇸' },
            { name: 'Roussillon', description: 'Southern France’s sun-drenched region producing rich and full-bodied Macabeo.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine Glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'Best for crisp Cava or fresh table styles.' },
                { temp: '10–12°C', description: 'Allows the rich bouquet of aged Rioja whites to fully emerge.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Seafood Paella', 'Grilled fish', 'Assorted Tapas', 'Toasted nuts']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['마카베오', 'macabeo', '비우라', 'viura']
}
