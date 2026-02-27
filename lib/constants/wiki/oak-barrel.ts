import { SpiritCategory } from './types'

export const oakBarrel: SpiritCategory = {
    slug: 'oak-barrel',
    emoji: '🪵',
    nameKo: '오크통 (캐스크)',
    nameEn: 'Oak Barrel (Cask)',
    taglineKo: '스피리츠의 색과 향, 영혼을 완성하는 긴 시간의 예술',
    taglineEn: 'The vessel of transformation — shaping flavor, color, and character through time',
    color: 'amber',
    sections: {
        definition: "오크통(캐스크)은 참나무를 사용하여 만든 숙성 용기로, 액체 내 성분과 나무 조직 간의 상호작용, 그리고 미세한 기공을 통한 산소 접촉을 통해 술의 풍미를 완성하는 '제2의 원재료'다.",
        history: "고대 로마 시대에 운반이 어려운 점토 용기(암포라)를 대체하기 위해 갈리아인의 나무통 제작 기술을 도입한 것이 시초다. 처음에는 단순 저장용이었으나, 장기 보관 중 술의 맛이 부드러워지고 화사한 향이 밴다는 사실이 발견되면서 현대 숙성 기술의 핵심으로 발전했다.",
        classifications: [
            {
                name: "아메리칸 화이트 오크 (Ex-Bourbon)",
                criteria: "Quercus Alba 품종 / 주로 버번 위스키를 숙성했던 오크통",
                description: "가장 대중적인 캐스크로, 바닐라, 카라멜, 코코넛 향이 지배적이다. 나무 조직이 치밀하여 술의 색이 비교적 밝은 금색을 띠게 하며, 부드러운 단맛과 크리미한 질감을 부여한다."
            },
            {
                name: "유러피안 오크 (Ex-Sherry)",
                criteria: "Quercus Robur 품종 / 주로 셰리 와인을 숙성했던 오크통",
                description: "스페인 등 유럽산 참나무로 제작되며, 탄닌 함량이 높아 구조감이 강하다. 말린 과일(무화과, 건포도), 구운 견과류, 다크 초콜릿, 시나몬 같은 묵직하고 복합적인 향미를 만든다."
            },
            {
                name: "버진 오크 (Virgin Oak)",
                criteria: "아무것도 담지 않았던 새 오크통",
                description: "나무 고유의 에너지가 가장 강력하게 전달된다. 강렬한 스파이시함, 생나무의 느낌, 빠른 색 발현이 특징이며, 과도한 숙성 시 떫은맛이 강해질 수 있어 정교한 관리가 필요하다."
            },
            {
                name: "미즈나라 캐스크 (Japanese Oak)",
                criteria: "Quercus Crispula 품종 / 일본산 '물참나무' 사용",
                description: "나무가 무르고 가공이 어렵지만, 장기 숙성 시 사찰의 향(백단향, 가라향)이나 코코넛, 꿀 같은 극도로 섬세하고 이국적인 아로마를 선사하는 고가의 희귀 캐스크다."
            },
            {
                name: "프렌치 와인 캐스크",
                criteria: "보르도, 부르고뉴 등 프리미엄 와인을 담았던 캐스크",
                description: "와인 고유의 탄닌과 붉은 과실향이 술에 녹아든다. 우아한 산미와 섬세한 타닌, 베리류의 향이 더해져 위스키나 브랜디에 복합적인 레이어를 추가한다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "탄닌 함량",
                label: "Tannin Level",
                value: "Medium ~ High (유러피안 오크에서 상승)",
                description: "입안을 조여주는 구조감과 떫은맛의 정도를 결정한다. 높은 탄닌은 장기 숙성 시 술의 뼈대를 잡아주는 역할을 한다."
            },
            {
                metric: "추출 강도",
                label: "Extraction Force",
                value: "High (새 오크통/작은 통) ~ Low (리필 캐스크)",
                description: "나무 조직에서 성분이 술로 녹아 나오는 속도다. 통이 작을수록 액체와 닿는 면적이 넓어 추출이 빨라진다."
            },
            {
                metric: "산소 투과율",
                label: "Oxidation Rate",
                value: "0.1 ~ 0.5% (연간 증발량 포함)",
                description: "나무의 미세 구멍을 통해 산소가 유입되어 술을 산화/숙성시키는 속도다. 이 과정을 통해 날카로운 알코올 향이 둥글게 다듬어진다."
            },
            {
                metric: "토스팅/차링 등급",
                label: "Char Level (1-4)",
                value: "Lv.1 (Light) ~ Lv.4 (Alligator)",
                description: "나무 안쪽을 태운 정도다. 많이 태울수록(Char) 바닐라향과 훈연향이 강해지고 탄소층이 불순물을 제거하는 필터 역할을 한다."
            }
        ],
        coreIngredients: [
            {
                type: "수종 (미국)",
                name: "Quercus Alba (White Oak)",
                description: "타일로스(Tyloses) 성분이 많아 액체가 새지 않고, 바닐린 성분이 풍부해 달콤한 향을 내는 데 최적화되어 있다."
            },
            {
                type: "수종 (유럽)",
                name: "Quercus Robur / Petraea",
                description: "탄닌과 폴리페놀 함량이 높아 더 짙은 색상과 스파이시하고 떫은맛의 복합미를 제공한다."
            },
            {
                type: "숙성 전 처리",
                name: "시즈닝 (Natural Seasoning)",
                description: "나무를 실외에서 2~3년간 자연 건조하여 불필요한 수분과 거친 수액 성분을 제거하고 풍미를 안정화하는 필수 과정이다."
            }
        ],
        manufacturingProcess: [
            {
                step: "제재 및 건조",
                name: "시즈닝 (Seasoning)",
                description: "참나무를 판재(Stave) 형태로 잘라 야외에서 비바람을 맞히며 건조한다. 이 과정에서 거친 탄닌이 씻겨 내려가고 곰팡이/효소 작용으로 예비 향기 성분이 형성된다."
            },
            {
                step: "통 조립",
                name: "쿠퍼리지 (Coopering)",
                description: "숙련된 전문가(Cooper)가 열과 물을 이용해 나무 판재를 휘어 원형의 통을 만든다. 못이나 접착제 없이 오직 압력만으로 밀폐 구조를 완성한다."
            },
            {
                step: "열처리",
                name: "토스팅 & 차링 (Toasting & Charring)",
                description: "불로 나무 안쪽을 가열한다. 토스팅은 나무 속 당분을 카라멜화하여 단맛을 내고, 차링은 표면을 태워 탄소 필터 층을 형성하고 훈연향을 부여한다."
            },
            {
                step: "숙성",
                name: "마투레이션 (Maturation)",
                description: "술을 채워 저장고(Dunnage/Racked)에 보관한다. 온도와 습도 변화에 따라 나무가 숨을 쉬며 술과 성분을 교환하고, '천사의 몫(Angel's Share)'이라 불리는 증발이 일어난다."
            },
            {
                step: "추가 숙성",
                name: "피니싱 (Finishing / ACEing)",
                description: "기존 오크통에서 숙성된 술을 다른 종류의 캐스크(예: 셰리, 와인 캐스크)로 옮겨 6개월~2년 정도 추가 숙성하여 향의 레이어를 덧입힌다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "노징 글라스 (Glencairn) 또는 튤립형 잔",
            decantingNeeded: true,
            optimalTemperatures: [
                {
                    temp: "18~22℃ (실온)",
                    description: "오크통에서 유래한 유질감과 바닐라, 카라멜 등 무거운 분자들의 향이 가장 풍성하게 피어오르는 온도다."
                },
                {
                    temp: "손바닥 온기 (Palm Warming)",
                    description: "잔을 감싸 쥐어 온도를 살짝 올리면, 장기 숙성된 고숙성 원액의 숨겨진 가죽, 흙, 향신료 향이 깨어난다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-amber-300 border-amber-600/30" },
            { label: "코코넛 (아메리칸)", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
            { label: "건포도/무화과 (셰리)", color: "bg-rose-700/20 text-rose-300 border-rose-700/30" },
            { label: "다크 초콜릿/커피", color: "bg-stone-800/20 text-stone-300 border-stone-800/30" },
            { label: "시나몬/스파이시", color: "bg-orange-600/20 text-orange-300 border-orange-600/30" },
            { label: "백단향 (미즈나라)", color: "bg-stone-600/20 text-stone-300 border-stone-600/30" },
            { label: "토스티/훈연향", color: "bg-stone-700/20 text-stone-300 border-stone-700/30" },
            { label: "타닌/와인 느낌", color: "bg-purple-600/20 text-purple-300 border-purple-600/30" }
        ],
        foodPairing: [
            "다크 초콜릿 (카카오 70% 이상)",
            "훈제 향이 강한 스테이크/바비큐",
            "숙성된 하드 치즈 (체다, 파르미지아노 레지아노)",
            "볶은 견과류 (피칸, 월넛)",
            "말린 과일과 무화과"
        ],
        dbCategories: ['whisky', 'rum', 'brandy', 'wine']
    }
}
