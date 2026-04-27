
import { getGoogleAccessToken } from '../lib/auth/google-auth';
import { getEnv } from '../lib/env';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    });
}
loadEnv();

async function checkOne() {
    const projectId = getEnv('FIREBASE_PROJECT_ID');
    const accessToken = await getGoogleAccessToken();
    const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/asia-northeast3/services/k-spirits-club-hub:executeGraphql`;
    
    // Check '의령부자촌생막걸리' id: fsk-200600150242
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `query { spirit(id: "fsk-200600150242") { name, tastingNote, noseTags, descriptionKo } }`
        })
    });
    const body: any = await res.json();
    console.log(JSON.stringify(body.data?.spirit, null, 2));
}
checkOne();
