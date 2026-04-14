const dotenv = require('dotenv');
const result = dotenv.config({ path: '.env' });
console.log('Dotenv Result:', result.error ? 'ERROR' : 'SUCCESS');
console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING');
console.log('PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'FOUND' : 'MISSING');
if (process.env.FIREBASE_CLIENT_EMAIL) {
  console.log('Email:', process.env.FIREBASE_CLIENT_EMAIL.substring(0, 10) + '...');
}
