import { SpiritCategory } from '../types'

export const tourigaFranca: SpiritCategory = {
    slug: 'touriga-franca',
    emoji: '🍇',
    nameKo: '투리가 프랑카',
    nameEn: 'Touriga Franca',
    taglineKo: '도루의 숨은 조율사, 화사한 향기와 정교한 산미의 예술',
    taglineEn: 'The hidden orchestrator of Douro, the art of brilliant aroma and refined acidity',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '투리가 프랑카(Touriga Franca)는 포르투갈 도루(Douro) 계곡에서 가장 널리 재배되는 핵심 레드 품종입니다. 투리가 나시오날의 파워풀한 동반자로, 와인에 화사한 야생화 향기와 신선한 붉은 과실, 그리고 우아한 산미를 부여하는 역할을 합니다. 투리가 나시오날이 골격이라면, 투리가 프랑카는 그 위에 입히는 화려한 색채와 섬세한 숨결 같은 품종입니다.',
        history: '도루 지역에서 오랜 시간 "투리가 프란세사"라는 이름으로 불리며 포트 와인 블렌딩의 3대 핵심 품종 중 하나로 자리를 지켜왔습니다. 수확량이 안정적이고 토양 적응력이 뛰어나 도루 계곡에서 가장 많이 식재되어 있습니다. 과거에는 조연의 이미지가 강했으나, 최근에는 특유의 향기로운 매력과 밸런스를 인정받아 고급 드라이 와인의 핵심 성분으로 재평가받고 있습니다.',
        classifications: [
            { name: 'Classic Port Blend', criteria: '블렌딩 역할', description: '포트 와인 블렌딩 시 화사한 꽃향기와 산도를 더해 밸런스를 잡아주는 역할' },
            { name: 'Superior Douro Red', criteria: '드라이 스타일', description: '투리가 나시오날과 함께 어우러져 우아하고 복합적인 명품 드라이 레드 와인 탄생' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '화사함', value: '9/10', description: '야생화, 장미 잎, 신선한 석류가 연상되는 향기로운 아로마' },
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '와인의 생동감을 유지해 주는 깨끗하고 정교한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '부드러우면서도 탄력 있는 미디엄-풀 바디' }
        ],
        flavorTags: [
            { label: '야생화 / 장미', color: 'bg-pink-100/20 text-pink-700' },
            { label: '붉은 석류', color: 'bg-red-200/20 text-red-700' },
            { label: '허브 (Rock Rose)', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중령 조절 발효', description: '투리가 프랑카 특유의 섬세한 향을 지키기 위해 너무 높지 않은 온도에서 발효를 진행합니다.' },
            { step: '블렌딩', name: '시너지 블렌딩', description: '투리가 나시오날의 강력한 타닌을 부드럽게 감싸주는 성분으로 주로 활용됩니다.' }
        ],
        majorRegions: [
            { name: '도루 계곡 (Douro)', description: '투리가 프랑카가 전체 포도밭의 약 5분의 1을 차지하는 절대적 산지', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '향을 잘 모아주는 표준 또는 대형 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-17°C', description: '화사한 꽃향기와 신선한 과실미가 가장 매력적으로 피어오르는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['구운 오리고기', '향신료를 곁들인 돼지고기', '각종 포르투갈 전통 요리', '부드러운 치즈']
    },
    sectionsEn: {
        definition: "Touriga Franca is the most widely planted and essential red variety of Portugal's Douro Valley. Often acting as the elegant counterpart to the powerful Touriga Nacional, it contributes a brilliant floral lift, fresh red fruit character, and sophisticated acidity to any blend. If Touriga Nacional provides the structural bones of a wine, Touriga Franca supplies the vibrant color and fragrant breath that completes the masterpiece.",
        history: "Long known in the region as 'Touriga Francesa,' it has established itself as one of the three paramount components of all great Port wines. Prized by viticulturists for its stable yields and resilience in the Douro's harsh climate, it occupies more vineyard space than any other premium variety in the valley. Once seen strictly as a supporting player, it is now globally recognized for the crucial aromatic balance it brings to high-end dry red wines.",
        classifications: [
            { name: 'Classic Port Blend', criteria: 'Blending Role', description: 'Provides essential floral aromatics and acidic lift to balance the weight of premium Port blends.' },
            { name: 'Superior Douro Red', criteria: 'Dry Style', description: 'A key component in the valley’s top dry wines, offering elegance and aromatic complexity.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Intensity', value: '9/10', description: 'Exquisite notes of wildflowers, rose petals, and fresh pomegranate.' },
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Clean and precise acidity that ensures vitality and a refreshing finish.' },
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Features a supple yet resilient medium-to-full bodily presence.' }
        ],
        flavorTags: [
            { label: 'Wildflowers / Rose', color: 'bg-pink-100/20 text-pink-700' },
            { label: 'Pomegranate', color: 'bg-red-200/20 text-red-700' },
            { label: 'Rock Rose (Cistus)', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Fragrance-Focused Fermentation', description: 'Conducted at moderate temperatures to protect the variety’s delicate floral and fruit profile.' },
            { step: 'Blending', name: 'Synergy Synthesis', description: 'Traditionally utilized to soften the muscular tannins of Touriga Nacional while adding aromatic lift.' }
        ],
        majorRegions: [
            { name: 'Douro Valley', description: 'The undisputed heartland where the variety dominates the vineyard landscape.', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard or Large Red Wine glass that concentrates aromatics',
            optimalTemperatures: [
                { temp: '16–17°C', description: 'The absolute best range for enjoying its perfume and fresh fruit vitality.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Roasted duck', 'Herb-crusted pork', 'Traditional Portuguese stews', 'Mild soft cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['투리가 프랑카', 'touriga franca', '도루', 'douro']
}
