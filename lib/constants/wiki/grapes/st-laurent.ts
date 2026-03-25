import { SpiritCategory } from '../types'

export const stLaurent: SpiritCategory = {
    slug: 'st-laurent',
    emoji: '🪵',
    nameKo: '생 로랑',
    nameEn: 'St. Laurent',
    taglineKo: '오스트리아의 벨벳, 피노 누아의 우아함에 야성미를 한 방울 더하다',
    taglineEn: 'Austrian velvet, adding a drop of wildness to the elegance of Pinot Noir',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '생 로랑(St. Laurent)은 오스트리아에서 유래한 고귀한 레드 품종으로, 피노 누아의 자손답게 매우 섬세하고 부드러운 질감을 지닌 "벨벳 같은 와인"입니다. 짙은 루비색과 함께 블랙베리, 체리, 그리고 은은한 훈연 향이 매력적이며, 피노 누아보다 조금 더 진한 색과 묵직한 힘을 보여주는 것이 특징입니다. 차갑게 마셔도 그 풍미가 훌륭한, 오스트리아 레드의 숨은 보석입니다.',
        history: '이름은 성 로렌조(St. Lawrence)의 축일인 8월 10일경 포도가 익기 시작하는 데서 유래했습니다. 19세기 프랑스에서 오스트리아로 건너와 정착했으며, 오늘날에는 오스트리아의 대표적인 고부가가치 품종으로 대접받고 있습니다. 또한 남아프리카 공화국 등지에서도 시험적으로 재배되며 현대적인 레드 와인 애호가들 사이에서 피노 누아의 훌륭한 대안으로 조종받고 있습니다.',
        classifications: [
            { name: 'Classic St. Laurent', criteria: '스타일 등급', description: '오크 사용을 자제하여 품종 본연의 신선한 베리 향을 살린 스타일' },
            { name: 'Reserve St. Laurent', criteria: '고농축 스타일', description: '새 오크통 숙성을 통해 벨벳 같은 타닌과 장기 숙성력을 갖춘 상급 와인' },
            { name: 'Thermenregion Elite', criteria: '산지 스타일', description: '오스트리아 테르멘레기온의 서늘한 기후에서 생산되는 가장 우아한 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '피노 누아보다 약간 더 묵직한 미디엄 바디' },
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '생기를 불어넣는 상쾌하고 높은 산미' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '4/10', description: '매우 부드럽고 매끄러운 "벨벳" 같은 질감' }
        ],
        flavorTags: [
            { label: '블랙체리', color: 'bg-red-900/20 text-red-900' },
            { label: '베이킹 스파이스', color: 'bg-orange-100/20 text-orange-800' },
            { label: '다크 초콜릿', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: '포도 수확', name: '선별 수확', description: '포도 알이 얇아 쉽게 상할 수 있으므로 매우 조심스럽게 선별하여 수확합니다.' },
            { step: '숙성', name: '프렌치 오크 숙성', description: '특유의 벨벳 질감을 완성하기 위해 주로 부드러운 오크통에서 숙성 과정을 거칩니다.' }
        ],
        majorRegions: [
            { name: '테르멘레기온', description: '오스트리아에서 가장 기품 있는 생 로랑이 탄생하는 곳', emoji: '🇦🇹' },
            { name: '부르겐란트 (Burgenland)', description: '농축미 있고 힘 있는 스타일의 생 로랑 산지', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓은 부르브뉴 스타일 글라스',
            optimalTemperatures: [
                { temp: '14-16°C', description: '섬세한 향기와 피노 누아 계열의 우아함을 가장 잘 느낄 수 있는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['구운 닭고기 요리', '풍미 있는 버섯 리조토', '오리 가슴살 스테이크', '중등도 숙성 치즈']
    },
    sectionsEn: {
        definition: "St. Laurent is a noble Austrian red variety, a spiritual descendant of Pinot Noir characterized by its remarkably silken and plush 'velvety' texture. While it offers the same level of delicacy as Pinot Noir, it presents a deeper ruby color and a slightly more robust physical presence. Known for its alluring bouquet of blackberries, sour cherries, and subtle smoky nuances, it is considered the hidden gem of Austrian red winemaking.",
        history: "The variety is named after St. Lawrence Day (August 10th), the period when its berries traditionally begin to color and ripen. Migrating from France to Austria in the 19th century, it found its perfect home in the cool-climate vineyards near Vienna. Today, it is revered as a premium Austrian specialty and is increasingly sought after by red wine enthusiasts looking for an elegant yet wild alternative to Burgundy.",
        classifications: [
            { name: 'Classic St. Laurent', criteria: 'Style Grade', description: 'Focused on preserving the variety’s pure, fresh forest fruit aromatics with minimal oak.' },
            { name: 'Reserve St. Laurent', criteria: 'Concentrated Style', description: 'Features significant oak aging to build velvety tannins and provide long-term depth.' },
            { name: 'Thermenregion Elite', criteria: 'Regional Style', description: "Hails from the variety’s spiritual center, offering its most ethereal and sophisticated expressions." }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '6/10', description: 'A medium-bodied presence that offers more physical density than Pinot Noir.' },
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Provides a vibrant, refreshing core that keeps the wine lively and energetic.' },
            { label: 'Tannins', metric: 'Astringency', value: '4/10', description: 'Characterized by a famously smooth, supple, and velvety mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Black Cherry', color: 'bg-red-900/20 text-red-900' },
            { label: 'Baking Spices', color: 'bg-orange-100/20 text-orange-800' },
            { label: 'Dark Chocolate', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Scrupulous Sorting', description: 'The thin skins require extremely careful handling and selection during the harvest to ensure berry integrity.' },
            { step: 'Aging', name: 'French Oak Maturation', description: 'Typically matured in high-quality barrels to enhance tertiary complexity and refine its signature texture.' }
        ],
        majorRegions: [
            { name: 'Thermenregion', description: 'The premier global region for high-end, sophisticated St. Laurent.', emoji: '🇦🇹' },
            { name: 'Burgenland', description: 'Produces richer and more powerful expressions under a slightly warmer influence.', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide-bowled Burgundy-style glass',
            optimalTemperatures: [
                { temp: '14–16°C', description: 'The absolute best temperature for enjoying its delicate aromatics and silken profile.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Roasted poultry', 'Rich mushroom risotto', 'Seared duck breast', 'Medium-aged cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['생 로랑', 'st laurent', 'st. laurent']
}
