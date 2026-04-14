import * as dotenv from 'dotenv';
import path from 'path';

// Load from .env in the root directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log('✅ Environment loaded from .env');
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  console.warn('⚠️ FIREBASE_CLIENT_EMAIL missing from environment!');
}
