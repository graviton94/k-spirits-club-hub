import { SpiritCategory } from '../types'

export const silvaner: SpiritCategory = {
    slug: 'silvaner',
    emoji: '🏔️',
    nameKo: '실바너',
    nameEn: 'Silvaner',
    taglineKo: '대지의 목소리, 독일 프랑켄이 빚어낸 정직한 미네랄과 중성미',
    taglineEn: 'The voice of the earth, honest minerality and neutrality crafted by German Franconia',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '실바너(Silvaner)는 독일과 오스트리아 지역에서 오랜 역사를 지닌 화이트 품종으로, 테루아를 가장 정직하게 반영하는 "투명한 도화지" 같은 품종입니다. 화려한 아로마를 뽐내기보다 대지의 흙 내음, 젖은 돌, 그리고 은은한 허브와 초록 사과 향을 전달하는 데 집중합니다. 특히 독일 프랑켄(Franken) 지역에서는 리슬링보다 높은 위상을 차지하며, 특유의 납작한 병(Bocksbeutel)에 담겨 명성을 이어가고 있습니다.',
        history: '중부 유럽에서 유래한 것으로 보이며, 17세기 오스트리아에서 독일로 건너와 정착한 것으로 알려져 있습니다. 과거에는 수확량이 많아 저가 벌크 와인용으로 오해받기도 했으나, 점토질이나 석회질 토양에서 자란 고품질 실바너는 그 어떤 품종보다도 깊은 대지의 맛을 선사합니다. 오늘날에는 알자스와 독일 전역에서 리슬링과는 또 다른 매력을 가진 고품격 드라이 화이트로 재평가받고 있습니다.',
        classifications: [
            { name: 'Franken Silvaner', criteria: '최고급 산지', description: '독특한 복스보이텔(Bocksbeutel) 병에 담긴, 가장 미네랄이 풍부하고 강력한 스타일' },
            { name: 'Alsace Sylvaner', criteria: '프랑스 스타일', description: '신선하고 마시기 편한 스타일로, 가벼운 식사나 해산물과 잘 어울림' },
            { name: 'Eiswein Silvaner', criteria: '희귀 스타일', description: '얼어붙은 실바너 포도를 수확하여 만든, 정교한 산미를 지닌 명품 아이스와인' }
        ],
        sensoryMetrics: [
            { label: '미네랄 (Minerality)', metric: '산지 특성', value: '9/10', description: '석회질/점토 토양에서 유래한 젖은 돌과 볏짚의 풍미' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '식도를 깔끔하게 정리해 주는 중등도 이상의 산미' },
            { label: '향기 (Aroma)', metric: '강도', value: 'Medium', description: '그린 허브, 풋사과, 은은한 스모키함' }
        ],
        flavorTags: [
            { label: '풋사과', color: 'bg-green-100/20 text-green-700' },
            { label: '젖은 돌', color: 'bg-slate-200/20 text-slate-700' },
            { label: '타임 / 건초', color: 'bg-amber-50/20 text-amber-700' }
        ],
        manufacturingProcess: [
            { step: '재배', name: '토양 선택', description: '미네랄리티를 극대화하기 위해 배수가 잘 되는 석회질이나 점토질 토양을 선별하여 재배합니다.' },
            { step: '발효', name: '앙금 접촉 숙성', description: '중성적인 매력을 보완하고 질감을 매끄럽게 다듬기 위해 효모 앙금과 함께 숙성 과정을 거치기도 합니다.' }
        ],
        majorRegions: [
            { name: '프랑켄 (Franken)', description: '실바너가 가장 위대하고 힘 있게 표현되는 세계 최고의 성지', emoji: '🇩🇪' },
            { name: '알자스 (Alsace)', description: '오래된 고목(Vieilles Vignes)에서 나오는 집중도 높은 실바너의 산지', emoji: '🇫🇷' },
            { name: '라인헤센 (Rheinhessen)', description: '모던하고 세련된 스타일의 드라이 실바너를 생산하는 곳', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '실바너 특유의 깔끔한 미네랄리티와 허브 향이 가장 명징하게 느껴지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['화이트 아스파라거스(슈파겔) 요리', '각종 생선 찜', '독일식 감자 샐러드', '굴 또는 가리비']
    },
    sectionsEn: {
        definition: "Silvaner is a historic white variety from Central Europe, revered as a 'transparent canvas' that honestly reflects the nuances of its terroir. Eschewing flamboyant aromatics, it focuses on delivering earthy undertones, wet stone minerality, and subtle notes of green apple and fresh herbs. In the German region of Franconia, it holds a prestige even greater than Riesling, famously presented in the distinctive, flattened 'Bocksbeutel' bottle.",
        history: "Likely originating in Central Europe, Silvaner is thought to have migrated from Austria to Germany in the 17th century. While it was once mass-produced for lower-quality bulk wines, high-end Silvaner grown on clay and limestone soils offers a profound connection to the land. Today, across Alsace and Germany, it is undergoing a renaissance as a premium dry white with a unique identity distinct from Riesling.",
        classifications: [
            { name: 'Franken Silvaner', criteria: 'Premium Home', description: 'Powerfully mineral and structured, traditionally bottled in the iconic Bocksbeutel.' },
            { name: 'Alsace Sylvaner', criteria: 'French Style', description: 'Typically fresh, zippy, and approachable, making it an ideal companion for simple seafood.' },
            { name: 'Eiswein Silvaner', criteria: 'Rare Style', description: "Exquisite ice wines made from frozen berries, balancing honeyed sweetness with precise acidity." }
        ],
        sensoryMetrics: [
            { label: 'Minerality', metric: 'Terroir Depth', value: '9/10', description: 'Prominent notes of wet stone, hay, and damp earth from rich clay soils.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Moderate-to-high acidity that provides a clean and appetizing finish.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Subtle herbals, green orchard fruits, and a faint hint of smokiness.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Wet Stone', color: 'bg-slate-200/20 text-slate-700' },
            { label: 'Thyme / Hay', color: 'bg-amber-50/20 text-amber-700' }
        ],
        manufacturingProcess: [
            { step: 'Viticulture', name: 'Strategic Soil Selection', description: 'Cultivated carefully on limestone and clay slopes to maximize the variety’s specific mineral properties.' },
            { step: 'Aging', name: 'Lees Maturation', description: 'Often kept on the lees post-fermentation to add a supple, silken texture to its neutral flavor profile.' }
        ],
        majorRegions: [
            { name: 'Franconia', description: 'The undisputed global spiritual center for powerful, dry, and mineral Silvaner.', emoji: '🇩🇪' },
            { name: 'Alsace', description: 'Produces concentrated expressions often from old vines (Vieilles Vignes) that highlight its purity.', emoji: '🇫🇷' },
            { name: 'Rheinhessen', description: 'Home to a new generation of winemakers producing modern, elegant dry Silvaner.', emoji: '🇩🇪' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The absolute best range for enjoying its clean mineral focus and herbal aromatics.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['White Asparagus (Spargel)', 'Steam or poached fish', 'German-style potato salad', 'Fresh oysters or scallops']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['실바너', 'silvaner', 'sylvaner', '프랑켄', 'franken']
}
