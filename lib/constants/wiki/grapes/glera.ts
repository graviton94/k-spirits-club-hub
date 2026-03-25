import { SpiritCategory } from '../types'

export const glera: SpiritCategory = {
    slug: 'glera',
    emoji: '🥂',
    nameKo: '글레라',
    nameEn: 'Glera',
    taglineKo: '프로세코의 경쾌한 고백, 이탈리아의 활기찬 거품',
    taglineEn: 'The cheerful confession of Prosecco, Italys vibrant bubbles',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '글레라(Glera)는 이탈리아 베네토(Veneto) 지역을 상징하는 화이트 품종으로, 세계에서 가장 많이 팔리는 스파클링 와인인 프로세코(Prosecco)의 주원료입니다. 중성적이면서도 신선한 청사과, 배, 그리고 흰 꽃의 아로마가 특징이며, 높은 산도와 가벼운 바디감 덕분에 식전주로 완벽한 청량감을 선사합니다.',
        history: '원래 "프로세코"라는 이름으로 불렸으나, 2009년 프로세코 지역이 DOCG 등급으로 승격되면서 산지 명칭과 품종 이름을 분리하기 위해 고대 이름인 "글레라"로 공식 명칭이 변경되었습니다. 슬로베니아 국경 근처의 카르소(Carso) 지역에서 유래한 것으로 추정되며, 현재는 이탈리아 북동부 전역에서 이탈리아의 활기찬 라이프스타일을 대변하는 품종으로 사랑받고 있습니다.',
        classifications: [
            { name: 'Prosecco DOC', criteria: '생산 등급', description: '베네토와 프리울리 지역에서 생산되는 대중적이고 신선한 스타일' },
            { name: 'Conegliano Valdobbiadene DOCG', criteria: '최고급 산지', description: '가장 가파른 언덕에서 생산되는 복합미와 미네랄리티가 뛰어난 최상급 프로세코' },
            { name: 'Cartizze', criteria: '최상위 단일 빈야드', description: '프로세코의 "그랑 크뤼"로 불리는 가장 농축된 풍미의 작은 산지' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '입안을 깨우는 상쾌하고 밝은 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '가볍고 부담 없는 라이트 바디' },
            { label: '아로마 (Aroma)', metric: '강도', value: 'Medium', description: '신선한 과실과 은은한 아카시아 향' }
        ],
        flavorTags: [
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '배', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '인동덩굴 (Honeysuckle)', color: 'bg-orange-50/20 text-orange-600' }
        ],
        manufacturingProcess: [
            { step: '2차 발효', name: '샤르마 방식 (Charmat Method)', description: '신선한 과실향을 보존하기 위해 병이 아닌 대형 스테인리스 탱크에서 2차 발효를 진행합니다.' },
            { step: '압착', name: '부드러운 압착', description: '쓴맛을 피하고 맑은 주스만을 얻기 위해 매우 부드럽게 포도를 압착합니다.' }
        ],
        majorRegions: [
            { name: '베네토 (Veneto)', description: '프로세코 생산의 중심지이자 글레라의 고향', emoji: '🇮🇹' },
            { name: '코넬리아노-발도비아데네', description: '가파른 언덕에서 탄생하는 프리미엄 글레라의 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '플루트(Flute) 또는 다이아몬드형 스파클링 글라스',
            optimalTemperatures: [
                { temp: '6-8°C', description: '거품의 청량감과 산미가 가장 기분 좋게 느껴지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 카나페', '프로슈토와 멜론', '해산물 튀김', '초밥(스시)']
    },
    sectionsEn: {
        definition: "Glera is the quintessential white grape variety of Italy's Veneto region, serving as the primary component for Prosecco, the world’s most popular sparkling wine. It is characterized by fresh notes of green apple, pear, and white blossoms. With high acidity and a light body, it offers perfect refreshment, making it the ideal aperitif.",
        history: "Formerly known as 'Prosecco,' the grape was officially renamed Glera in 2009 when the Prosecco region achieved DOCG status, to distinguish the geographical designation from the variety. Believed to have originated in the Carso region near the Slovenian border, it is now celebrated across Northeast Italy as a grape representing the vibrant Italian lifestyle.",
        classifications: [
            { name: 'Prosecco DOC', criteria: 'Production Tier', description: 'The widely enjoyed, fresh, and approachable style from Veneto and Friuli.' },
            { name: 'Conegliano Valdobbiadene DOCG', criteria: 'Premium Terroir', description: 'High-quality Prosecco from steep hillsides, known for greater complexity and minerality.' },
            { name: 'Cartizze', criteria: 'Grand Cru Vineyard', description: 'A small, prestigious area considered the pinnacle of Prosecco for its concentrated flavors.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Refreshing and bright acidity that awakens the palate.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Light, crisp, and effortlessly drinkable.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Dominated by fresh orchard fruits and subtle acacia notes.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Pear', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Honeysuckle', color: 'bg-orange-50/20 text-orange-600' }
        ],
        manufacturingProcess: [
            { step: 'Secondary Fermentation', name: 'Charmat Method', description: 'Fermentation takes place in large stainless steel tanks rather than bottles to preserve clean PRIMARY fruit aromas.' },
            { step: 'Pressing', name: 'Gentle Pressing', description: 'A delicate process used to extract pure juice while avoiding bitter phenolics from skins and seeds.' }
        ],
        majorRegions: [
            { name: 'Veneto', description: 'The heartland of Prosecco production and the historic home of Glera.', emoji: '🇮🇹' },
            { name: 'Conegliano-Valdobbiadene', description: 'World-renowned hillsides producing the most sophisticated expressions of the grape.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Flute or Diamond-shaped Sparkling Glass',
            optimalTemperatures: [
                { temp: '6–8°C', description: 'The best range for experiencing the vivacity of the bubbles and crisp acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light canapés', 'Prosciutto and melon', 'Fried seafood', 'Sushi']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['글레라', 'glera']
}
