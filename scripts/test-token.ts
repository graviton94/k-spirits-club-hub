const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

async function test() {
  console.log('Testing Service Account Token Generation...');
  try {
    const { getServiceAccountToken } = require('../lib/auth/service-account');
    const token = await getServiceAccountToken();
    console.log('Token generated! (length:', token.length, ')');
  } catch (err) {
    console.error('Error during token generation:', err);
  }
}

test();
