import { SpiritCategory } from './types'

export const whisky: SpiritCategory = {
    slug: 'whisky',
    emoji: '🥃',
    nameKo: '위스키',
    nameEn: 'Whisky',
    taglineKo: '곡물을 증류·숙성한 세계에서 가장 다양한 스피리츠',
    taglineEn: 'The world\'s most diverse distilled spirit, aged in oak barrels',
    color: 'amber',
    sections: {
        definition: "위스키는 맥아(Malted barley)를 비롯한 곡물(Grain) 발효주를 증류한 뒤, 오크통(Oak cask)에서 일정 기간 이상 숙성시킨 증류주입니다.",
        history: "스코틀랜드와 아일랜드에서 기원했으며, '생명의 물(Aqua Vitae)'이라는 뜻의 켈트어 'Uisge Beatha'(우슈게 베하)에서 유래했습니다.",
        subtypes: [
            { name: '스카치 위스키', description: '스코틀랜드에서 생산되며, 싱글 몰트와 블렌디드로 나뉩니다. 피트(이탄) 향이 특징인 경우가 많습니다.' },
            { name: '버번 위스키', description: '미국에서 옥수수를 51% 이상 사용하여 만들며, 안쪽을 그을린 새 오크통에서 숙성해 강렬한 바닐라 향이 납니다.' },
            { name: '아이리시 위스키', description: '아일랜드에서 생산되며, 세 번 증류하여 부드럽고 가벼운 맛을 자랑합니다.' },
            { name: '재패니즈 위스키', description: '일본에서 생산되며, 스카치의 전통을 따르면서도 섬세하고 깔끔한 맛을 구현합니다.' }
        ],
        flavorTags: [
            { label: '피트/고기향', color: 'bg-stone-500/20 text-stone-300 border-stone-500/30' },
            { label: '바닐라/카라멜', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { label: '과일향/셰리', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
            { label: '스파이시/우디', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }
        ],
        production: "제맥(Malting) → 당화(Mashing) → 발효(Fermentation) → 증류(Distillation) → 숙성(Maturation) → 병입(Bottling)",
        howToEnjoy: [
            "니트(Neat): 향을 음미하며 실온의 위스키를 그대로 마시기",
            "온더락(On the rocks): 얼음을 넣어 차갑고 부드럽게 즐기기",
            "물 한 방울(Drop of water): 향기 분자를 활성화시켜 숨겨진 향기 깨우기",
            "하이볼(Highball): 탄산수와 믹스하여 시원하고 경쾌하게 즐기기"
        ],
        foodPairing: ["다크 초콜릿", "훈제 연어", "스테이크", "견과류", "숙성 치즈"],
        dbCategories: ['whisky']
    }
}
