import { SpiritCategory } from './types'

export const rum: SpiritCategory = {
    slug: 'rum',
    emoji: '🏝️',
    nameKo: '럼',
    nameEn: 'Rum',
    taglineKo: '사탕수수에서 태어난 카리브해의 영혼',
    taglineEn: 'Caribbean spirit born from sugarcane, rich with tropical warmth',
    color: 'orange',
    sections: {
        definition: "럼(Rum)은 사탕수수의 즙이나 당밀 등 사탕수수 부산물을 발효시키고 증류하여 만든 달콤한 풍미의 스피리츠입니다.",
        history: "17세기 카리브해 연안의 사탕수수 농장에서 탄생했으며, 대항해 시대 선원들과 해적들의 술로 불리며 전 세계로 퍼져나갔습니다.",
        subtypes: [
            { name: '화이트/라이트 럼', description: '증류 후 스테인리스 탱크나 가볍게 오크통에서 숙성 후 여과하여 색을 없앤 럼. 칵테일 베이스로 애용.' },
            { name: '다크 럼', description: '내부를 깊게 그을린 오크통에서 장기간 숙성하여 진한 갈색을 띠며, 풍부한 카라멜과 스파이스 향이 특징.' },
            { name: '스파이스드 럼', description: '화이트나 골드 럼에 바닐라, 시나몬, 정향 등의 향신료와 카라멜을 첨가하여 만든 달콤한 럼.' }
        ],
        flavorTags: [
            { label: '당밀/카라멜', color: 'bg-orange-600/20 text-orange-400 border-orange-600/30' },
            { label: '트로피컬(열대과일)', color: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' },
            { label: '바닐라/스위트', color: 'bg-amber-400/20 text-amber-300 border-amber-400/30' },
            { label: '스파이시(정향/시나몬)', color: 'bg-red-500/20 text-red-300 border-red-500/30' }
        ],
        production: "사탕수수 즙 또는 당밀 베이스 구축 → 효모 투입 후 발효 → 증류(단식/연속식 증류기) → 오크통 숙성(종류에 따라 생략) → 블렌딩 및 병입",
        howToEnjoy: [
            "칵테일 베이스: 모히토, 다이키리, 피나콜라다, 쿠바 리브레",
            "니트/온더락: 숙성 기간이 긴 다크 럼이나 프리미엄 럼은 위스키처럼 천천히 향을 음미",
            "스파이스드 럼 & 콜라: 캡틴 모건 같은 스파이스드 럼에 콜라를 섞어 가볍게 마시기"
        ],
        foodPairing: ["구운 파인애플", "바비큐(저크 치킨)", "초콜릿 디저트", "시가(Cigar)"],
        dbCategories: ['rum']
    }
}
