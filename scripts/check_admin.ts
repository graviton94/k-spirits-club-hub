import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getDC, dbUpsertUser } from '../lib/db/data-connect-client';

async function verifyAndGrantAdmin() {
  const targetUid = 'fiO8qf1PjLZAPBNcJmvy1cpqrY52';
  const targetEmail = 'ruahn49@gmail.com';
  
  console.log(`🔍 Checking relational status for UID: ${targetUid}...`);
  
  try {
    // We'll use the upsert mutation to force-set the ADMIN role
    // This ensures that even if the user record doesn't exist yet, it's created correctly.
    const result = await dbUpsertUser({
      id: targetUid,
      email: targetEmail,
      nickname: '묵직한 아드벡#8969',
      profileImage: '/icons/user/user-8.webp',
      role: 'ADMIN',
      themePreference: 'light',
      isFirstLogin: false
    });
    
    console.log('✅ Relational Update Result:', result);
    console.log(`🎉 Success! User ${targetUid} has been confirmed as ADMIN in the PostgreSQL database.`);
    
  } catch (error) {
    console.error('❌ Error updating admin status:', error);
  }
}

verifyAndGrantAdmin();
