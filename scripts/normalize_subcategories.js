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
    // Whisky - Scotch
    "싱글 몰트 위스키": "싱글 몰트 스카치 위스키",
    "Single Malt Scotch Whisky": "싱글 몰트 스카치 위스키",
    "Single Malt": "싱글 몰트 스카치 위스키",
    "싱글 몰트": "싱글 몰트 스카치 위스키",
    "싱글 몰트 스카치 위스키": "싱글 몰트 스카치 위스키",
    "싱글몰트 위스키": "싱글 몰트 스카치 위스키",
    "Single Malt Whisky": "싱글 몰트 스카치 위스키",
    "싱글몰트": "싱글 몰트 스카치 위스키",
    "싱글 몰트 위스키(Single Malt Whisky)": "싱글 몰트 스카치 위스키",
    "싱글몰트 스카치 위스키": "싱글 몰트 스카치 위스키",

    "블렌디드 위스키": "블렌디드 스카치 위스키",
    "Blended Scotch Whisky": "블렌디드 스카치 위스키",
    "블렌디드": "블렌디드 스카치 위스키",
    "블렌디드 스카치 위스키": "블렌디드 스카치 위스키",
    "블렌디드 스카치": "블렌디드 스카치 위스키",
    "Blended Whisky": "블렌디드 스카치 위스키",
    "Blended Scotch": "블렌디드 스카치 위스키",
    "Blended": "블렌디드 스카치 위스키",
    "블렌디드 위스키(Blended Whisky)": "블렌디드 스카치 위스키",

    "블렌디드 몰트 위스키": "블렌디드 몰트 스카치 위스키",
    "Blended Malt Scotch Whisky": "블렌디드 몰트 스카치 위스키",
    "Blended Malt": "블렌디드 몰트 스카치 위스키",
    "블렌디드몰트": "블렌디드 몰트 스카치 위스키",
    "Blended Malt Whisky": "블렌디드 몰트 스카치 위스키",
    "블렌디드 몰트": "블렌디드 몰트 스카치 위스키",
    "블렌디드 몰트 스카치 위스키": "블렌디드 몰트 스카치 위스키",

    "싱글 그레인 스카치 위스키": "싱글 그레인 스카치 위스키",
    "싱글 그린 스카치 위스키": "싱글 그레인 스카치 위스키", // 이전 오타 수정용
    "그레인 위스키": "싱글 그레인 스카치 위스키",
    "Single Grain Whisky": "싱글 그레인 스카치 위스키",
    "Single Grain Scotch Whisky": "싱글 그레인 스카치 위스키",
    "Single Grain": "싱글 그레인 스카치 위스키",
    "싱글 그레인 위스키": "싱글 그레인 스카치 위스키",

    // Whisky - American
    "버번 위스키": "버번 위스키",
    "Bourbon Whiskey": "버번 위스키",
    "버번": "버번 위스키",
    "Bourbon": "버번 위스키",
    "Kentucky Straight Bourbon Whiskey": "버번 위스키",

    "라이 위스키": "라이 위스키",
    "Rye Whiskey": "라이 위스키",
    "Rye": "라이 위스키",

    "테네시 위스키": "테네시 위스키",
    "Tennessee Whiskey": "테네시 위스키",
    "Tennessee": "테네시 위스키",

    "콘 위스키": "콘 위스키",
    "Corn Whiskey": "콘 위스키",

    // Whisky - World
    "아이리쉬 위스키": "아이리쉬 위스키",
    "Irish Whiskey": "아이리쉬 위스키",
    "일본 위스키": "일본 위스키",
    "Japanese Whisky": "일본 위스키",
    "캐나다 위스키": "캐나다 위스키",
    "Canadian Whisky": "캐나다 위스키",
    "타이완 위스키": "타이완 위스키",
    "Taiwanese Whisky": "타이완 위스키",
    "한국 위스키": "한국 위스키",
    "Korean Whisky": "한국 위스키",

    // Soju
    "증류식 소주": "증류식 소주",
    "오크 숙성 소주": "증류식 소주",
    "희석식 소주": "희석식 소주",

    // Beer
    "필스너": "필스너",
    "필스너 (Pilsner)": "필스너",
    "Pilsner": "필스너",
    "헬레스": "헬레스",
    "헬레스 (Helles)": "헬레스",
    "듄켈": "듄켈",
    "Dunkel": "듄켈",
    "복": "복",
    "Bock": "복",
    "메르첸": "메르첸",

    "페일에일": "페일에일",
    "페일 에일": "페일에일",
    "Pale Ale": "페일에일",
    "IPA": "IPA",
    "벨지안 에일": "벨지안 에일",
    "세종": "세종",
    "Saison": "세종",

    "스타우트": "스타우트",
    "Stout": "스타우트",
    "포터": "포터",
    "Porter": "포터",
    "슈바르츠비어": "슈바르츠비어",

    "밀맥주": "밀맥주",
    "Wheat Beer": "밀맥주",
    "사이트": "사이더",
    "사이더": "사이더",
    "Cider": "사이더",

    // Spirits
    "런던 드라이 진": "런던 드라이 진",
    "플리머스 진": "플리머스 진",
    "보드카": "오리지널 보드카",
    "Vodka": "오리지널 보드카",
    "코냑": "코냑",
    "Cognac": "코냑",
    "깔바도스": "깔바도스",
    "Calvados": "깔바도스",

    // Traditional
    "탁주": "탁주(막걸리)",
    "막걸리": "탁주(막걸리)",
    "약주": "약주",
    "청주": "청주",
    "사케": "사케(니혼슈)",

    // General
    "일반/기타 주류 가이드": "그외주류",
};

// Values explicitly marked to be skipped
const skipValues = new Set([
    "undefined", "undefined", "(제외)", ""
]);

// Normalization Logic Helper
function getNormalizedSubcategory(originalSub) {
    if (!originalSub) return originalSub;
    const trimmed = String(originalSub).trim();
    if (skipValues.has(trimmed) || skipValues.has(originalSub)) return originalSub;

    if (subcategoryMapping.hasOwnProperty(trimmed)) {
        return subcategoryMapping[trimmed];
    }
    return originalSub;
}

// File Processing Mode
async function normalizeLocalFile(filePath) {
    const fs = require('fs');
    try {
        console.log(`📂 Processing local file: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            console.error("File not found.");
            process.exit(1);
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        let items = JSON.parse(rawData);
        if (!Array.isArray(items)) {
            console.error("Input file must be a JSON array.");
            process.exit(1);
        }

        let updatedCount = 0;
        items = items.map(item => {
            const original = item.subcategory;
            const normalized = getNormalizedSubcategory(original);
            if (original !== normalized) {
                item.subcategory = normalized;
                item.normalizedAt = new Date().toISOString();
                updatedCount++;
            }
            return item;
        });

        fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
        console.log(`✅ Normalized ${updatedCount} items in local file.`);
        console.log("Subcategory Normalization Complete (Local).");
    } catch (error) {
        console.error("Error processing local file:", error);
        process.exit(1);
    }
}

// Firestore Processing Mode
// Firestore Processing Mode
async function normalizeFirestore() {
    try {
        console.log("Starting Subcategory Normalization (Firestore)...");

        const collectionPath = 'spirits';
        const spiritsRef = db.collection(collectionPath);

        console.log(`Target Collection: ${collectionPath}`);

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

        console.log("Subcategory Normalization Complete (Firestore).");
        console.log(`Total documents updated: ${updatedCount}`);

    } catch (error) {
        console.error("Normalization failed:", error);
        process.exit(1);
    }
}

// Main Execution Entry Point
const args = process.argv.slice(2);
const fileFlagIndex = args.indexOf('--file');

if (fileFlagIndex !== -1 && args[fileFlagIndex + 1]) {
    // Local File Mode
    normalizeLocalFile(args[fileFlagIndex + 1]);
} else {
    // Default Firestore Mode
    normalizeFirestore();
}
