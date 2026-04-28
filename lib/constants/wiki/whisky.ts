import { SpiritCategory } from './types'

export const whisky: SpiritCategory = {
    slug: 'whisky',
    dbCategories: ['위스키'],
    emoji: '🥃',
    nameKo: '위스키 (Whisky)',
    nameEn: 'Whisky',
    taglineKo: '곡물, 오크, 시간이 빚어내는 증류주의 왕',
    taglineEn: 'The king of distilled spirits — grain, oak, and time in a glass',
    color: 'amber',
    sections: {
        definition: "위스키(Whisky/Whiskey)란 발아 곡물(주로 맥아 보리·옥수수·호밀·밀)을 당화·발효·증류한 뒤 오크통에서 최소 일정 기간 숙성시켜 만드는 갈색 증류주다. 스코틀랜드·아일랜드·미국·일본·캐나다 등 각국의 법률과 전통이 서로 다른 스타일을 규정하며, '테루아(곡물·물·효모·기후)'와 '오크 숙성'의 상호작용이 각 위스키 고유의 풍미를 결정한다.",
        history: "위스키의 기원은 15세기 스코틀랜드·아일랜드 수도원에서 약용으로 증류하던 '아쿠아 비테(Aqua Vitae, 생명의 물)'로 거슬러 올라간다. 18~19세기 세제 합법화와 연속식 증류기(Column Still)의 발명으로 산업화가 가속됐고, 20세기 두 차례 세계대전과 미국 금주법 시대를 거치며 글로벌 브랜드가 형성됐다. 21세기에는 일본, 한국, 대만, 인도 등 아시아 위스키가 세계적 인정을 받으며 '월드 위스키' 시대가 열리고 있다.",
        classifications: [
            {
                name: "싱글 몰트 스카치 위스키 (Single Malt Scotch)",
                criteria: "스코틀랜드 단일 증류소, 100% 맥아 보리, 구리 팟 스틸 증류, 오크통 3년 이상 숙성",
                description: "증류소 고유의 테루아와 장인 정신이 가장 직접적으로 투영된다. 하이랜드·스페이사이드·아일라·로우랜드·캠벨타운 등 지역별로 전혀 다른 향미 프로파일을 보인다."
            },
            {
                name: "블렌디드 스카치 위스키 (Blended Scotch)",
                criteria: "스코틀랜드산 몰트 위스키 1종 이상 + 그레인 위스키 1종 이상 블렌딩",
                description: "마스터 블렌더가 수십 종의 원액을 조화시켜 균형 잡힌 하우스 스타일을 완성한다. 전체 스카치 위스키 출하량의 약 90%를 차지하는 가장 대중적인 카테고리다."
            },
            {
                name: "버번 위스키 (Bourbon Whiskey)",
                criteria: "미국산, 옥수수 매쉬빌 51% 이상, 새 오크통(화이트 오크, 내부 차링) 숙성, 최대 125 proof 증류",
                description: "바닐라·카라멜·코코넛 등 달콤하고 풍성한 오크 노트가 특징이다. 켄터키가 중심이며, NAS부터 스몰 배치·싱글 배럴까지 다양한 세그먼트가 발전했다."
            },
            {
                name: "아이리시 위스키 (Irish Whiskey)",
                criteria: "아일랜드 섬에서 생산, 오크통 3년 이상 숙성, 3회 증류(전통적)",
                description: "3회 증류 전통으로 매우 부드럽고 가벼운 질감이 특징이다. 그레인·몰트·팟 스틸 스타일이 공존하며, 미국 버번 캐스크 피니시 제품이 널리 인기를 끌고 있다."
            },
            {
                name: "재패니즈 위스키 (Japanese Whisky)",
                criteria: "일본에서 생산, 스코틀랜드 전통에 기반한 팟 스틸/컬럼 스틸 사용, 미즈나라(일본 참나무) 숙성 활용",
                description: "繊細함과 균형미, 미즈나라의 백단향·코코넛 계열 향이 특징이다. 야마자키·하쿠슈·니카 등 세계 컬렉터들에게 높은 평가를 받는다."
            },
            {
                name: "라이 위스키 (Rye Whiskey)",
                criteria: "미국 또는 캐나다산, 호밀(라이) 51% 이상 매쉬빌(미국 기준)",
                description: "스파이시하고 드라이한 성격이 강조된다. 1920년대 칵테일 문화의 기반이 되었으며, 최근 클래식 칵테일 르네상스와 함께 급격히 부활하고 있다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "40~65% (스타일에 따라)",
                description: "법적 최저 병입 도수는 스타일마다 다르나 보통 40%다. 캐스크 스트렝스(50~65%)는 희석 없이 오크와 원액의 풍미를 극대화한다."
            },
            {
                metric: "숙성 연수",
                label: "Maturity",
                value: "NAS / 3~12년 / 18년+",
                description: "오크통에서 보내는 시간이 늘수록 타닌이 부드러워지고 바닐라·스파이스·건과일 같은 오크 유래 향미가 깊어진다. NAS(No Age Statement)도 원액 품질에 따라 훌륭한 복합성을 지닌다."
            },
            {
                metric: "피트 스모크 (Phenols)",
                label: "Peatiness",
                value: "0~50+ ppm",
                description: "이탄(피트)으로 맥아를 건조할 때 흡수되는 페놀 성분이 스모키·약품·해풍 계열 향을 만든다. 아일라 스타일은 35~50ppm 이상으로 강렬하고, 스페이사이드는 대체로 무피트(0ppm)다."
            },
            {
                metric: "캐스크 타입",
                label: "Oak Influence",
                value: "버번 / 셰리 / 와인 / 미즈나라",
                description: "버번 캐스크는 바닐라·코코넛을, 셰리 캐스크는 건포도·다크 초콜릿을, 미즈나라는 백단향·코코넛·향신료를 부여한다. 피니시 캐스크 선택이 최종 향미 복합성을 결정한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "곡물 (맥아 보리·옥수수·호밀·밀)",
                description: "곡물의 종류가 위스키의 기본 풍미 골격을 결정한다. 맥아 보리는 과일·견과, 옥수수는 달콤함, 호밀은 스파이시함을 기여한다."
            },
            {
                type: "물",
                name: "현지 용수 (Terroir Water)",
                description: "증류소 주변 수원의 미네랄 성분이 발효·증류·희석 과정에 영향을 주어 지역별 고유 캐릭터를 형성한다."
            },
            {
                type: "숙성통",
                name: "오크 캐스크",
                description: "일반적으로 완성된 위스키 향미의 60~70%가 오크 숙성에서 비롯된다. 캐스크 크기·이력·숙성 환경이 최종 품질을 좌우한다."
            }
        ],
        manufacturingProcess: [
            { step: "맥아화", name: "제맥(Malting)", description: "보리를 발아시켜 당화 효소를 활성화한 뒤, 킬른(가마)으로 건조한다. 이 과정에서 피트를 사용하면 스모키 캐릭터가 부여된다." },
            { step: "당화·발효", name: "매싱 & 워시백 발효", description: "분쇄한 맥아를 온수에 당화해 워트(맥즙)를 추출한 뒤, 효모를 투입해 알코올 발효시켜 워시(wash, 약 8% ABV)를 만든다." },
            { step: "증류", name: "팟 스틸 또는 컬럼 스틸 증류", description: "팟 스틸은 2~3회 증류로 묵직하고 풍성한 향을 남기고, 컬럼 스틸은 연속 증류로 깔끔하고 가벼운 증류액을 만든다." },
            { step: "숙성", name: "오크통 숙성", description: "뉴메이크 스피릿을 오크통에 담아 기간·환경에 따라 색상과 복합성을 얻는다. 이 단계가 최종 위스키 캐릭터의 대부분을 결정한다." },
            { step: "병입", name: "블렌딩 & 병입", description: "단독 또는 여러 캐스크를 조합해 목표 도수로 희석하거나 캐스크 스트렝스 그대로 병입한다." }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런(Glencairn) 또는 코피타(Copita) — 향을 모아 복합성을 극대화한다",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (니트)",
                    description: "바닐라·꿀·과일 레이어가 가장 잘 열린다. 오크의 질감과 알코올 밸런스를 온전히 느낄 수 있는 기본 형태다."
                },
                {
                    temp: "4~8℃ (하이볼)",
                    description: "탄산이 위스키의 달콤·시트러스 계열 향을 끌어올려 청량감을 극대화한다. 식사 중 페어링에 이상적이다."
                },
                {
                    temp: "0~2℃ (온더락)",
                    description: "알코올 자극이 줄어들며 오크의 달콤한 향이 부드럽게 올라온다. 텁텁한 타닌이 있는 보디감 강한 위스키에 특히 적합하다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "물·얼음 없이 상온에서 그대로 즐기는 방법. 위스키 본연의 모든 향과 질감을 가장 직접적으로 경험할 수 있다."
                },
                {
                    name: "가수 (Water Addition)",
                    description: "상온 물을 한두 방울 첨가하면 에스터 향이 피어오르며 더욱 풍부한 아로마를 경험한다. 특히 고도수(46%+) 위스키에 효과적이다."
                },
                {
                    name: "하이볼 (Highball)",
                    description: "1:3 비율의 탄산수와 함께 즐기는 일본 유래의 클래식 방식. 라이트한 블렌디드·버번·재패니즈 위스키와 궁합이 탁월하다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "큰 얼음 위에 부어 서서히 차가워지며 즐기는 방식. 강한 탄닌이나 높은 도수를 가진 위스키의 날카로운 각을 부드럽게 만든다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "꿀/과일", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "오크/나무", color: 'bg-amber-200 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100' },
            { label: "스파이스/후추", color: 'bg-red-100 text-red-950 dark:bg-red-900/40 dark:text-red-100' },
            { label: "스모키/피트", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "건과일/초콜릿", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' }
        ],
        foodPairing: [
            "스테이크 및 훈제 바비큐",
            "삼겹살·불고기 (하이볼 페어링)",
            "다크 초콜릿 및 각종 견과류",
            "하드 치즈 (체다·그뤼에르)",
            "연어 및 훈제 생선 요리"
        ],
        relatedPageSlug: 'scotch-whisky-regions',
        relatedPageLabelKo: '스카치 위스키 지역별 가이드 →',
        relatedPageLabelEn: 'Scotch Whisky Regions Guide →',
        faqs: [
            {
                question: "위스키(Whisky)와 위스키(Whiskey), 철자가 다른 이유는?",
                answer: "스코틀랜드·일본·캐나다는 'Whisky', 아일랜드·미국은 'Whiskey'를 사용한다. 역사적 이민과 언어 문화권의 차이로 굳어진 표기법이며, 맛·품질과는 무관하다."
            },
            {
                question: "숙성 연수가 높을수록 항상 더 좋은 위스키인가?",
                answer: "반드시 그렇지 않다. 숙성 연수가 증가할수록 오크의 영향이 깊어지지만, 원액의 초기 품질·캐스크 상태·증류소 환경이 더 본질적인 품질을 결정한다. NAS(No Age Statement) 위스키도 뛰어난 복합성을 가질 수 있다."
            },
            {
                question: "아이리시 위스키가 유독 부드러운 이유는?",
                answer: "아이리시 위스키는 전통적으로 3회 증류를 거쳐 불순물과 거친 향이 제거되어 매우 가볍고 부드러운 질감을 갖는다. 또한 대부분 버번 캐스크에서 숙성되어 달콤하고 크리미한 풍미가 강조된다."
            }
        ]
    },
    sectionsEn: {
        definition: "Whisky (or Whiskey) is a brown distilled spirit made by mashing, fermenting, and distilling grain (typically malted barley, corn, rye, or wheat), then aging it in oak casks for a minimum legally defined period. The laws and traditions of each country — Scotland, Ireland, the USA, Japan, Canada — define distinct styles, and the interplay of 'terroir (grain, water, yeast, climate)' and 'oak maturation' determines the unique character of every whisky.",
        history: "The origins of whisky trace back to the 15th-century Scottish and Irish monasteries, where 'aqua vitae' ('water of life') was distilled for medicinal purposes. The industrial revolution was accelerated by the legalization of distilling in the 18th–19th centuries and the invention of the continuous column still. The 20th-century World Wars and American Prohibition shaped the global brand landscape. Today, Asian whiskies from Japan, Korea, Taiwan, and India are gaining worldwide recognition, ushering in the era of 'World Whisky.'",
        classifications: [
            {
                name: "Single Malt Scotch Whisky",
                criteria: "Single Scottish distillery, 100% malted barley, copper pot still distillation, oak cask maturation for at least 3 years",
                description: "The most direct expression of a distillery's unique terroir and craftsmanship. Flavor profiles differ dramatically by region: Highland, Speyside, Islay, Lowland, and Campbeltown each have a distinct character."
            },
            {
                name: "Blended Scotch Whisky",
                criteria: "A blend of one or more Scottish malt whiskies with one or more single grain whiskies",
                description: "A master blender harmonizes dozens of single spirits to create a balanced, consistent house style. Accounting for roughly 90% of all Scotch exports, it is the most commercially accessible category."
            },
            {
                name: "Bourbon Whiskey",
                criteria: "Made in the USA, mash bill minimum 51% corn, aged in new charred white oak barrels, distilled at no more than 160 proof",
                description: "Characterized by rich vanilla, caramel, and coconut notes from new oak. Kentucky is its spiritual home. The category spans NAS expressions through small-batch and single-barrel premiums."
            },
            {
                name: "Irish Whiskey",
                criteria: "Produced on the island of Ireland, aged in wooden casks for at least 3 years, traditionally triple-distilled",
                description: "Triple distillation creates an exceptionally smooth, light texture. Grain, malt, and pot still styles coexist, and bourbon cask finishes are widely popular for their creamy, approachable character."
            },
            {
                name: "Japanese Whisky",
                criteria: "Produced in Japan; uses pot and column stills inspired by Scotch tradition; often finished in mizunara (Japanese oak) casks",
                description: "Defined by elegance, balance, and the sandalwood-coconut notes of mizunara oak. Distilleries such as Yamazaki, Hakushu, and Nikka are held in the highest regard by collectors worldwide."
            },
            {
                name: "Rye Whiskey",
                criteria: "American or Canadian; mash bill at least 51% rye grain (US standard)",
                description: "A bold, spicy, and dry character that formed the backbone of classic cocktail culture in the 1920s. Currently undergoing a major revival alongside the global renaissance of classic cocktails."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Alcohol by Volume (ABV)",
                label: "Strength",
                value: "40–65% (varies by style)",
                description: "The legal minimum bottling strength is typically 40%. Cask strength expressions (50–65%) maximize the intensity of oak and spirit flavors without dilution."
            },
            {
                metric: "Age Statement",
                label: "Maturity",
                value: "NAS / 3–12Y / 18Y+",
                description: "Extended time in oak softens tannins and deepens vanilla, spice, and dried-fruit notes. NAS (No Age Statement) whiskies can also achieve impressive complexity depending on spirit quality."
            },
            {
                metric: "Peat Smoke (Phenols)",
                label: "Peatiness",
                value: "0–50+ ppm",
                description: "Phenols absorbed when malt is dried over burning peat create smoky, medicinal, and briny aromas. Islay styles can exceed 35–50 ppm, while most Speysides are unpeated (0 ppm)."
            },
            {
                metric: "Cask Type",
                label: "Oak Influence",
                value: "Bourbon / Sherry / Wine / Mizunara",
                description: "Bourbon casks contribute vanilla and coconut; sherry casks give dried fruit and dark chocolate; mizunara imparts sandalwood and exotic spice. The choice of finish cask is critical to final complexity."
            }
        ],
        coreIngredients: [
            {
                type: "Base Grain",
                name: "Malted Barley, Corn, Rye, or Wheat",
                description: "The choice of grain defines the spirit's fundamental flavor framework: malted barley brings fruit and nuts, corn delivers sweetness, and rye provides spiciness."
            },
            {
                type: "Water",
                name: "Local Source Water (Terroir Water)",
                description: "The mineral profile of a distillery's local water source influences fermentation, distillation, and dilution, helping to establish the regional character of each whisky."
            },
            {
                type: "Maturation",
                name: "Oak Cask",
                description: "It is widely accepted that 60–70% of a mature whisky's flavor comes from oak maturation. Cask size, history, and storage environment are the most decisive quality factors."
            }
        ],
        manufacturingProcess: [
            { step: "Malting", name: "Malting (Germination & Kilning)", description: "Barley is steeped and allowed to germinate to activate sugar-converting enzymes, then dried in a kiln. Using peat as fuel at this stage imparts smoky phenolic character." },
            { step: "Mashing & Fermentation", name: "Mashing & Washback Fermentation", description: "Ground malt is steeped in hot water to extract a sugar-rich wort. Yeast is then added to ferment the wort into a low-ABV wash (approximately 8%)." },
            { step: "Distillation", name: "Pot Still or Column Still Distillation", description: "Pot stills (2–3 passes) preserve rich, complex flavors; column stills produce lighter, cleaner distillates through continuous distillation." },
            { step: "Maturation", name: "Oak Cask Maturation", description: "New-make spirit is filled into oak casks where time and environment bestow color and complexity. This stage shapes the vast majority of the whisky's final character." },
            { step: "Bottling", name: "Blending & Bottling", description: "Single or multiple casks are combined and either diluted to target ABV or bottled at cask strength." }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn Glass or Copita — both concentrate aromas and maximize complexity",
            optimalTemperatures: [
                {
                    temp: "18–22°C (Neat)",
                    description: "The ideal range for vanilla, honey, and fruit layers to open fully. Experience the oak texture and alcohol balance in its purest form."
                },
                {
                    temp: "4–8°C (Highball)",
                    description: "Carbonation lifts the sweet and citrus-forward aromas, maximizing refreshment. The ideal pairing companion throughout a meal."
                },
                {
                    temp: "0–2°C (On the Rocks)",
                    description: "Reduces alcohol sting while highlighting smooth oak-derived sweetness. Especially suited to full-bodied whiskies with assertive tannins."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "Consumed at room temperature without water or ice. The most direct way to experience all the aromas, flavors, and textures the whisky has to offer."
                },
                {
                    name: "Water Addition",
                    description: "A drop or two of room-temperature water breaks the surface tension, releasing hidden ester aromas. Particularly effective with high-strength expressions (46%+)."
                },
                {
                    name: "Highball",
                    description: "A classic Japanese-influenced method: mix 1 part whisky with 3 parts sparkling water over ice. Light blended, bourbon, and Japanese whiskies perform especially well in this style."
                },
                {
                    name: "On the Rocks",
                    description: "Pour over a large ice cube and allow the chill to slowly round out the sharp edges. Best suited for bold, tannic, or high-ABV whiskies."
                }
            ]
        },
        flavorTags: [
            { label: "Vanilla / Caramel", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Honey / Fruit", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Oak / Wood", color: 'bg-amber-200 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100' },
            { label: "Spice / Pepper", color: 'bg-red-100 text-red-950 dark:bg-red-900/40 dark:text-red-100' },
            { label: "Smoky / Peat", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Dried Fruit / Chocolate", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' }
        ],
        foodPairing: [
            "Steak and Smoked Barbecue",
            "Grilled Pork Belly and Bulgogi (with Highball)",
            "Dark Chocolate and assorted nuts",
            "Hard cheeses (Cheddar, Gruyère)",
            "Salmon and smoked fish dishes"
        ],
        relatedPageSlug: 'scotch-whisky-regions',
        relatedPageLabelKo: '스카치 위스키 지역별 가이드 →',
        relatedPageLabelEn: 'Scotch Whisky Regions Guide →',
        faqs: [
            {
                question: "Why is whisky spelled both with and without an 'e'?",
                answer: "Scotland, Japan, and Canada use 'Whisky', while Ireland and the USA use 'Whiskey'. The difference is a historical artifact of regional linguistic traditions carried across by emigrants, and has no bearing on taste or quality."
            },
            {
                question: "Is a higher age statement always a better whisky?",
                answer: "Not necessarily. While extended oak contact deepens complexity, the initial quality of the new-make spirit, cask condition, and storage environment are more fundamental to quality. Many NAS (No Age Statement) whiskies deliver exceptional character."
            },
            {
                question: "Why is Irish Whiskey notably smoother than other styles?",
                answer: "Traditional Irish Whiskey undergoes triple distillation, which removes harsher compounds and produces a particularly light, smooth texture. Most expressions are also matured in ex-bourbon casks, which impart a creamy, approachable sweetness."
            }
        ]
    }
}
