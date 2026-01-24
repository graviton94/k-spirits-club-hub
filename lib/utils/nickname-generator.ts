export const generateRandomNickname = () => {
    // 1단계: 질감·인상 (혀/코에서 바로 느껴지는 성격)
    const adjectives1 = [
        '달콤하고', '쌉싸름하고', '부드럽고', '강렬하고', '스모키하고',
        '상큼하고', '깔끔하고', '묵직하고', '드라이하고', '크리미하고',
        '오일리하고', '짭짤하고',
        '스파이시하고', '허브하고', '플로럴하고', '프루티하고',
        '토스티하고', '로스티하고', '오키하고', '피티하고',
        '동양풍의', '이국적인', '야성적인', '세련되고'
    ];

    // 2단계: 캐릭터·완성도 (평가/여운/개성)
    const adjectives2 = [
        '풍미폭발', '향미가득', '여운짙은',
        '밸런스좋은', '탄탄한', '개성있는',
        '중독적인', '매혹적인',
        '고급진', '클래식한', '모던한',
        '한방있는', '말끔한', '오래가는',
        '입체적인', '신비로운',
        '데일리각'
    ];

    // 3단계: 주류 스펙트럼 (카테고리+대표명 혼합)
    const spirits = [
        // Whisky & Whiskey
        '싱글몰트', '블렌디드', '버번', '라이',
        '아드벡', '라프로익', '라가불린', '글렌알라키', '탈리스커',
        '맥캘란', '글렌피딕', '발베니', '스프링뱅크', '글렌드로낙',

        // Brandy & Agave
        '코냑', '아르마냑', '브랜디', 'VSOP', 'X.O',
        '테킬라', '메스칼',

        // Clear Spirits
        '진', '보드카', '럼', '쇼츄',

        // Asian Spirits
        '소주', '증류식소주', '안동소주',
        '사케', '청주', '막걸리', '고량주',

        // Fortified & Liqueur
        '셰리', '포트와인', '마데이라',
        '리큐르', '비터스',

        // Wine & Beer
        '레드와인', '화이트와인', '내추럴와인',
        '라거', '에일', 'IPA', '스타우트'
    ];

    // 예시 조합
    // `${adjectives1[rand]} ${adjectives2[rand]} ${spirits[rand]}`

    const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

    // 4자리 랜덤 숫자 ID
    const randomId = Math.floor(1000 + Math.random() * 9000);

    return `${pick(adjectives1)} ${pick(adjectives2)} ${pick(spirits)}#${randomId}`;
};
