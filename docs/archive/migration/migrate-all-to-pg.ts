import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { getDataConnect } from 'firebase-admin/data-connect';
import { getAppPath } from '../lib/db/path-config';
import { calculateInitialContentRating } from '../lib/utils/content-rating';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Initialize Firebase Admin FIRST
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
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'k-spirits-club-hub';
const paths = getAppPath(APP_ID);

const DC_SERVICE_ID = 'k-spirits-club-hub';
const DC_LOCATION = 'asia-northeast3';
const SYSTEM_USER_ID = 'system-editor-id'; 

const DEFAULT_IMAGE = 'https://kspiritsclub.com/placeholder.png';

async function executeMutation(name: string, variables: any) {
  try {
    const dataConnect = getDataConnect({
      serviceId: DC_SERVICE_ID,
      location: DC_LOCATION,
      connector: 'main'
    });

    const result = await dataConnect.executeMutation(name, variables);
    const anyResult = result as any;
    
    if (anyResult.errors && anyResult.errors.length > 0) {
      throw new Error(`Error in mutation ${name}: ${JSON.stringify(anyResult.errors, null, 2)}`);
    }
    return true;
  } catch (error: any) {
    throw new Error(`Admin SDK error in mutation ${name}: ${error.message}`);
  }
}

function cleanTimestamps(obj: any): any {
  if (!obj) return obj;
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(cleanTimestamps);
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      cleaned[key] = cleanTimestamps(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

async function prepareSystemUser() {
  console.log('--- Preparing System User (Editor) ---');
  const vars = {
    id: SYSTEM_USER_ID,
    nickname: 'K-Spirits Editor',
    role: 'ADMIN',
    isFirstLogin: false
  };
  const success = await executeMutation('upsertUser', vars);
  if (success) {
    console.log('✅ System User Ready.');
  } else {
    throw new Error('❌ Failed to prepare System User.');
  }
}

async function migrateUsers() {
  console.log('--- Migrating Users ---');
  const snapshot = await db.collection(paths.users).get();
  console.log(`Found ${snapshot.size} users.`);

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const vars = {
      id: doc.id,
      email: data.email || null,
      nickname: data.nickname || null,
      profileImage: data.profileImage || null,
      role: data.role || 'USER',
      isFirstLogin: data.isFirstLogin ?? true,
      reviewsWritten: data.reviews_written || 0,
      heartsReceived: data.hearts_received || 0
    };
    const success = await executeMutation('upsertUser', vars);
    if (success) count++;
    if (count % 100 === 0) console.log(`  Processed ${count} users...`);
  }
  console.log(`Finished Users. Total: ${count}`);
}

async function migrateSpirits(limit?: number) {
  console.log(`--- Migrating Spirits (Limit: ${limit || 'Unlimited'}) ---`);
  let query: admin.firestore.Query = db.collection(paths.spirits);
  if (limit) query = query.limit(limit);
  const snapshot = await query.get();
  console.log(`Found ${snapshot.size} spirits.`);

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.imageUrl) data.imageUrl = DEFAULT_IMAGE;

    const variables = {
      id: doc.id,
      name: data.name || 'Untitled Spirit',
      nameEn: data.name_en || null,
      category: data.category || 'Other',
      categoryEn: data.category_en || null,
      mainCategory: data.main_category || null,
      subcategory: data.subcategory || null,
      distillery: data.distillery || null,
      bottler: data.bottler || null,
      abv: typeof data.abv === 'number' ? data.abv : null,
      volume: typeof data.volume === 'number' ? data.volume : null,
      country: data.country || null,
      region: data.region || null,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      descriptionKo: data.description_ko || null,
      descriptionEn: data.description_en || null,
      pairingGuideKo: data.pairing_guide_ko || null,
      pairingGuideEn: data.pairing_guide_en || null,
      noseTags: Array.isArray(data.nose_tags) ? data.nose_tags : [],
      palateTags: Array.isArray(data.palate_tags) ? data.palate_tags : [],
      finishTags: Array.isArray(data.finish_tags) ? data.finish_tags : [],
      tastingNote: data.tasting_note || null,
      status: data.status || null,
      isPublished: !!data.isPublished,
      isReviewed: !!data.isReviewed,
      rating: data.rating || 0.0,
      reviewCount: data.review_count || 0,
      metadata: data.metadata || {}
    };

    const success = await executeMutation('upsertSpirit', variables);
    if (success) {
      count++;
      if (data.isPublished) {
         try {
           const cleanedData = cleanTimestamps(data);
           const ratingInfo = calculateInitialContentRating(cleanedData as any);
           const expertReviewVars = {
             id: uuidv4(),
             spiritId: doc.id,
             userId: SYSTEM_USER_ID,
             rating: Math.round(data.rating || 4),
             title: 'K-Spirits Editor Review',
             content: ratingInfo.expertReview.reviewBody,
             isPublished: true,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString()
           };
           await executeMutation('upsertReview', expertReviewVars);
         } catch (e) {
           // Skip if expert review generation fails
         }
      }
    }
    if (count % 100 === 0) console.log(`  Processed ${count} spirits...`);
  }
  console.log(`Finished Spirits. Total: ${count}`);
}

async function migrateNews() {
  console.log('--- Migrating News ---');
  const snapshot = await db.collection(paths.news).get();
  console.log(`Found ${snapshot.size} news.`);

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const vars = {
      id: doc.id,
      title: data.title || 'Untitled News',
      content: data.content || '',
      imageUrl: data.image_url || null,
      category: data.category || null,
      source: data.source || null,
      link: data.link || null,
      date: data.date || null,
      tags: Array.isArray(data.tags) ? data.tags : []
    };
    const success = await executeMutation('upsertNews', vars);
    if (success) count++;
  }
  console.log(`Finished News. Total: ${count}`);
}

async function main() {
  const isTrial = process.argv.includes('--trial');
  try {
    console.log('🏗️ INITIALIZING PRODUCTION MIGRATION...');
    await prepareSystemUser();
    
    if (isTrial) {
      console.log('🚀 RUNNING TRIAL MIGRATION (LIMIT 5)...');
      await migrateSpirits(5);
    } else {
      console.log('🔥 RUNNING FULL MIGRATION (USERS -> SPIRITS -> NEWS)...');
      await migrateUsers();
      await migrateSpirits();
      await migrateNews();
      console.log('!!! ALL MIGRATIONS COMPLETED !!!');
    }
  } catch (error) {
    console.error('Fatal error during migration:', error);
  }
}

main();
