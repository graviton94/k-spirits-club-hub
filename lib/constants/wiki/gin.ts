import { SpiritCategory } from './types'

export const gin: SpiritCategory = {
    slug: 'gin',
    emoji: '🌿',
    nameKo: '진',
    nameEn: 'Gin',
    taglineKo: '주니퍼 베리와 보타니컬의 조화, 칵테일의 베이스',
    taglineEn: 'A botanical spirit defined by juniper, the cocktail world\'s backbone',
    color: 'emerald',
    sections: {
        definition: "진(Gin)은 주니퍼 베리(노간주나무 열매)를 주원료로 하여 다양한 보타니컬(허브, 향신료, 감귤류 껍질 등)의 풍미를 입힌 투명한 증류주입니다.",
        history: "17세기 네덜란드에서 해열제 용도로 발명된 쥬네베르(Genever)가 영국으로 넘어가면서 런던 드라이 진으로 발전하였고, 전 세계적인 칵테일 베이스로 자리 잡았습니다.",
        subtypes: [
            { name: '런던 드라이 진', description: '가장 흔한 스타일로, 인공 감미료 없이 보타니컬 본연의 강렬한 주니퍼 베리 향과 드라이한 맛이 특징.' },
            { name: '올드 톰 진', description: '런던 드라이보다 약간 달콤하게 만들어진 18세기 스타일의 진.' },
            { name: '플레이버드 진', description: '증류 후 딸기, 자몽 등 특정 과일이나 향신료를 강력하게 가미한 현대적인 진.' }
        ],
        flavorTags: [
            { label: '솔향/주니퍼베리', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { label: '시트러스(감귤류)', color: 'bg-lime-400/20 text-lime-300 border-lime-400/30' },
            { label: '허벌/풀향', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
            { label: '스파이시', color: 'bg-orange-400/20 text-orange-300 border-orange-400/30' }
        ],
        production: "중성 주정(곡물 발효 후 고도수 증류) 생산 → 주니퍼 베리 및 다양한 보타니컬 첨가(침출 또는 증기 바구니 이용) → 2차 증류 → 정제수로 희석 후 병입",
        howToEnjoy: [
            "진 토닉(Gin & Tonic): 진과 토닉워터를 섞고 라임/레몬 슬라이스 곁들이기",
            "마티니(Martini): 드라이 베르무트와 섞어 칵테일의 제왕 즐기기",
            "네그로니(Negroni): 캄파리, 스윗 베르무트와 동일 비율로 섞어 쌉쌀하게 마시기"
        ],
        foodPairing: ["오이 샌드위치", "신선한 굴/해산물", "절인 올리브", "가벼운 허브 샐러드"],
        dbCategories: ['gin']
    }
}
