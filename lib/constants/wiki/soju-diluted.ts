import { SpiritCategory } from './types'

export const sojuDiluted: SpiritCategory = {
    slug: 'soju-diluted',
    emoji: '🍶',
    nameKo: '희석식 소주',
    nameEn: 'Diluted Soju',
    taglineKo: '깨끗함과 부드러움으로 완성된 한국의 대중 증류주',
    taglineEn: 'Korea\'s most popular spirit — clean, smooth, and neutral',
    color: 'cyan',
    sections: {
        definition: "희석식 소주는 고도 정제된 주정(에탄올)을 정제수로 희석한 뒤, 감미료 등을 배합해 맛을 조정한 증류주다. 개별 원재료의 향보다는 알코올의 깨끗함과 목넘김의 부드러움, 은은한 단맛에 초점을 맞춘 한국의 대표 대중 주다.",
        history: "1960년대 식량 부족 문제로 곡물 증류가 금지되면서, 연속식 증류기로 생산한 고순도 주정을 희석해 마시는 방식이 주류가 되었다. 이후 기술의 발달로 도수가 점차 낮아지고(저도화), 최근에는 '제로슈거'와 다양한 '플레이버드' 제품군으로 진화하며 시대를 반영하고 있다.",
        classifications: [
            {
                name: "레귤러 소주 (Standard)",
                criteria: "고순도 주정 + 정제수 + 감미료 / 16~17% ABV",
                description: "가장 보편적인 소주다. 쓴맛을 줄이고 약간의 감칠맛과 단맛을 더해, 기름지거나 매운 한식 안주의 맛을 깔끔하게 씻어주는 역할을 한다."
            },
            {
                name: "제로 슈거 (Zero Sugar)",
                criteria: "과당이나 설탕 대신 효소처리 스테비아 등 대체 감미료 사용",
                description: "건강을 중시하는 트렌드에 맞춰 당류를 0g으로 설계했다. 기존 소주보다 피니시가 더 드라이하고 깔끔하며 입안에 남는 끈적임이 적은 점이 특징이다."
            },
            {
                name: "플레이버드 / 과일 소주",
                criteria: "희석식 소주 베이스에 과즙이나 향료 첨가 / 12~14% ABV",
                description: "자몽, 복숭아, 청포도 등 상큼한 향과 달콤함을 더해 접근성을 높였다. 알코올 특유의 향에 거부감이 있는 입문자나 가벼운 술자리에 적합하다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "청량감 (Crispness)",
                label: "Cleanliness",
                value: "Neutral and Refreshing",
                description: "잡미가 없는 주정을 사용하여 뒷맛이 매우 깨끗하다. 차갑게 마실수록 이 청량감이 극대화된다."
            },
            {
                metric: "감미 밸런스",
                label: "Sweetness",
                value: "Dry to Subtle Sweet",
                description: "알코올의 쓴맛을 보완하기 위해 첨가된 미세한 단맛이 목넘김을 한결 부드럽게 만든다."
            },
            {
                metric: "바디감/점도",
                label: "Mouthfeel",
                value: "Light and Smooth",
                description: "입안에서 가볍게 넘어가며, 제로슈거 제품으로 갈수록 질감이 더 가볍고 깔끔해지는 경향이 있다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "연속식 증류 주정 (Neutral Spirit)",
                description: "원료에 상관없이 95% 이상의 순도로 증류해 잡내를 제거한 소주의 근간이다."
            },
            {
                type: "물",
                name: "다각 여과 정제수",
                description: "소주 구성의 80% 이상을 차지하며, 부드러운 목넘김과 깨끗한 맛을 결정짓는 핵심 요소다."
            },
            {
                type: "조미",
                name: "감미료 (스테비아, 에리트리톨 등)",
                description: "알코올의 자극적인 맛을 다듬고 감칠맛을 부여하여 소주 특유의 대중적인 풍미를 완성한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "정제/희석",
                name: "주정 정제 및 가수",
                description: "생산된 주정을 활성탄 등으로 여과해 잡미를 없애고, 깨끗한 물을 섞어 목표 도수로 맞춘다."
            },
            {
                step: "배합/혼화",
                name: "미세 조미 및 숙성",
                description: "감미 성분을 정교하게 배합하고 일정한 시간 동안 순환시켜 물과 알코올이 완벽하게 섞이도록 한다."
            },
            {
                step: "완성",
                name: "최종 여과 및 병입",
                description: "미세한 입자까지 걸러낸 뒤 투명한 병에 담아 제품의 청정함을 유지하며 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "전용 소주잔 (샷 글라스)",
            optimalTemperatures: [
                {
                    temp: "4~8℃ (냉장 칠링)",
                    description: "알코올 자극이 억제되고 소주 특유의 시원함과 부드러운 목넘김이 극대화되는 황금 온도다."
                },
                {
                    temp: "-2~0℃ (슬러시)",
                    description: "액체 상태를 유지하면서도 살얼음 직전의 차가움을 주어 알코올 향을 최소화하고 짜릿함을 준다."
                }
            ],
            methods: [
                {
                    name: "칠드 샷 (Chilled Shot)",
                    description: "차갑게 보관한 소주를 잔에 담아 한 번에 마시거나 나누어 마시며 안주와의 조화를 즐긴다."
                },
                {
                    name: "소맥 (Soju + Beer)",
                    description: "소주와 맥주를 일정한 비율(주로 1:3)로 섞어 탄산의 청량감과 위스키 같은 풍미를 동시에 만드는 한국의 폭탄주 문화다."
                },
                {
                    name: "소주 토닉 (Soju & Tonic)",
                    description: "소주에 토닉워터와 얼음, 레몬 슬라이스를 더해 마치 진토닉처럼 깔끔하고 가벼운 롱드링크로 즐긴다."
                }
            ]
        },
        flavorTags: [
            { label: "클린/뉴트럴", color: "bg-sky-600/20 text-zinc-950 dark:text-sky-300" },
            { label: "은은한 단맛", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "부드러운 목넘김", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "드라이 피니시", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "깔끔한 뒷맛", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" }
        ],
        foodPairing: [
            "삼겹살 및 돼지 구이 요리",
            "김치찌개 및 매운 전골류",
            "제육볶음 및 닭발 등의 매운 요리",
            "생선회 및 해산물 안주",
            "각종 마른안주 및 과일"
        ],
        dbCategories: ['소주']
    }
}
