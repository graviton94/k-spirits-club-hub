import { SpiritCategory } from './types'

export const sake: SpiritCategory = {
    slug: 'sake',
    emoji: '🍶',
    nameKo: '사케 (니혼슈)',
    nameEn: 'Sake (Nihonshu)',
    taglineKo: '쌀과 물, 누룩이 빚어내는 정교한 발효 예술',
    taglineEn: 'The refined art of fermentation from rice, water, and koji',
    color: 'sky',
    sections: {
        definition: "사케(니혼슈)는 쌀, 누룩(코지), 물을 주원료로 발효시킨 일본의 전통 양조주다. 쌀의 외피를 깎아내는 '정미' 정도와 양조 알코올 첨가 여부에 따라 등급이 나뉘며, 섬세한 향미와 온도에 따른 극적인 맛의 변화가 특징이다.",
        history: "고대 일본의 구치카미자케에서 시작되어 나라 시대와 에도 시대를 거치며 현재의 정교한 양조 기술(병행복발효)로 완성되었다. 지역별 물과 쌀의 특성, '토지(Toji)'라 불리는 장인들의 기술력이 결합되어 일본 전역에서 각기 다른 테루아의 향미를 보여주고 있다.",
        classifications: [
            {
                name: "준마이 다이긴죠 (Junmai Daiginjo)",
                criteria: "정미율 50% 이하 + 쌀, 누룩, 물만 사용",
                description: "사케의 정점이다. 고속 정미를 통해 단백질과 지방을 걷어내어 잡미가 전혀 없고, 화사한 꽃향과 과일향(긴죠카)이 정교하게 폭발한다. 가장 투명하고 우아한 질감을 선사한다."
            },
            {
                name: "다이긴죠 (Daiginjo)",
                criteria: "정미율 50% 이하 + 향의 발산을 돕는 미량의 양조 알코올 첨가",
                description: "준마이 다이긴죠보다 향이 더 날카롭고 선명하게 개방되는 경향이 있다. 깔끔한 피니시와 화려한 첫 향의 임팩트를 강조하는 기술적인 프리미엄 사케다."
            },
            {
                name: "준마이 긴죠 (Junmai Ginjo)",
                criteria: "정미율 60% 이하 + 쌀, 누룩, 물만 사용",
                description: "화사한 긴죠향과 쌀 특유의 감칠맛(우마미)이 가장 이상적인 균형을 이루는 등급이다. 페어링 범주가 매우 넓어 전 세계적으로 가장 사랑받는 스타일이다."
            },
            {
                name: "긴죠 (Ginjo)",
                criteria: "정미율 60% 이하 + 쌀, 누룩, 물 + 양조 알코올",
                description: "저온 장기 발효를 통해 과일 같은 상쾌한 아로마를 살려내면서도, 양조 알코올을 통해 가볍고 경쾌한 목넘김을 완성한 스타일이다."
            },
            {
                name: "준마이 (Junmai)",
                criteria: "쌀, 누룩, 물만 사용 (정미율 규정 폐지, 주로 70% 전후)",
                description: "쌀 본연의 묵직한 풍미와 곡물의 단맛, 산미가 돋보인다. 화려한 향보다는 든든한 바디감과 따뜻하게 마셨을 때 피어오르는 온화한 풍미가 매력이다."
            },
            {
                name: "혼죠조 (Honjozo)",
                criteria: "정미율 70% 이하 + 미량의 양조 알코올 첨가",
                description: "부드럽고 깔끔하며 뒷맛이 개운한(기레가 좋은) 스타일이다. 데일리 사케로 적합하며 어느 음식에나 무난하게 어우러지는 높은 범용성을 지닌다."
            },
            {
                name: "토쿠베츠 (Tokubetsu / 특별)",
                criteria: "정미율 60% 이하 혹은 특별한 양조 방식을 채택한 준마이/혼죠조",
                description: "증류소만의 독자적인 기술이나 특수한 원료 쌀을 사용했을 때 부여하는 명칭으로, 해당 하우스의 개성이 가장 뚜렷하게 드러나는 '스페셜' 라인이다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "일본주도 (SMV)",
                label: "Sake Meter Value",
                value: "-15 (Sweet) ~ +10 (Dry)",
                description: "물의 비중을 기준으로 당분의 함량을 나타낸다. 마이너스 수치가 높을수록 달콤하고, 플러스 수치가 높을수록 드라이하게 느껴진다."
            },
            {
                metric: "산도 (Acidity)",
                label: "Acidity Level",
                value: "1.0 (Soft) ~ 2.0 (Rich)",
                description: "사케의 맛을 조여주고 맛의 골격을 형성한다. 산도가 높을수록 진하고 묵직한 인상을 주며, 낮을수록 부드럽고 가볍게 체감된다."
            },
            {
                metric: "아미노산도",
                label: "Umami Level",
                value: "0.8 ~ 1.8",
                description: "사케의 감칠맛과 바디감을 결정하는 지표다. 이 수치가 높을수록 '쌀의 맛'이 진하게 느껴지고 복합적인 풍미가 커진다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "주조호적세 (Saka Mai)",
                description: "일반 식용 쌀보다 심백(쌀 중심부)이 크고 단백질이 적은 야마다니시키, 오만고쿠 등 사케 전용 쌀을 사용해 깨끗한 맛을 낸다."
            },
            {
                type: "발효제",
                name: "황누룩 (Yellow Koji)",
                description: "쌀의 전분을 당으로 분해하는 효소를 제공하며, 사케 고유의 깊은 풍미와 향기 성분의 기틀을 마련한다."
            },
            {
                type: "수질",
                name: "와미즈 (양조용 물)",
                description: "경수(Nada 지역)는 힘차고 드라이한 남성적인 술을, 연수(Fushimi 지역)는 부드럽고 우아한 여성적인 술을 만든다."
            }
        ],
        manufacturingProcess: [
            {
                step: "정미",
                name: "세미 및 침지",
                description: "쌀을 깎아내고 정교하게 씻은 뒤 수분을 흡수시킨다. 등급이 높을수록 분 단위의 정밀한 수분 관리가 이루어진다."
            },
            {
                step: "발효",
                name: "병행복발효 (Shubun)",
                description: "전분의 당화와 알코올 발효가 한 통에서 동시에 일어나는 세계적으로 드문 고도화된 발효 기술로 깊은 복합미를 만든다."
            },
            {
                step: "숙성/완성",
                name: "카이이레 및 여과",
                description: "발효가 끝난 술을 짜내고 가열 처리(히이레)를 거쳐 맛을 안정시킨다. 무여과 생주(나마자케)는 신선한 생동감을 강조한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "와인 잔(향기 중심) 또는 오초코/사카즈키(전통 스타일)",
            optimalTemperatures: [
                {
                    temp: "5~10℃ (유키바네/하나비에)",
                    description: "다이긴죠나 긴죠급의 화사한 향과 깔끔한 질감을 즐기기에 가장 좋은 온도다."
                },
                {
                    temp: "15~20℃ (조온)",
                    description: "사케 본연의 감칠맛과 단맛이 부드럽게 살아나며 밸런스가 가장 안정적인 구간이다."
                },
                {
                    temp: "40~45℃ (누루칸/죠칸)",
                    description: "준마이나 혼죠조 계열에서 쌀의 풍미가 극대화되며 속을 따뜻하게 적셔주는 전통적인 서빙 온도다."
                }
            ],
            methods: [
                {
                    name: "히야 (Chilled)",
                    description: "차갑게 칠링하여 사케 특유의 산뜻함과 과일 향을 선명하게 느끼는 대중적인 방식이다."
                },
                {
                    name: "칸자케 (Warming)",
                    description: "중탕을 통해 온도를 높여 알코올의 기운을 부드럽게 하고 곡물의 단맛을 폭발시키는 전문적인 방식이다."
                },
                {
                    name: "와인 잔 서빙",
                    description: "튤립 형태의 와인 잔을 사용하면 다이긴죠급의 섬세하고 화려한 긴죠향을 훨씬 입체적으로 맡을 수 있다."
                }
            ]
        },
        flavorTags: [
            { label: "멜론/배/사과", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-300" },
            { label: "화이트 플라워", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "감칠맛/우마미", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "부드러운 단맛", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "깔끔한 산미", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "누룩/쌀향", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "사시미 및 초밥 (흰살생선 베스트)",
            "가라아게 및 각종 텐푸라",
            "구운 생선 및 해산물 요리",
            "야키토리 (소금구이/타레)",
            "샤브샤브 및 나베 요리"
        ],
        dbCategories: ['청주']
    }
}
