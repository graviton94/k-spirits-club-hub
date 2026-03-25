import { SpiritCategory } from '../types'

export const muscadelle: SpiritCategory = {
    slug: 'muscadelle',
    emoji: '🍯',
    nameKo: '뮈스카델',
    nameEn: 'Muscadelle',
    taglineKo: '보르도의 향기로운 비밀, 달콤한 포도 향과 우아한 꽃의 미학',
    taglineEn: 'Bordeaux’s fragrant secret, the aesthetics of sweet grape scent and elegant flowers',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '뮈스카델(Muscadelle)은 프랑스 보르도에서 주로 재배되는 매우 향기로운 화이트 품종입니다. 이름 때문에 뮈스카(Muscat) 패밀리로 오해받기도 하지만 유전적으로는 무관하며, 신선한 포도 본연의 향과 하얀 꽃, 그리고 은은한 허브 향을 지니고 있습니다. 주로 세미용, 소비뇽 블랑과 블렌딩되어 소테른(Sauternes) 같은 위대한 스위트 와인에 화사한 아로마의 뉘앙스를 완성하는 핵심 조연 역할을 합니다.',
        history: '프랑스 남서부 보르도와 도르도뉴(Dordogne) 지역에서 수 세기 동안 재배되어 왔습니다. 비록 재배 면적이 넓지는 않지만, 보르도 스위트 와인의 복합미를 위해 결코 빠질 수 없는 존재입니다. 또한 호주의 루더글렌(Rutherglen) 지역으로 건너가 "토파즈"와 같은 빛깔의 세계 최고의 주정 강화 와인(Liqueur Muscat으로 불리다 현재는 Topaque)을 만들어내며 제2의 전성기를 누리고 있습니다.',
        classifications: [
            { name: 'Sauternes / Barsac Component', criteria: '블렌딩 역할', description: '귀부 와인에 신선한 꽃향기와 포도 본연의 향미를 더해주는 보조 품종' },
            { name: 'Rutherglen Topaque', criteria: '주정 강화 스타일', description: '호주에서 생산되는 진하고 끈적한 토피와 캐러멜 풍미의 상급 주정 강화 와인' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '강도', value: '9/10', description: '입안 가득 퍼지는 강력한 꽃향과 포도 향' },
            { label: '산도 (Acidity)', metric: '청량감', value: '4/10', description: '온화하고 부드러워 주로 블렌딩으로 보완' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '부드럽고 매끄러운 질감의 미디엄 바디' }
        ],
        flavorTags: [
            { label: '인동덩굴 (Honeysuckle)', color: 'bg-orange-50/20 text-orange-600' },
            { label: '신선한 포도', color: 'bg-green-100/20 text-green-700' },
            { label: '머스크', color: 'bg-slate-200/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '천천히 진행되는 저온 발효', description: '화사한 아로마를 잃지 않기 위해 매우 낮은 온도에서 서서히 발효를 진행합니다.' },
            { step: '귀부 현상 (농축)', name: '보트리티스 유도', description: '스위트 와인 산지에서는 뮈스카델 포도에도 귀부 현상을 유도하여 풍미를 고도로 농축시킵니다.' }
        ],
        majorRegions: [
            { name: '보르도 (Bordeaux)', description: '소테른과 앙트르 되 메르의 핵심 보조 산지', emoji: '🇫🇷' },
            { name: '루더글렌 (Rutherglen)', description: '진정한 뮈스카델의 위력을 보여주는 호주의 주정 강화 와인 성지', emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 또는 소형 디저트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-11°C', description: '특유의 향기로운 아로마를 가장 우아하게 느낄 수 있는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['애플 타르트', '살구 잼을 곁들인 치즈', '매운맛이 가미된 태국 요리', '푸아그라']
    },
    sectionsEn: {
        definition: "Muscadelle is a highly aromatic white grape variety primarily grown in the Bordeaux region of France. Despite its name, it is genetically unrelated to the Muscat family, though it shares similar notes of fresh grapes, white blossoms, and subtle herbs. It acts as a critical supporting player in Bordeaux blends, providing an essential aromatic flourish to legendary sweet wines like Sauternes and Barsac alongside Sémillon and Sauvignon Blanc.",
        history: "Cultivated for centuries in Southwest France, particularly in Bordeaux and the Dordogne, Muscadelle occupies a small but vital niche. Beyond France, it found a second home in Australia's Rutherglen region. There, it is used to produce world-class fortified wines formerly known as 'Liqueur Muscat,' now officially called 'Topaque,' recognized by their deep topaz color and incredibly concentrated flavors.",
        classifications: [
            { name: 'Sauternes / Barsac Component', criteria: 'Blending Role', description: 'Adds fresh floral and intense grapey aromatics to world-class botrytized sweet wines.' },
            { name: 'Rutherglen Topaque', criteria: 'Fortified Style', description: "A luscious, sticky Australian style characterized by toffee, caramel, and honeyed complexity." }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Intensity', value: '9/10', description: 'Expansive and powerful floral and fresh grape aromatics.' },
            { label: 'Acidity', metric: 'Crispness', value: '4/10', description: 'Soft and moderate, usually balanced through expert blending.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Smooth, silken texture with a medium-bodied presence.' }
        ],
        flavorTags: [
            { label: 'Honeysuckle', color: 'bg-orange-50/20 text-orange-600' },
            { label: 'Fresh Grape', color: 'bg-green-100/20 text-green-700' },
            { label: 'Musk', color: 'bg-slate-200/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Slow, Cool Fermentation', description: 'Conducted at very low temperatures to prevent the volatile and delicate floral esters from escaping.' },
            { step: 'Concentration', name: 'Botrytis Induction', description: 'In sweet wine regions, berries are encouraged to develop noble rot for extreme flavor concentration.' }
        ],
        majorRegions: [
            { name: 'Bordeaux', description: 'A key minor component in the prestigious sweet wines of Sauternes and Barsac.', emoji: '🇫🇷' },
            { name: 'Rutherglen', description: "The premier global destination for intensely concentrated Muscadelle-based fortified wines.", emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White or Small Dessert Wine glass',
            optimalTemperatures: [
                { temp: '8–11°C', description: 'The ideal range to experience its characteristic floral bouquet with elegance.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Apple tart', 'Cheese with apricot jam', 'Spicy Thai cuisine', 'Foie Gras']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['뮈스카델', 'muscadelle']
}
