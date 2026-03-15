import { SpiritCategory } from './types'

export const whiteWineRegions: SpiritCategory = {
    slug: 'white-wine-regions',
    emoji: '🗺️',
    nameKo: '화이트 와인 세계 산지 가이드',
    nameEn: 'White Wine Regions of the World',
    taglineKo: '샤블리, 모젤, 알자스, 말버러까지 — 세계 화이트 와인 산지와 품종의 개성',
    taglineEn: 'From Chablis and Mosel to Alsace and Marlborough — the world\'s great white wine regions and their defining grape varieties',
    color: 'yellow',
    sections: {
        definition: '화이트 와인의 세계는 레드보다 훨씬 더 다양하다. 오크 숙성을 거친 묵직한 부르고뉴 샤르도네부터, 스틸 탱크에서만 만들어진 미네랄 넘치는 샤블리, 섬세한 단맛의 독일 리슬링, 열대과일의 뉴질랜드 소비뇽 블랑까지 — 화이트 와인은 서늘한 기후를 선호하는 섬세한 특성 때문에 산지의 영향을 레드보다도 더 직접적으로 받는다.',
        history: '화이트 와인의 역사는 고대 그리스·로마에서 시작된다. 중세 수도원들이 서유럽 각지에서 품종을 개발·보존했고, 르네상스 이후 귀족의 식탁에서 핵심 음료로 자리 잡았다. 독일 리슬링은 18세기부터 유럽 최고급 와인으로 대접받았으며, 20세기 초까지는 샤또 디켐(소테른)이 세계에서 가장 비싼 와인이었다. 1970~80년대 서늘한 신세계(뉴질랜드, 호주 남부)의 등장이 화이트 와인 지형을 크게 바꾸었다.',
        classifications: [
            {
                name: '샤블리 & 부르고뉴 (Chablis & Burgundy) — 프랑스',
                criteria: '품종: 샤르도네 | 샤블리(오크 미사용·極미네랄) vs 뫼르소·몽라쉐(오크 숙성·묵직) | 그랑 크뤼/프르미에 크뤼 포도밭 등급 | 서늘한 기후',
                description: '샤블리는 해양 화석이 포함된 석회암 토양(키메리지앙)에서 자란 샤르도네로 만들어지며, 굴 껍데기 같은 매우 순수한 미네랄리티와 레몬·청사과의 날카로운 산도가 특징이다. 강의 반대편 뫼르소와 퓔리니-몽라쉐는 오크 숙성을 통해 버터·구운 헤이즐넛·꿀·꽃의 복합미를 더한다. 르 몽라쉐 그랑 크뤼는 세계 최고의 드라이 화이트 와인으로 꼽힌다.',
                flavorTags: [
                    { label: '굴/미네랄(샤블리)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '레몬/청사과', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: '버터/헤이즐넛(뫼르소)', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '꿀/토스트', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                ]
            },
            {
                name: '루아르 밸리 (Loire Valley) — 프랑스',
                criteria: '대표 품종: 소비뇽 블랑, 슈냉 블랑, 뮈스카데 | 상세르, 푸이 퓌메(소비뇽 블랑) | 부브레(슈냉 블랑·드라이~스위트) | 서늘한 대서양성 기후',
                description: '소비뇽 블랑의 고향 루아르는 신선함과 허브 아로마의 왕국이다. 상세르와 푸이 퓌메의 소비뇽 블랑은 자몽·풀·각시완두콩(흑현미향)·분필·미네랄의 날카롭고 생동감 넘치는 프로파일로 세계 어디서도 복제 불가능한 스타일을 구현한다. 부브레의 슈냉 블랑은 드라이에서 달콤한 귀부와인(Vouvray Moelleux)까지 폭넓은 스타일을 아우른다.',
                flavorTags: [
                    { label: '자몽/시트러스', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '풀/허브/완두콩', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: '분필/미네랄', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '산도/청량감', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                ]
            },
            {
                name: '알자스 (Alsace) — 프랑스',
                criteria: '주요 품종: 리슬링, 게뷔르츠트라미너, 피노 그리, 뮈스카 | 독일 접경 지역(보주 산맥 동쪽) | 매우 건조한 기후 | 드라이 스타일 및 방당쥐 타르디브(늦수확) 스위트 스타일',
                description: '알자스는 독일과 지리적으로 인접해 독일 품종을 재배하지만 스타일은 전혀 다르다. 보주 산맥이 만드는 "비 그늘"로 프랑스에서 가장 건조한 기후가 형성되어, 게뷔르츠트라미너의 리치·장미향과 리슬링의 섬세한 미네랄이 매우 응축된 형태로 잘 익는다. 그랑 크뤼 알자스(리슬링)는 세계 최고 수준의 드라이 화이트 와인으로 평가받는다.',
                flavorTags: [
                    { label: '리치/장미(게뷔르츠)', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
                    { label: '백도/아카시아(리슬링)', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '응축 미네랄', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '풀바디/드라이', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: '모젤 (Mosel) — 독일',
                criteria: '품종: 리슬링 (압도적 비중) | 슬레이트(점판암) 토양 | 매우 서늘한 기후 | 카비넷·슈패트레제·아우스레제·트로켄베렌아우스레제 등 당도 등급 체계 | Prädikat 등급 시스템',
                description: '세계에서 가장 섬세하고 미묘한 화이트 와인을 만드는 산지. 모젤의 그레이 슬레이트 토양은 포도에 독특한 연기·미네랄 풍미를 부여한다. 산도가 매우 높고 알코올이 낮으며(7~11%), 약간의 잔당이 완벽한 단맛-산도 불균형을 만들어내는 독특한 균형감이 특징이다. 에곤 뮐러, 요하네스 호프 등의 그랑 크뤼 리슬링은 세계에서 가장 비싼 화이트 와인 중 하나다.',
                flavorTags: [
                    { label: '백도/살구', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '슬레이트/연기 미네랄', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '꿀/아카시아', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '낮은 알코올·높은 산도', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                ]
            },
            {
                name: '말버러 (Marlborough) — 뉴질랜드',
                criteria: '품종: 소비뇽 블랑(말버러의 상징) | 서늘하고 일조량 풍부한 기후 | 뉴질랜드 화이트 와인 생산의 70%+ | 클라우디 베이(Cloudy Bay)로 세계적으로 알려짐',
                description: '1980년대 말버러의 소비뇽 블랑은 전 세계 소비뇽 블랑의 스타일을 재정의했다. 루아르 밸리의 허브 미네랄 스타일과 달리, 말버러는 강렬하고 폭발적인 열대과일(페션프루트·구아바·망고) + 자몽 + 신선한 허브의 조합으로 미각에 강렬한 인상을 남긴다. 스테인리스 발효, 오크 무사용이 이 선명한 과실 아로마를 보존한다.',
                flavorTags: [
                    { label: '페션프루트/구아바', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: '자몽/시트러스', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: '허브(흑현미/아스파라거스)', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: '선명/폭발적', color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: '오크 영향도',
                label: 'Oak Influence',
                value: '없음(샤블리·말버러) → 강함(뫼르소·그랑 크뤼 부르고뉴)',
                description: '오크 미사용 화이트는 과실·미네랄·산도가 선명하고 신선하다. 오크 숙성 화이트(뫼르소, 일부 알자스)는 버터·헤이즐넛·크리미함이 더해지며 더 복잡하고 풀바디해진다.',
            },
            {
                metric: '당도 레벨',
                label: 'Sweetness Level',
                value: '드라이(상세르·샤블리) ~ 스위트(TBA·소테른)',
                description: '독일 Prädikat 시스템은 카비넷(가장 드라이)에서 트로켄베렌아우스레제(TBA, 극단적 스위트)까지 6단계의 수확 숙성도에 따른 당도 등급을 명시한다.',
            },
            {
                metric: '기후 유형',
                label: 'Climate Effect',
                value: '서늘한 기후 → 미네랄·산도 / 따뜻한 기후 → 알코올·열대과일',
                description: '모젤, 알자스, 루아르의 서늘한 기후는 포도의 산도를 높게 유지하고 알코올을 낮춰 섬세한 미네랄 와인을 만든다. 반면 따뜻한 기후의 화이트 와인은 알코올이 높고 열대과일이 풍부하다.',
            }
        ],
        coreIngredients: [
            {
                type: '지역 시그니처 품종',
                name: '품종 × 산지 매칭',
                description: '샤르도네 × 부르고뉴/샤블리, 소비뇽 블랑 × 루아르/말버러, 리슬링 × 모젤/알자스, 게뷔르츠트라미너 × 알자스. 각 조합이 세계 화이트 와인 문화의 정수를 표현한다.'
            },
            {
                type: '기술적 선택',
                name: '오크 vs 스테인리스 발효',
                description: '오크 발효/숙성은 와인에 구조와 복잡성을 더하고, 스테인리스 탱크 발효는 과실·미네랄의 순수함을 보존한다. 이 선택이 같은 품종·산지에서도 완전히 다른 스타일을 만드는 가장 중요한 기술적 변수다.'
            }
        ],
        manufacturingProcess: [
            {
                step: '압착',
                name: '수확 직후 신속 압착',
                description: '화이트 와인은 껍질과의 접촉을 최소화(또는 완전 배제)하여 섬세한 아로마를 보존한다. 수확 직후 신속하게 압착하여 탄닌 과추출을 방지한다.'
            },
            {
                step: '발효/숙성',
                name: '온도 제어 발효 + 쉬르 리 숙성',
                description: '저온(12~15℃) 발효로 섬세한 과실·꽃 아로마를 보존한다. 효모 찌꺼기(Lees) 위에서 병마개 없이 숙성(쉬르 리, Sur Lie)하면 빵·크리미한 질감이 추가된다.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: '화이트 와인 전용 튤립형 잔 (부르고뉴형 or 소비뇽형)',
            optimalTemperatures: [
                { temp: '8~10℃ (소비뇽 블랑·드라이 리슬링·샤블리)', description: '미네랄과 과실의 선명함이 가장 신선하게 느껴지는 온도.' },
                { temp: '10~12℃ (부르고뉴 샤르도네·알자스)', description: '오크의 복합미와 과실향이 균형 있게 열리는 온도.' },
                { temp: '6~8℃ (달콤한 리슬링·소테른)', description: '잔당의 풍부함이 높은 산도와 조화를 이루며 가장 생동감 있게 느껴진다.' }
            ],
            methods: [
                { name: '스타일 비교 시음', description: '샤블리 프르미에 크뤼와 뫼르소 비야쥬를 나란히 시음하면, 오크 사용 유무가 같은 품종(샤르도네)에 얼마나 다른 결과를 만드는지 극적으로 체험할 수 있다.' },
                { name: '음식 궁합 탐험', description: '말버러 소비뇽 블랑은 신선한 굴, 생선초밥과 천상의 궁합을 보인다. 독일 리슬링 슈패트레제는 매운 아시아 요리(태국 그린커리, 한국 양념치킨)의 열기를 중화하며 최고의 페어링을 만든다.' }
            ]
        },
        flavorTags: [
            { label: '부르고뉴: 버터·미네랄', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: '루아르: 허브·시트러스', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
            { label: '알자스: 아로마틱·리치', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
            { label: '모젤: 슬레이트·꿀', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: '말버러: 열대과일·폭발적', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
        ],
        foodPairing: [
            '샤블리 — 신선한 굴, 해산물, 스시',
            '부르고뉴 샤르도네 — 구운 닭, 관자 요리, 크림 파스타',
            '루아르 소비뇽 블랑 — 생선, 염소 치즈, 허브 샐러드',
            '알자스 게뷔르츠 — 알자시엔 타르트 플람베, 포아그라, 매운 태국 요리',
            '독일 리슬링 — 한국 양념치킨, 매운 아시안 요리, 독일 소시지',
            '말버러 소비뇽 블랑 — 참치회, 녹색 샐러드, 헤르브 치즈',
        ],
        dbCategories: ['과실주'],
        relatedPageSlug: 'white-wine',
        relatedPageLabelKo: '← 화이트 와인 백과로 돌아가기',
        relatedPageLabelEn: '← Back to White Wine Wiki',
    },
    sectionsEn: {
        definition: 'The world of white wine is even more diverse than red. From the rich, oak-aged grandeur of White Burgundy to the mineral-sharp purity of Chablis, the delicate sweetness of German Riesling, and the explosive tropical fruit of New Zealand Sauvignon Blanc — white wine is more directly shaped by regional terroir than red wine, as the delicate nature of white varieties amplifies even subtle environmental nuances.',
        history: 'White wine history stretches back to ancient Greece and Rome. Medieval monasteries developed and preserved grape varieties across Western Europe, and white wines became central to noble dining tables by the Renaissance. German Riesling was considered Europe\'s finest wine from the 18th century, and until the early 20th century, Château d\'Yquem (Sauternes) held the distinction of being the world\'s most expensive wine. The emergence of cool-climate New World regions (New Zealand, Southern Australia) in the 1970s–80s dramatically reshaped the white wine landscape.',
        classifications: [
            {
                name: 'Chablis & White Burgundy — France',
                criteria: 'Variety: Chardonnay | Chablis (no oak, extreme minerality) vs. Meursault/Montrachet (oak-aged, rich) | Grand Cru and Premier Cru vineyard hierarchy | Cool continental climate',
                description: 'Chablis is crafted from Chardonnay grown in Kimmeridgian limestone soils rich in ancient oyster fossils, producing an intensely mineral, oyster shell-tinged style with razor-sharp lemon and green apple acidity — completely unlike oak-aged Burgundy. Meursault and Puligny-Montrachet on the Côte de Beaune bring opulent, complex expressions of butter, toasted hazelnut, honey, and citrus blossom through careful oak aging. Le Montrachet Grand Cru is widely considered the greatest dry white wine on earth.',
                flavorTags: [
                    { label: 'Oyster Shell/Mineral (Chablis)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Lemon/Green Apple', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: 'Butter/Hazelnut (Meursault)', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Honey/Toast', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                ]
            },
            {
                name: 'Loire Valley — France',
                criteria: 'Key varieties: Sauvignon Blanc, Chenin Blanc, Muscadet | Sancerre, Pouilly-Fumé (Sauvignon Blanc) | Vouvray (Chenin Blanc, dry to sweet) | Cool Atlantic climate',
                description: 'The original home of Sauvignon Blanc, the Loire Valley is a kingdom of freshness and herbal aromatics. Sancerre and Pouilly-Fumé are the benchmark for the grape — an inimitable combination of grapefruit, freshly cut grass, black currant leaves (cassis bud), chalk, and limestone minerality that cannot be replicated elsewhere. Vouvray\'s Chenin Blanc spans a remarkable range from bone-dry to lusciously sweet botrytized Moelleux, making the Loire the most stylistically diverse white wine valley in France.',
                flavorTags: [
                    { label: 'Grapefruit/Citrus', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Grass/Herb/Pea', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: 'Chalk/Mineral', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'High Acidity/Freshness', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                ]
            },
            {
                name: 'Alsace — France',
                criteria: 'Key varieties: Riesling, Gewürztraminer, Pinot Gris, Muscat | Bordering Germany (east of Vosges Mountains) | France\'s driest wine region | Both dry and Vendange Tardive (late-harvest) sweet styles',
                description: 'Alsace is geographically adjacent to Germany but stylistically entirely distinct. The natural "rain shadow" of the Vosges Mountains creates France\'s driest wine climate, concentrating and fully ripening the aromatic Germanic varieties into something uniquely Alsatian: Gewürztraminer\'s intoxicating lychee-and-rose perfume and Riesling\'s intense, layered mineral complexity both achieve extraordinary concentration here. Grand Cru Alsace Riesling is consistently ranked among the world\'s finest dry white wines.',
                flavorTags: [
                    { label: 'Lychee/Rose (Gewürztraminer)', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
                    { label: 'White Peach/Acacia (Riesling)', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Concentrated Minerality', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Full-Bodied/Dry', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                ]
            },
            {
                name: 'Mosel — Germany',
                criteria: 'Variety: Riesling (dominant) | Slate (Schiefer) soil | Extremely cool climate | Prädikat sweetness classification: Kabinett > Spätlese > Auslese > Beerenauslese > Trockenbeerenauslese (TBA) | Steep terraced vineyards on the river',
                description: 'Germany\'s Mosel produces some of the world\'s most delicate and intellectually thrilling white wines. The iconic grey slate (Schiefer) soil imparts a unique smoky, stony minerality to the wines. With naturally high acidity and low alcohol (often just 7–9%), Mosel Rieslings achieve a hauntingly precise balance between residual sweetness and vibrant acidity. Egon Müller\'s Scharzhofberger Trockenbeerenauslese regularly fetches prices rivaling Romanée-Conti.',
                flavorTags: [
                    { label: 'White Peach/Apricot', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Slate/Smoky Mineral', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Honey/Acacia', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Low Alcohol/High Acidity', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                ]
            },
            {
                name: 'Marlborough — New Zealand',
                criteria: 'Primary variety: Sauvignon Blanc (Marlborough\'s defining grape) | Cool, sun-rich climate with large diurnal temperature variation | Produces 70%+ of all New Zealand white wine | Globally introduced by Cloudy Bay (1985 vintage)',
                description: 'Marlborough\'s Sauvignon Blanc redefined what the world expected from the grape when it burst onto the global stage in the 1980s. Far more exuberant and fruit-forward than Loire Valley\'s mineral herb style, Marlborough delivers an explosion of tropical passion fruit, guava, mango, and grapefruit alongside fresh-cut grass and bell pepper (in cool vintages). Stainless steel fermentation with no oak preserves the vivid aromatics in their fullest intensity.',
                flavorTags: [
                    { label: 'Passion Fruit/Guava', color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
                    { label: 'Grapefruit/Citrus', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
                    { label: 'Fresh Herb/Asparagus', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: 'Vivid/Explosive', color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: 'Oak Influence',
                label: 'Wood Contact',
                value: 'None (Chablis / Marlborough) → Heavy (White Burgundy Grand Cru)',
                description: 'Unoaked white wines preserve the vibrancy of fruit, minerality, and acidity. Oak-aged whites (Meursault, some Alsace) gain layers of butter, hazelnut, and cream, becoming fuller-bodied and structurally complex. The winemaker\'s choice of vessel is the single most consequential stylistic decision in white winemaking.',
            },
            {
                metric: 'Sweetness Level',
                label: 'Residual Sugar',
                value: 'Bone Dry (Chablis / Sancerre) to Very Sweet (German TBA / Sauternes)',
                description: 'Germany\'s Prädikat system formally classifies white wines by must weight (sugar at harvest) — from Kabinett (lightest, driest) to Trockenbeerenauslese (TBA) — one of the rarest, most concentrated, and expensive sweet wines on earth.',
            },
            {
                metric: 'Climate Type',
                label: 'Regional Climate',
                value: 'Cool Climate → Minerality/Acidity / Warm Climate → Alcohol/Tropical Fruit',
                description: 'Mosel, Alsace, and Loire\'s cool climates retain high acidity and low alcohol — producing precision, delicacy, and mineral definition. Warmer-climate whites (Napa Chardonnay, Barossa Viognier) are richer, more full-bodied, and tropical fruit-driven.',
            }
        ],
        coreIngredients: [
            {
                type: 'Regional Signature Varieties',
                name: 'Variety × Terroir Matchmaking',
                description: 'Chardonnay × Burgundy/Chablis, Sauvignon Blanc × Loire/Marlborough, Riesling × Mosel/Alsace, Gewürztraminer × Alsace. These pairings represent the pinnacles of white wine expression refined over centuries.'
            },
            {
                type: 'Technical Choice',
                name: 'Oak vs. Stainless Steel Fermentation',
                description: 'Oak fermentation/aging adds structure, texture, and complexity. Stainless steel preserves the pure, direct expression of fruit and terroir. This single decision creates radically different wines from the same region and variety.'
            }
        ],
        manufacturingProcess: [
            {
                step: 'Pressing',
                name: 'Rapid Post-Harvest Pressing',
                description: 'White wine minimizes (or eliminates) skin contact to preserve delicate aromatics. Grapes are pressed immediately after harvest, separating the juice from grape solids before fermentation begins.'
            },
            {
                step: 'Fermentation/Aging',
                name: 'Temperature-Controlled Fermentation + Sur Lie Aging',
                description: 'Low-temperature fermentation (12–15°C) preserves delicate floral and fruit aromas. "Sur Lie" aging (resting on fermentation lees without racking) adds creamy texture, bread dough complexity, and a silky mouthfeel to white wines like Muscadet and White Burgundy.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped White Wine Glass (Burgundy or Chardonnay type)',
            optimalTemperatures: [
                { temp: '8–10°C (Sauvignon Blanc / Dry Riesling / Chablis)', description: 'The ideal temperature to achieve maximum freshness and clarity of mineral and fruit character.' },
                { temp: '10–12°C (White Burgundy / Alsace)', description: 'Allows the oak complexity and fuller fruit of these richer whites to unfold in balance.' },
                { temp: '6–8°C (Sweet Riesling / Sauternes)', description: 'The sweet richness is perfectly balanced by the vibrant acidity at this refreshing temperature.' }
            ],
            methods: [
                { name: 'Style Comparison', description: 'Taste a Chablis Premier Cru alongside a Meursault Village side by side — the dramatic contrast reveals how the presence or absence of oak transforms the same grape variety (Chardonnay) into completely different wines.' },
                { name: 'Food Pairing Discovery', description: 'Marlborough Sauvignon Blanc\'s explosive tropical fruit is a revelation with fresh oysters or sashimi. German Riesling Spätlese is one of the world\'s perfect matches for spicy Asian cuisine — Korean fried chicken, Thai green curry, or Indian tandoori — as its lively acidity and gentle sweetness tame the heat and amplify the spice complexity.' }
            ]
        },
        flavorTags: [
            { label: 'Burgundy: Butter & Mineral', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: 'Loire: Herb & Citrus', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
            { label: 'Alsace: Aromatic & Lychee', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
            { label: 'Mosel: Slate & Honey', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: 'Marlborough: Tropical & Vivid', color: 'bg-lime-100 text-lime-950 dark:bg-lime-900/40 dark:text-lime-100' },
        ],
        foodPairing: [
            'Chablis — Fresh Oysters, Shellfish, Sashimi',
            'White Burgundy — Roasted Chicken, Scallops, Cream Pasta',
            'Loire Sauvignon Blanc — Fish, Goat Cheese, Herb Salads',
            'Alsace Gewürztraminer — Foie Gras, Spicy Thai Cuisine, Muenster Cheese',
            'German Riesling — Korean Fried Chicken, Spicy Asian Cuisine, Pork',
            'Marlborough Sauvignon Blanc — Tuna Sashimi, Green Salads, Herbed Cheese',
        ],
        dbCategories: ['과실주'],
        relatedPageSlug: 'white-wine',
        relatedPageLabelKo: '← 화이트 와인 백과로 돌아가기',
        relatedPageLabelEn: '← Back to White Wine Wiki',
    }
}
