import { SpiritCategory } from './types'

export const wine: SpiritCategory = {
    slug: 'wine',
    emoji: '🍷',
    nameKo: '와인 (로제/스파클링)',
    nameEn: 'Wine (Rosé & Sparkling)',
    taglineKo: '포도의 섬세한 색채와 청량한 기포의 향연',
    taglineEn: 'A celebration of delicate colors and refreshing bubbles',
    color: 'rose',
    sections: {
        definition: "로제 와인과 스파클링 와인(샴페인 등)은 포도의 침용 시간(로제)이나 발효 중 생성된 탄산(스파클링)을 제어하여 만드는 와인군이다. 신선한 산미와 다채로운 색상, 정교한 기포가 주는 즐거움이 특징이다.",
        history: "로제는 고대 그리스 시대부터 이어져 온 가장 오래된 와인 스타일 중 하나이며, 스파클링 와인은 17세기 프랑스 상파뉴(Champagne) 지역에서 병 내 2차 발효 기술이 정립되면서 전 세계적인 축제의 술로 자리 잡았다.",
        classifications: [
            {
                name: "전통 방식 스파클링 (Champagne Style)",
                criteria: "병 내에서 2차 발효 및 효모와 함께 장기 숙성",
                description: "샴페인, 까바(Cava) 등이 대표적이다. 기포가 매우 정교하고 조밀하며, 오랜 숙성을 통해 구운 빵, 견과류, 비스킷 같은 고소한 풍미가 층층이 쌓인다."
            },
            {
                name: "샤르마 방식 (Charmat / Tank)",
                criteria: "대형 압력 탱크에서 2차 발효 진행",
                description: "프로세코(Prosecco) 등이 대표적이다. 효모 숙성 향보다는 포도 본연의 신선한 아로마와 과일 꽃 향을 빠르고 생동감 있게 살려내는 스타일이다."
            },
            {
                name: "로제 와인 (Rosé)",
                criteria: "적포도 껍질을 짧은 시간(수 분~수 시간)만 침용",
                description: "화이트 와인의 산뜻함과 레드 와인의 가벼운 구조감을 동시에 지닌다. 딸기, 라즈베리 등 붉은 과실의 싱그러움이 매력적인 전천후 스타일이다."
            },
            {
                name: "펫낫 (Pét-Nat / Ancestral)",
                criteria: "1차 발효가 끝나기 전 병입하여 자연적인 기포 생성",
                description: "가장 원초적인 스파클링 방식이다. 필터링을 최소화하여 야생 효모의 펑키함과 과일의 날것 그대로의 생동감이 살아있는 내추럴 와인 스타일이다."
            },
            {
                name: "당도 등급 (Brut Nature ~ Demi-Sec)",
                criteria: "최종 단계에서 첨가되는 당분(Dosage)의 양",
                description: "Brut Nature(무가당)는 극도로 드라이하며, Demi-Sec은 확연한 단맛이 있어 디저트나 매콤한 음식과 조화롭다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "기포의 지속성 (Perlage)",
                label: "Effervescence",
                value: "Aggressive to Persistent",
                description: "기포가 작고 끊임없이 수직으로 올라올수록 전통 방식의 정교함과 긴 숙성 시간을 대변한다."
            },
            {
                metric: "신선도/산도",
                label: "Crispness",
                value: "High (pH 2.9 ~ 3.4)",
                description: "스파클링 와인의 생명이다. 산도는 입안을 활기차게 하고 음식의 기름진 맛을 깨끗이 씻어내어 다음 잔을 부른다."
            },
            {
                metric: "자가분해 향 (Autolysis)",
                label: "Yeasty Notes",
                value: "Fresh Fruit to Brioche",
                description: "효모와 함께한 시간이 길수록 과일향은 배경으로 물러나고 버터, 구운 식빵, 헤이즐넛 같은 럭셔리한 향이 주도권을 잡는다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "샤르도네 / 피노 누아 / 피노 뮈니에",
                description: "샴페인의 3대 품종이다. 샤르도네는 우아함과 골격을, 피노 계열은 붉은 과실의 풍부함과 바디감을 제공한다."
            },
            {
                type: "발효제",
                name: "리스 (Lees, 죽은 효모)",
                description: "병 속에서 와인과 함께 잠자며 복합적인 향미 성분과 부드럽고 크리미한 질감을 선물하는 조용한 공헌자다."
            }
        ],
        manufacturingProcess: [
            {
                step: "추출/제조",
                name: "베이스 와인 및 블렌딩",
                description: "산도가 높은 베이스 와인을 만든다. 특히 샴페인은 수십 종의 빈티지 와인을 블렌딩하여 하우스 고유의 스타일을 창조한다."
            },
            {
                step: "탄산화",
                name: "2차 발효 및 Prise de Mousse",
                description: "설탕과 효모를 더해 밀폐된 병이나 탱크에서 다시 발효시켜 미세한 탄산가스가 와인 속에 녹아들게 한다."
            },
            {
                step: "분출/마감",
                name: "데고르주망 및 도사주",
                description: "숙성이 끝난 효모 찌꺼기를 제거하고, 부족한 양을 채우며 최종 당도를 맞추는 정교한 마감 공정이다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 스파클링 잔 또는 화이트 와인 잔",
            optimalTemperatures: [
                {
                    temp: "6~9℃ (칠드)",
                    description: "일반적인 스파클링과 로제 와인의 청량감과 산미가 가장 예리하게 살아나는 온도다."
                },
                {
                    temp: "10~13℃ (빈티지 샴페인)",
                    description: "고급 스파클링 와인의 복합적인 효모 숙성향과 질감을 충분히 느끼기 위해 살짝 높은 온도가 추천된다."
                }
            ],
            methods: [
                {
                    name: "완만한 칠링 (Gentle Chilling)",
                    description: "아이스 버킷에 물과 얼음을 채워 20분 정도 담가두면 와인의 온도를 가장 안정적이고 마시기 좋게 낮출 수 있다."
                },
                {
                    name: "안전한 오픈 (Silent Opening)",
                    description: "스파클링 와인을 열 때는 '펑' 소리보다는 조용한 '한숨' 소리가 나도록 코르크를 천천히 제어하며 여는 것이 매너이자 기술이다."
                },
                {
                    name: "로제 가니시 (Rosé Pairing)",
                    description: "로제 와인 잔에 산딸기나 체리를 한 알 띄우면 시각적인 즐거움과 함께 과실의 풍미가 시각적으로 강조된다."
                }
            ]
        },
        flavorTags: [
            { label: "딸기/라즈베리", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "청사과/레몬", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "브리오슈/비스킷", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "아몬드/헤이즐넛", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "미네랄리티", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "신선한 굴 및 각종 해산물",
            "후라이드 치킨 및 튀김 요리 (최고의 마리아주)",
            "연어 사시미 및 초밥",
            "브리 치즈와 견과류",
            "딸기 크림 디저트"
        ],
        dbCategories: ['과실주']
    }
}
