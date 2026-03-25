import { SpiritCategory } from '../types'

export const roussanne: SpiritCategory = {
    slug: 'roussanne',
    emoji: '🌾',
    nameKo: '루산',
    nameEn: 'Roussanne',
    taglineKo: '론의 우아한 금빛 선율, 허브향과 묵직한 질감의 교향곡',
    taglineEn: 'The elegant golden melody of Rhône, a symphony of herbal aromas and heavy texture',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '루산(Roussanne)은 프랑스 북부 론(Northern Rhône) 지역을 대표하는 가장 고귀한 화이트 품종 중 하나입니다. "적갈색(Roux)"을 뜻하는 프랑스어에서 유래한 이름처럼 잘 익었을 때 포도 껍질이 금갈색으로 변하는 것이 특징입니다. 야생화, 허브, 배 향과 함께 입안을 가득 채우는 풍부한 풍미와 매끄러운 질감을 지녀 "화이트계의 귀족"으로 불립니다.',
        history: '프랑스 론 계곡에서 수 세기 동안 재배되어 왔으며, 특히 마르산(Marsanne) 품종과 함께 에르미타주(Hermitage) 등 전설적인 화이트 와인을 만드는 핵심 성분입니다. 재배가 매우 까다롭고 질병에 취약하여 한때 재배 면적이 크게 줄었으나, 최근 그 독보적인 향기와 풍미가 재조명되면서 다시금 전 세계 화이트 와인 애호가들의 주목을 받고 있습니다.',
        classifications: [
            { name: 'Northern Rhône Blend', criteria: '주요 역할', description: '마르산과 블렌딩되어 와인에 우아한 산도와 화사한 향기를 부여하는 역할' },
            { name: 'Châteauneuf-du-Pape Blanc', criteria: '고급 블렌딩', description: '남부 론 최고의 화이트 와인에서 복합미와 구조감을 담당하는 핵심 품종' },
            { name: 'Varietal Roussanne', criteria: '단독 스타일', description: '최근 캘리포니아 등에서 생산되는, 루산 특유의 허브와 꽃향을 극대화한 단독 품종 와인' }
        ],
        sensoryMetrics: [
            { label: '아로마 (Aroma)', metric: '복합미', value: '10/10', description: '야생화, 인동덩굴, 허브 티가 어우러진 다층적인 향' },
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '입안을 매끄럽게 감싸는 풍부하고 묵직한 오일리함' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '무게감 있는 바디를 세련되게 지탱하는 충분한 산미' }
        ],
        flavorTags: [
            { label: '인동덩굴 (Honeysuckle)', color: 'bg-orange-50/20 text-orange-600' },
            { label: '허브 티', color: 'bg-green-100/20 text-green-700' },
            { label: '살구', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '스킨 컨택', description: '루산 특유의 고귀한 향기와 질감을 더하기 위해 짧은 시간 껍질과 함께 침출하기도 합니다.' },
            { step: '숙성', name: '오크 숙성', description: '복합미를 더하고 구조감을 완성하기 위해 주로 새 오크통이나 중고 오크통에서 숙성을 진행합니다.' }
        ],
        majorRegions: [
            { name: '에르미타주 (Hermitage)', description: '루산과 마르산이 만나 세계 최고의 화이트 와인을 탄생시키는 성지', emoji: '🇫🇷' },
            { name: '샤토네프 뒤 파프', description: '남부 론의 뜨거운 태양 아래 루산의 복합미가 완성되는 곳', emoji: '🇫🇷' },
            { name: '중부 캘리포니아', description: '신대륙에서 루산의 단독 잠재력을 가장 잘 보여주는 산지', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 약간 넓은 화이트 와인 또는 가볍게 오크 숙성된 전용 글라스',
            optimalTemperatures: [
                { temp: '10-12°C', description: '루산 특유의 우아한 꽃향기와 매끄러운 질감이 가장 조화로운 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['크림 소스 닭요리', '풍미가 강한 생선 구이', '트러플 파스타', '숙성된 연성 치즈']
    },
    sectionsEn: {
        definition: "Roussanne is one of the most noble white varieties of the Northern Rhône, distinguished by its unique golden-bronze skin when fully ripe (the name derives from the French 'Roux' for reddish-brown). Revered as the 'Aristocrat of Whites,' it is characterized by an expansive, oily texture and complex aromatics of wildflowers, herbal tea, and stone fruits. It offers a level of physical weight and aromatic sophistication that few other white grapes can match.",
        history: "Cultivated for centuries in the Rhône Valley, Roussanne is a vital component in legendary wines like Hermitage Blanc, where it is traditionally paired with Marsanne. Despite being notoriously difficult to grow and susceptible to disease, its sheer quality and aromatic potential have led to a significant global revival, with winemakers from California to Australia now exploring its singular personality.",
        classifications: [
            { name: 'Northern Rhône Blend', criteria: 'Primary Role', description: 'Provides aromatic lift, acidity, and elegance when blended with the weightier Marsanne.' },
            { name: 'Châteauneuf-du-Pape Blanc', criteria: 'Premium Blend', description: 'Contributes structural complexity and vital aromatics to the prestigious white blends of the Southern Rhône.' },
            { name: 'Varietal Roussanne', criteria: 'Singular Style', description: 'Increasingly popular in the US and Australia, showcasing its pure herbal and floral essence.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Complexity', value: '10/10', description: 'Multilayered notes of honeysuckle, camomile tea, and crushed stones.' },
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'Lush, expansive, and oily mouthfeel that coats the palate.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Sufficiently firm to provide balance to its significant physical weight.' }
        ],
        flavorTags: [
            { label: 'Honeysuckle', color: 'bg-orange-50/20 text-orange-600' },
            { label: 'Herbal Tea', color: 'bg-green-100/20 text-green-700' },
            { label: 'Apricot', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Skin Contact', description: 'Sometimes employed for short periods to enhance the variety’s specific phenolic structure and aromatics.' },
            { step: 'Aging', name: 'Oak Maturation', description: 'Frequently aged in neutral or new oak barrels to build textural depth and introduce tertiary complexities.' }
        ],
        majorRegions: [
            { name: 'Hermitage', description: 'The absolute spiritual home where Roussanne helps create world-class whites.', emoji: '🇫🇷' },
            { name: 'Châteauneuf-du-Pape', description: 'A key region where it achieves plushness and aromatic ripeness under the hot southern sun.', emoji: '🇫🇷' },
            { name: 'Central Coast, California', description: "Recognized as a leading site for high-quality, expressive varietal Roussanne.", emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Slightly wide-bowled White or Light Oak glass',
            optimalTemperatures: [
                { temp: '10–12°C', description: 'Ideal for showcasing its elegant floral bouquet and characteristic silken texture.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Creamy chicken dishes', 'Richly flavored grilled fish', 'Truffle-infused pasta', 'Aged soft cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['루산', 'roussanne']
}
