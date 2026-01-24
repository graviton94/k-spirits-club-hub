import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(process.cwd(), 'lib/db/ingested-data.json');
const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

// Helper to get last modified time
function getLastModified(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return stats.mtime;
        }
    } catch (e) {
        return null;
    }
    return null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'status') {
        const importedFile = path.join(DATA_DIR, 'raw_imported'); // Directory
        const spiritsFile = path.join(DATA_DIR, 'spirits_soju.json'); // Sample file for domestic
        const dbFile = DB_FILE;

        // Estimate last run times
        const lastImported = getLastModified(path.join(DATA_DIR, 'raw_imported')) || null;
        const lastDomestic = getLastModified(path.join(DATA_DIR, 'spirits_소주.json')) || null; // Check one representative file
        const lastIngested = getLastModified(DB_FILE) || null;

        return NextResponse.json({
            lastImported,
            lastDomestic,
            lastIngested
        });
    }

    // Read raw file content (careful with size, maybe limit or just use for specific files)
    if (action === 'read_raw') {
        const type = searchParams.get('type'); // 'ingested' or specific raw file
        if (type === 'ingested') {
            if (fs.existsSync(DB_FILE)) {
                // Only read first 10KB to avoid crash if just checking, or verify size
                const stats = fs.statSync(DB_FILE);
                if (stats.size > 50 * 1024 * 1024) { // 50MB limit
                    return NextResponse.json({ error: 'File too large to view directly' }, { status: 400 });
                }
                const content = fs.readFileSync(DB_FILE, 'utf-8');
                return NextResponse.json({ content });
            }
            return NextResponse.json({ content: '[]' });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'run_imported') {
            // Run fetch_imported_food.py
            try {
                const { stdout, stderr } = await execAsync(`python "${path.join(SCRIPTS_DIR, 'fetch_imported_food.py')}"`);
                return NextResponse.json({ success: true, logs: stdout, errorLogs: stderr });
            } catch (error: any) {
                return NextResponse.json({ error: 'Script execution failed', details: error.message }, { status: 500 });
            }
        }

        if (action === 'run_domestic') {
            // Run fetch_food_safety.py
            try {
                const { stdout, stderr } = await execAsync(`python "${path.join(SCRIPTS_DIR, 'fetch_food_safety.py')}"`);
                return NextResponse.json({ success: true, logs: stdout, errorLogs: stderr });
            } catch (error: any) {
                return NextResponse.json({ error: 'Script execution failed', details: error.message }, { status: 500 });
            }
        }

        if (action === 'run_reviews_gemini') {
            // Run fetch_reviews_gemini.py
            try {
                const { stdout, stderr } = await execAsync(`python "${path.join(SCRIPTS_DIR, 'fetch_reviews_gemini.py')}"`);
                return NextResponse.json({ success: true, logs: stdout, errorLogs: stderr });
            } catch (error: any) {
                return NextResponse.json({ error: 'Script execution failed', details: error.message }, { status: 500 });
            }
        }

        if (action === 'merge_ingest') {
            // Simple merge of all JSON files in data/ and data/raw_imported/
            try {
                const allData: any[] = [];

                // 1. Domestic
                if (fs.existsSync(DATA_DIR)) {
                    const files = fs.readdirSync(DATA_DIR);
                    for (const file of files) {
                        if (file.startsWith('spirits_') && file.endsWith('.json')) {
                            const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
                            try {
                                const json = JSON.parse(content);
                                if (Array.isArray(json)) allData.push(...json);
                            } catch (e) { }
                        }
                    }
                }

                // 2. Imported
                const importedDir = path.join(DATA_DIR, 'raw_imported');
                if (fs.existsSync(importedDir)) {
                    const files = fs.readdirSync(importedDir);
                    for (const file of files) {
                        if (file.endsWith('.json')) {
                            const content = fs.readFileSync(path.join(importedDir, file), 'utf-8');
                            try {
                                const json = JSON.parse(content);
                                if (Array.isArray(json)) allData.push(...json);
                            } catch (e) { }
                        }
                    }
                }

                // Deduplicate by ID
                const uniqueMap = new Map();
                allData.forEach(item => uniqueMap.set(item.id, item));
                const uniqueData = Array.from(uniqueMap.values());

                fs.writeFileSync(DB_FILE, JSON.stringify(uniqueData, null, 2), 'utf-8');

                return NextResponse.json({ success: true, count: uniqueData.length });
            } catch (error: any) {
                console.error('Merge error:', error);
                return NextResponse.json({ error: 'Merge failed', details: error.message }, { status: 500 });
            }
        }

        if (action === 'reset_all') {
            // Delete DB_FILE
            try {
                if (fs.existsSync(DB_FILE)) {
                    fs.writeFileSync(DB_FILE, '[]', 'utf-8');
                }
                return NextResponse.json({ success: true });
            } catch (error: any) {
                return NextResponse.json({ error: 'Reset failed', details: error.message }, { status: 500 });
            }
        }

        // Save Raw Content
        if (action === 'save_raw') {
            const { content } = body;
            try {
                // Validate JSON
                JSON.parse(content);
                fs.writeFileSync(DB_FILE, content, 'utf-8');
                return NextResponse.json({ success: true });
            } catch (error: any) {
                return NextResponse.json({ error: 'Invalid JSON', details: error.message }, { status: 400 });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
