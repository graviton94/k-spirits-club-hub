import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load envs manually because we are running with tsx
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) {
    const localConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    for (const k in localConfig) {
        process.env[k] = localConfig[k];
    }
}

const GOOGLE_NEWS_API_KEY = process.env.GOOGLE_NEWS_API_KEY;
const CX_ID = process.env.GOOGLE_NEWS_CX_ID;

console.log('--- Config Check ---');
console.log('GOOGLE_NEWS_API_KEY:', GOOGLE_NEWS_API_KEY ? `${GOOGLE_NEWS_API_KEY.slice(0, 8)}...` : 'MISSING');
console.log('GOOGLE_NEWS_CX_ID:', CX_ID);
console.log('--------------------');

async function testSearch() {
    if (!GOOGLE_NEWS_API_KEY || !CX_ID) {
        console.error('Missing API Key or CX ID');
        return;
    }

    const query = 'test';
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_NEWS_API_KEY}&cx=${CX_ID}&q=${query}`;

    console.log(`Fetching: ${searchUrl.replace(GOOGLE_NEWS_API_KEY, 'HIDDEN_KEY')}`);

    try {
        const res = await fetch(searchUrl);
        console.log('Status:', res.status, res.statusText);

        const data = await res.json();
        if (!res.ok) {
            console.error('❌ API Error Body:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ Success! Found items:', data.items?.length || 0);
        }
    } catch (e) {
        console.error('❌ Network/Fetch Error:', e);
    }
}

testSearch();
