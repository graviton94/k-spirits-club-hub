import { SpiritCategory } from '../types'

export const folleBlanche: SpiritCategory = {
    slug: 'folle-blanche',
    emoji: '🍃',
    nameKo: '폴 블랑슈',
    nameEn: 'Folle Blanche',
    taglineKo: '코냑의 잊혀진 심장, 우아한 산미와 섬세한 꽃향의 정수',
    taglineEn: 'The forgotten heart of Cognac, the essence of elegant acidity and floral notes',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '폴 블랑슈(Folle Blanche)는 한때 프랑스 브랜디 생산의 절대적인 주인공이었던 고귀한 화이트 품종입니다. "미친 화이트(Mad White)"라는 이름처럼 폭발적인 산도와 섬세한 아로마가 특징이며, 이를 통해 증류된 스피릿은 타의 추종을 불허하는 우아함과 꽃향기를 선사합니다. 오늘날에는 희소성이 높아졌으나, 여전히 최고급 아르마냑과 코냑의 비밀스러운 풍미의 열쇠로 여겨집니다.',
        history: '19세기 필록세라 재앙 이전까지 코냑과 아르마냑 지역에서 가장 널리 재배되던 품종이었습니다. 그러나 병충해에 취약하다는 단점 때문에 관리가 쉬운 위니 블랑(Ugni Blanc)에게 자리를 내주며 재배 면적이 급감했습니다. 하지만 최근 그 특유의 섬세한 품질을 사랑하는 생산자들에 의해 다시 주목받고 있으며, 특히 아르마냑 지역에서 그 위상을 회복하고 있습니다.',
        classifications: [
            { name: 'Vintage Armagnac', criteria: '주요 용도', description: '폴 블랑슈 100% 혹은 높은 비율로 블렌딩되어 장기 숙성되는 고급 아르마냑' },
            { name: 'Gros Plant du Pays Nantais', criteria: '산지 스타일', description: '루아르 지역에서 생산되는 매우 드라이하고 산도가 높은 테이블 와인' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '9/10', description: '증류 후에도 생동감을 잃지 않는 선명한 산미' },
            { label: '향기 (Aroma)', metric: '복합미', value: 'High', description: '쟈스민, 흰 꽃, 그리고 옅은 시트러스 향' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '매우 가볍고 투명한 질감' }
        ],
        flavorTags: [
            { label: '흰 꽃', color: 'bg-slate-100/20 text-slate-700' },
            { label: '레몬즙', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '시나몬', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '증류 전 처치', name: '무첨가 발효', description: '브랜디의 순수성을 위해 설탕이나 이산화황 첨가 없이 자연 발효를 진행합니다.' },
            { step: '증류', name: '직화식 증류', description: '폴 블랑슈의 섬세한 향을 살리기 위해 전통적인 구리 단식 증류기를 사용합니다.' }
        ],
        majorRegions: [
            { name: '바 아르마냑 (Bas-Armagnac)', description: '폴 블랑슈가 가장 화려하게 피어나는 모래 토양의 산지', emoji: '🇫🇷' },
            { name: '코냑 (Cognac)', description: '과거의 영광을 간직한 일부 장인들의 밭', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립 모양의 좁은 브랜디 글라스',
            optimalTemperatures: [
                { temp: '18-20°C', description: '스피릿의 화사한 꽃향기가 가장 잘 피어오르는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['지방질이 적은 생선 요리', '레몬 타르트', '장기 숙성된 콩테 치즈']
    },
    sectionsEn: {
        definition: "Folle Blanche is a noble white grape variety that was once the undisputed star of French brandy production. Aptly named 'Mad White' for its explosive acidity and delicate aromatics, the spirits distilled from it possess an unparalleled elegance and floral intensity. Though now rare, it remains the secret key to the most sophisticated flavor profiles in premium Armagnac and Cognac.",
        history: "Before the late 19th-century Phylloxera crisis, Folle Blanche was the dominant grape in the Cognac and Armagnac regions. Its susceptibility to rot and disease led to its gradual replacement by the hardier Ugni Blanc. However, a modern renaissance led by artisan distillers is bringing this variety back into the spotlight, particularly in the sandy soils of Bas-Armagnac where it thrives.",
        classifications: [
            { name: 'Vintage Armagnac', criteria: 'Primary Usage', description: 'Premium, long-aged Armagnacs often featuring 100% Folle Blanche for maximum floral complexity.' },
            { name: 'Gros Plant du Pays Nantais', criteria: 'Regional Style', description: 'A bone-dry, high-acid table wine style produced in the Loire Valley.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '9/10', description: 'A sharp, vibrant acidity that stays alive even after distillation.' },
            { label: 'Aroma', metric: 'Complexity', value: 'High', description: 'Dominated by jasmine, white blossoms, and subtle citrus zest.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Extremely light, transparent, and ethereal mouthfeel.' }
        ],
        flavorTags: [
            { label: 'White Flowers', color: 'bg-slate-100/20 text-slate-700' },
            { label: 'Lemon Zest', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Cinnamon', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Pre-distillation', name: 'Additive-free Fermentation', description: 'Fermented naturally without added sugar or sulfur to ensure the purity of the final spirit.' },
            { step: 'Distillation', name: 'Traditional Pot Distillation', description: 'Distilled in copper alembics to capture the fleeting, delicate floral esters of the grape.' }
        ],
        majorRegions: [
            { name: 'Bas-Armagnac', description: 'The premier terroir for Folle Blanche, where sandy soils enhance its floral character.', emoji: '🇫🇷' },
            { name: 'Cognac', description: 'Home to historic plots maintained by traditionalist maisons.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Narrow tulip-shaped Brandy glass',
            optimalTemperatures: [
                { temp: '18–20°C', description: 'The ideal temperature to allow its bright floral bouquet to fully unfurl.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Lean white fish dishes', 'Lemon tarts', 'Aged Comté cheese']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['폴 블랑슈', 'folle blanche']
}
