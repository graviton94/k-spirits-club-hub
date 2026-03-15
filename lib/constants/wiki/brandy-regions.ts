import { SpiritCategory } from './types'

export const brandyRegions: SpiritCategory = {
    slug: 'brandy-regions',
    emoji: '🌍',
    nameKo: '브랜디 세계 산지 가이드',
    nameEn: 'World Brandy Regions Guide',
    taglineKo: '코냑, 아르마냑, 그라파, 피스코까지 — 세계 브랜디 산지의 개성과 차이',
    taglineEn: 'From Cognac and Armagnac to Grappa and Pisco — the world\'s great brandy regions and their distinct characters',
    color: 'orange',
    sections: {
        definition: '브랜디는 과일(주로 포도)을 발효하여 증류한 증류주의 총칭이다. 산지에 따라 법적 정의와 생산 방식이 엄격하게 구분되며, 각 지역의 기후·토양·포도 품종·숙성 방식이 극적으로 다른 개성을 만들어낸다. 프랑스 코냑의 우아함, 아르마냑의 복고적 깊이, 이탈리아 그라파의 강렬함, 남미 피스코의 과실미까지 — 브랜디는 세계에서 가장 다양한 지역 스타일을 가진 증류주 중 하나다.',
        history: '브랜디 생산의 역사는 14세기 프랑스 의사들이 와인을 증류해 "생명의 물(Eau de Vie)"을 만든 것에서 시작된다. 17세기 네덜란드 상인들이 와인의 운반 편의를 위해 대량 증류하면서 "Brandewijn(태운 와인)"이 코냑 산업의 토대를 만들었다. 코냑은 19세기 중반 급성장 후 필록세라(포도나무 해충) 습격으로 큰 타격을 받았으나, 아메리칸 오크로의 접목 실험 등으로 극복하며 현재의 프리미엄 카테고리로 发展했다.',
        classifications: [
            {
                name: '코냑 (Cognac) — 프랑스 샤랑트 지방',
                criteria: '프랑스 Charente 및 Charente-Maritime 데파르트망 내 생산 | 유니 블랑(Ugni Blanc) 품종 주 사용 | 샤랑트 증류기(구리 단식 증류기)로 2회 증류 | 프랑스산 오크에서 최소 2년 이상 숙성 | VS / VSOP / XO / Hors d\'âge 등급 체계',
                description: '세계에서 가장 엄격하게 규제되고 권위있는 브랜디 산지다. 분필(Chalk) 토양이 풍부한 "그랑드 샹파뉴"와 "프티트 샹파뉴" 지구는 최고 품질의 풍미를 만든다. 2회의 샤랑트 방식 증류로 정갈하고 우아한 증류액이 만들어지며, 리무쟁이나 트롱세 산 참나무에서의 장기 숙성으로 건자두·말린 꽃·가죽·도자기 같은 복합적인 3차 아로마가 발전한다.',
                flavorTags: [
                    { label: '건자두/말린 꽃', color: 'bg-rose-600/20 text-zinc-950 dark:text-rose-300' },
                    { label: '바닐라/시더', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
                    { label: '가죽/시가 박스', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: '오렌지 필/스파이스', color: 'bg-orange-500/20 text-zinc-950 dark:text-orange-300' },
                ]
            },
            {
                name: '아르마냑 (Armagnac) — 프랑스 가스코뉴 지방',
                criteria: '프랑스 남서부 3개 데파르트망(Gers, Lot-et-Garonne, Landes) | 콜롱바르, 폴 블랑스 등 다양한 품종 허용 | 아르마냑 특유의 연속식 단식 증류기(Alambic Armagnacais) 사용 | 블랙 오크 숙성 | 빈티지(단일 연도) 병입 허용',
                description: '코냑의 화려함과 달리, 아르마냑은 프랑스 주류 문화에서 가장 복고적이고 고집스러운 산지다. 단식 증류기로 1회만 증류하는 전통(연속 단식 증류)과 가스코뉴산 블랙 오크 사용이 코냑보다 더 기름지고(oily), 야생적이며, 원재료의 포도 개성이 강하게 남는 스타일을 만든다. 빈티지 아르마냑(특정 연도 수확 포도만 사용)은 희귀한 고급 시장에서 큰 인기를 끈다.',
                flavorTags: [
                    { label: '프룬/대추야자', color: 'bg-rose-700/20 text-zinc-950 dark:text-rose-400' },
                    { label: '오일리/풀바디', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
                    { label: '흙내/버섯', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: '고수/허브', color: 'bg-green-500/20 text-zinc-950 dark:text-green-300' },
                ]
            },
            {
                name: '헤레즈 브랜디 (Brandy de Jerez) — 스페인 안달루시아',
                criteria: '스페인 카디스 지방 헤레즈 데 라 프론테라 등 3개 도시 | 아이렌, 팔로미노 품종 | 솔레라(Solera) 시스템으로 다중 빈티지 블렌딩 | 셰리 와인을 담았던 배럴에서만 숙성',
                description: '셰리 와인 산지 헤레즈의 오래된 셰리 캐스크에서 숙성되는 이 브랜디는 세계에서 가장 달콤하고 진한 스타일을 자랑한다. 솔레라 시스템(오래된 통에 새 술을 점점 보충하며 블렌딩)으로 빈티지의 일관성 없이 깊은 복합미를 만들어낸다. 페드로 히메네스(PX) 캐스크를 거친 제품은 건포도·당밀·초콜릿 같은 극단적인 달콤함을 보인다.',
                flavorTags: [
                    { label: '건포도/당밀', color: 'bg-amber-800/20 text-zinc-950 dark:text-amber-400' },
                    { label: '초콜릿/커피', color: 'bg-stone-800/20 text-zinc-950 dark:text-stone-200' },
                    { label: '달콤한 스파이스', color: 'bg-orange-600/20 text-zinc-950 dark:text-orange-300' },
                    { label: '나무/탄닌', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: '그라파 (Grappa) — 이탈리아',
                criteria: '이탈리아 전역 | 와인 양조 후 남은 포도 찌꺼기(pomace: 껍질·씨·줄기)를 발효·증류 | 품종별 또는 지역별 그라파 가능',
                description: '그라파는 와인 제조의 부산물인 포도 찌꺼기를 원료로 쓴다. 대량의 탄닌과 껍질 성분이 남아있어 코냑보다 훨씬 강렬하고 날카로운 스타일이 특징이다. 베네토, 피에몬테, 프리울리 등 지역마다 포도 품종이 달라 개성이 극명히 갈린다. 고급 그라파는 청동 또는 스테인리스 탱크에서 숙성해 포도 품종 본연의 순수한 아로마를 강조한다.',
                flavorTags: [
                    { label: '강렬함/날카로움', color: 'bg-purple-600/20 text-zinc-950 dark:text-purple-300' },
                    { label: '꽃향/과실', color: 'bg-rose-400/20 text-zinc-950 dark:text-rose-300' },
                    { label: '허브/아니스', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: '호두/타닌', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-200' },
                ]
            },
            {
                name: '피스코 (Pisco) — 페루·칠레',
                criteria: '페루 및 칠레 (각각 원산지 법적 분쟁 중) | 허용된 특정 포도 품종만 사용 | 단식 증류 후 물·색소·첨가물 금지 | 오크 숙성 금지(페루식)',
                description: '페루의 피스코는 무숙성(투명)이 규정이다. 물을 첨가하거나 오크 향을 입히는 것을 금지하여 포도 품종 자체의 순수한 아로마 — 꽃항기, 복숭아, 사과, 시트러스 — 를 가장 응축된 형태로 보여준다. 피스코 사워(Pisco Sour) 칵테일로 세계적으로 유명해졌으며, 최근 고급 싱글 빈야드 피스코 시장도 성장 중이다.',
                flavorTags: [
                    { label: '꽃향기/복숭아', color: 'bg-pink-400/20 text-zinc-950 dark:text-pink-300' },
                    { label: '사과/포도', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: '시트러스/클린', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
                    { label: '투명/무숙성', color: 'bg-slate-300/20 text-zinc-950 dark:text-slate-200' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: '숙성 등급 (코냑)',
                label: 'Aging Classification',
                value: 'VS(2년+) / VSOP(4년+) / XO(10년+)',
                description: 'VS는 베이스 칵테일이나 입문용, VSOP는 니트와 칵테일 모두 적합, XO 이상은 단독 시음에 적합하다. 등급이 오를수록 건자두·가죽·꽃의 3차 아로마가 깊어진다.',
            },
            {
                metric: '증류 횟수',
                label: 'Distillation Count',
                value: '코냑(2회) vs 아르마냑(1회) vs 그라파(1회)',
                description: '증류 횟수가 많을수록 더 클린하고 우아한 증류액이 만들어진다. 코냑의 2회 증류가 아르마냑보다 정갈하고 섬세한 이유다. 그라파는 단 1회 증류이지만 포도 찌꺼기의 강한 개성 때문에 독특한 강렬함을 가진다.',
            },
            {
                metric: '오크 영향도',
                label: 'Oak Influence',
                value: '없음(피스코·신 그라파) → 강함(헤레즈·장기숙성 코냑)',
                description: '피스코(페루)는 오크 영향 없이 순수 포도 아로마를 강조한다. 반면 헤레즈 브랜디는 셰리 캐스크의 강한 영향을 그대로 받아들이며, 코냑 XO는 10년 이상의 오크 숙성으로 깊고 복합적인 나무 유래 아로마를 보인다.',
            }
        ],
        coreIngredients: [
            {
                type: '공통 원료',
                name: '포도 (Vitis vinifera)',
                description: '품종이 브랜디의 아로마 방향을 결정한다. 코냑의 유니 블랑은 높은 산도, 아르마냑의 폴 블랑스는 꽃향기, 피스코의 케브란타는 과실미를 각각 특화한다.'
            },
            {
                type: '지역 변수',
                name: '토양 (Terroir Soil)',
                description: '코냑 그랑드 샹파뉴의 분필 토양은 와인에 독특한 미네랄리티를 부여한다. 아르마냑의 점토·모래 혼합 토양, 헤레즈의 알바리자(백악) 토양이 각 지역 포도의 근원적 개성을 만든다.'
            },
            {
                type: '숙성 도구',
                name: '산지별 특화 오크',
                description: '코냑 — 리무쟁·트롱세 프랑스 오크(세밀한 결, 높은 탄닌), 아르마냑 — 가스코뉴 블랙 오크, 헤레즈 — 셰리 와인 전 출입 캐스크. 오크의 종류와 이전 내용물이 브랜디의 2차 아로마를 결정한다.'
            }
        ],
        manufacturingProcess: [
            {
                step: '발효',
                name: '포도/과즙 발효',
                description: '포도를 압착하여 즙을 얻고(코냑·피스코·아르마냑) 혹은 찌꺼기를 그대로 발효한다(그라파). 발효 온도와 효모 선택이 에스터(꽃·과실향)의 방향을 결정한다.'
            },
            {
                step: '증류',
                name: '지역 스타일 증류',
                description: '코냑은 2회, 아르마냑·그라파·피스코는 1회 증류가 전통이다. 코냑의 샤랑트 방식 구리 단식 증류기는 정갈하고 우아한 증류액을, 아르마냑의 특수 단식 연속 증류기는 더 오일리하고 복합적인 스타일을 만든다.'
            },
            {
                step: '숙성',
                name: '산지별 캐스크 숙성 (혹은 無숙성)',
                description: '코냑·아르마냑·헤레즈는 오크 숙성이 필수이지만, 페루 피스코는 오크 숙성이 법적으로 금지된다. 숙성 기간과 캐스크 종류가 최종 풍미의 70% 이상을 결정한다.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립형 코냑 글라스 또는 스니프터 글라스',
            optimalTemperatures: [
                { temp: '18~22℃ (코냑·아르마냑)', description: '실온에서 손으로 잔을 감싸 미지근하게 데우면(약 24~26℃) 3차 아로마가 가장 풍부하게 피어오른다.' },
                { temp: '4~8℃ (피스코·그라파)', description: '차갑게 마시면 포도 품종 본연의 순수한 꽃향과 과실향이 더 선명하고 신선하게 느껴진다.' }
            ],
            methods: [
                { name: '산지 비교 시음', description: 'VS급 코냑과 동급 아르마냑을 나란히 비교하면, 코냑의 정갈함 대비 아르마냑의 거친 개성이 극적으로 대비된다.' },
                { name: '피스코 사워 칵테일', description: '피스코 45ml + 레몬즙 30ml + 단순시럽 15ml + 달걀흰자(거품용) + 앙고스투라 비터 2방울. 피스코 특유의 꽃향기와 과실미를 가장 맛있게 즐기는 방법이다.' }
            ]
        },
        flavorTags: [
            { label: '코냑: 우아함·건자두', color: 'bg-rose-600/20 text-zinc-950 dark:text-rose-300' },
            { label: '아르마냑: 야생적·오일리', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
            { label: '헤레즈: 달콤·셰리', color: 'bg-amber-800/20 text-zinc-950 dark:text-amber-400' },
            { label: '그라파: 강렬·꽃향', color: 'bg-purple-500/20 text-zinc-950 dark:text-purple-300' },
            { label: '피스코: 과실·클린', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
        ],
        foodPairing: [
            '코냑 — 푸아그라, 다크 초콜릿, 블루 치즈',
            '아르마냑 — 오리 콩피, 카술레, 프룬 타르트',
            '헤레즈 — 초리소, 맨체고 치즈, 초콜릿 케이크',
            '그라파 — 이탈리안 에스프레소, 하드 치즈, 구운 견과류',
            '피스코 — 세비체, 로미토 사우스아메리칸 요리',
        ],
        dbCategories: ['브랜디'],
        relatedPageSlug: 'brandy',
        relatedPageLabelKo: '← 브랜디 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Brandy Wiki',
    },
    sectionsEn: {
        definition: 'Brandy is the collective term for a distilled spirit made from fermented fruit — most commonly grape. Producing regions maintain strict legal definitions and production methods, and each location\'s climate, soil, grape variety, and aging traditions create dramatically different characters. From the elegance of French Cognac to the rustic depth of Armagnac, the intensity of Italian Grappa, and the fresh fruitiness of South American Pisco — brandy represents one of the most regionally diverse spirits in the world.',
        history: 'The history of brandy production begins in the 14th century when French physicians distilled wine to create "Eau de Vie" (Water of Life) for medicinal purposes. In the 17th century, Dutch merchants began distilling vast quantities of wine for easier transport — "Brandewijn" (Burnt Wine) — which laid the foundation of the Cognac industry. After near-catastrophic destruction by phylloxera (grape vine louse) in the late 19th century, the industry recovered through innovation and today represents one of the most prestigious and collectible spirits categories in the world.',
        classifications: [
            {
                name: 'Cognac — Charente, France',
                criteria: 'Produced solely within the Charente and Charente-Maritime departments | Primary grape: Ugni Blanc | Double-distilled in Charentais copper pot stills | Aged in French oak (Limousin or Tronçais) minimum 2 years | Graded: VS / VSOP / XO / Hors d\'âge',
                description: 'The world\'s most strictly regulated and prestigious brandy. The chalky soils of the Grande Champagne and Petite Champagne crus are considered the finest terroir, producing the most complex and ageworthy base wines. Double distillation in the Charentais method creates a clean, elegant distillate that develops profound tertiary aromas — dried plum, pressed flowers, leather, and porcelain — through decades of patient aging.',
                flavorTags: [
                    { label: 'Dried Plum/Pressed Flowers', color: 'bg-rose-600/20 text-zinc-950 dark:text-rose-300' },
                    { label: 'Vanilla/Cedar', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
                    { label: 'Leather/Cigar Box', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: 'Orange Peel/Spice', color: 'bg-orange-500/20 text-zinc-950 dark:text-orange-300' },
                ]
            },
            {
                name: 'Armagnac — Gascony, France',
                criteria: 'Three departments of southwestern France (Gers, Lot-et-Garonne, Landes) | Multiple permitted grape varieties (Colombard, Folle Blanche, etc.) | Traditional continuous Armagnac still (Alambic Armagnacais) | Aged in local Gascon black oak | Vintage (single-year) bottling permitted',
                description: 'Where Cognac is polished perfection, Armagnac is France\'s most rustic and uncompromising brandy tradition. Single-pass continuous distillation in a unique Armagnac still retains more grape character — oilier, wilder, and more primal than Cognac. Vintage Armagnac (from a single harvest year) is a treasure of the rarities market, allowing collectors to taste single-year expressions stretching back decades.',
                flavorTags: [
                    { label: 'Prune/Dates', color: 'bg-rose-700/20 text-zinc-950 dark:text-rose-400' },
                    { label: 'Oily/Full-Bodied', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
                    { label: 'Earthy/Mushroom', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: 'Coriander/Herbs', color: 'bg-green-500/20 text-zinc-950 dark:text-green-300' },
                ]
            },
            {
                name: 'Brandy de Jerez — Andalusia, Spain',
                criteria: 'Three towns in Cádiz province, Spain | Airén and Palomino grapes | Solera aging system (fractional blending of multiple vintages) | Must be aged exclusively in ex-Sherry barrels',
                description: 'The sweetest and most intensely flavored of the major brandy styles. Aged in the same Sherry casks that define Jerez\'s wines (Fino, Amontillado, Oloroso, PX), the Solera system — continuously blending younger spirit into older — creates extraordinary complexity without a single vintage year. PX (Pedro Ximénez) cask-finished expressions deliver near-syrupy notes of raisins, molasses, dark chocolate, and toffee.',
                flavorTags: [
                    { label: 'Raisins/Molasses', color: 'bg-amber-800/20 text-zinc-950 dark:text-amber-400' },
                    { label: 'Dark Chocolate/Coffee', color: 'bg-stone-800/20 text-zinc-950 dark:text-stone-200' },
                    { label: 'Sweet Spice', color: 'bg-orange-600/20 text-zinc-950 dark:text-orange-300' },
                    { label: 'Wood/Tannin', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: 'Grappa — Italy',
                criteria: 'Produced throughout Italy | Made from pomace (skins, seeds, stems) — the by-product of winemaking | Grape variety and regional styles permitted',
                description: 'Grappa is made from what is left after winemaking: the pressed pomace of skins, seeds, and stems. This makes it inherently more intensely flavored and raw than wine-based brandies — rich in tannin, grape skin oils, and variety-specific aromatics. The finest Grappas (Monovitigno — single variety) are distilled and aged in stainless steel or glass demijohns to preserve the pure aromatic character of the grape. The Veneto, Piedmont, and Friuli-Venezia Giulia regions produce the most celebrated examples.',
                flavorTags: [
                    { label: 'Intense/Bold', color: 'bg-purple-600/20 text-zinc-950 dark:text-purple-300' },
                    { label: 'Floral/Fruity', color: 'bg-rose-400/20 text-zinc-950 dark:text-rose-300' },
                    { label: 'Herbs/Anise', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: 'Walnut/Tannin', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-200' },
                ]
            },
            {
                name: 'Pisco — Peru & Chile',
                criteria: 'Both Peru and Chile legally claim Pisco (an ongoing geopolitical dispute) | Only specific permitted grape varieties | Single-distillation; no water, additives, or coloring allowed | No oak aging (Peruvian style)',
                description: 'Peruvian Pisco regulations are among the strictest in the world: no water may be added to reduce proof, and no oak contact is permitted. This mandatory preservation of purity makes Pisco a uniquely transparent "terroir spirit" — the aromas are purely from specific Quebranta, Torontel, Italia, or Muscat grapes. The Pisco Sour cocktail catapulted Pisco to global fame, and a growing market for single-vineyard expressions is elevating it into the premium spirits tier.',
                flavorTags: [
                    { label: 'Floral/Peach', color: 'bg-pink-400/20 text-zinc-950 dark:text-pink-300' },
                    { label: 'Apple/Grape', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: 'Citrus/Clean', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
                    { label: 'Clear/Unaged', color: 'bg-slate-300/20 text-zinc-950 dark:text-slate-200' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: 'Cognac Aging Classification',
                label: 'Age Grade',
                value: 'VS (2y+) / VSOP (4y+) / XO (10y+)',
                description: 'VS is ideal as a cocktail base or introduction. VSOP suits both cocktails and neat sipping. XO and above are best appreciated neat, where the tertiary aromas of dried plum, leather, and rancio develop most fully.',
            },
            {
                metric: 'Number of Distillations',
                label: 'Distillation Count',
                value: 'Cognac (2x) vs. Armagnac (1x) vs. Grappa (1x)',
                description: 'More distillations produce a cleaner, more refined distillate. This is why Cognac achieves greater elegance and delicacy than Armagnac, which retains more raw grape character through its single-pass process.',
            },
            {
                metric: 'Oak Influence',
                label: 'Wood Contact',
                value: 'None (Pisco) → Intense (Jerez / Long-Aged Cognac)',
                description: 'Peruvian Pisco is legally forbidden from oak contact, ensuring pure grape expression. At the other extreme, Brandy de Jerez is deeply shaped by ex-Sherry casks, while Cognac XO receives 10+ years of progressive French oak influence that creates a rich, multilayered complexity.',
            }
        ],
        coreIngredients: [
            {
                type: 'Universal Base',
                name: 'Grape varieties (Vitis vinifera)',
                description: 'The grape variety is the primary aromatic blueprint of any brandy. Cognac\'s Ugni Blanc brings high acidity; Armagnac\'s Folle Blanche provides a floral character; Pisco\'s Quebranta delivers bold fruitiness; and Grappa\'s variety-specific Prosecco or Nebbiolo pomace shapes its unique identity.'
            },
            {
                type: 'Regional Variable',
                name: 'Terroir Soil',
                description: 'Cognac Grande Champagne\'s chalite (chalk) soil imparts a rare minerality to the base wine. Armagnac\'s sandy-clay mix, and Jerez\'s albariza (white clay-limestone) soil each fundamentally shape the grapes\' character at the source.'
            },
            {
                type: 'Maturation Vessel',
                name: 'Region-Specific Oak',
                description: 'Cognac uses Limousin or Tronçais French oak (fine-grained, high in tannin); Armagnac employs Gascon Black Oak (more porous, bolder influence); Jerez uses exclusively ex-Sherry casks. The wood choice and previous contents define the secondary aromatic layers of any aged brandy.'
            }
        ],
        manufacturingProcess: [
            {
                step: 'Fermentation',
                name: 'Grape/Pomace Fermentation',
                description: 'Cognac, Armagnac, and Pisco press fresh grapes for juice fermentation. Grappa uses the full pomace (skins+seeds+stems) which brings far more tannic, intensely colored compounds into the ferment.'
            },
            {
                step: 'Distillation',
                name: 'Regional Distillation Style',
                description: 'Cognac: double-distillation in copper Charentais pot stills for elegance. Armagnac: single-pass through a unique continuous Armagnac still for rustic richness. Grappa/Pisco: single-distillation in pot or column stills emphasizing raw variety character.'
            },
            {
                step: 'Maturation',
                name: 'Cask Aging (or Non-Aging for Pisco)',
                description: 'Cognac, Armagnac, and Brandy de Jerez require oak aging by law, with the style and duration dramatically shaping the final product. Peruvian Pisco is legally prohibited from any oak contact, preserving the purity of the grape\'s volatile aromatic compounds.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped Cognac glass or Snifter Glass',
            optimalTemperatures: [
                { temp: '18–22°C (Cognac / Armagnac)', description: 'Cup the glass in your hands to warm the brandy to approximately 24–26°C — this fully opens the tertiary aromatic bouquet of dried fruit, flowers, and spice.' },
                { temp: '4–8°C (Pisco / Young Grappa)', description: 'Served chilled, the vibrant, pure floral and fruit notes of these unaged spirits register most freshly and precisely.' }
            ],
            methods: [
                { name: 'Regional Comparison Tasting', description: 'Place a VS Cognac alongside an equivalent Armagnac — the contrast between Cognac\'s polished elegance and Armagnac\'s wild, oily rusticity is one of the most revealing educational experiences in the spirits world.' },
                { name: 'The Classic Pisco Sour', description: 'Pisco 45ml + fresh lemon juice 30ml + simple syrup 15ml + egg white (for foam) + 2 dashes Angostura bitters. The best introduction to Pisco\'s unique floral fruitiness.' }
            ]
        },
        flavorTags: [
            { label: 'Cognac: Elegant & Dried Plum', color: 'bg-rose-600/20 text-zinc-950 dark:text-rose-300' },
            { label: 'Armagnac: Wild & Oily', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
            { label: 'Jerez: Sweet & Sherry', color: 'bg-amber-800/20 text-zinc-950 dark:text-amber-400' },
            { label: 'Grappa: Bold & Floral', color: 'bg-purple-500/20 text-zinc-950 dark:text-purple-300' },
            { label: 'Pisco: Fruity & Clean', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
        ],
        foodPairing: [
            'Cognac — Foie Gras, Dark Chocolate, Blue Cheese',
            'Armagnac — Duck Confit, Cassoulet, Prune Tart',
            'Brandy de Jerez — Chorizo, Manchego, Chocolate Cake',
            'Grappa — Italian Espresso, Hard Cheese, Roasted Nuts',
            'Pisco — Ceviche, South American Grilled Meats',
        ],
        dbCategories: ['브랜디'],
        relatedPageSlug: 'brandy',
        relatedPageLabelKo: '← 브랜디 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Brandy Wiki',
    }
}
