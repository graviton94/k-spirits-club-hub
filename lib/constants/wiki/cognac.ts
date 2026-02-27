import { SpiritCategory } from './types'

export const cognac: SpiritCategory = {
    slug: 'cognac',
    emoji: '🍯',
    nameKo: '꼬냑',
    nameEn: 'Cognac',
    taglineKo: '프랑스 꼬냑 지방의 고급 포도 증류주',
    taglineEn: 'France\'s prestigious grape brandy from the Cognac region',
    color: 'amber',
    sections: {
        definition: "꼬냑(Cognac)은 프랑스 꼬냑(Cognac) 지방에서 엄격한 규정에 따라 생산되는 프리미엄 포도 증류주(브랜디)입니다.",
        history: "17세기 와인을 배로 수출할 때 변질을 막고 부피를 줄이기 위해 증류한 맑은 술 '오 드 비(Eau de vie)'가 오크통 안에서 우연히 긴 시간 숙성되며 탄생했습니다.",
        subtypes: [
            { name: 'V.S (Very Special)', description: '가장 어린 오 드 비가 최소 2년 이상 오크 숙성된 꼬냑. 과실향이 산뜻하여 칵테일에 주로 쓰임.' },
            { name: 'V.S.O.P (Very Superior Old Pale)', description: '최소 4년 이상 오크통 숙성된 원액이 포함된 꼬냑. 밸런스가 훌륭해 니트로 널리 즐깁니다.' },
            { name: 'X.O (Extra Old)', description: '최소 10년 이상 긴 세월 숙성된 최상위 등급. 다채로운 말린 과일, 가죽, 흙의 향 등이 압도적입니다.' }
        ],
        flavorTags: [
            { label: '말린 과일/건포도/무화과', color: 'bg-rose-700/20 text-rose-400 border-rose-700/30' },
            { label: '바닐라/카라멜', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { label: '오크/프렌치 오크', color: 'bg-stone-600/20 text-stone-400 border-stone-600/30' },
            { label: '플로럴/재스민', color: 'bg-pink-400/20 text-pink-300 border-pink-400/30' }
        ],
        production: "위니 블랑 등의 백포도 발효 → 구리로 만든 알람빅(Charentais) 증류기로 2번 증류 → 프랑스 리무쟁/트롱세 오크통에서 최소 2년 이상 장기 숙성 → 마스터 블렌더의 아상블라주(블렌딩)",
        howToEnjoy: [
            "스니프터/튤립 글라스: 둥근 잔의 밑부분을 손바닥 온기로 가볍게 품어 데우며 풍성한 향 발현시키기",
            "니트(Neat): 따뜻한 실내에서 식후주로 조금씩 입안에서 굴려 마시기",
            "사이드카(Sidecar): 꼬냑, 오렌지 리큐르, 레몬 즙으로 만드는 클래식 칵테일"
        ],
        foodPairing: ["최고급 다크 초콜릿", "시가(Cigar)", "구운 아몬드/피칸", "에스프레소", "푸아그라"],
        dbCategories: ['cognac']
    }
}
