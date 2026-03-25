import { SpiritCategory } from '../types'

export const mullerThurgau: SpiritCategory = {
    slug: 'muller-thurgau',
    emoji: '🏔️',
    nameKo: '뮐러 트루가우',
    nameEn: 'Müller-Thurgau',
    taglineKo: '알프스의 상쾌함, 가볍고 화사한 꽃향기와 일상의 즐거움',
    taglineEn: 'Alpine freshness, light and brilliant floral aroma and everyday joy',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '뮐러 트루가우(Müller-Thurgau)는 독일 화이트 와인의 실용성과 화사함을 상징하는 품종입니다. 1882년 헤르만 뮐러 박사에 의해 리슬링과 실바너의 장점을 결합하기 위해 개발되었으나(실제로는 리슬링과 마들렌 로열의 교배), 오늘날에는 가볍게 마시기 좋은 데일리 와인으로 큰 사랑을 받고 있습니다. 은은한 복숭아 향과 꽃향기, 그리고 낮은 산도 덕분에 누구나 편안하게 즐길 수 있는 "친근한 화이트"입니다.',
        history: '독일 와인 현대화의 산증인 같은 품종입니다. 리슬링보다 재배가 쉽고 더 빨리 익는 특성 덕분에 제2차 세계대전 이후 독일 와인 산업의 부흥을 이끌었습니다. 한때 독일에서 가장 많이 재배되는 품종이었으며, 현재는 독일뿐만 아니라 오스트리아, 북이탈리아, 뉴질랜드 등 서늘한 기후를 가진 전 세계 산지에서 특유의 상쾌하고 가벼운 매력을 뽐내고 있습니다.',
        classifications: [
            { name: 'German Müller-Thurgau', criteria: '표준 스타일', description: '독일 전역에서 생산되는, 꽃향기와 머스캣 향이 살짝 가미된 가벼운 데일리 와인' },
            { name: 'Rivaner', criteria: '별칭 스타일', description: '리슬링+실바너의 약자로 불리며, 대개 더 드라이하고 깔끔하게 빚은 스타일' },
            { name: 'Alto Adige Müller', criteria: '고급 산지', description: '이탈리아 북부 고지대의 서늘한 기후에서 생산되는 미네랄이 풍부한 상급 와인' }
        ],
        sensoryMetrics: [
            { label: '아로마 (Aroma)', metric: '화사함', value: '7/10', description: '은은하게 퍼지는 복숭아꽃과 머스캣의 향기' },
            { label: '산도 (Acidity)', metric: '청량감', value: '5/10', description: '자극적이지 않고 부드럽게 넘어가는 편안한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '4/10', description: '경쾌하고 직선적인 라이트 바디' }
        ],
        flavorTags: [
            { label: '백복숭아', color: 'bg-red-50/20 text-red-600' },
            { label: '엘더플라워', color: 'bg-yellow-50/20 text-yellow-700' },
            { label: '신선한 허브', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중립적 발효', description: '품종 특유의 섬세한 꽃향기를 지키기 위해 오크통 대신 스테인리스 탱크에서 발효합니다.' },
            { step: '출시', name: '빠른 출시', description: '신선함을 최우선으로 하여 수확 후 가급적 빨리 병입하여 시장에 출시합니다.' }
        ],
        majorRegions: [
            { name: '독일 (Germany)', description: '뮐러 트루가우의 본고장이자 최대 생산지', emoji: '🇩🇪' },
            { name: '알토 아디제', description: '이탈리아 북부의 알프스 기슭에서 가장 세련된 뮐러가 탄생하는 곳', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '7-10°C', description: '차갑게 서빙하여 특유의 상쾌함과 꽃향기를 극대화해야 하는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 해산물 샐러드', '채소 전이나 튀김', '신선한 연성 치즈', '피크닉 음식']
    },
    sectionsEn: {
        definition: "Müller-Thurgau is the practical and friendly emblem of German white winemaking. Developed in 1882 by Dr. Hermann Müller, it was long believed to be a cross of Riesling and Silvaner (though later DNA analysis identified Madeleine Royale as the actual second parent). It is beloved for producing highly approachable, easy-drinking wines characterized by gentle notes of peach, elderflower, and a soft, low-acid profile that invites immediate enjoyment.",
        history: "A fundamental variety in the modernization of the German wine industry. Easier to grow and faster to ripen than Riesling, it spearheaded the recovery of several wine-growing regions after WWII. Once the most planted grape in Germany, it now maintains a proud presence across Austria, Northern Italy, and even New Zealand, celebrated for its reliable and refreshing character.",
        classifications: [
            { name: 'German Müller-Thurgau', criteria: 'Standard Style', description: 'Vibrant and light daily whites offering subtle floral and Muscat-like aromatics.' },
            { name: 'Rivaner', criteria: 'Alternative Identity', description: 'A portmanteau of Riesling and Silvaner; often denotes a drier, crisper style.' },
            { name: 'Alto Adige Müller', criteria: 'Premium Terroir', description: 'Grown in high-altitude Alpine vineyards to produce mineral-focused and refined expressions.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Brilliance', value: '7/10', description: 'Delicate notes of peach blossom and a gentle hint of grapeiness.' },
            { label: 'Acidity', metric: 'Crispness', value: '5/10', description: 'Intentionally soft and moderate, ensuring high drinkability.' },
            { label: 'Body', metric: 'Weight', value: '4/10', description: 'Features a light, linear, and airy physical presence.' }
        ],
        flavorTags: [
            { label: 'White Peach', color: 'bg-red-50/20 text-red-600' },
            { label: 'Elderflower', color: 'bg-yellow-50/20 text-yellow-700' },
            { label: 'Fresh Herb', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Neutral Vessel Fermentation', description: 'Conducted in stainless steel to protect the grape’s fleeting floral aromatics from oak interference.' },
            { step: 'Bottling', name: 'Fresh-Release Strategy', description: 'The wine is generally bottled and released quickly to capture its youthful vitality.' }
        ],
        majorRegions: [
            { name: 'Germany', description: 'The ancestral and largest global producer of the variety.', emoji: '🇩🇪' },
            { name: 'Alto Adige', description: 'The foothills of the Italian Alps, producing some of the world’s most sophisticated examples.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass',
            optimalTemperatures: [
                { temp: '7–10°C', description: 'Best served well-chilled to maintain its refreshing floral profile.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light seafood salads', 'Vegetable tempura', 'Fresh soft cheeses', 'Picnic-style fare']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['뮐러 트루가우', 'muller thurgau', 'müller thurgau', '리바너', 'rivaner']
}
