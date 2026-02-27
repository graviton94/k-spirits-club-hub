import { SpiritCategory } from './types'

export const makgeolli: SpiritCategory = {
    slug: 'makgeolli',
    emoji: '🍶',
    nameKo: '막걸리',
    nameEn: 'Makgeolli',
    taglineKo: '쌀과 누룩으로 빚은 한국의 대표 탁주',
    taglineEn: 'Korea\'s iconic cloudy rice wine, rich in probiotics and heritage',
    color: 'emerald',
    sections: {
        definition: "막걸리는 쌀(또는 곡물)을 누룩(또는 입국)으로 당화한 뒤 효모·유산균 발효를 거쳐 만든 한국의 대표적인 탁주(濁酒)로, 미세한 고형분이 남아 뿌연 외관과 크리미한 질감을 갖는다.",
        history: "막걸리는 삼국~고려·조선 시기까지 농경사회에서 널리 빚어 마시던 곡물 발효주의 흐름 속에서 발전했으며, 지역마다 누룩·물·쌀 품종과 담금 방식이 달라 다양한 향미 스펙트럼이 형성되었다. 20세기에는 대량생산과 유통 안정성을 위한 살균·가수(물 첨가)·감미 조정 등 ‘개량형’이 확산되었고, 최근에는 전통누룩·원주·저감미(무가당)·프리미엄 소규모 양조가 성장하며 스타일이 다시 다층화되고 있다.",
        classifications: [
            {
                name: "전통누룩 막걸리 (Traditional)",
                criteria: "밀/보리 등 곡물 기반의 복합 미생물 누룩 사용",
                description: "유산미(요거트), 곡물 고소함, 허브 뉘앙스 등 복합 향이 나타난다. 향미의 층위와 여운이 깊고 지역적 ‘손맛’이 두드러지는 프리미엄 스타일이 많다."
            },
            {
                name: "입국(코지) 및 개량 누룩 막걸리 (Modern)",
                criteria: "입국(쌀누룩) 또는 정제 효소를 활용해 발효 제어",
                description: "품질 재현성이 높고, 바나나·배 같은 산뜻한 과일 에스터가 선명하다. 잡미가 적고 경쾌한 인상으로 대중적인 접근성이 높다."
            },
            {
                name: "생막걸리 (Fresh / Unpasteurized)",
                criteria: "열살균 없이 병입하여 살아있는 효모와 유산균 보존",
                description: "병 내에서 미세한 후발효가 진행되어 선명한 탄산감과 생동감 있는 발효 풍미를 즐길 수 있다. 시간이 지날수록 드라이해지는 것이 특징이다."
            },
            {
                name: "살균막걸리 (Pasteurized)",
                criteria: "열처리로 미생물 활성을 억제하여 상온 유통 안정성 강화",
                description: "유통 기한이 길고 맛의 변화가 적어 안정적이다. 생막걸리에 비해 질감이 단정하고 부드럽게 정돈되어 있어 수출용이나 식당용으로 널리 쓰인다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "6% ~ 16% (스펙트럼)",
                description: "대중형은 6~8%로 가볍고 청량하며, 프리미엄 원주는 12~16%로 묵직한 바디감과 응축된 풍미를 보여준다."
            },
            {
                metric: "당도/드라이함",
                label: "Residual Sugar",
                value: "Dry to Sweet",
                description: "무가당 드라이 스타일은 곡물의 풍미가 강조되며, 감미료나 잔당이 있는 스타일은 부드럽고 친근한 인상을 준다."
            },
            {
                metric: "산도 (Acidity)",
                label: "pH 3.4 ~ 4.2",
                value: "Vibrant Lactic Acid",
                description: "요거트 같은 상큼한 산미가 구조감을 형성하며, 기름진 음식과의 밸런스를 잡아주는 핵심적인 요소다."
            },
            {
                metric: "탄산감 (Fizz)",
                label: "Natural CO2",
                value: "None to High",
                description: "생막걸리 특유의 자연 탄산이 강할수록 청량감이 극대화되며, 탄산이 적을수록 크리미한 질감이 돋보인다."
            },
            {
                metric: "바디/점도",
                label: "Body Thickness",
                value: "Light to Creamy",
                description: "쌀 고형분의 함량에 따라 맑은 주스 느낌부터 걸쭉하고 농밀한 크림 느낌까지 다양한 텍스처를 형성한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "국산 쌀 (멥쌀/찹쌀) 및 혼합 곡물",
                description: "단맛과 점도의 근원이다. 찹쌀 비중이 높을수록 목넘김이 더 부드럽고 당미의 깊이가 깊어진다."
            },
            {
                type: "발효제",
                name: "전통 누룩 또는 입국 (Koji)",
                description: "당화와 발효를 주도하며 바나나, 요구르트, 견과, 흙내 등 막걸리 특유의 복합 아로마를 형성하는 핵심이다."
            },
            {
                type: "물",
                name: "양조용수 (연수 중심)",
                description: "막걸리의 부드러운 질감을 결정하는 요소로, 깨끗한 수질은 발효의 안정성과 깔끔한 뒷맛을 보장한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "준비",
                name: "고두밥 찌기 (Steaming)",
                description: "쌀을 씻고 불려 증기로 찌는 과정이다. 쌀의 호화 정도가 효소 당화 효율을 결정한다."
            },
            {
                step: "발효",
                name: "다단 담금 (Multi-stage)",
                description: "밑술에 쌀과 누룩을 여러 차례 나누어 투입한다. 이 과정을 통해 향을 입체적으로 쌓고 도수를 안정적으로 높인다."
            },
            {
                step: "여과",
                name: "채주 및 조여과",
                description: "다 익은 술을 거친 망에 걸러 고형분을 적절히 남긴다. 여과 강도에 따라 바디의 밀도가 달라진다."
            },
            {
                step: "완성",
                name: "가수 및 안정화",
                description: "목표 도수에 맞춰 물을 섞고, 냉장 온도에서 일정 기간 안정화하여 물과 술이 잘 어우러지게 한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "넓은 사발 또는 튤립형 화이트 와인 잔",
            optimalTemperatures: [
                {
                    temp: "4~6℃",
                    description: "탄산과 산미가 가장 예리하게 살아나며, 대중적인 생막걸리를 가장 청량하게 즐길 수 있는 온도다."
                },
                {
                    temp: "7~10℃",
                    description: "쌀의 은은한 단맛과 산미의 밸런스가 가장 안정적으로 느껴지는 표준 온도다."
                },
                {
                    temp: "12~15℃",
                    description: "고숙성 프리미엄 원주나 전통 누룩 막걸리의 복합적인 향과 크리미한 질감이 확장되는 온도다."
                }
            ],
            methods: [
                {
                    name: "재현탁 (Gently Shake)",
                    description: "바닥에 가라앉은 고형분을 가볍게 흔들어 섞어 막걸리 특유의 풍부한 바디감을 즐기는 방식이다."
                },
                {
                    name: "상등액 시음 (Clear Pour)",
                    description: "흔들지 않고 위의 맑은 부분만 따르면 약주와 같은 깔끔하고 예리한 곡물 향을 색다르게 느낄 수 있다."
                },
                {
                    name: "막걸리 하이볼 (Mak-Soda)",
                    description: "걸쭉한 프리미엄 막걸리에 탄산수와 얼음을 더해 농도를 조절하며 시원하게 즐기는 방식이다."
                }
            ]
        },
        flavorTags: [
            { label: "쌀밥/곡물 고소함", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "요거트/락틱 산미", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "바나나/배", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "우유빛/크리미", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "청량한 탄산", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "누룩/견과/흙내", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" },
            { label: "허브/풀내", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" }
        ],
        foodPairing: [
            "각종 전 요리 (파전, 김치전, 육전)",
            "두부김치 및 수육/보쌈",
            "매콤한 떡볶이 및 제육볶음",
            "삼겹살 구이",
            "브리/고다 치즈와 견과류",
            "바삭한 후라이드 치킨"
        ],
        dbCategories: ['makgeolli', 'takju']
    }
}
