export const generateRandomNickname = () => {
    const adjectives1 = ['달콤한', '쌉싸름한', '부드러운', '강렬한', '스모키한', '상큼한', '깔끔한', '묵직한'];
    const adjectives2 = ['풍미 가득한', '향긋한', '여운이 남는', '짜릿한', '매력적인', '신비로운', '고급스러운'];
    const spirits = ['아드벡', '맥캘란', '발베니', '조니워커', '진로', '화요', '글렌피딕', '라프로익', '잭다니엘'];

    const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

    // 4자리 랜덤 숫자 ID
    const randomId = Math.floor(1000 + Math.random() * 9000);

    return `${pick(adjectives1)} ${pick(adjectives2)} ${pick(spirits)}#${randomId}`;
};
