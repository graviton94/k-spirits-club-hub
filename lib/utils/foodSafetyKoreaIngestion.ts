/**
 * Food Safety Korea (식품안전나라) API Ingestion Utility
 * Refer to: http://openapi.foodsafetykorea.go.kr/
 */

const API_KEY = process.env.FOOD_SAFETY_KOREA_API_KEY;
const BASE_URL = 'http://openapi.foodsafetykorea.go.kr/api';

/**
 * List of spirit categories to fetch from Food Safety Korea
 */
export const SPIRIT_TYPES = [
  '소주',
  '맥주',
  '위스키',
  '기타주류',
  '청주',
  '약주',
  '탁주',
  '과실주',
  '리큐르',
  '브랜디',
  '일반증류주'
];

interface FoodSafetyRawData {
  PRDLST_NM: string;    // 제품명
  BSSH_NM: string;      // 제조사
  PRDLST_DCNM: string;  // 유형
  POG_DAYCNT: string;   // 유통/소비기한
  [key: string]: any;
}

export interface MappedSpiritData {
  제품명: string;
  제조사: string;
  유형: string;
  유통기한: string;
  원본데이터: FoodSafetyRawData;
}

/**
 * Fetches spirits data from Food Safety Korea API with pagination
 */
export async function ingestFoodSafetyData() {
  if (!API_KEY) {
    console.error('❌ 에러: FOOD_SAFETY_KOREA_API_KEY가 .env 파일에 설정되어 있지 않습니다.');
    return;
  }

  const results: MappedSpiritData[] = [];

  for (const type of SPIRIT_TYPES) {
    let startIdx = 1;
    let endIdx = 1000;
    let hasMore = true;
    let totalCollectedForType = 0;

    console.log(`\n🔍 [${type}] 데이터 수집 시작...`);

    try {
      while (hasMore) {
        // Build URL: http://openapi.foodsafetykorea.go.kr/api/{apiKey}/I1250/json/{startIdx}/{endIdx}/PRDLST_DCNM={주종}
        const encodedType = encodeURIComponent(type);
        const url = `${BASE_URL}/${API_KEY}/I1250/json/${startIdx}/${endIdx}/PRDLST_DCNM=${encodedType}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
        }

        const json = await response.json();

        // Check if API returned an error or empty result
        const serviceResult = json.I1250;

        if (!serviceResult || serviceResult.RESULT?.CODE !== 'INFO-000') {
          if (serviceResult?.RESULT?.CODE === 'INFO-200') {
            // No more data
            hasMore = false;
            continue;
          }
          throw new Error(`API 내부 에러: ${serviceResult?.RESULT?.MSG || '알 수 없는 에러'}`);
        }

        const rows: FoodSafetyRawData[] = serviceResult.row || [];

        if (rows.length === 0) {
          hasMore = false;
          continue;
        }

        // Map data to Korean fields
        const mappedRows: MappedSpiritData[] = rows.map(row => ({
          제품명: row.PRDLST_NM,
          제조사: row.BSSH_NM,
          유형: row.PRDLST_DCNM,
          유통기한: row.POG_DAYCNT,
          원본데이터: row
        }));

        results.push(...mappedRows);
        totalCollectedForType += rows.length;

        // If we got fewer than 1000 items, it's the last page
        if (rows.length < 1000) {
          hasMore = false;
        } else {
          startIdx += 1000;
          endIdx += 1000;

          // Safety break to prevent infinite loops (max 100,000 records per type for now)
          if (startIdx > 100000) {
            console.warn(`⚠️ 경고: [${type}] 데이터가 너무 많아 10만 건에서 중단합니다.`);
            hasMore = false;
          }
        }
      }

      console.log(`✅ [${type}]: ${totalCollectedForType.toLocaleString()}건 수집 완료`);
    } catch (error: any) {
      console.error(`❌ [${type}] 데이터 수집 중 에러 발생: ${error.message}`);
    }
  }

  console.log(`\n🎉 모든 수집 작업 완료. 총 ${results.length.toLocaleString()}건의 데이터를 처리했습니다.`);
  return results;
}
