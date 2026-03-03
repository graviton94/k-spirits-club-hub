import { SpiritCategory } from './types'

export const koreanWhiskyDistilleries: SpiritCategory = {
    slug: '한국-위스키-증류소',
    emoji: '🥃',
    nameKo: '한국 위스키 증류소 정리',
    nameEn: 'Korean Whisky Distilleries',
    taglineKo: '극한의 환경이 빚어낸 코리안 크래프트 싱글몰트의 위대한 도전',
    taglineEn: 'The pioneers of Korean craft single malt',
    color: 'amber',
    sections: {
        definition: "한국 위스키는 대한민국의 기후와 물, 그리고 증류소별 철학을 담아 만들어지는 크래프트 싱글몰트 위스키를 중심으로 새롭게 쓰여지고 있는 장르입니다.",
        history: "과거엔 주정과 스코틀랜드 원액을 혼합한 패스포트나 썸씽스페셜 류의 블렌디드가 주류였으나, 세 건의 계절 변화가 뚜렷한 한국에서 숙성부터 증류까지 모든 과정을 해내는 쓰리소사이어티스와 김창수위스키 등의 탄생으로 본격적인 크래프트 씬이 열렸습니다.",
        classifications: [
            {
                name: "기원 (쓰리소사이어티스)",
                criteria: "남양주의 풍부한 수자원과 급격한 연교차 활용.",
                description: "가장 먼저 코리안 싱글몰트 시대를 열었으며, 버진 오크, 버번 캐스크 등 실험적인 숙성으로 스파이시하고 강렬한 나무 향을 단기간에 끌어올립니다."
            },
            {
                name: "김창수 위스키 (김포 파주)",
                criteria: "열정적인 마스터 디스틸러의 1인 기획/제조.",
                description: "한국산 국산 맥아나 벚나무 캐스크(사쿠라 우드), 와인 캐스크 피니시 등 전례 없는 시도를 통해 매 배치마다 오픈런을 기록하는 독보적인 캐릭터."
            }
        ],
        sensoryMetrics: [
            {
                metric: "숙성 속도",
                label: "Maturation Rate",
                value: "Very Fast (천사의 몫 10% 이상)",
                description: "스코틀랜드의 연평균 2% 증발량과 달리, 한국의 덥고 습한 여름과 영하의 겨울은 오크통을 격렬하게 수축·팽창시켜 1~2년 만에 10년 숙성에 달하는 색상과 오크 풍미를 뿜어냅니다."
            }
        ],
        coreIngredients: [
            {
                type: "로컬 재료의 재발견",
                name: "국산 맥아와 이탄",
                description: "아직은 수입 몰트 비중이 높으나, 점진적으로 한국산 보리와 로컬 피트(이탄)를 사용해 진정한 '코리안 테루아'를 구현하려는 시도가 이어지고 있습니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "기후 적응",
                name: "고도 온도차 숙성",
                description: "한국 고유의 사계절이 만들어내는 가혹한 숙성 환경은 위스키 원액에 짙은 바닐라와 강렬한 스파이스 노트를 단숨에 새겨버립니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "캐스크 스트랭스의 향을 모아주는 글렌캐런(Glencairn) 잔.",
            optimalTemperatures: [
                {
                    temp: "상온 (20°C)",
                    description: "니트로 마실 때, 빠른 숙성으로 폭발하는 강한 타닌과 오크 노트를 생생하게 느낄 수 있습니다."
                }
            ],
            methods: [
                {
                    name: "물 몇 방울 (Water Drop)",
                    description: "고도수의 코리안 싱글몰트의 알코올 향을 진정시키고 숨겨진 과일, 꿀 향을 깨우는 가장 추천하는 방식입니다."
                }
            ]
        },
        flavorTags: [
            { label: "강렬한 오크", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "진한 바닐라", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "향신료(스파이스)", color: "bg-red-900/20 text-zinc-950 dark:text-red-300" }
        ],
        foodPairing: [
            "한우 다이닝 스테이크",
            "다크 초콜릿 / 견과류",
            "하몽, 살라미 등 건조 육류"
        ],
        dbCategories: ['위스키']
    }
}
