import { SpiritCategory } from '../types'

export const tourigaNacional: SpiritCategory = {
    slug: 'touriga-nacional',
    emoji: '🇵🇹',
    nameKo: '투리가 나시오날',
    nameEn: 'Touriga Nacional',
    taglineKo: '포르투갈의 자존심, 웅장한 색과 제비꽃 향의 압도적 카리스마',
    taglineEn: 'The pride of Portugal, overwhelming charisma of grand color and violet aroma',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '투리가 나시오날(Touriga Nacional)은 포르투갈을 대표하는 가장 고귀하고 위대한 레드 품종입니다. 세계 최고의 강화 와인인 "포트(Port) 와인"의 핵심 성분이자, 압도적인 색조와 탄탄한 타닌, 그리고 베르가모트와 제비꽃의 화사한 향이 특징입니다. 레드 와인이 가질 수 있는 웅장한 구조감과 우아함을 동시에 지닌, 포르투갈 와인의 정수라 할 수 있습니다.',
        history: '포르투갈 북부 다우(Dão) 지역에서 유래한 것으로 알려져 있으며, 수 세기 동안 도루(Douro) 계곡의 가파른 테루아에서 가장 높은 가치를 지닌 품종으로 군림해 왔습니다. 수확량이 매우 적어 한때 위기를 겪기도 했으나, 그 독보적인 품질 덕분에 다시금 포르투갈 전역으로 확산되었습니다. 오늘날에는 포트 와인을 넘어 위대한 드라이 레드 와인의 주인공으로서 전 세계 평론가들의 극찬을 받고 있습니다.',
        classifications: [
            { name: 'Vintage Port Component', criteria: '최고급 강화 와인', description: '최고급 빈티지 포트에 웅장한 색, 타닌, 그리고 장기 숙성을 위한 골격을 제공' },
            { name: 'Douro Tinto Superior', criteria: '드라이 스타일', description: '도루 계곡의 뜨거운 열기를 머금은, 농축미 넘치는 프리미엄 드라이 레드' },
            { name: 'Dão Elegance', criteria: '산지 스타일', description: '고향인 다우 지역 특유의 우아함과 세밀한 산미가 돋보이는 스타일' }
        ],
        sensoryMetrics: [
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '빛을 투과하지 않는 짙고 잉크 같은 루비-블랙' },
            { label: '향기 (Aroma)', metric: '화사함', value: '10/10', description: '제비꽃과 베르가모트가 어우러진 매우 독창적이고 고급스러운 향' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '9/10', description: '입안을 견고하게 잡아주는 힘차고 입자가 고운 타닌' }
        ],
        flavorTags: [
            { label: '제비꽃 (Violet)', color: 'bg-purple-100/20 text-purple-700' },
            { label: '블랙커런트', color: 'bg-purple-900/20 text-purple-900' },
            { label: '얼 그레이 / 베르가모트', color: 'bg-amber-100/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '라가르(Lagares) 침출', description: '포트 와인 제조 시 전통적인 돌 탱크(Lagary)에서 발로 밟아 유효 성분을 고도로 추출합니다.' },
            { step: '숙성', name: '장기 오크 숙성', description: '강력한 타닌을 부드럽게 다듬기 위해 고품질 프렌치 오크통에서 수개월 이상 숙성합니다.' }
        ],
        majorRegions: [
            { name: '도루 계곡 (Douro)', description: '전설적인 포트 와인과 위대한 드라이 레드가 탄생하는 험준한 산지', emoji: '🇵🇹' },
            { name: '다우 (Dão)', description: '투리가 나시오날의 고향이자 가장 우아한 스타일을 생산하는 곳', emoji: '🇵🇹' },
            { name: '알렌테주', description: '뜨거운 기후에서 보다 리치하고 부드러운 투리가를 생산하는 곳', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 풍부하고 깊은 대형 레드 또는 포트 와인 전용 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 화사한 꽃향기와 웅장한 타닌이 가장 기품 있게 드러나는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['숯불에 구운 스테이크', '진한 풍미의 사슴/양고기', '다크 초콜릿(포트 와인과 함께)', '숙성된 치즈']
    },
    sectionsEn: {
        definition: "Touriga Nacional is the undisputed sovereign of Portuguese red grapes, widely regarded as the most noble variety of the nation. It is the essential backbone of the world's finest Fortified Port wines, characterized by an intensely deep pigment, formidable tannic structure, and a signature bouquet of Bergamot and violets. It represents a rare intersection of monumental power and refined elegance, standing as the absolute essence of Portuguese viticulture.",
        history: "Believed to have originated in the Dão region of Northern Portugal, it has reigned for centuries as the most prized variety on the steep slopes of the Douro Valley. Although it nearly faced extinction in the 20th century due to low yields, its sheer quality led to a nationwide resurgence. Today, beyond its role in Port, it is celebrated globally as a premier varietal for producing world-class, cellar-worthy dry red wines.",
        classifications: [
            { name: 'Vintage Port Component', criteria: 'Premium Fortified', description: 'Provides the essential color, tannins, and structural longevity for the most prestigious Vintage Ports.' },
            { name: 'Douro Tinto Superior', criteria: 'Dry Style', description: 'High-end dry reds that capture the concentrated heat and mineral depth of the Douro Valley.' },
            { name: 'Dão Elegance', criteria: 'Regional Style', description: 'The ancestral source producing expressions noted for their floral lift and refined acidic balance.' }
        ],
        sensoryMetrics: [
            { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Opaque, inky black-ruby hues even in dry versions.' },
            { label: 'Aroma', metric: 'Complexity', value: '10/10', description: 'An unmistakable and sophisticated blend of violets, rose petals, and Earl Grey tea.' },
            { label: 'Tannins', metric: 'Astringency', value: '9/10', description: 'Powerful, sophisticated, and fine-grained, ensuring immense aging potential.' }
        ],
        flavorTags: [
            { label: 'Violet', color: 'bg-purple-100/20 text-purple-700' },
            { label: 'Blackcurrant', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Earl Grey / Bergamot', color: 'bg-amber-100/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: 'Extraction', name: 'Lagares Maceration', description: 'Traditionally foot-trodden in stone troughs (Lagares) to maximize extraction of its high phenolic load while maintaining seed integrity.' },
            { step: 'Aging', name: 'Extended Oak Aging', description: 'Matured for significant periods in quality French oak to tame its vigorous tannins and harmonize the floral aromatics.' }
        ],
        majorRegions: [
            { name: 'Douro Valley', description: 'The rugged spiritual heartland for legendary Port and world-class dry reds.', emoji: '🇵🇹' },
            { name: 'Dão', description: 'The historic birthplace known for producing the variety’s most elegant and poised wines.', emoji: '🇵🇹' },
            { name: 'Alentejo', description: 'A warmer region producing riper, more approachable, and plush expressions.', emoji: '🇵🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Large, deep Red Wine or dedicated Port glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The sweet spot for allowing the floral bouquet and structural tannins to integrate seamlessly.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Grilled ribeye steak', 'Venison or wild boar', 'Dark chocolate (with Port)', 'Pungent aged cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['투리가 나시오날', 'touriga nacional', '포르투갈', '도루']
}
