import { SpiritCategory } from '../types'

export const airen: SpiritCategory = {
    slug: 'airen',
    emoji: '🏜️',
    nameKo: '아이렌',
    nameEn: 'Airén',
    taglineKo: '스페인의 강인한 생명력, 브랜디의 투명한 바탕',
    taglineEn: "Spain's resilient spirit, the transparent canvas for brandy",
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '아이렌(Airén)은 한때 세계에서 가장 널리 재배되었던 품종으로, 건조하고 척박한 스페인 고원에서 독보적인 저항력을 자랑합니다. 주로 중성적이고 깔끔한 화이트 와인을 생산하며, 그 투명한 풍미 덕분에 스페인 브랜디(Brandy de Jerez) 증류를 위한 최적의 기초 와인으로 사용됩니다. 현대에 이르러서는 고지대 재배와 세심한 양조를 통해 상쾌한 산미와 과실향을 살린 고품질 테이블 와인으로도 재발견되고 있습니다.',
        history: '아이렌은 스페인 중부 라 만차(La Mancha) 지역에서 수 세기 동안 재배되어 온 토착 품종입니다. 19세기 필록세라(Phylloxera) 재앙 이후, 극심한 가뭄과 척박한 토양에서도 살아남는 강인한 생명력 덕분에 스페인 전역으로 확산되었습니다. 20세기 후반까지 세계에서 가장 많이 재배되는 포도 품종 1위를 기록하기도 했으나, 현재는 품질 위주의 다변화 정책에 따라 재배 면적이 줄어들고 있으며, 대신 양조 기술의 발전으로 더욱 세련된 와인이 생산되고 있습니다.',
        classifications: [
            { name: 'Joven (호벤)', criteria: '숙성 여부', description: '숙성 과정을 거치지 않은 신선하고 가이버운 스타일' },
            { name: 'Base for Brandy', criteria: '용도', description: '브랜디 증류를 위해 산도와 알코올 균형을 맞춘 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '매우 가볍고 중성적' },
            { label: '산도 (Acidity)', metric: '청량감', value: '5/10', description: '온화하고 깔끔한 산미' },
            { label: '향기 (Aroma)', metric: '강도', value: 'Low', description: '은은한 과실향' }
        ],
        flavorTags: [
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '바나나', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '자몽', color: 'bg-yellow-200/20 text-yellow-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '저온 발효', description: '중성적인 품종의 섬세한 과실향을 보존하기 위해 스테인리스 탱크에서 12-15°C의 저온 발효를 진행합니다.' },
            { step: '안정화', name: '단기 숙성', description: '신선함을 극대화하기 위해 오크 숙성보다는 병입 전 짧은 안정화 과정을 거칩니다.' }
        ],
        majorRegions: [
            { name: '라 만차 (La Mancha)', description: '세계 최대의 아이렌 재배지이자 스페인 와인의 심장부', emoji: '🇪🇸' },
            { name: '발데페냐스 (Valdepeñas)', description: '전통적인 아이렌 생산의 또 다른 중요 거점', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '7-10°C', description: '산뜻하고 과실향이 가장 잘 살아나는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 해산물 타파스', '신선한 샐러드', '만체고 치즈'],
    },
    sectionsEn: {
        definition: "Airén was once the most widely planted grape variety in the world, boasting exceptional resilience in the dry, harsh highlands of central Spain. It primarily produces neutral, clean white wines and serves as the perfect base wine for distilling Spanish Brandy (Brandy de Jerez) due to its transparent flavor profile. Today, it is being rediscovered as a high-quality table wine, with modern viticulture in high-altitude vineyards focusing on preserving its refreshing acidity and delicate fruit notes.",
        history: "Airén is an indigenous variety that has been cultivated for centuries in the La Mancha region of central Spain. Following the Phylloxera crisis in the 19th century, its ability to survive in extreme droughts and poor soils led to its widespread expansion across Spain. Until the late 20th century, it held the title of the world's most planted grape. While vineyard area is now decreasing in favor of international varieties, the quality of Airén wine is reaching new heights through advanced winemaking techniques.",
        classifications: [
            { name: 'Joven', criteria: 'Aging', description: 'Fresh and light style that does not undergo aging.' },
            { name: 'Base for Brandy', criteria: 'Usage', description: 'A style balanced in acidity and alcohol specifically for brandy distillation.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Very light and neutral.' },
            { label: 'Acidity', metric: 'Crispness', value: '5/10', description: 'Gentle and clean acidity.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Low', description: 'Subtle fruity notes.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Banana', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Grapefruit', color: 'bg-yellow-200/20 text-yellow-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Low-Temperature Fermentation', description: 'Conducted at 12-15°C in stainless steel tanks to preserve the delicate fruity aromas of this neutral variety.' },
            { step: 'Stabilization', name: 'Short Aging', description: 'Follows a brief stabilization period before bottling to maximize freshness, typically avoiding oak.' }
        ],
        majorRegions: [
            { name: 'La Mancha', description: "The world's largest Airén planting area and the heart of Spanish viticulture.", emoji: '🇪🇸' },
            { name: 'Valdepeñas', description: 'Another historic and significant production hub for the Airén variety.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'White Wine Glass',
            optimalTemperatures: [
                { temp: '7-10°C', description: 'The ideal temperature for showcasing its crisp and fruity character.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light seafood tapas', 'Fresh salads', 'Manchego cheese'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['아이렌', 'airen']
}
