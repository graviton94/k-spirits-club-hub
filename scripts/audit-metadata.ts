import { getGoogleAccessToken } from '../lib/auth/google-auth';
import { getEnv } from '../lib/env';
import * as fs from 'fs';
import * as path from 'path';

// Minimal .env loader for local scripts
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const [key, ...rest] = line.split('=');
                if (key && rest.length > 0) {
                    process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
                }
            });
        }
    } catch (e) {}
}

loadEnv();

const DEFAULT_LOCATION = 'asia-northeast3';
const DEFAULT_SERVICE_ID = 'k-spirits-club-hub';

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = getEnv('FIREBASE_PROJECT_ID') || getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    const location = getEnv('DATA_CONNECT_LOCATION') || DEFAULT_LOCATION;
    const serviceId = getEnv('DATA_CONNECT_SERVICE_ID') || DEFAULT_SERVICE_ID;

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

async function runAudit() {
    console.log('🚀 Starting Metadata Field Audit...');
    const query = `
        query auditMetadata($limit: Int) {
            spirits(limit: $limit, where: { metadata: { ne: null } }) {
                id
                name
                metadata
            }
        }
    `;
    
    try {
        const result: any = await executeGraphql('auditMetadata', query, { limit: 50 });
        const spirits = result.data?.spirits || [];
        
        if (spirits.length === 0) {
            console.log('❌ No spirits found with metadata.');
            return;
        }

        const keysMap: Record<string, number> = {};
        const samples: Record<string, any> = {};

        spirits.forEach((s: any) => {
            const meta = s.metadata || {};
            Object.keys(meta).forEach(k => {
                keysMap[k] = (keysMap[k] || 0) + 1;
                if (!samples[k]) samples[k] = meta[k];
            });
        });

        console.log('\n--- Found Metadata Keys ---');
        Object.entries(keysMap).sort((a,b) => b[1] - a[1]).forEach(([k, count]) => {
            const sample = samples[k];
            const sampleStr = typeof sample === 'object' ? JSON.stringify(sample) : String(sample);
            console.log(`[KEY] ${k.padEnd(25)} | COUNT: ${String(count).padStart(3)} | SAMPLE: ${sampleStr.substring(0, 80)}`);
        });

        // Special check for tags and other fields
        const targets = ['nose_tags', 'palate_tags', 'finish_tags', 'distillery', 'bottler', 'abv', 'volume', 'price'];
        console.log('\n--- Target Field Presence in Metadata ---');
        targets.forEach(t => {
            if (keysMap[t]) {
                console.log(`✅ ${t} is present in metadata! (${keysMap[t]} records)`);
            } else {
                console.log(`❌ ${t} not found in metadata.`);
            }
        });

    } catch (e) {
        console.error('Audit failed:', e);
    }
}

runAudit();
