import { SpiritCategory } from '../types'

export const grunerVeltliner: SpiritCategory = {
    slug: 'gruner-veltliner',
    emoji: '🟢',
    nameKo: '그뤼너 벨틀리너',
    nameEn: 'Grüner Veltliner',
    taglineKo: '오스트리아의 고결한 백색, 알싸한 백후추와 극강의 미네랄리티',
    taglineEn: 'Austrias noble white, spicy white pepper and ultimate minerality',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '그뤼너 벨틀리너(Grüner Veltliner)는 오스트리아 와인의 자부심이자 가장 널리 재배되는 대표 품종입니다. 입안을 톡 쏘는 듯한 선명한 백후추 향과 신선한 시트러스, 그리고 서늘한 기후의 정취가 느껴지는 미네랄리티가 독보적입니다. 가볍고 상쾌한 데일리 스타일부터 수십 년간 숙성 가능한 풀바디 스타일까지 놀라운 표현력을 보여줍니다.',
        history: '오스트리아의 토착 품종으로, 트라미너(Traminer)와 현재는 거의 사라진 세인트 게오르겐(St. Georgen) 품종의 자연 교배를 통해 탄생했습니다. 오랫동안 오스트리아 내부에서만 즐겨왔으나, 1990년대 중반 블라인드 테이스팅에서 세계 최고의 샤르도네와 화이트 와인들을 꺾으면서 전 세계 평론가들을 놀라게 했고, 이후 미식가들 사이에서 "가장 음식과 페어링하기 좋은 화이트 와인"으로 손꼽히게 되었습니다.',
        classifications: [
            { name: 'Steinfeder', criteria: '와카우 등급', description: '가장 가볍고 알코올 도수가 낮은 청량한 스타일' },
            { name: 'Federspiel', criteria: '와카우 등급', description: '중간 정도의 무게감과 우아한 균형을 지닌 클래식 스타일' },
            { name: 'Smaragd', criteria: '와카우 등급', description: '가장 잘 익은 포도로 만든 묵직하고 복합적인 최고급 숙성용 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '8/10', description: '입안을 깨끗하게 씻어주는 날카롭고 밝은 산미' },
            { label: '스파이스 (Spice)', metric: '풍미', value: '9/10', description: '그뤼너 벨틀리너의 상징인 알싸한 백후추 향' },
            { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '가벼운 듯하다가도 중후하게 퍼지는 미디엄 풀바디' }
        ],
        flavorTags: [
            { label: '백후추', color: 'bg-stone-200/20 text-stone-700' },
            { label: '라임', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '셀러리', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '자연 효모 사용', description: '테루아의 개성을 극대화하기 위해 인위적인 효모 대신 밭 고유의 자연 효모를 주로 사용합니다.' },
            { step: '숙성', name: '대형 오크/스테인리스', description: '강한 오크향을 배제하고 품종 특유의 미네랄리티를 지키기 위해 주로 대형 오래된 오크통이나 스테인리스 보관을 선호합니다.' }
        ],
        majorRegions: [
            { name: '니더외스터라이히 (Niederösterreich)', description: '와카우, 캄프탈 등 세계 최고 품질의 그뤼너가 탄생하는 거점', emoji: '🇦🇹' },
            { name: '바인피어텔 (Weinviertel)', description: '알싸한 백후추 풍미가 가장 전형적으로 나타나는 광활한 산지', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '화이트 와인 또는 약간 볼이 넓은 글라스',
            optimalTemperatures: [
                { temp: '8-11°C', description: '풍부한 미네랄과 후추의 뉘앙스가 가장 조화롭게 표현되는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['오스트리아 전통 슈니첼', '동남아시아 아시안 퀴진', '아스파라거스 요리', '허브를 쓴 생선 구이']
    },
    sectionsEn: {
        definition: "Grüner Veltliner is the pride of Austrian viticulture and its most widely planted variety. It is instantly recognizable by its signature spicy white pepper notes, fresh citrus acidity, and a cool-climate minerality. Spanning a vast range from light, effervescent daily drinkers to concentrated, age-worthy full-bodied masterpieces, it offers incredible expressive depth.",
        history: "A native Austrian variety, it is a natural cross between Traminer and the now nearly extinct St. Georgen grape. Long a hidden treasure within Austria, it shocked the international community in the mid-1990s by outperforming world-class Chardonnays in blind tastings. Since then, it has become a darling of sommeliers worldwide, often cited as one of the most food-friendly white grapes in existence.",
        classifications: [
            { name: 'Steinfeder', criteria: 'Wachau Tier', description: 'The lightest and freshest style with lower alcohol, perfect for easy drinking.' },
            { name: 'Federspiel', criteria: 'Wachau Tier', description: 'A classic, medium-bodied style offering an elegant balance of fruit and acidity.' },
            { name: 'Smaragd', criteria: 'Wachau Tier', description: 'The riper, more complex full-bodied wines with immense aging potential.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Sharp and bright acidity that cleanses the palate effectively.' },
            { label: 'Spice', metric: 'Intensity', value: '9/10', description: 'The hallmark white pepper zing that is iconic to the variety.' },
            { label: 'Body', metric: 'Weight', value: '6/10', description: 'Possesses a surprising tactile richness ranging to medium-full body.' }
        ],
        flavorTags: [
            { label: 'White Pepper', color: 'bg-stone-200/20 text-stone-700' },
            { label: 'Lime', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Celery', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Native Yeast Engagement', description: 'Often fermented using natural vineyard yeasts rather than commercial strains to prioritize terroir transparency.' },
            { step: 'Aging', name: 'Neutral Vessel Aging', description: 'Preferred maturation in large, old oak casks or stainless steel to prevent wood flavors from masking its mineral core.' }
        ],
        majorRegions: [
            { name: 'Niederösterreich', description: 'Home to world-class sub-regions like Wachau and Kamptal, producing the finest expressions.', emoji: '🇦🇹' },
            { name: 'Weinviertel', description: 'A vast region celebrated for its archetypal peppery and refreshing Grüner-style wines.', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'White Wine or slightly wider-bowled Glass',
            optimalTemperatures: [
                { temp: '8–11°C', description: 'The ideal range for highlighting its mineral depth and peppery nuances.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Traditional Austrian Wiener Schnitzel', 'Spicy Southeast Asian cuisine', 'Asparagus dishes', 'Herb-roasted fish']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['그뤼너 벨틀리너', 'gruner veltliner']
}
