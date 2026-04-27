
import { getGoogleAccessToken } from '../lib/auth/google-auth';
import { getEnv } from '../lib/env';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const [key, ...rest] = line.split('=');
                if (key && rest.length > 0) process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
            });
        }
    } catch (e) {}
}

loadEnv();

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = getEnv('FIREBASE_PROJECT_ID') || getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    const location = getEnv('DATA_CONNECT_LOCATION') || 'asia-northeast3';
    const serviceId = getEnv('DATA_CONNECT_SERVICE_ID') || 'k-spirits-club-hub';
    const accessToken = await getGoogleAccessToken();
    const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${location}/services/${serviceId}`
        },
        body: JSON.stringify({ operationName, query, variables }),
    });
    return await res.json();
}

async function verify() {
    console.log('🔍 Final Verification of Restored Fields...');
    const query = `
        query verifyData {
            spirits(limit: 5, where: { tastingNote: { ne: null } }) {
                name
                tastingNote
                noseTags
                palateTags
                finishTags
                descriptionKo
                metadata
            }
        }
    `;
    const res: any = await executeGraphql('verifyData', query);
    const spirits = res.data?.spirits || [];
    
    if (spirits.length === 0) {
        console.log('❌ Error: No spirits found with tastingNote column populated!');
    } else {
        spirits.forEach((s: any) => {
            console.log(`\n✅ Spirit: ${s.name}`);
            console.log(`   - Tasting Note: ${s.tastingNote?.substring(0, 50)}...`);
            console.log(`   - Nose Tags: ${JSON.stringify(s.noseTags)}`);
            console.log(`   - Meta keys remaining: ${Object.keys(s.metadata || {}).join(', ')}`);
        });
    }
}

verify();
