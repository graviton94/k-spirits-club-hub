import { SpiritCategory } from '../types'

export const cabernetFranc: SpiritCategory = {
        slug: 'cabernet-franc',
        emoji: '🍃',
        nameKo: '카베르네 프랑',
        nameEn: 'Cabernet Franc',
        taglineKo: '보르도의 이면, 우아한 초록빛 허브와 세련된 부드러움',
        taglineEn: 'The soul of Bordeaux, elegant green herbs and refined softness',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '카베르네 프랑(Cabernet Franc)은 카베르네 소비뇽과 메를로의 유전적 조상이자 보르도 블렌딩의 중추를 담당하는 품종입니다. 카베르네 소비뇽보다 타닌과 바디감은 가볍지만, 훨씬 더 우아하고 선명한 라즈베리와 야생 딸기의 과실향, 그리고 특유의 피망(Green Bell Pepper)이나 흑연(Graphite) 같은 뉘앙스가 특징입니다. 부드러운 질감과 매력적인 산미 덕분에 단일 품종으로도 매우 매력적인 결과물을 보여줍니다.',
                history: '프랑스 남서부에서 유래하여 부르고뉴와 보르도를 거쳐 전 세계로 퍼져 나갔습니다. 17세기경 프랑스 루아르(Loire) 밸리의 수도원에서 널리 재배되기 시작하며 그 명성을 얻었으며, 생테밀리옹(Saint-Émilion)의 가장 전설적인 와인인 "샤토 슈발 블랑"의 핵심 품종이기도 합니다. 유전적으로는 소비뇽 블랑과 교배되어 전 세계에서 가장 유명한 품종인 카베르네 소비뇽을 탄생시킨 역사의 근간이 되는 품종입니다.',
                classifications: [
                        { name: 'Loire Style', criteria: '산지 스타일', description: '시농(Chinon) 등에서 생산되는 신선한 산미와 가벼운 질감의 스타일' },
                        { name: 'Right Bank Bordeaux', criteria: '산지 스타일', description: '메를로와 결합하여 벨벳 같은 질감과 복합미를 완성하는 스타일' },
                        { name: 'New World Style', criteria: '산지 스타일', description: '미국이나 아르헨티나에서 생산되는 더 익은 과실향 중심의 스타일' }
                ],
                sensoryMetrics: [
                        { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '유연하고 매끄러운 미디엄 바디' },
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '5/10', description: '미세하고 실키한 타닌' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '생기 있고 균형 잡힌 높은 산미' }
                ],
                flavorTags: [
                        { label: '라즈베리', color: 'bg-red-200/20 text-red-600' },
                        { label: '피망', color: 'bg-green-100/20 text-green-700' },
                        { label: '흑연', color: 'bg-zinc-300/20 text-zinc-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '자연 효모 발효', description: '품종 고유의 섬세한 향을 살리기 위해 저온에서의 긴 침출과 자연 효모 사용을 선호하기도 합니다.' },
                        { step: '숙성', name: '중고 오크 숙성', description: '강한 오크향이 품종 특유의 허브향을 가리지 않도록 주로 중고 오크통에서 섬세하게 조절합니다.' }
                ],
                majorRegions: [
                        { name: '루아르 밸리 (Loire Valley)', description: '카베르네 프랑의 순수함을 가장 잘 보여주는 산지', emoji: '🇫🇷' },
                        { name: '생테밀리옹 (Saint-Émilion)', description: '세계 최고의 카베르네 프랑 와인이 탄생하는 곳', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '14-16°C', description: '특유의 향긋한 허브향과 과실향이 환상적으로 피어나는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['구운 가금류(닭, 오리)', '염소 치즈', '토마토 베이스의 가벼운 고기 요리'],
        },
        sectionsEn: {
                definition: "Cabernet Franc is the genetic ancestor of Cabernet Sauvignon and Merlot and a cornerstone of Bordeaux blending. While lighter in body and tannins than Cabernet Sauvignon, it is renowned for its elegance, vivid raspberry and wild strawberry aromas, and distinct notes of green bell pepper and graphite. Its smooth texture and vibrant acidity make it equally compelling as a high-fidelity single varietal.",
                history: "Originating in Southwest France, Cabernet Franc traveled through Burgundy and Bordeaux before spreading globally. It gained prestige in the 17th century through cultivation in the monasteries of the Loire Valley. It is an essential component of legendary wines like Saint-Émilion’s Château Cheval Blanc. Genetically, it crossed with Sauvignon Blanc to create Cabernet Sauvignon, making it a foundation of modern viticulture.",
                classifications: [
                        { name: 'Loire Style', criteria: 'Regional Style', description: 'Produced in areas like Chinon, characterized by fresh acidity and a lean texture.' },
                        { name: 'Right Bank Bordeaux', criteria: 'Regional Style', description: 'Blended with Merlot to achieve a velvety texture and deep complexity.' },
                        { name: 'New World Style', criteria: 'Regional Style', description: 'Styles from regions like USA or Argentina, focusing on riper, more fruit-forward profiles.' }
                ],
                sensoryMetrics: [
                        { label: 'Body', metric: 'Weight', value: '6/10', description: 'Supple and smooth medium body.' },
                        { label: 'Tannins', metric: 'Astringency', value: '5/10', description: 'Fine and silky tannins.' },
                        { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Lively and well-balanced high acidity.' }
                ],
                flavorTags: [
                        { label: 'Raspberry', color: 'bg-red-200/20 text-red-600' },
                        { label: 'Green Bell Pepper', color: 'bg-green-100/20 text-green-700' },
                        { label: 'Graphite', color: 'bg-zinc-300/20 text-zinc-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Native Yeast Fermentation', description: 'Utilizes cool temperatures and wild yeasts to preserve the delicate herbal aromas inherent to the variety.' },
                        { step: 'Aging', name: 'Used Oak Maturation', description: 'Typically aged in older oak barrels to ensure the wood does not overpower its characteristic herbal notes.' }
                ],
                majorRegions: [
                        { name: 'Loire Valley', description: 'A region that showcases the purest expression of Cabernet Franc.', emoji: '🇫🇷' },
                        { name: 'Saint-Émilion', description: 'Produces some of the most prestigious Cabernet Franc-dominant wines in the world.', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Red Wine Glass',
                        optimalTemperatures: [
                                { temp: '14-16°C', description: 'The range where its fragrant herbal and bright fruit notes are most expressive.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Roasted poultry (chicken, duck)', 'Goat cheese', 'Light tomato-based meat dishes'],
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['카베르네 프랑', 'cabernet franc']
}