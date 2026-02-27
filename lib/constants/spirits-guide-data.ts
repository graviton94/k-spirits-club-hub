/**
 * 주류 백과사전 (Spirits Wiki) — 카테고리 데이터
 *
 * 이 파일은 개별 주종 데이터 파일을 통합하는 엔트리 포인트입니다.
 * 상세 데이터는 lib/constants/wiki 디렉토리의 각 파일에서 관리합니다.
 */

import { SpiritCategory } from './wiki/types'
import { whisky } from './wiki/whisky'
import { sake } from './wiki/sake'
import { sojuDistilled } from './wiki/soju-distilled'
import { sojuDiluted } from './wiki/soju-diluted'
import { gin } from './wiki/gin'
import { rum } from './wiki/rum'
import { vodka } from './wiki/vodka'
import { tequila } from './wiki/tequila'
import { wine } from './wiki/wine'
import { champagne } from './wiki/champagne'
import { cognac } from './wiki/cognac'
import { brandy } from './wiki/brandy'
import { baijiu } from './wiki/baijiu'
import { beer } from './wiki/beer'

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
    whisky,
    sake,
    sojuDistilled,
    sojuDiluted,
    gin,
    rum,
    vodka,
    tequila,
    wine,
    champagne,
    cognac,
    brandy,
    baijiu,
    beer
]

/** slug로 카테고리 조회 */
export function getSpiritCategory(slug: string): SpiritCategory | undefined {
    return SPIRIT_CATEGORIES.find((c) => c.slug === slug)
}
