import { SpiritCategory } from '../types'

export const tintaAmarela: SpiritCategory = {
    slug: 'tinta-amarela',
    emoji: '🍂',
    nameKo: '틴타 아마렐라',
    nameEn: 'Tinta Amarela (Trincadeira)',
    taglineKo: '포르투갈의 고풍스러운 깊이, 우아한 허브와 검은 과실의 고전미',
    taglineEn: 'The vintage depth of Portugal, the classical beauty of elegant herbs and dark fruit',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '틴타 아마렐라(Tinta Amarela), 혹은 알렌테주에서 "트린카데이라(Trincadeira)"로 불리는 이 품종은 포르투갈에서 가장 고전적이고 기품 있는 레드 품종 중 하나입니다. 매우 짙은 색상과 함께 특유의 건조된 허브, 홍차, 그리고 검은 과실의 복합적인 아로마를 선사합니다. 재배가 매우 까다롭지만, 완성되었을 때의 산미와 구조감은 포르투갈 와인의 품격을 한 단계 높여줍니다.',
        history: '포르투갈 도루 계곡과 알렌테주 지역에서 오랫동안 재배되어 온 토착 품종입니다. 비늘과 질병에 매우 취약하여 "재배자의 불평(Malvasia Preta)"이라는 별명이 있을 정도로 까다롭지만, 도루의 척박한 땅에서 살아남아 포트 와인과 고급 드라이 레드의 핵심으로 자리 잡았습니다. 특히 숙성될수록 깊어지는 가죽과 향신료 향 덕분에 장기 숙성용 와인의 감초 같은 역할을 합니다.',
        classifications: [
            { name: 'Trincadeira Varietal', criteria: '알렌테주 등급', description: '포르투갈 남부 알렌테주 지역에서 생산되는, 더 리치하고 허브 향이 강한 단일 품종 와인' },
            { name: 'Reserve Douro Red Component', criteria: '블렌딩 역할', description: '도루의 고급 레드 와인에 특유의 향기로운 복합미와 산도를 부여하여 장기 숙성력을 강화' }
        ],
        sensoryMetrics: [
            { label: '아로마 (Aroma)', metric: '복합미', value: '9/10', description: '홍차, 말린 꽃, 한약재가 어우러진 깊고 고급스러운 향' },
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '적당히 묵직하면서도 날렵하게 떨어지는 세련된 바디' },
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '와인의 전체적인 골격을 지탱해 주는 탄탄한 산미' }
        ],
        flavorTags: [
            { label: '검은 자두', color: 'bg-purple-900/20 text-purple-900' },
            { label: '말린 허브 (Tea)', color: 'bg-amber-100/20 text-amber-800' },
            { label: '정향 (Clove)', color: 'bg-orange-100/20 text-orange-900' }
        ],
        manufacturingProcess: [
            { step: '관리', name: '캐노피 관리', description: '곰팡이 질병을 막고 포도알이 잘 익도록 잎사귀를 하나하나 세심하게 관리합니다.' },
            { step: '발효', name: '저온 침출 및 발효', description: '까다로운 품종의 과실 향과 산미를 끝까지 지키기 위해 낮은 온도에서 정성껏 발효합니다.' }
        ],
        majorRegions: [
            { name: '알렌테주 (Alentejo)', description: '트린카데이라라는 이름으로 가장 화려하게 표현되는 포르투갈 남부의 젖줄', emoji: '🇵🇹' },
            { name: '도루 계곡 (Douro)', description: '가파른 돌산에서 인내하며 자라나 깊은 풍미를 완성하는 곳', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 풍부한 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 고풍스러운 허브 향과 검은 과실 풍미가 가장 잘 피어오르는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['구운 양갈비', '사냥한 고기 요리(꿩, 토끼)', '진한 버섯 소스 요리', '숙성된 경성 치즈']
    },
    sectionsEn: {
        definition: "Tinta Amarela, more famously known as 'Trincadeira' in the Alentejo, is one of Portugal's most classical and distinguished red varieties. It is celebrated for its deep pigment and a profoundly complex bouquet of dried herbs, black tea, and dark forest fruits. While notoriously difficult to cultivate, its presence in a blend guarantees a level of acidity and structural poise that elevates the overall prestige of the wine.",
        history: "A native of both the Douro and Alentejo, the variety is so sensitive to moisture and disease that it was historically dubbed 'the grower's complaint.' Despite its fickle nature, it has endured on the barren slopes of the Douro as a vital component in Port and high-end dry reds. It is particularly valued for its secondary evolution; with age, it develops magnificent layers of leather, spice, and truffle.",
        classifications: [
            { name: 'Trincadeira Varietal', criteria: 'Alentejo Style', description: 'Produces richer, more herb-driven single-varietal wines under the intense sun of Southern Portugal.' },
            { name: 'Reserve Douro Red Component', criteria: 'Blending Role', description: 'Provides essential aromatic complexity and a necessary acidic backbone to ensure long-term aging potential.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Complexity', value: '9/10', description: 'Multilayered notes of black tea, withered flowers, and balsamic herbs.' },
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Possesses a refined, moderately full-bodied presence with a lean, athletic finish.' },
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Firm, structural acidity that acts as the wine’s primary architecture.' }
        ],
        flavorTags: [
            { label: 'Black Plum', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Dried Tea', color: 'bg-amber-100/20 text-amber-800' },
            { label: 'Clove / Allspice', color: 'bg-orange-100/20 text-orange-900' }
        ],
        manufacturingProcess: [
            { step: 'Viticulture', name: 'Canopy Precision', description: 'Requires intensive leaf thinning and canopy management to prevent rot and ensure uniform berry ripening.' },
            { step: 'Fermentation', name: 'Preservationist Fermentation', description: 'Conducted at lower temperatures to safeguard its volatile aromatic compounds and precise tartness.' }
        ],
        majorRegions: [
            { name: 'Alentejo', description: "The variety's spiritual home under the name Trincadeira, yielding its most opulent results.", emoji: '🇵🇹' },
            { name: 'Douro Valley', description: 'Where it struggles and triumphs on schist slopes, contributing depth to legendary blends.', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Generous, tall Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The ideal range for the liberation of its classical herbal and dark fruit bouquet.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Grilled lamb chops', 'Wild game (Pheasant or Hare)', 'Rich mushroom-based stews', 'Aged hard cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['틴타 아마렐라', 'tinta amarela', '트린카데이라', 'trincadeira']
}
