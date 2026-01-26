const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// Initialize Firebase Admin
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("Error: FIREBASE_PROJECT_ID is not set.");
    process.exit(1);
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

const db = admin.firestore();

// Normalization Mapping for Regions
const regionMapping = {
    "Speyside": "스페이사이드",
    "Highland": "하이랜드",
    "Scotland": "스코틀랜드",
    "Islay": "아일라",
    "Kentucky": "켄터키",
    // "스코틀랜드": "스코틀랜드", // Same
    "미국": "미국", // Same
    "Japan": "일본",
    // "undefined": skip
    "Kentucky, USA": "켄터키",
    "Highlands": "하이랜드",
    "Speyside, Scotland": "스페이사이드",
    "대한민국": "대한민국", // Same
    "Taiwan": "대만",
    "충청북도": "충청북도", // Same
    "Ireland": "아일랜드",
    "스페이사이드": "스페이사이드", // Same
    "이탈리아": "이탈리아", // Same
    // "켄터키": "켄터키", // Same
    "프랑스": "프랑스", // Same
    "Highlands, Scotland": "하이랜드",
    "제주도": "제주",
    "Campbeltown": "캠벨타운",
    // "내변산": "내변산", // Same
    // "대전": "대전", // Same
    "Islay, Scotland": "아일라",
    "Lowland": "로우랜드",
    // "일본": "일본", // Same
    "벨기에": "벨기에", // Same
    // "안동": "안동", // Same
    "독일": "독일", // Same
    // "경상남도": "경상남도", // Same
    "Netherlands": "네덜란드",
    "Islands": "아일랜드(Islands)",
    // "아일라": "아일라", // Same
    "USA": "미국",
    // "하이랜드": "하이랜드", // Same
    // "부르고뉴": "부르고뉴", // Same
    "Rioja, Spain": "리오하",
    // "제주": "제주", // Same
    "Tennessee": "테네시",
    "Belgium": "벨기에",
    "스페인": "스페인", // Same
    "토스카나": "토스카나", // Same
    "프랑스, 샤블리": "샤블리",
    "Isle of Skye": "스카이 섬",
    "Canada": "캐나다",
    "Island": "아일랜드(Islands)",
    "England": "잉글랜드",
    "하이랜드(Highland)": "하이랜드",
    "China": "중국",
    // "아일랜드": "아일랜드", // Same
    // "N/A": skip,
    "호주": "호주", // Same
    // "강산": "강산", // Same
    "Burgundy, France": "부르고뉴",
    "Highland, Scotland": "하이랜드",
    "Philippines": "필리핀",
    "Isle of Skye, Scotland": "스카이 섬",
    // "히로시마": "히로시마", // Same
    "캠벨타운(Campbeltown)": "캠벨타운",
    "Vietnam": "베트남",
    // "(공백)": skip,
    "Isle of Raasay": "라세이 섬",
    "부르고뉴, 프랑스": "부르고뉴",
    "칠레": "칠레", // Same
    "Champagne, France": "샴페인",
    // "경기도": "경기도", // Same
    // "Unknown": skip,
    "Lowlands": "로우랜드",
    "Spain": "스페인",
    "스카치": "스코틀랜드",
    "Isle of Mull": "멀 섬",
    // "니가타": "니가타", // Same
    "Yamazaki, Japan": "야마자키",
    // "야마나시": "야마나시", // Same
    // "필리핀": "필리핀", // Same
    "체코": "체코", // Same
    "스코틀랜드 아일라": "아일라",
    "핀란드": "핀란드", // Same
    "태국": "태국", // Same
    "중국": "중국", // Same
    "Denmark": "덴마크",
    "Sweden": "스웨덴",
    "Germany": "독일",
    // "보르도": "보르도", // Same
    // "샴페인": "샴페인", // Same
    "웨스턴 케이프, 남아프리카 공화국": "웨스턴 케이프",
    "마콩, 프랑스": "마콩",
    "조지아": "조지아", // Same
    "프랑스, 부르고뉴": "부르고뉴",
    // "샤블리": "샤블리", // Same
    "California, USA": "캘리포니아",
    // "울산": "울산", // Same
    // "창원": "창원", // Same
    "대전광역시": "대전",
    "Yoichi, Japan": "요이치",
    "Miyagikyo, Japan": "미야기쿄",
    // "캠벨타운": "캠벨타운", // Same
    "North America": "북미",
    "France": "프랑스",
    // "대만": "대만", // Same
    "Czech Republic": "체코",
    "Isle of Jura, Scotland": "쥬라 섬",
    "Australia": "호주",
    "Fujian": "푸젠",
    "Isle of Arran, Scotland": "아란 섬",
    // "스카이 섬": "스카이 섬", // Same
    // "미상": skip
    "오키나와": "오키나와", // Same
    "일본(Japan)": "일본",
    "북아일랜드(Northern Ireland)": "북아일랜드",
    "스페이사이드(Speyside)": "스페이사이드",
    "Isle of Islay, Scotland": "아일라",
    // "로우랜드": "로우랜드", // Same
    "Tennessee, USA": "테네시",
    // "캐나다": "캐나다", // Same
    "Yamanashi": "야마나시",
    "터키": "터키", // Same
    "덴마크": "덴마크", // Same
    "Italy": "이탈리아",
    "베트남": "베트남", // Same
    "Skye": "스카이 섬",
    "멕시코": "멕시코", // Same
    "Speyside / Jerez": "스페이사이드",
    "인도": "인도", // Same
    "피에몬테": "피에몬테", // Same
    "남아프리카 공화국": "남아프리카 공화국", // Same
    "멘도사": "멘도사", // Same
    "카오르, 프랑스": "카오르",
    "론, 프랑스": "론",
    "사우스 오스트레일리아, 호주": "사우스 오스트레일리아",
    "Netherlands/Vietnam": "네덜란드/베트남",
    "루아르": "루아르", // Same
    "Martinborough, New Zealand": "마틴버러",
    "Kakheti, Georgia": "카헤티",
    "Beaujolais, France": "보졸레",
    "Cote de Nuits, France": "꼬뜨 드 뉘",
    "Savigny-les-Beaune, France": "사비니 레 본",
    "Bordeaux, France": "보르도",
    "Vittoria, Italy": "비토리아",
    "아르헨티나": "아르헨티나", // Same
};

// Values explicitly marked to be skipped/ignored (not updated, or handled as null?)
// The user said "(제외)", which implies we might want to keep them as is OR set to null.
// Usually "Normalization" implies standardizing known values. If "undefined" or empty, we leave it.
const skipValues = new Set([
    "undefined", "N/A", "(공백)", "", "Unknown", "미상"
]);

async function normalizeRegions() {
    try {
        console.log("Starting Region Normalization...");
        const spiritsRef = db.collection('spirits');
        const snapshot = await spiritsRef.get();

        let batch = db.batch();
        let ops = 0;
        let updatedCount = 0;
        const BATCH_LIMIT = 400;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const originalRegion = data.region;

            // Handle missing/empty
            if (!originalRegion) continue;

            const trimmed = String(originalRegion).trim();
            if (skipValues.has(trimmed) || skipValues.has(originalRegion)) continue;

            // Check if mapping exists
            if (regionMapping.hasOwnProperty(trimmed)) {
                const newRegion = regionMapping[trimmed];

                // Only update if different
                if (newRegion !== originalRegion) {
                    batch.update(doc.ref, {
                        region: newRegion,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    ops++;
                    updatedCount++;
                }
            }

            if (ops >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`Committed batch of ${ops} updates.`);
                batch = db.batch();
                ops = 0;
            }
        }

        if (ops > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${ops} updates.`);
        }

        console.log("Region Normalization Complete.");
        console.log(`Total documents updated: ${updatedCount}`);

    } catch (error) {
        console.error("Normalization failed:", error);
        process.exit(1);
    }
}

normalizeRegions();
