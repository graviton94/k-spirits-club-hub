import { SpiritCategory } from '../types'

export const kadarka: SpiritCategory = {
    slug: 'kadarka',
    emoji: '🍒',
    nameKo: '카다르카',
    nameEn: 'Kadarka',
    taglineKo: '발칸의 야성, 헝가리의 태양 아래 피어난 스파이시한 붉은 과실',
    taglineEn: 'The wildness of the Balkans, spicy red fruits blooming under the Hungarian sun',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '카다르카(Kadarka)는 헝가리와 발칸 반도 전역에서 오랫동안 사랑받아 온 화이트 품종 급의 섬세함을 지닌 레드 품종입니다. 껍질이 얇아 밝은 붉은색을 띠며, 산미가 높고 타닌은 적어 마시기 편한 스타일을 보여줍니다. 특히 특유의 이국적인 향신료 풍미와 신선한 체리향 덕분에 헝가리의 전설적인 레드 블렌딩 와인인 "에그리 비카베르(Egri Bikavér, 황소의 피)"의 역사적인 핵심 성분으로 알려져 있습니다.',
        history: '그 기원은 발칸 반도의 알바니아나 불가리아 지역으로 추정되며, 16세기 오스만 제국의 점령기 동안 헝가리로 전파되었습니다. 수 세기 동안 헝가리에서 가장 널리 재배되는 레드 품종이었으나, 병충해와 부패에 매우 취약한 까다로운 특성 때문에 현대에 들어서는 재배 면적이 많이 줄었습니다. 하지만 최근 고유의 우아함과 지역적 특색을 살리려는 장인 생산자들에 의해 다시 위대한 부활을 맞이하고 있습니다.',
        classifications: [
            { name: 'Historic Bikavér Component', criteria: '블렌딩 역할', description: '에그리 비카베르 블렌딩에 우아함과 스파이시한 아로마를 더해주는 역할' },
            { name: 'Varietal Kadarka', criteria: '당도 스타일', description: '낮은 타닌과 높은 산도를 강조한 신선한 단일 품종 스타일' },
            { name: 'Siller', criteria: '전통 카테고리', description: '레드와 로제 사이의 진한 분홍색을 띠는 헝가리 전통 스타일의 가벼운 와인' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '매우 가볍고 맑은 미디엄 라이트 바디' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '3/10', description: '부드럽고 떫은맛이 거의 느껴지지 않는 질감' },
            { label: '스파이스 (Spice)', metric: '풍미 강도', value: 'High', description: '파프리카, 정향, 백후추의 독특한 향신료 뉘앙스' }
        ],
        flavorTags: [
            { label: '빨간 체리', color: 'bg-red-200/20 text-red-600' },
            { label: '파프리카 파우더', color: 'bg-orange-100/20 text-orange-700' },
            { label: '라즈베리', color: 'bg-pink-100/20 text-pink-700' }
        ],
        manufacturingProcess: [
            { step: '포도 관리', name: '수확량 조절', description: '부패하기 쉬운 특성상 단위 면적당 수확량을 엄격히 제한하여 집중도를 높입니다.' },
            { step: '발효', name: '자연 발효', description: '카다르카 고유의 섬세한 아로마를 해치지 않기 위해 인위적인 간섭을 최소화한 자연 발효를 선호합니다.' }
        ],
        majorRegions: [
            { name: '섹사르드 (Szekszárd)', description: '가장 우아하고 뛰어난 품질의 카다르카가 생산되는 헝가리의 핵심지', emoji: '🇭🇺' },
            { name: '에게르 (Eger)', description: '전설적인 황소의 피(Bikavér) 와인의 본거지', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 좁은 표준 레드 또는 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '14-16°C', description: '특유의 향신료 향과 신선한 과실미가 가장 돋보이는 약간 서늘한 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['헝가리 전통 굴라쉬(Goulash)', '파프리카를 쓴 육류 요리', '구운 버섯', '가벼운 육류 전채요리']
    },
    sectionsEn: {
        definition: "Kadarka is a historic red grape variety cherished in Hungary and across the Balkans, possessing the delicate elegance often found in aromatic whites. Known for its thin skins and bright red hue, it yields high-acid, low-tannin wines that are exceptionally approachable. Its exotic spice profile and fresh cherry notes have made it an indispensable component of Hungary's legendary 'Egri Bikavér' (Bull’s Blood) red blend.",
        history: "Suspected to originate from Albania or Bulgaria, Kadarka spread to Hungary during the Ottoman occupation in the 16th century. For centuries, it was Hungary's most widely planted red, but its extreme susceptibility to rot and disease saw its popularity wane in favor of hardier international varieties. Today, artisan winemakers are leading a passionate revival, reclaiming its status as a noble variety of profound elegance and regional identity.",
        classifications: [
            { name: 'Historic Bikavér Component', criteria: 'Blending Role', description: "Imparts much-needed elegance and a unique spicy bouquet to Eger's famous Bull’s Blood blends." },
            { name: 'Varietal Kadarka', criteria: 'Style', description: 'Single-varietal wines focusing on high-toned acidity, low tannins, and purity of red fruit.' },
            { name: 'Siller', criteria: 'Traditional Category', description: 'A traditional local style intermediate between rosé and red, often showcasing Kadarka’s vibrant fruit.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Clean, transparent, and medium-light on the palate.' },
            { label: 'Tannins', metric: 'Astringency', value: '3/10', description: 'Gentle, silky, and almost devoid of harsh grip.' },
            { label: 'Spice', metric: 'Flavor Intensity', value: 'High', description: 'Distinctive notes of paprika, clove, and white pepper.' }
        ],
        flavorTags: [
            { label: 'Red Cherry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Paprika Powder', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Raspberry', color: 'bg-pink-100/20 text-pink-700' }
        ],
        manufacturingProcess: [
            { step: 'Vineyard Management', name: 'Yield Restriction', description: 'Strict yield control is critical to manage its thin skins and concentrate flavor depth.' },
            { step: 'Fermentation', name: 'Native Fermentation', description: 'Preferentially fermented with native yeasts to preserve the grape’s fleeting and delicate aromatics.' }
        ],
        majorRegions: [
            { name: 'Szekszárd', description: 'Renowned for producing the most sophisticated and high-quality varietal Kadarka in Hungary.', emoji: '🇭🇺' },
            { name: 'Eger', description: "The historic home of the Bull’s Blood blend where Kadarka's spice is vital.", emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Narrow-bowled standard Red or White wine glass',
            optimalTemperatures: [
                { temp: '14–16°C', description: 'Best served slightly cool to highlight its characteristic spice and fresh fruitiness.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Traditional Hungarian Goulash', 'Meat dishes seasoned with paprika', 'Grilled mushrooms', 'Light meat appetizers']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['카다르카', 'kadarka']
}
