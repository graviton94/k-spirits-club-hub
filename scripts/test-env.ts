import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING');
console.log('PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'FOUND' : 'MISSING');
console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
