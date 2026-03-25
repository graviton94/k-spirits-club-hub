import { SpiritCategory } from '../types'

export const melonDeBourgogne: SpiritCategory = {
    slug: 'melon-de-bourgogne',
    emoji: '🐚',
    nameKo: '멜롱 드 부르고뉴',
    nameEn: 'Melon de Bourgogne',
    taglineKo: '바다의 전설, 뮈스카데(Muscadet)가 빚어낸 짭조름한 조개껍데기의 노래',
    taglineEn: 'The legend of the sea, the salty song of shells crafted by Muscadet',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '멜롱 드 부르고뉴(Melon de Bourgogne), 혹은 흔히 "뮈스카데(Muscadet)"로 불리는 이 품종은 프랑스 루아르 밸리 하구에서 탄생하는 가장 해산물 친화적인 화이트 와인입니다. 이름처럼 부르고뉴에서 유래했으나 현재는 낭트 지역의 상징이 되었으며, 날카로운 산미와 중성적인 과실향, 그리고 대서양의 정취를 담은 짭조름한 미네랄리티가 이 품종의 정체성입니다.',
        history: '원래 부르고뉴가 고향이었으나 18세기 초 혹독한 추위로 부르고뉴에서 퇴출된 후, 루아르 밸리의 서쪽 끝 낭트 지역으로 옮겨졌습니다. 그곳의 서늘하고 습한 기후에 완벽히 적응하며 뮈스카데라는 이름으로 전 세계 굴 애호가들에게 없어서는 안 될 존재로 자리 잡았습니다. 20세기 후반 "쉬르 리(Sur Lie)" 양조 기법의 도입으로 품종 고유의 가벼움에 깊이와 질감을 더하며 한층 진화했습니다.',
        classifications: [
            { name: 'Muscadet Sèvre et Maine', criteria: '산지 등급', description: '가장 중요하고 품질이 뛰어난 뮈스카데 생산 지역' },
            { name: 'Sur Lie', criteria: '양조 방식', description: '발효 후 효모 찌꺼기 위에서 숙성하여 질감과 신선함을 더한 최상급 스타일' },
            { name: 'Cru Communaux', criteria: '최고급 테루아', description: '특정 마을의 우수한 테루아를 반영하여 최소 18개월 이상 숙성한 프리미엄 뮈스카데' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '입안을 짜릿하게 만드는 매우 높고 바삭한 산미' },
            { label: '미네랄 (Minerality)', metric: '풍미', value: '10/10', description: '바닷물, 조개껍데기, 젖은 돌 같은 해양 미네랄리티의 정수' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '매우 가볍고 직선적이며 투명한 질감' }
        ],
        flavorTags: [
            { label: '레몬 껍질', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '소금기 (Saline)', color: 'bg-blue-100/20 text-blue-700' },
            { label: '청사과', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '숙성', name: '쉬르 리 (Sur Lie)', description: '겨울 동안 효모 앙금과 함께 숙성하여 이산화탄소가 미세하게 녹아들어 신선함과 질감을 극대화합니다.' },
            { step: '온도 조절', name: '저온 발효', description: '멜롱 품종의 섬세하고 중성적인 향을 보존하기 위해 차가운 스테인리스 탱크에서 발효합니다.' }
        ],
        majorRegions: [
            { name: '페이 낭테 (Pays Nantais)', description: '전 세계 멜롱 드 부르고뉴 재배의 절대적인 중심지', emoji: '🇫🇷' },
            { name: '뮈스카데 세브르 에 멘', description: '가장 복합미 있는 멜롱 드 부르고뉴가 생산되는 루아르의 핵심지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '입구가 좁고 직선적인 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '7-9°C', description: '뮈스카데 특유의 바삭한 산미와 미네랄리티가 가장 돋보이는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['생굴(Oysters)', '모듬 해산물 플래터(Plateau de Fruits de Mer)', '가벼운 생선 회', '조개 찜']
    },
    sectionsEn: {
        definition: "Melon de Bourgogne, most commonly referred to as 'Muscadet' after its primary region, is France's ultimate seafood-friendly white wine. Hailing from the mouth of the Loire Valley, this variety is defined by its piercingly sharp-edged acidity, neutral fruit profile, and a distinctive saline minerality that captures the essence of the Atlantic. It is the definitive companion for oysters and fresh shellfish.",
        history: "Despite its name, its origins in Burgundy were cut short in the early 18th century after a devastating frost led to its displacement to the Nantes region at the far western end of the Loire Valley. There, it adapted perfectly to the cool, maritime climate. The introduction of the 'Sur Lie' winemaking technique in the late 20th century transformed the variety from a simple light white into a sophisticated wine with textural depth and yeasty complexity.",
        classifications: [
            { name: 'Muscadet Sèvre et Maine', criteria: 'Regional Tier', description: 'The most prestigious and significant production area for high-quality Muscadet.' },
            { name: 'Sur Lie', criteria: 'Winemaking Style', description: 'Aged on the yeast lees to introduce creamy texture, depth, and a characteristic slight spritz.' },
            { name: 'Cru Communaux', criteria: 'Premium Terroir', description: 'Designated village-specific crus that require at least 18 months of aging for maximum complexity.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '9/10', description: 'Zip and zingy acidity that makes it electrically refreshing.' },
            { label: 'Minerality', metric: 'Depth', value: '10/10', description: 'The quintessence of maritime minerals, oyster shells, and sea spray.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Light, lean, and incredibly focused on the palate.' }
        ],
        flavorTags: [
            { label: 'Lemon Peel', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Saline', color: 'bg-blue-100/20 text-blue-700' },
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Aging', name: 'Sur Lie Maturation', description: 'Extended contact with yeast lees during winter imparts a rounder mouthfeel and captures a hint of natural CO2.' },
            { step: 'Fermentation', name: 'Cool Stainless Steel', description: "Preserves the delicate and subtle aromas of the Melon variety without any external flavor influence." }
        ],
        majorRegions: [
            { name: 'Pays Nantais', description: "The global epicenter of Melon de Bourgogne cultivation on the Loire's Atlantic coast.", emoji: '🇫🇷' },
            { name: 'Muscadet Sèvre et Maine', description: "The premier sub-region responsible for the most complex and age-worthy 'Sur Lie' expressions.", emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Narrow-rimmed, upright White Wine glass',
            optimalTemperatures: [
                { temp: '7–9°C', description: 'Ideal for emphasizing its crisp acidity and briny mineral character.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Fresh Oysters', 'Assorted Seafood Platters', 'Sashimi', 'Steamed clams']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['멜롱 드 부르고뉴', 'melon de bourgogne', '뮈스카데', 'muscadet']
}
