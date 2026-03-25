import { SpiritCategory } from '../types'

export const pinotBlanc: SpiritCategory = {
    slug: 'pinot-blanc',
    emoji: '🍋',
    nameKo: '피노 블랑',
    nameEn: 'Pinot Blanc',
    taglineKo: '알자스의 투명한 우아함, 부드러운 중성미와 섬세한 텍스처',
    taglineEn: 'The transparent elegance of Alsace, soft neutrality and delicate texture',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '피노 블랑(Pinot Blanc)은 피노 누아의 돌연변이로 탄생한 화이트 품종으로, 특유의 깔끔하고 중성적인 성격 덕분에 "어떤 음식과도 잘 울리는 만능의 조연"이라 불립니다. 배, 잘 익은 사과, 그리고 신선한 레몬 아로마를 기본으로 하며, 샤르도네와 비슷하지만 보다 산뜻하고 가벼운 바디감을 선사합니다. 자기주장이 강하기보다 입안을 편안하게 감싸는 부드러운 유질감이 특징입니다.',
        history: '부르브뉴 지역에서 유래했으나 현재는 프랑스 알자스(Alsace) 지역에서 가장 성공적으로 정착했습니다. 오랫동안 피노 그리와 혼동되기도 했으나, 19세기에야 비로소 독립된 품종으로 인정받았습니다. 오늘날 독일의 바이스부르군더(Weiβburgunder), 이탈리아의 피노 비앙코(Pinot Bianco) 등 지역마다 고유의 이름을 가지고 전 유럽에서 꾸준한 사랑을 받고 있습니다.',
        classifications: [
            { name: 'Alsace Pinot Blanc', criteria: '산지 스타일', description: '신선하고 상쾌한 과실향과 부드러운 질감을 지닌 알자스의 클래식한 화이트' },
            { name: 'Weiβburgunder', criteria: '독일 스타일', description: '산미가 조금 더 강조되고 미네랄리티가 돋보이는 드라이하고 날렵한 스타일' },
            { name: 'Cremant d\'Alsace Base', criteria: '스파클링 역할', description: '알자스 스파클링 와인의 산뜻한 골격을 담당하는 핵심 품종' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '부드러우면서도 끝 맛을 깔끔하게 잡아주는 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '입안에서 매끄럽게 느껴지는 미디엄 라이트 바디' },
            { label: '향기 (Aroma)', metric: '강도', value: 'Medium', description: '은은한 사과와 서양배의 고요한 향기' }
        ],
        flavorTags: [
            { label: '서양배', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '빨간 사과', color: 'bg-green-100/20 text-green-700' },
            { label: '화이트 블라썸', color: 'bg-slate-50/20 text-slate-500' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중립적 숙성', description: '피노 블랑 고유의 섬세함을 가리지 않기 위해 주로 스테인리스 탱크나 커다란 중고 오크통에서 발효합니다.' },
            { step: '숙성', name: '앙금 접촉 (Lees)', description: '짧은 기간 효모 앙금과 접촉시켜 중성적인 맛에 매끄러운 질감을 더해줍니다.' }
        ],
        majorRegions: [
            { name: '알자스 (Alsace)', description: '피노 블랑이 가장 대중적이고 품질 좋게 생산되는 곳', emoji: '🇫🇷' },
            { name: '바덴 & 팔츠 (Baden & Pfalz)', description: '바이스부르군더라는 이름으로 위대한 드라이 와인을 생산하는 독일 산지', emoji: '🇩🇪' },
            { name: '위동부 이탈리아', description: '피노 비앙코라는 이름으로 깔끔하고 미네랄이 풍부한 와인을 생산', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '전형적인 튤립 모양의 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '특유의 부드러운 질감과 섬세한 과실향이 가장 조화로운 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 닭고기 요리', '해산물 파스타', '염소 치즈 샐러드', '독일식 족발 요리(슈바인학센)']
    },
    sectionsEn: {
        definition: "Pinot Blanc is a genetic mutation of Pinot Noir, celebrated as a versatile and approachable white variety known for its clean, neutral profile. Often acting as the ultimate dinner guest that pairs with almost anything, it offers notes of pear, ripe apple, and fresh lemon. While it shares some structural similarities with Chardonnay, it is typically fresher and lighter, characterized by a smooth, gentle texture rather than power.",
        history: "Though it originated in Burgundy, Pinot Blanc has found its spiritual and commercial home in the Alsace region of France. Long confused with Pinot Gris, it was only recognized as a distinct variety in the late 19th century. Today, it flourishes across Europe under various names, most notably as Weiβburgunder in Germany and Pinot Bianco in Italy, maintaining a steady and loyal following.",
        classifications: [
            { name: 'Alsace Pinot Blanc', criteria: 'Regional Style', description: 'The classic expression featuring fresh orchard fruit and a soft, supple mouthfeel.' },
            { name: 'Weiβburgunder', criteria: 'German Style', description: 'A more focused and leaner style emphasizing vibrant acidity and mineral precision.' },
            { name: "Cremant d'Alsace Base", criteria: 'Sparkling Role', description: 'The primary variety providing the crisp and elegant backbone for Alsatian sparkling wines.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Soft yet sufficient to provide a clean and refreshing finish.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Features a smooth, medium-light-bodied texture on the palate.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Quiet yet elegant notes of apple, pear, and subtle white blossoms.' }
        ],
        flavorTags: [
            { label: 'Pear', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Red Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'White Blossom', color: 'bg-slate-50/20 text-slate-500' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Neutral Vessel Fermentation', description: 'Typically fermented in stainless steel or large neutral oak to preserve its delicate varietal purity.' },
            { step: 'Aging', name: 'Lees Contact', description: 'Brief maturation on the lees is often used to impart a silken mouthfeel to its neutral palate.' }
        ],
        majorRegions: [
            { name: 'Alsace', description: 'The premier global region for high-volume, high-quality Pinot Blanc.', emoji: '🇫🇷' },
            { name: 'Baden & Pfalz', description: 'German regions producing some of the world’s most refined Weiβburgunder.', emoji: '🇩🇪' },
            { name: 'Northeast Italy', description: 'Produces clean, mineral-driven styles known locally as Pinot Bianco.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Typical tulip-shaped White Wine glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The ideal range to appreciate its soft texture and subtle orchard fruit aromatics.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light chicken dishes', 'Seafood pasta', 'Goat cheese salad', 'Roasted pork (Schweinshaxe)']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['피노 블랑', 'pinot blanc', '바이스부르군더', 'weissburgunder']
}
