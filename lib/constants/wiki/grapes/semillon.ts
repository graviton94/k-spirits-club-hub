import { SpiritCategory } from '../types'

export const semillon: SpiritCategory = {
    slug: 'semillon',
    emoji: '🍯',
    nameKo: '세미용',
    nameEn: 'Sémillon',
    taglineKo: '보르도의 황금빛 조율사, 밀랍 같은 질감과 꿀의 미학',
    taglineEn: 'Bordeaux’s golden orchestrator, the aesthetics of waxy texture and honey',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '세미용(Sémillon)은 프랑스 보르도를 대표하는 매우 고귀한 화이트 품종으로, 시간이 흐를수록 경이로운 변화를 보여주는 "잠재력의 화이트"입니다. 젊을 때는 레몬과 사과 과실이 주를 이루지만, 숙성되면서 밀랍(Beeswax), 벌꿀, 그리고 볶은 견과류의 매끄럽고 리치한 질감을 선사합니다. 특히 귀부병에 매우 취약한 특 덕분에 세계 최고의 디저트 와인인 소테른(Sauternes)의 주인공으로 군림합니다.',
        history: '보르도 남서부 지역에서 유래한 고대 품종으로, 19세기에는 세계에서 가장 많이 재배되는 화이트 포도 중 하나였습니다. 보르도의 핵심 산지인 그라브(Graves)와 소테른에서 오랫동안 역사를 쌓아왔으며, 호주로 건너가 헌터 밸리(Hunter Valley)라는 독특한 테루아에서 저알코올이면서도 장기 숙성력이 뛰어난 세계 유일의 스타일을 탄생시키며 제2의 전성기를 맞이했습니다.',
        classifications: [
            { name: 'Sauternes / Barsac', criteria: '최고급 디저트', description: '귀부 현상을 통해 탄생한, 꿀과 살향이 농축된 세계 최고의 스위트 와인' },
            { name: 'Hunter Valley Semillon', criteria: '호주 정통 스타일', description: '낮은 알코올과 높은 산도, 숙성될수록 토스트와 꿀 풍미가 폭발하는 독창적 스타일' },
            { name: 'Bordeaux Blanc Blend', criteria: '블렌딩 역할', description: '소비뇽 블랑의 날카로움에 묵직한 바디감과 매끄러운 질감을 보완하는 역할' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '입안을 가득 채우는 매끄럽고 리치한 유질감' },
            { label: '산도 (Acidity)', metric: '청량감', value: '6/10', description: '부드럽고 온화하게 질감을 감싸주는 산미' },
            { label: '숙성력 (Aging)', metric: '잠재력', value: '10/10', description: '시간이 흐를수록 벌꿀과 견과류 향이 짙어지는 뛰어난 숙성력' }
        ],
        flavorTags: [
            { label: '벌꿀', color: 'bg-yellow-100/20 text-yellow-800' },
            { label: '밀랍 (Beeswax)', color: 'bg-amber-100/20 text-amber-700' },
            { label: '레몬 껍질', color: 'bg-green-50/20 text-green-600' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '배럴 발효 및 숙성', description: '세미용의 리치한 질감을 완성하기 위해 주로 프렌치 오크통에서 서서히 발효하고 숙성합니다.' },
            { step: '귀부 현상 유도', name: '보트리티스 유도', description: '스위트 와인 제조 시 세미용 특유의 얇은 껍질에 귀부병을 유도하여 풍미를 고도로 농축시킵니다.' }
        ],
        majorRegions: [
            { name: '소테른 (Sauternes)', description: '귀부 와인의 세계적인 성지이자 세미용의 정점', emoji: '🇫🇷' },
            { name: '헌터 밸리 (Hunter Valley)', description: '세계에서 가장 독특하고 장기 숙성이 가능한 드라이 세미용 산지', emoji: '🇦🇺' },
            { name: '그라브 (Graves)', description: '소비뇽 블랑과 함께 위대한 명품 드라이 화이트를 생산하는 곳', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓은 화이트 또는 소형 디저트 와인 글라스',
            optimalTemperatures: [
                { temp: '10-13°C', description: '세미용 특유의 리치한 질감과 복합적인 아로마가 가장 품격 있게 드러나는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['구운 닭고기 또는 오리', '푸아그라(스위트 스타일)', '크림 버섯 리조토', '랍스터 구이']
    },
    sectionsEn: {
        definition: "Sémillon is a noble white variety essential to the identity of Bordeaux, revered for its remarkable ability to evolve over decades into a wine of profound complexity. In its youth, it offers clean notes of lemon and green apple, but with age, it transforms into a decadent display of beeswax, honey, and roasted nuts with a rich, silken texture. Its high susceptibility to 'noble rot' (Botrytis cinerea) makes it the undisputed sovereign of world-class sweet wines like Sauternes.",
        history: "Originating in the southwest of France, Sémillon was once one of the most widely planted white grapes in the world during the 19th century. Historically anchored in the Graves and Sauternes regions of Bordeaux, it found a radical second home in Australia's Hunter Valley. There, it achieved cult status for a uniquely low-alcohol, bone-dry style that develops legendary toasted honey notes with long-term cellaring.",
        classifications: [
            { name: 'Sauternes / Barsac', criteria: 'Premium Dessert', description: 'World-class botrytized wines offering extreme concentrations of apricot, honey, and saffron.' },
            { name: 'Hunter Valley Semillon', criteria: 'Australian Classic', description: 'A unique, low-alcohol style that gains incredible toasted and honeyed complexity after 10+ years.' },
            { name: 'Bordeaux Blanc Blend', criteria: 'Blending Role', description: "Provides essential weight, body, and textural silkiness to complement the zesty nature of Sauvignon Blanc." }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'A lush, expansive, and oily mouthfeel that coats the palate.' },
            { label: 'Acidity', metric: 'Crispness', value: '6/10', description: 'Moderate and soft, perfectly integrating with its rich physical presence.' },
            { label: 'Aging', metric: 'Potential', value: '10/10', description: 'One of the few whites capable of improving for 20 years or more in the bottle.' }
        ],
        flavorTags: [
            { label: 'Honey', color: 'bg-yellow-100/20 text-yellow-800' },
            { label: 'Beeswax', color: 'bg-amber-100/20 text-amber-700' },
            { label: 'Lemon Curd', color: 'bg-green-50/20 text-green-600' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Barrel Fermentation', description: 'Often fermented in French oak to enhance its textural depth and introduce subtle spice.' },
            { step: 'Botrytis Development', name: 'Noble Rot Induction', description: 'Used for sweet styles, where the thin skins allow Botrytis to concentrate sugars and acids to extreme levels.' }
        ],
        majorRegions: [
            { name: 'Sauternes', description: 'The global benchmark for high-end dessert wines and Sémillon’s most prestigious home.', emoji: '🇫🇷' },
            { name: 'Hunter Valley', description: 'Famed for its unique dry, age-worthy expressions without the use of oak.', emoji: '🇦🇺' },
            { name: 'Graves', description: 'A key region for elegant, mineral, and powerful dry white Bordeaux blends.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide-bowled White or Small Dessert Wine glass',
            optimalTemperatures: [
                { temp: '10–13°C', description: 'Ideal for showcasing its characteristic rich texture and honeyed tertiary aromatics.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Roasted chicken or duck', 'Foie Gras (with sweet styles)', 'Creamy mushroom risotto', 'Grilled lobster']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['세미용', 'semillon', '소테른', 'sauternes']
}
