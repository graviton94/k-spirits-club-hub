/**
 * 주류 백과사전 (Spirits Wiki) — 카테고리 데이터
 *
 * 이 파일은 개별 주종 데이터 파일을 통합하는 엔트리 포인트입니다.
 * 상세 데이터는 lib/constants/wiki 디렉토리의 각 파일에서 관리합니다.
 */

import { SpiritCategory } from './wiki/types'
import { blendedWhisky } from './wiki/blended-whisky'
import { singleMalt } from './wiki/single-malt'
import { bourbon } from './wiki/bourbon'
import { grainWhisky } from './wiki/grain-whisky'
import { cognac } from './wiki/cognac'
import { champagne } from './wiki/champagne'
import { sake } from './wiki/sake'
import { sojuDistilled } from './wiki/soju-distilled'
import { sojuDiluted } from './wiki/soju-diluted'
import { gin } from './wiki/gin'
import { rum } from './wiki/rum'
import { vodka } from './wiki/vodka'
import { tequila } from './wiki/tequila'
import { wine } from './wiki/wine'
import { redWine } from './wiki/red-wine'
import { whiteWine } from './wiki/white-wine'
import { mezcal } from './wiki/mezcal'
import { liqueur } from './wiki/liqueur'
import { brandy } from './wiki/brandy'
import { baijiu } from './wiki/baijiu'
import { beer } from './wiki/beer'
import { yakju } from './wiki/yakju'
import { cheongju } from './wiki/cheongju'
import { makgeolli } from './wiki/makgeolli'
import { shochu } from './wiki/shochu'
import { oakBarrel } from './wiki/oak-barrel'
import { cheongjuVsSake } from './wiki/cheongju-vs-sake'
import { yakjuVsCheongju } from './wiki/yakju-vs-cheongju'
import { singleMaltVsBlended } from './wiki/single-malt-vs-blended'

// SEO Hub Categories (Bilingual)
import { sojuGuide } from './wiki/soju-guide'
import { makgeolliGuide } from './wiki/makgeolli-guide'
import { koreanWhisky } from './wiki/korean-whisky'
import { koreanTraditionalSpirits } from './wiki/korean-traditional-spirits'
import { koreanSpiritsByAbv } from './wiki/korean-spirits-by-abv'

// Regional Sub-Wiki Pages (KO + EN)
import { scotchWhiskyRegions } from './wiki/scotch-whisky-regions'
import { usWhiskeyRegions } from './wiki/us-whiskey-regions'
import { brandyRegions } from './wiki/brandy-regions'
import { redWineRegions } from './wiki/red-wine-regions'
import { whiteWineRegions } from './wiki/white-wine-regions'

// Wine Grapes Hubs
export const redGrapeHub: SpiritCategory = {
    slug: 'red-grape',
    emoji: '🍷',
    nameKo: '레드 와인 포도 품종',
    nameEn: 'Red Wine Grape Varieties',
    taglineKo: '카베르네 소비뇽, 피노 누아 등 레드 와인의 주역들',
    taglineEn: 'Master varieties of red wine: Cabernet, Pinot, and more',
    color: 'rose',
}

export const whiteGrapeHub: SpiritCategory = {
    slug: 'white-grape',
    emoji: '🥂',
    nameKo: '화이트 와인 포도 품종',
    nameEn: 'White Wine Grape Varieties',
    taglineKo: '샤르도네, 소비뇽 블랑 등 화이트 와인의 정수',
    taglineEn: 'Essential white wine grapes: Chardonnay, Sauvignon, and more',
    color: 'emerald',
}

// Individual Grapes
import { RED_WINE_GRAPES, WHITE_WINE_GRAPES } from './wiki/grapes/index'

// 타입 재수출 (하위 호환성 유지)
export type {
    SpiritSubtype,
    SpiritFlavorTag,
    SpiritClassification,
    SpiritSensoryMetric,
    SpiritIngredient,
    SpiritProcess,
    SpiritServingGuideline,
    SpiritSection,
    SpiritCategory
} from './wiki/types'

// ─── 카테고리 목록 ──────────────────────────────────────────────────────────

export const SPIRIT_CATEGORIES: SpiritCategory[] = [
    // 1. Whisky Group
    singleMalt,
    bourbon,
    grainWhisky,
    blendedWhisky,

    // 2. Brandy Group
    cognac,
    brandy,

    // 3. Wine Group
    champagne,
    redWine,
    whiteWine,
    wine, // Rosé & Sparkling

    // 4. White Spirits (Global)
    gin,
    vodka,
    rum,
    tequila,
    mezcal,

    // 5. Traditional East Asian
    sojuDistilled,
    sojuDiluted,
    yakju,
    cheongju,
    makgeolli,
    sake,
    shochu,
    baijiu,

    // 6. Others
    beer,
    liqueur,

    // 7. Technical Guide
    oakBarrel,

    // 8. SEO Hubs (Bilingual)
    sojuGuide,
    makgeolliGuide,
    koreanWhisky,
    koreanTraditionalSpirits,
    koreanSpiritsByAbv,
    cheongjuVsSake,
    yakjuVsCheongju,
    singleMaltVsBlended,

    // 9. Regional Sub-Wiki Pages (KO + EN)
    scotchWhiskyRegions,
    usWhiskeyRegions,
    brandyRegions,
    redWineRegions,
    whiteWineRegions,

    // 10. Wine Grapes (Hubs & Varieties)
    redGrapeHub,
    whiteGrapeHub,
    ...RED_WINE_GRAPES,
    ...WHITE_WINE_GRAPES,
]

/** slug로 카테고리 조회 */
export function getSpiritCategory(slug: string): SpiritCategory | undefined {
    return SPIRIT_CATEGORIES.find((c) => c.slug === slug)
}
