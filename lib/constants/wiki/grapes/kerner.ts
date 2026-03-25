import { SpiritCategory } from '../types'

export const kerner: SpiritCategory = {
    slug: 'kerner',
    emoji: '🍋',
    nameKo: '케르너',
    nameEn: 'Kerner',
    taglineKo: '리슬링의 후계자, 견고한 구조와 화사한 머스캣 향의 조화',
    taglineEn: 'Successor to Riesling, a harmony of solid structure and bright Muscat aromatics',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '케르너(Kerner)는 독일에서 가장 성공적으로 정착한 교배 품종 중 하나로, 리슬링(Riesling)의 우아한 산도와 트롤링거(Trollinger)의 견고한 생명력을 동시에 물려받았습니다. 신선한 시트러스, 사과, 그리고 살구 향을 기본으로 은은한 머스캣(Muscat) 풍미가 감도는 것이 특징이며, 리슬링보다 조금 더 묵직한 바디감과 높은 알코올 함량을 보여줍니다.',
        history: '1929년 독일 바덴뷔르템베르크 주의 바인스베르크(Weinsberg) 연구소에서 아우구스트 헤롤드(August Herold)에 의해 탄생했습니다. 이름은 이 지역 출신의 시인이자 의사였던 유스티누스 케르너(Justinus Kerner)를 기리기 위해 붙여졌습니다. 혹독한 겨울 추위에도 잘 견디고 리슬링처럼 늦게 싹을 틔우면서도 더 빨리 익는 장점 덕분에 독일 전역과 이탈리아 알토 아디제 지역에서 큰 인기를 얻었습니다.',
        classifications: [
            { name: 'Qualitätswein', criteria: '독일 품질 등급', description: '기본적인 품질이 보증된 상용 등급의 케르너 와인' },
            { name: 'Alto Adige Kerner DOC', criteria: '이탈리아 산지 스타일', description: '이탈리아 북부 고지대에서 생산되는 극도로 미네랄리티가 높은 상급 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '8/10', description: '리슬링에 견줄 만큼 견고하고 힘찬 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '리슬링보다 약간 더 묵직하고 실키한 질감' },
            { label: '아로마 (Aroma)', metric: '강도', value: 'High', description: '시트러스와 은은한 꽃향기가 어우러진 아로마' }
        ],
        flavorTags: [
            { label: '레몬즙', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '살구', color: 'bg-orange-100/20 text-orange-700' },
            { label: '백후추', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '저온 발효', description: '케르너의 화사한 꽃향기와 과실미를 보존하기 위해 차가운 온도에서 발효를 진행합니다.' },
            { step: '숙성', name: '단기 앙금 숙성 (Lees)', description: '입안에서의 풍성함을 더하기 위해 발효 후 짧은 기간 효모 앙금과 함께 보관하기도 합니다.' }
        ],
        majorRegions: [
            { name: '팔츠 & 라인헤센 (Pfalz & Rheinhessen)', description: '독일 내 케르너 생산의 핵심 중심지', emoji: '🇩🇪' },
            { name: '알토 아디제 (Alto Adige)', description: '이탈리아의 고지대에서 자란 텐션 있는 최고급 케르너의 성지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립 모양의 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '신선한 산미와 향기로운 머스캣 풍미가 가장 잘 조화되는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['매콤한 아시안 퀴진', '허브를 곁들인 구운 가금류', '신선한 해산물 샐러드', '여름철 채소 요리']
    },
    sectionsEn: {
        definition: "Kerner is one of Germany’s most successful crossings, inheriting the noble acidity of Riesling and the robust vitality of Trollinger. It is characterized by fresh notes of citrus, apple, and apricot, underscored by a subtle yet distinctive Muscat-like perfume. Generally possessing more body and higher alcohol than Riesling, it offers a sturdy and flavorsome alternative for white wine enthusiasts.",
        history: "Developed in 1929 by August Herold at the Weinsberg research institute in Baden-Württemberg, the grape was named in honor of Justinus Kerner, a 19th-century local poet and physician. Prized for its ability to withstand harsh winters and late frosts—ripening earlier than Riesling while sharing its high-acid potential—it gained significant popularity across Germany and the high-altitude vineyards of Italy's Alto Adige.",
        classifications: [
            { name: 'Qualitätswein', criteria: 'German Quality Grade', description: 'The standard quality designation in Germany indicating a reliable and expressive varietal wine.' },
            { name: 'Alto Adige Kerner DOC', criteria: 'Italian Style', description: 'Produced in Northern Italy’s Dolomites, known for extreme minerality, tension, and high-altitude elegance.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '8/10', description: 'Firm and energetic acidity comparable to that of Riesling.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Slightly weightier and silkier on the palate than a typical Riesling.' },
            { label: 'Aroma', metric: 'Complexity', value: 'High', description: 'A vibrant blend of citrus and delicate floral/musky aromatics.' }
        ],
        flavorTags: [
            { label: 'Lemon Zest', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Apricot', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'White Pepper', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Cool Temperature Fermentation', description: "Focuses on preserving the variety's vibrant floral and fruit-led ester profile." },
            { step: 'Aging', name: 'Short Lees Maturation', description: 'Often kept on the lees for a few months post-fermentation to enhance the mid-palate richness.' }
        ],
        majorRegions: [
            { name: 'Pfalz & Rheinhessen', description: 'The core production areas for German Kerner, offering a wide range of styles.', emoji: '🇩🇪' },
            { name: 'Alto Adige', description: "Italy's high-altitude home for some of the world's most prestigious and refined Kerner wines.", emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped White Wine Glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The ideal temperature to balance its structural acidity with its fragrant aromatics.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Spicy Asian fusion', 'Herb-roasted poultry', 'Fresh seafood salads', 'Summer vegetable dishes']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['케르너', 'kerner']
}
