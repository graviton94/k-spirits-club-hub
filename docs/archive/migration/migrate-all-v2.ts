import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';
import { getDataConnect } from 'firebase-admin/data-connect';

dotenv.config({ path: '.env.local' });
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'k-spirits-club',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';
const KSC_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

// --- Helpers ---
function cleanTimestamps(obj: any): any {
  if (!obj) return new Date().toISOString();
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  return new Date(obj).toISOString();
}

function docIdToUuid(docId: string) {
  if (docId && docId.length === 36 && docId.split('-').length === 5) return docId; 
  return uuidv5(docId, KSC_NAMESPACE);
}

async function executeMutation(name: string, variables: any) {
  try {
    const dataConnect = getDataConnect({
      serviceId: DC_SERVICE_ID,
      location: DC_LOCATION,
      connector: 'main'
    });
    await dataConnect.executeMutation(name, variables);
    return true;
  } catch (error: any) {
    console.error(`Field Error in ${name}:`, JSON.stringify(variables, null, 2));
    throw new Error(`Admin SDK error in mutation ${name}: ${error.message}`);
  }
}

// --- Explicit Mappers (The "Contract") ---

function mapSpiritToSQL(d: any) {
    return {
        id: String(d.id || d.spiritId),
        name: d.name || 'Unnamed Spirit',
        nameEn: d.nameEn || d.name_en || null,
        category: d.category || 'Unknown',
        categoryEn: d.categoryEn || d.category_en || null,
        mainCategory: d.mainCategory || d.main_category || null,
        subcategory: d.subcategory || d.sub_category || null,
        distillery: d.distillery || null,
        bottler: d.bottler || null,
        abv: d.abv ? Number(d.abv) : null,
        volume: d.volume ? Math.round(Number(d.volume)) : null,
        country: d.country || null,
        region: d.region || null,
        imageUrl: d.imageUrl || d.image_url || 'https://placehold.co/400',
        thumbnailUrl: d.thumbnailUrl || d.thumbnail_url || null,
        descriptionKo: d.descriptionKo || d.description || null,
        descriptionEn: d.descriptionEn || d.description_en || null,
        pairingGuideKo: d.pairingGuideKo || d.pairing_guide || null,
        pairingGuideEn: d.pairingGuideEn || d.pairing_guide_en || null,
        noseTags: Array.isArray(d.noseTags) ? d.noseTags : [],
        palateTags: Array.isArray(d.palateTags) ? d.palateTags : [],
        finishTags: Array.isArray(d.finishTags) ? d.finishTags : [],
        tastingNote: d.tastingNote || d.tasting_note || null,
        status: d.status || 'published',
        importer: d.importer || null,
        rawCategory: d.rawCategory || d.raw_category || null,
        isPublished: d.isPublished !== false,
        isReviewed: d.isReviewed === true,
        rating: Number(d.rating || 0),
        reviewCount: Math.round(Number(d.reviewCount || 0)),
        metadata: d.metadata || (d.auditDate ? { auditDate: d.auditDate } : null)
    };
}

function mapReviewToSQL(d: any, docId: string, userId: string) {
    let urls: string[] = [];
    if (Array.isArray(d.imageUrls)) urls = d.imageUrls;
    else if (d.imageUrl) urls = [d.imageUrl];
    else if (d.image_url) urls = [d.image_url];

    return {
        id: docIdToUuid(docId),
        spiritId: String(d.spiritId || d.spirit_id),
        userId: String(userId),
        rating: Math.round(Number(d.rating || 0)),
        title: d.title || (d.spiritName ? `${d.spiritName} 리뷰` : 'Spirit Review'),
        content: String(d.notes || d.content || '내용 없음'),
        nose: d.tagsN || d.nose || (d.ratingN ? String(d.ratingN) : null),
        palate: d.tagsP || d.palate || (d.ratingP ? String(d.ratingP) : null),
        finish: d.tagsF || d.finish || (d.ratingF ? String(d.ratingF) : null),
        likes: Number(d.likes || 0),
        likedBy: Array.isArray(d.likedBy) ? d.likedBy : [],
        isPublished: d.isPublished !== false,
        imageUrls: urls,
        createdAt: cleanTimestamps(d.createdAt),
        updatedAt: cleanTimestamps(d.updatedAt || d.createdAt)
    };
}

function mapNewsToSQL(d: any, id: string) {
    const ko = d.translations?.ko || {};
    return {
        id: String(id),
        title: ko.title || d.originalTitle || 'News',
        content: ko.content || '내용 없음',
        imageUrl: d.imageUrl || d.image_url || null,
        category: d.category || 'Global News',
        source: d.source || 'News',
        link: d.link || '',
        date: d.date || cleanTimestamps(d.createdAt),
        translations: d.translations || null,
        tags: d.tags || null // Shared with newsTags
    };
}

// --- Main Migration Logic ---

async function bigBang() {
    console.log("🚀 STARTING BIG BANG MIGRATION (PHASE 1.5) 🚀");

    const rootUsersSnap = await db.collection('users').get();
    const allUserIds = rootUsersSnap.docs.map(doc => doc.id);

    // 1. Spirits
    console.log("--- 🧊 Migrating Spirits ---");
    const spiritsSnap = await db.collection('spirits').get();
    for (const doc of spiritsSnap.docs) {
        await executeMutation('upsertSpirit', mapSpiritToSQL(doc.data()));
    }
    console.log(`✅ ${spiritsSnap.size} Spirits Migrated.`);

    // 2. Users
    console.log("--- 👤 Migrating Users ---");
    for (const userDoc of rootUsersSnap.docs) {
        const d = userDoc.data();
        // Fetch taste profile from subcoll
        const tasteSnap = await userDoc.ref.collection('taste_data').get();
        const tasteProfile = tasteSnap.docs.map(t => t.data());
        
        await executeMutation('upsertUser', {
            id: userDoc.id,
            email: d.email || null,
            nickname: d.nickname || null,
            profileImage: d.profileImage || d.photoURL || null,
            role: d.role || 'USER',
            isFirstLogin: d.isFirstLogin !== false,
            reviewsWritten: Number(d.reviewsWritten || 0),
            heartsReceived: Number(d.heartsReceived || 0),
            tasteProfile: tasteProfile.length > 0 ? tasteProfile : null
        });
    }
    console.log(`✅ ${rootUsersSnap.size} Users Migrated.`);

    // 3. Isolated Content (Reviews & Cabinet)
    console.log("--- 🕸️ Deep-Crawling Isolated Sub-collections ---");
    for (const userId of allUserIds) {
        const userArtifactRef = db.collection('artifacts').doc(APP_ID).collection('users').doc(userId);
        
        // Reviews
        const revSnap = await userArtifactRef.collection('reviews').get();
        for (const rDoc of revSnap.docs) {
            const payload = mapReviewToSQL(rDoc.data(), rDoc.id, userId);
            if (payload && payload.spiritId) await executeMutation('upsertReview', payload);
        }

        // Cabinet
        const cabSnap = await userArtifactRef.collection('cabinet').get();
        for (const cDoc of cabSnap.docs) {
            const cd = cDoc.data();
            await executeMutation('upsertCabinet', {
                userId,
                spiritId: cd.spiritId || cDoc.id,
                notes: cd.notes || null,
                rating: cd.rating ? Math.round(Number(cd.rating)) : null,
                isFavorite: cd.isFavorite === true,
                addedAt: cleanTimestamps(cd.addedAt || cd.createdAt)
            });
        }
    }
    console.log("✅ Isolated Reviews & Cabinets Migrated.");

    // 4. Global News
    console.log("--- 📰 Migrating News ---");
    const newsRef = db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('news');
    const newsSnap = await newsRef.get();
    for (const nDoc of newsSnap.docs) {
        await executeMutation('upsertNews', mapNewsToSQL(nDoc.data(), nDoc.id));
    }
    console.log(`✅ ${newsSnap.size} News Articles Migrated.`);

    // 5. WorldCup Results
    console.log("--- 🏆 Migrating WorldCup Results ---");
    const wcSnap = await db.collection('worldcup_results').get();
    for (const wDoc of wcSnap.docs) {
        const wd = wDoc.data();
        if(!wd.winnerId && !wd.winner_id) continue;
        await executeMutation('upsertWorldCupResult', {
            id: docIdToUuid(wDoc.id),
            winnerId: String(wd.winnerId || wd.winner_id),
            category: String(wd.category || 'ALL'),
            subcategory: String(wd.subcategory || 'ALL'),
            initialRound: Number(wd.initialRound || 32)
        });
    }
    console.log(`✅ ${wcSnap.size} WorldCup Results Migrated.`);

    console.log("\n🎊 BIG BANG MIGRATION SUCCESSFUL! 🎊");
}

bigBang().catch(console.error);
