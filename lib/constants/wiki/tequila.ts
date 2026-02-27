import { SpiritCategory } from './types'

export const tequila: SpiritCategory = {
    slug: 'tequila',
    emoji: '🌵',
    nameKo: '데킬라',
    nameEn: 'Tequila',
    taglineKo: '블루 아가베에서 탄생한 멕시코의 자존심',
    taglineEn: 'Mexico\'s pride, distilled from blue agave under the desert sun',
    color: 'lime',
    sections: {
        definition: "데킬라(Tequila)는 멕시코 특정 지역(주로 할리스코 주)에서 재배된 100% 블루 아가베(Blue Agave)의 수액을 발효하고 증류하여 만든 멕시코의 국민 증류주입니다.",
        history: "고대 아즈텍 원주민들이 마시던 아가베 발효주 '풀케'에 16세기 스페인 정복자들이 가져온 증류 기술이 더해져 탄생했습니다.",
        subtypes: [
            { name: '블랑코 (Blanco / Silver)', description: '증류 직후 바로 병입하거나 2개월 미만 숙성. 아가베 본연의 신선하고 산뜻한 향이 강합니다.' },
            { name: '레포사도 (Reposado)', description: '오크통에서 2개월~1년 숙성. 바닐라 향이 옅게 배어 부드럽습니다.' },
            { name: '아네호 (Añejo)', description: '오크통에서 1~3년 숙성. 위스키와 비슷한 깊은 나무향과 묵직함을 가집니다.' }
        ],
        flavorTags: [
            { label: '아가베(풀/흙향)', color: 'bg-lime-500/20 text-lime-300 border-lime-500/30' },
            { label: '시트러스(라임/레몬)', color: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' },
            { label: '스파이시/페퍼', color: 'bg-red-400/20 text-red-300 border-red-400/30' },
            { label: '바닐라/오크(숙성시)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
        ],
        production: "블루 아가베의 밑동(피냐) 수확 → 오븐에서 굽기(당화) → 착즙하여 아구아미엘(단물) 추출 → 발효 → 다중 증류 → 숙성(선택) → 병입",
        howToEnjoy: [
            "전통 샷: 손등에 짠 소금을 핥고 데킬라를 원샷한 뒤 라임 조각 베어물기",
            "마가리타(Margarita): 코앵트로(오렌지 리큐르), 라임 즙과 얼음을 블렌딩하여 소금 리밍 잔에 즐기기",
            "팔로마(Paloma): 데킬라 베이스에 상큼/쌉쌀한 자몽 소다 섞기"
        ],
        foodPairing: ["타코/파히타 등 멕시칸 요리", "과카몰리", "세비체(해산물 초무침)", "매콤한 칠리 요리"],
        dbCategories: ['tequila', 'mezcal']
    }
}
