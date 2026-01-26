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

// Normalization Mapping for Subcategories
const subcategoryMapping = {
    // Whisky - Single Malt
    "싱글 몰트 위스키": "싱글 몰트 위스키",
    "Single Malt Scotch Whisky": "싱글 몰트 위스키",
    "Single Malt": "싱글 몰트 위스키",
    "싱글 몰트": "싱글 몰트 위스키",
    "싱글 몰트 스카치 위스키": "싱글 몰트 위스키",
    "싱글몰트 위스키": "싱글 몰트 위스키",
    "Single Malt Whisky": "싱글 몰트 위스키",
    "싱글몰트": "싱글 몰트 위스키",
    "싱글 몰트 위스키(Single Malt Whisky)": "싱글 몰트 위스키",
    "싱글몰트 스카치 위스키": "싱글 몰트 위스키",

    // Whisky - Blended
    "블렌디드 위스키": "블렌디드 위스키",
    "Blended Scotch Whisky": "블렌디드 위스키",
    "블렌디드": "블렌디드 위스키",
    "블렌디드 스카치 위스키": "블렌디드 위스키",
    "블렌디드 스카치": "블렌디드 위스키",
    "Blended Whisky": "블렌디드 위스키",
    "Blended Scotch": "블렌디드 위스키",
    "Blended": "블렌디드 위스키",
    "블렌디드 위스키(Blended Whisky)": "블렌디드 위스키",

    // Whisky - Bourbon
    "버번 위스키": "버번 위스키",
    "Bourbon Whiskey": "버번 위스키",
    "버번": "버번 위스키",
    "Bourbon": "버번 위스키",
    "Kentucky Straight Bourbon Whiskey": "버번 위스키",

    // Whisky - Rye
    "라이 위스키": "라이 위스키",
    "Rye Whiskey": "라이 위스키",

    // Whisky - Blended Malt
    "블렌디드 몰트 위스키": "블렌디드 몰트 위스키",
    "Blended Malt Scotch Whisky": "블렌디드 몰트 위스키",
    "Blended Malt": "블렌디드 몰트 위스키",
    "블렌디드몰트": "블렌디드 몰트 위스키",
    "Blended Malt Whisky": "블렌디드 몰트 위스키",
    "블렌디드 몰트": "블렌디드 몰트 위스키",
    "블렌디드 몰트 스카치 위스키": "블렌디드 몰트 위스키",

    // Whisky - Grain
    "싱글 그레인 스카치 위스키": "그레인 위스키",
    "Blended Grain Whisky": "그레인 위스키",
    "Single Grain Whisky": "그레인 위스키",
    "Single Grain Scotch Whisky": "그레인 위스키",
    "Single Grain": "그레인 위스키",
    "Single Grain Whiskey": "그레인 위스키",
    "싱글 그레인 위스키(Single Grain Whisky)": "그레인 위스키",
    "싱글 그레인 위스키": "그레인 위스키",
    "Blended Grain": "그레인 위스키",

    // Whisky - Others
    "월드 몰트 위스키": "월드 위스키",
    "월드 위스키": "월드 위스키",
    "필리핀 위스키": "월드 위스키",
    "World Malt Whisky": "월드 위스키",
    "싱글 캐스크 위스키": "싱글 캐스크 위스키",
    "Single Cask Whisky": "싱글 캐스크 위스키",
    "Pure Malt Whisky": "퓨어 몰트 위스키",
    "퓨어 몰트 위스키": "퓨어 몰트 위스키",
    "캐나다 위스키": "캐나디안 위스키",
    "캐나디안 위스키": "캐나디안 위스키",
    "테네시 위스키": "테네시 위스키",
    "Tennessee Whiskey": "테네시 위스키",
    "아이리쉬 위스키": "아이리쉬 위스키",
    "Irish Whiskey": "아이리쉬 위스키",
    "Single Pot Still Whiskey": "싱글 팟 스틸 위스키",
    "Single Pot Still": "싱글 팟 스틸 위스키",
    "American Whiskey": "아메리칸 위스키",
    "Whiskey": "아메리칸 위스키",
    "Sour Mash Whiskey": "사워 매쉬 위스키",
    "사워 매쉬 위스키": "사워 매쉬 위스키",

    // Wine
    "레드 와인": "레드 와인",
    "화이트 와인": "화이트 와인",
    "스파클링 와인": "스파클링 와인",
    "로제 스파클링 와인": "스파클링 와인",
    "샴페인": "스파클링 와인",
    "베르무트": "베르무트",

    // Soju
    "증류식 소주": "증류식 소주",
    "오크 숙성 소주": "증류식 소주",
    "희석식 소주": "희석식 소주",
    "담금 소주": "담금 소주",
    "주정": "주정",
    "담금주": "담금주",

    // Beer - Lager/Pilsner
    "라거": "라거",
    "라거 (Lager)": "라거",
    "Lager": "라거",
    "페일 라거": "라거",
    "헬레스 (Helles)": "라거",
    "드라이 라거 (Dry Lager)": "라거",
    "다크 라거": "라거",
    "라이트 라거": "라거",
    "페일 라거 (Pale Lager)": "라거",
    "필스너": "필스너",
    "필스너 (Pilsner)": "필스너",

    // Beer - Ale/IPA/Stout/Etc
    "스타우트": "스타우트",
    "스타우트 (Stout)": "스타우트",
    "임페리얼 스타우트 (Imperial Stout)": "스타우트",
    "포터 (Porter)": "스타우트",

    "IPA": "IPA",
    "IPA (India Pale Ale)": "IPA",
    "아이피에이 (IPA)": "IPA",

    "밀맥주": "밀맥주",
    "Witbier": "밀맥주",
    "밀맥주 (Wheat Beer)": "밀맥주",
    "밀맥주 (Weissbier)": "밀맥주",
    "바이젠": "밀맥주",
    "윗비어": "밀맥주",

    "사워 에일": "사워 에일",
    "괴즈": "사워 에일",
    "플래미쉬 레드 에일": "사워 에일",
    "람빅": "사워 에일",

    "에일": "에일",
    "Fruit Beer": "에일",
    "스코티쉬 에일 (Scottish Ale)": "에일",
    "에일 (Ale)": "에일",
    "쾰쉬": "에일",
    "프루트 에일 (Fruit Ale)": "에일",
    "세종": "에일",

    "페일 에일": "페일 에일",
    "Pale Ale": "페일 에일",
    "페일 에일 (Pale Ale)": "페일 에일",

    "스트롱 에일": "스트롱 에일",
    "벨지안 스트롱 에일": "스트롱 에일",
    "스트롱 에일 (Strong Ale)": "스트롱 에일",
    "벨지안 다크 스트롱 에일": "스트롱 에일",
    "쿼드루펠": "스트롱 에일",

    "벨지안 블론드 에일": "벨지안 블론드 에일",
    "Belgian Blonde Ale": "벨지안 블론드 에일",

    "벨지안 트리펠": "벨지안 트리펠",
    "트리펠": "벨지안 트리펠",

    "배럴 에이지드 맥주": "기타 맥주",

    // General
    "일반/기타 주류 가이드": "기타 주류",
};

// Values explicitly marked to be skipped
const skipValues = new Set([
    "undefined", "undefined", "(제외)", ""
]);

async function normalizeSubcategories() {
    try {
        console.log("Starting Subcategory Normalization...");
        const spiritsRef = db.collection('spirits');
        const snapshot = await spiritsRef.get();

        let batch = db.batch();
        let ops = 0;
        let updatedCount = 0;
        const BATCH_LIMIT = 400;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const originalSub = data.subcategory;

            // Handle missing/empty
            if (!originalSub) continue;

            const trimmed = String(originalSub).trim();
            if (skipValues.has(trimmed) || skipValues.has(originalSub)) continue;

            // Check if mapping exists
            if (subcategoryMapping.hasOwnProperty(trimmed)) {
                const newSub = subcategoryMapping[trimmed];

                // Only update if different
                if (newSub !== originalSub) {
                    batch.update(doc.ref, {
                        subcategory: newSub,
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

        console.log("Subcategory Normalization Complete.");
        console.log(`Total documents updated: ${updatedCount}`);

    } catch (error) {
        console.error("Normalization failed:", error);
        process.exit(1);
    }
}

normalizeSubcategories();
