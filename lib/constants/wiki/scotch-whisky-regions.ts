import { SpiritCategory } from './types'

export const scotchWhiskyRegions: SpiritCategory = {
    slug: 'scotch-whisky-regions',
    dbCategories: ['위스키'],
    emoji: '🗺️',
    nameKo: '스카치 위스키 지역 가이드',
    nameEn: 'Scotch Whisky Regions Guide',
    taglineKo: '스코틀랜드 5대 위스키 산지의 지역별 개성과 대표 증류소를 한눈에',
    taglineEn: 'Explore the distinct character of Scotland\'s 5 whisky-producing regions and their iconic distilleries',
    color: 'amber',
    sections: {
        definition: '스카치 위스키의 맛은 단순히 숙성 연수나 캐스크의 종류만으로 결정되지 않는다. 증류소가 위치한 스코틀랜드의 지역—그 지역의 기후, 물, 대기, 피트의 종류—이 위스키 한 병의 정체성을 결정짓는 가장 근원적인 변수다. 법적으로 스카치 위스키는 스코틀랜드 내 5개의 주요 산지로 구분되며, 각 지역은 고유의 "테루아(Terroir)"를 가진다.',
        history: '스코틀랜드 위스키 산지 구분의 역사는 1784년 세금 징수를 위한 행정 구역 분류에서 비롯되었다. 이후 1823년 소비세법(Excise Act) 개혁으로 합법적 증류 산업이 자리 잡고, 각 지역 증류소들이 독자적인 스타일을 발전시켜 나가며 오늘날의 산지별 개성이 형성되었다. 스카치 위스키 협회(SWA)는 현재 Highland, Speyside, Lowland, Islay, Campbeltown의 5개 공식 지역을 인정하고 있다.',
        classifications: [
            {
                name: '스페이사이드 (Speyside)',
                criteria: '스코틀랜드 북동부, 스페이 강 유역 | 스카치 전체 생산량의 약 60% 차지 | 대표 증류소: 글렌피딕, 맥캘란, 더 글렌리벳, 발베니, 글렌파클라스',
                description: '세계에서 증류소 밀집도가 가장 높은 지역으로, 전 세계 싱글몰트 스카치의 절반 이상이 이곳에서 생산된다. 스페이 강의 부드럽고 미네랄이 풍부한 물을 사용하며, 피트를 거의 사용하지 않는다. 셰리 캐스크 숙성의 비율이 높아 건포도·무화과·다크 초콜릿·오렌지 필 같은 풍부하고 달콤한 과실향이 대표적이다. 맥캘란, 글렌파클라스처럼 헤비 셰리 스타일부터, 더 글렌리벳처럼 화사하고 가벼운 플로럴 스타일까지 스펙트럼이 넓다.',
                flavorTags: [
                    { label: '셰리/건과일', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '꿀/바닐라', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '사과/배', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: '오크/스파이스', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            },
            {
                name: '하이랜드 (Highland)',
                criteria: '스코틀랜드 북부 및 중부 대부분 지역 | 가장 광활한 산지 | 대표 증류소: 탈리스커(아일랜드 인근), 글렌모렌지, 달모어, 오반, 에드라두어',
                description: '스코틀랜드에서 지리적으로 가장 넓고 스타일이 다양한 산지다. 넓은 만큼 하위 스타일이 다채롭다: 북부 하이랜드는 꿀과 헤더꽃의 달콤함, 동부는 과실과 스파이스, 해안가(Coastal Highland)는 바다 소금기와 약한 피트향, 중부는 묵직한 바디와 카라멜이 특징이다. "하이랜드 스타일"이라는 하나의 규칙으로 묶기 어려울 정도로 개성이 분산되어 있으며, 그것이 오히려 탐험의 묘미를 준다.',
                flavorTags: [
                    { label: '꿀/헤더', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '과실/스파이스', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '해풍/소금기', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: '카라멜/오크', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: '아일라 (Islay)',
                criteria: '스코틀랜드 서부 해안의 섬 | 면적 대비 증류소 밀도 최고 | 대표 증류소: 아드벡, 라가불린, 라프로익, 보모어, 브룩라디, 킬호만',
                description: '주류계에서 가장 개성이 강하고 마니아층이 두터운 산지다. 아일라 섬은 해안선을 따라 무진장한 이탄(Peat)이 쌓여 있으며, 이 피트로 맥아를 건조하는 전통이 아일라 위스키의 상징인 "스모키함"을 만든다. PPM(페놀 수치) 25 이상의 헤비 피트부터 보모어처럼 상대적으로 절제된 스타일까지 존재한다. 훈제향 아래 잠복한 레몬·배·바닐라·타르·해초·요오드 등의 복합미가 깊다.',
                flavorTags: [
                    { label: '피트/스모키', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '해풍/요오드', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: '타르/메디시널', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '레몬/과실(배경)', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                ]
            },
            {
                name: '로우랜드 (Lowland)',
                criteria: '스코틀랜드 중남부 저지대 | 전통적으로 3회 증류 방식 | 대표 증류소: 오켄토션, 글렌킨치, 아녹무어, 아일사베이',
                description: '스카치 위스키 산지 중 가장 순하고 섬세한 스타일로 알려져 있다. 아일랜드 위스키 전통에서 영향을 받은 3회 증류 방식이 특징이며, 이로 인해 매우 가볍고 깨끗한 증류액이 만들어진다. 피트를 거의 사용하지 않으며, 초보자가 위스키에 입문할 때 첫 번째 선택지로 추천되곤 한다. 풀꽃, 크림, 레몬, 바닐라, 가벼운 오크의 섬세한 아로마가 특징이다.',
                flavorTags: [
                    { label: '크림/버터', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '풀꽃/허브', color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
                    { label: '레몬/시트러스', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: '가벼운 오크', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: '캠벨타운 (Campbeltown)',
                criteria: '킨타이어 반도 남쪽 끝의 작은 항구 도시 | 한때 30개 이상의 증류소가 있던 "세계의 위스키 수도" | 현존: 스프링뱅크, 글렌기어, 글렌스코시아',
                description: '과거 엄청난 번영을 누렸으나 20세기 초 경기 침체와 금주법 여파로 대부분의 증류소가 문을 닫았고, 현재는 3개 증류소만이 이 영광을 이어가고 있다. 캠벨타운 스타일은 독특하다: 유황 특유의 짭조름하고 오일리한 질감, 소금기, 적당한 피트, 그리고 묵직하고 복합적인 바디감이 특징이다. 특히 스프링뱅크는 전 세계 위스키 마니아에게 "가장 개성 있는 증류소"로 손꼽힌다.',
                flavorTags: [
                    { label: '유황/오일리', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '소금/해풍', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: '과실/스파이스', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '묵직한 바디', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: '피트 강도 (PPM)',
                label: 'Peat Level',
                value: '0 (로우랜드) ~ 50+ (아일라)',
                description: 'PPM(Phenol Parts Per Million)은 맥아의 페놀 함량으로 스모키함의 강도를 나타낸다. 스페이사이드·로우랜드는 0~5 PPM의 무피트, 하이랜드는 1~15 PPM, 아일라는 25~55 PPM의 헤비피트가 일반적이다.',
            },
            {
                metric: '바디감',
                label: 'Body',
                value: '라이트(로우랜드) → 풀(아일라·캠벨타운)',
                description: '로우랜드의 3회 증류는 기름기를 최소화한 가벼운 바디를 만들고, 아일라와 캠벨타운의 강한 해안 기후와 장기 숙성 전통은 오일리하고 묵직한 풀바디를 형성한다.',
            },
            {
                metric: '숙성 스타일',
                label: 'Cask Preference',
                value: '버번 캐스크(하이랜드) / 셰리 캐스크(스페이사이드)',
                description: '산지에 따라 선호하는 캐스크가 다르다. 스페이사이드는 셰리 캐스크 사용이 많고, 하이랜드와 아일라는 보통 버번 캐스크를 주로 활용한다.',
            }
        ],
        coreIngredients: [
            {
                type: '공통 원료',
                name: '스코틀랜드산 맥아 보리 (Scottish Malted Barley)',
                description: '법적으로 모든 스카치 위스키는 스코틀랜드에서 재배한 보리를 사용해야 한다. 맥아화(몰팅) 방식과 건조 방법(피트 여부)이 지역 스타일의 첫 번째 분기점이 된다.'
            },
            {
                type: '지역별 핵심 변수',
                name: '피트 (Peat) — 아일라·캠벨타운',
                description: '수천 년에 걸쳐 쌓인 이탄이 연소되면서 나오는 연기가 맥아에 페놀 성분을 입힌다. 아일라 피트는 해조류를 포함해 "해풍+스모크"를 만들고, 내륙 피트(하이랜드)는 보다 건조한 흙 향을 낸다.'
            },
            {
                type: '지역별 핵심 변수',
                name: '양조용 물 (Terroir Water)',
                description: '스페이 강의 미네랄이 풍부한 연수, 하이랜드의 화강암 암반수, 아일라 섬의 피트를 통과한 연수 — 물의 성질이 발효와 증류에서 다른 결과를 만든다. 이것이 "테루아"의 가장 큰 물질적 증거다.'
            }
        ],
        manufacturingProcess: [
            {
                step: '피트 적용',
                name: '지역 피트로 맥아 건조',
                description: '아일라산 피트, 하이랜드산 피트, 혹은 무피트 방식으로 맥아를 건조하는 것이 지역 스타일의 첫 번째 갈림길이다.'
            },
            {
                step: '발효/증류',
                name: '팟 스틸의 형태와 컷 포인트',
                description: '팟 스틸의 목(Neck) 길이와 형태도 지역 내 차이를 만든다. 긴 목은 더 가볍고 플로럴한 증류액을, 짧은 목은 더 오일리하고 무거운 증류액을 만든다.'
            },
            {
                step: '숙성',
                name: '창고 환경 (Dunnage Warehouse)',
                description: '해안가 증류소의 창고는 습하고 눅눅한 환경에서 알코올이 더 빠르게 증발하고 바다 향이 위스키에 스며든다. 내륙 고원의 건조한 창고는 더 느리고 섬세한 숙성을 만든다.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: '글렌캐런(Glencairn) 또는 튤립형 노징 글라스',
            optimalTemperatures: [
                { temp: '18~22℃ (니트)', description: '지역마다 극명하게 차이나는 아로마가 가장 선명하게 드러난다.' },
                { temp: '가수 후 탐색', description: '물을 조금 섞으면 아일라의 피트 아래 과실향과 스페이사이드의 섬세한 꽃내음이 더 분명히 열린다.' }
            ],
            methods: [
                { name: '지역 비교 시음', description: '같은 숙성 연수의 스페이사이드(e.g. 글렌리벳 12)와 아일라(e.g. 보모어 12)를 나란히 시음하면, 지역 테루아의 차이를 가장 극적으로 체험할 수 있다.' },
                { name: '입문용 추천 순서', description: '① 로우랜드(크리미·라이트) → ② 하이랜드(균형·다양) → ③ 스페이사이드(달콤·과실) → ④ 캠벨타운(오일리·복합) → ⑤ 아일라(피트·스모키) 순서로 탐색하면 위스키 세계를 체계적으로 이해할 수 있다.' }
            ]
        },
        flavorTags: [
            { label: '스페이사이드: 셰리·과실', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: '하이랜드: 꿀·다양성', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: '아일라: 피트·스모키', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: '로우랜드: 크림·플로럴', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
            { label: '캠벨타운: 오일리·소금기', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
        ],
        foodPairing: [
            '스페이사이드 — 훈제 연어, 숙성 치즈, 다크 초콜릿',
            '하이랜드 — 스테이크, 양갈비, 헤더허니 요리',
            '아일라 — 신선한 굴, 해산물 플래터, 훈제 고등어',
            '로우랜드 — 크림치즈, 연어 카나페, 라이트 샐러드',
            '캠벨타운 — 훈제 해산물, 스코틀랜드 전통 하기스',
        ],
        relatedPageSlug: 'single-malt',
        relatedPageLabelKo: '← 싱글 몰트 위스키 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Single Malt Whisky Wiki',
    },
    sectionsEn: {
        definition: 'The flavor of Scotch Whisky is not determined solely by age statements or cask types. The region of Scotland where a distillery is located — its climate, water source, air, and peat — is the most fundamental variable shaping a bottle\'s identity. Legally, Scotch Whisky is classified into five principal producing regions, each possessing a unique "Terroir."',
        history: 'The regional classification of Scotch Whisky traces its roots to 1784 administrative tax boundaries. Following the landmark Excise Act of 1823, which legalized distillation on a commercial scale, individual distilleries in each region developed their own distinct styles. Today, the Scotch Whisky Association (SWA) officially recognizes five regions: Highland, Speyside, Lowland, Islay, and Campbeltown.',
        classifications: [
            {
                name: 'Speyside',
                criteria: 'Located in northeastern Scotland along the River Spey | Accounts for approximately 60% of all Scotch production | Key Distilleries: Glenfiddich, Macallan, The Glenlivet, Balvenie, Glenfarclas',
                description: 'The world\'s most densely concentrated whisky-producing region, responsible for over half of all single malt Scotch. The soft, mineral-rich waters of the River Spey and a predominant use of Sherry casks define its signature: rich dried fruit, dark chocolate, orange peel, and honey. Styles range from the heavy sherry bombs of Macallan and Glenfarclas to the lighter, floral elegance of The Glenlivet.',
                flavorTags: [
                    { label: 'Sherry/Dried Fruit', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Honey/Vanilla', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Apple/Pear', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: 'Oak/Spice', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            },
            {
                name: 'Highland',
                criteria: 'The largest whisky region; encompasses most of northern and central Scotland | Key Distilleries: Glenmorangie, Dalmore, Oban (Coastal), Edradour, Talisker (Isle of Skye, often associated)',
                description: 'The most geographically diverse region, making a single "Highland style" nearly impossible to define. The north favors honey and heather, the east leans toward fruit and spice, coastal Highland distilleries carry a briny, maritime quality with light peat, and the central Highlands produce richer, more caramel-driven expressions. This diversity is its greatest strength and a treasure for whisky explorers.',
                flavorTags: [
                    { label: 'Honey/Heather', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Fruit/Spice', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Sea Breeze/Brine', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: 'Caramel/Oak', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: 'Islay',
                criteria: 'A small island off the west coast of Scotland | Highest distillery density per square kilometer | Key Distilleries: Ardbeg, Lagavulin, Laphroaig, Bowmore, Bruichladdich, Kilchoman',
                description: 'The most iconic and intensely flavored region in whisky. Vast peat bogs along the coastline and centuries of tradition mean most Islay expressions carry powerful, distinctive smoke. The peat is laced with seaweed and organic coastal matter, producing a unique "maritime smoke" of iodine, brine, and tar. Beneath the smoke lies a surprising complexity of lemon, vanilla, and briny fruit. Entry-level to Islay: Bowmore 12. The deep end: Ardbeg or Laphroaig 10.',
                flavorTags: [
                    { label: 'Peat/Smoky', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Coastal/Iodine', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: 'Tar/Medicinal', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Lemon/Fruit (Underlying)', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                ]
            },
            {
                name: 'Lowland',
                criteria: 'The southern lowlands of Scotland | Traditionally triple-distilled | Key Distilleries: Auchentoshan, Glenkinchie, Ailsa Bay',
                description: 'The gentlest and most approachable of the Scotch regions, often compared to Irish whiskey in style. Triple distillation (a rarity in Scotland, common in Ireland) produces an exceptionally clean and light distillate with minimal fusel oils. No peat is used. The resulting expressions are delicate, creamy, and floral — showcasing elderflower, vanilla, lemon curd, and light cereal notes. Highly recommended as a gateway whisky.',
                flavorTags: [
                    { label: 'Cream/Butter', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Wildflower/Herbal', color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
                    { label: 'Lemon/Citrus', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: 'Light Oak', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: 'Campbeltown',
                criteria: 'A small harbor town at the southern tip of the Kintyre Peninsula | Once home to 30+ distilleries; the "Whisky Capital of the World" | Surviving Distilleries: Springbank, Glengyle (Kilkerran), Glen Scotia',
                description: 'A once-booming town brought to near extinction by Prohibition-era economic collapse. Only three distilleries carry the flame today, yet Campbeltown retains its own official GI (Geographical Indication). Its style is unmistakable: a distinct sulfurous note, oily and viscous texture, briny coastal character, and a medium peat presence that gives a complex, rugged profile. Springbank in particular is revered globally as one of the most characterful and collectible distilleries in existence.',
                flavorTags: [
                    { label: 'Sulfurous/Oily', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Brine/Sea Air', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                    { label: 'Fruit/Spice', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Full Body', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: 'Peat Level (PPM)',
                label: 'Smokiness',
                value: '0 (Lowland) to 50+ PPM (Islay)',
                description: 'PPM (Phenol Parts Per Million) measures phenol content — the primary driver of smokiness. Speyside and Lowland are typically 0–5 PPM, Highland varies widely from 1–20 PPM, while Islay expressions range from 25 to 55+ PPM.',
            },
            {
                metric: 'Body',
                label: 'Mouthfeel',
                value: 'Light (Lowland) → Full (Islay / Campbeltown)',
                description: 'Triple distillation in the Lowland removes most oils for a light, clean spirit. The harsh maritime climate of Islay and Campbeltown\'s aging traditions build a rich, oily, full-bodied character that coats the palate.',
            },
            {
                metric: 'Preferred Cask Style',
                label: 'Cask Preference',
                value: 'Bourbon (Highland) / Sherry (Speyside)',
                description: 'Speyside distilleries favor the sweetness and fruit of Sherry casks. Highland and Islay distilleries predominantly use ex-Bourbon barrels, letting the distillery\'s own character shine rather than heavy wood influence.',
            }
        ],
        coreIngredients: [
            {
                type: 'Shared Foundation',
                name: 'Scottish Malted Barley',
                description: 'By law, all Scotch Whisky must be produced from cereals grown in Scotland. The malting and kilning method — specifically whether peat is burned during drying — is the first point of divergence between regional styles.'
            },
            {
                type: 'Regional Key Variable',
                name: 'Peat (Islay / Campbeltown)',
                description: 'Millennia of accumulated organic matter burns to release phenolic smoke that bonds to the malt. Islay peat is rich in coastal, seaweed-laden matter, producing unique iodine and brine characters. Inland peat (from the Highlands) creates a drier, earthier smoke.'
            },
            {
                type: 'Regional Key Variable',
                name: 'Terroir Water',
                description: 'The mineral-rich soft water of the River Spey, the granite mountain spring water of the Highlands, and the peat-filtered water of Islay all create chemically different distillates. This is the purest material expression of Scottish terroir.'
            }
        ],
        manufacturingProcess: [
            {
                step: 'Peat Application',
                name: 'Regional Peat Kilning',
                description: 'Using local Islay, Highland, or no peat to dry the malt is the first major stylistic fork in the road between regions.'
            },
            {
                step: 'Distillation',
                name: 'Still Shape & Cut Point',
                description: 'The shape of the pot still\'s neck dramatically affects character. Tall, lanky stills (Glenmorangie) produce lighter, more floral spirits. Short, squat stills (Lagavulin) yield heavier, oilier distillates.'
            },
            {
                step: 'Maturation',
                name: 'Coastal Warehouse Environment',
                description: 'Coastal warehouses (dunnage-style) expose maturing whisky to humid, salty sea air, subtly infusing the spirit over years. Highland inland warehouses offer a drier, more controlled environment for a slower, more refined maturation.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: 'Glencairn Glass or Tulip-shaped Nosing Glass',
            optimalTemperatures: [
                { temp: '18–22°C (Neat)', description: 'The most revealing way to distinguish the dramatic regional differences in aroma and texture.' },
                { temp: 'With a Drop of Water', description: 'A few drops opens up fruit notes hidden beneath Islay\'s peat and reveals the delicate florals of Speyside.' }
            ],
            methods: [
                { name: 'Regional Comparison Tasting', description: 'Taste a Speyside 12 (e.g., Glenlivet) alongside an Islay 12 (e.g., Bowmore) side by side for a dramatic, revelatory experience of terroir-driven flavor difference.' },
                { name: 'Recommended Exploration Order', description: '① Lowland (creamy, light) → ② Highland (balanced, diverse) → ③ Speyside (sweet, fruity) → ④ Campbeltown (oily, complex) → ⑤ Islay (peated, smoky). This systematic journey builds a complete taste map of Scotland.' }
            ]
        },
        flavorTags: [
            { label: 'Speyside: Sherry & Fruit', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: 'Highland: Honey & Diversity', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: 'Islay: Peat & Smoke', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: 'Lowland: Cream & Floral', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
            { label: 'Campbeltown: Oily & Briny', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
        ],
        foodPairing: [
            'Speyside — Smoked Salmon, Aged Cheese, Dark Chocolate',
            'Highland — Steak, Lamb Chops, Heather Honey Desserts',
            'Islay — Fresh Oysters, Seafood Platters, Smoked Mackerel',
            'Lowland — Cream Cheese, Salmon Canapés, Light Salads',
            'Campbeltown — Smoked Seafood, Traditional Haggis',
        ],
        relatedPageSlug: 'single-malt',
        relatedPageLabelKo: '← 싱글 몰트 위스키 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Single Malt Whisky Wiki',
    }
}
