/**
 * final-audit.ts
 * Directly compares row counts between Firestore and Data Connect.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/final-audit.ts
 */
import * as admin from 'firebase-admin';
import { getDataConnect } from 'firebase-admin/data-connect';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

// ─── Init App ────────────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const dc = getDataConnect({
  serviceId: 'k-spirits-club-hub',
  location: 'asia-northeast3',
  connector: 'main',
});

// ─── ANSI Helpers ────────────────────────────────────────────────────────────
const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;

async function getFirestoreCount(collection: string) {
  const snap = await db.collection(collection).count().get();
  return snap.data().count;
}

async function getDcCount(operationName: string, field: string) {
  const res = await dc.executeQuery(operationName, {});
  return ((res as any).data[field] ?? []).length;
}

async function main() {
  console.log(BOLD('\n[PARITY AUDIT: FIRESTORE vs DATA CONNECT]'));
  
  const targets = [
    { label: 'Spirits',  fsColl: 'spirits',       dcOp: 'auditAllSpirits',  dcField: 'spirits' },
    { label: 'Users',    fsColl: 'users',         dcOp: 'auditAllUsers',    dcField: 'users' },
    { label: 'News',     fsColl: 'news',          dcOp: 'auditAllNews',     dcField: 'newsArticles' },
    { label: 'Reviews',  fsColl: 'spiritReviews', dcOp: 'auditAllReviews',  dcField: 'spiritReviews' },
  ];

  let totalFailed = 0;

  for (const t of targets) {
    try {
      const fsCount = await getFirestoreCount(t.fsColl);
      const dcCount = await getDcCount(t.dcOp, t.dcField);
      
      const diff = dcCount - fsCount;
      const ok = diff === 0 || (t.label === 'Users' && diff >= 0); // Users might have 1 extra (system/admin)

      console.log(`${BOLD(t.label.padEnd(8))} | Firestore: ${fsCount.toString().padEnd(5)} | Data Connect: ${dcCount.toString().padEnd(5)} | ${ok ? GREEN('MATCH') : RED('DIFF: ' + diff)}`);
      if (!ok) totalFailed++;
    } catch (e: any) {
      console.log(`${BOLD(t.label.padEnd(8))} | ${RED('ERROR: ' + e.message)}`);
      totalFailed++;
    }
  }

  console.log(BOLD('\n════════════════════════════════════════'));
  if (totalFailed === 0) {
    console.log(GREEN('  ✓ ALL CORE DATA IS IN SYNC'));
  } else {
    console.log(RED(`  ✗ ${totalFailed} DISCREPANCIES FOUND`));
  }
  console.log(BOLD('════════════════════════════════════════\n'));

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(e => { console.error(RED('FATAL: ' + e.message)); process.exit(1); });
