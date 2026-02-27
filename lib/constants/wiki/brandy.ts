import { SpiritCategory } from './types'

export const brandy: SpiritCategory = {
    slug: 'brandy',
    emoji: '🍇',
    nameKo: '브랜디',
    nameEn: 'Brandy',
    taglineKo: '과일을 발효·증류해 만든 우아한 스피리츠',
    taglineEn: 'Elegant spirit distilled from fermented fruit, wine, or pomace',
    color: 'orange',
    sections: {
        definition: "브랜디(Brandy)는 넓은 의미로 포도를 비롯한 사과, 체리 등 다양한 과일의 발효액을 증류하여 오크통 등에 숙성시킨 과일 증류주 전체를 통칭합니다.",
        history: "네덜란드 상인들이 와인을 농축해 만든 '구운 와인'을 뜻하는 네덜란드어 '브란데베인(Brandewijn)'에서 이름이 유래되었습니다.",
        subtypes: [
            { name: '아르마냑 (Armagnac)', description: '프랑스 가스코뉴 지방에서 1회 연속 증류하여 만들어진 브랜디. 꼬냑보다 거칠고 남성적인 흙내음과 자두 향이 강합니다.' },
            { name: '깔바도스 (Calvados)', description: '프랑스 노르망디 지방에서 사과나 배를 이용해 만든 사과 브랜디(Apple Brandy).' },
            { name: '포마스 브랜디 / 그라파', description: '와인을 짜고 남은 포도 껍질과 씨앗(찌꺼기)을 증류해 만든 향이 강한 이탈리아식 브랜디.' },
            { name: '피스코 (Pisco)', description: '페루/칠레에서 오크통 숙성 없이 만들어지는 투명한 포도 증류주.' }
        ],
        flavorTags: [
            { label: '구운 사과/조린 과일', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { label: '오크/바닐라', color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
            { label: '부드러운 단맛', color: 'bg-orange-400/20 text-orange-300 border-orange-400/30' },
            { label: '투명하고 화사한 향(피스코)', color: 'bg-sky-200/20 text-sky-200 border-sky-200/30' }
        ],
        production: "과일 당쇄/착즙 및 발효(사이다 또는 와인 생성) → 단식/연속식 증류기를 통한 증류 → 오크통 장기 숙성 (숙성이 없는 화이트 브랜디/피스코는 예외) → 블렌딩 병입",
        howToEnjoy: [
            "니트(식후주): 튤립 글라스로 꼬냑처럼 포도나 과일 본연의 향 흠향하기",
            "피스코 사워(칵테일): 피스코에 라임, 시럽, 계란 흰자를 넣어 부드럽고 상큼한 거품 칵테일 즐기기",
            "깔바도스 잭 로즈(칵테일): 애플잭(또는 깔바도스)에 석류 시럽과 라임을 넣은 붉은빛 칵테일"
        ],
        foodPairing: ["과일 타르트", "애플/피칸 파이", "까망베르/브리 치즈", "바비큐 요리"],
        dbCategories: ['brandy', 'armagnac', 'calvados']
    }
}
