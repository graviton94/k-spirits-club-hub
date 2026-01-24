import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Spirit } from '@/lib/db/schema';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// POST /api/admin/pipeline
// Trigger enrichment for specific spirits using Python script
export async function POST(req: NextRequest) {
    try {
        const { spiritIds, action } = await req.json();

        if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
            return NextResponse.json({ error: 'Missing spiritIds' }, { status: 400 });
        }

        console.log(`[Pipeline] Processing ${spiritIds.length} items. Action: ${action || 'ENRICH'}`);

        // 1. Fetch data from DB
        const targets: Spirit[] = [];
        for (const id of spiritIds) {
            const spirit = await db.getSpirit(id);
            if (spirit) targets.push(spirit);
        }

        if (targets.length === 0) {
            return NextResponse.json({ error: 'No valid spirits found' }, { status: 404 });
        }

        // 2. Write to Temp File
        const tempDir = path.join(process.cwd(), 'data', 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const timestamp = Date.now();
        const inputPath = path.join(tempDir, `enrich_in_${timestamp}.json`);
        const outputPath = path.join(tempDir, `enrich_out_${timestamp}.json`);

        fs.writeFileSync(inputPath, JSON.stringify(targets, null, 2), 'utf-8');

        // 3. Execute Python Script
        // Use the generic script we just refactored
        const scriptPath = path.join(process.cwd(), 'scripts', 'enrich_with_gemini.py');
        console.log(`[Pipeline] Executing python script: ${scriptPath}`);

        try {
            const { stdout, stderr } = await execPromise(`python "${scriptPath}" --input "${inputPath}" --output "${outputPath}"`, {
                maxBuffer: 1024 * 1024 * 50 // 50MB buffer
            });
            console.log('[Pipeline] Python Output:', stdout);
            if (stderr) console.warn('[Pipeline] Python Stderr:', stderr);
        } catch (error: any) {
            console.error('[Pipeline] Script Execution Failed:', error);
            return NextResponse.json({ error: 'Python script failed', details: error.message }, { status: 500 });
        }

        // 4. Read Output and Update DB
        if (!fs.existsSync(outputPath)) {
            return NextResponse.json({ error: 'Output file not found after script execution' }, { status: 500 });
        }

        const enrichedData: Spirit[] = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        const results = [];

        for (const item of enrichedData) {
            await db.updateSpirit(item.id, {
                status: 'ENRICHED', // Explicitly set status to enriched
                category: item.category,
                subcategory: item.subcategory,
                // abv, distillery, etc are updated in metadata or top level by script logic
                // The script returns the full object structure for convenience
                metadata: item.metadata,
                // Update specific top-level fields if they changed
                abv: item.abv,
                region: item.region,
                distillery: item.distillery,
                updatedAt: new Date()
            });
            results.push({ id: item.id, status: 'success', name: item.name });
        }

        // Cleanup temp files
        try {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } catch (e) {
            console.warn('[Pipeline] Failed to clean temp files:', e);
        }

        return NextResponse.json({ results, count: results.length });

    } catch (error: any) {
        console.error('API Pipeline Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
