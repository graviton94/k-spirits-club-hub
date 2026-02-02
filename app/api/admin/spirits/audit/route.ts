import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { spirit } = await req.json();

        if (!spirit) {
            return NextResponse.json({ error: 'Missing spirit data' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are a spirits expert and database auditor. Analyze the following spirit data for inconsistencies or missing information.
        
        **Spirit Data:**
        - Name: ${spirit.name}
        - Category: ${spirit.category}
        - Subcategory: ${spirit.subcategory || 'Unknown'}
        - ABV: ${spirit.abv}%
        - Country: ${spirit.country || 'Unknown'}
        - Region: ${spirit.region || 'Unknown'}
        - Distillery: ${spirit.distillery || 'Unknown'}
        
        **Audit Checklist:**
        1. Does the ABV seem correct for this type of spirit? (e.g., standard whisky is usually 40-60%)
        2. Is the Distillery/Producer correctly associated with the Region and Country?
        3. Is the Name consistent with the Category/Subcategory?
        4. Suggest corrections for any inconsistencies found.
        
        **Output JSON (Strictly):**
        {
            "status": "PASS" | "WARNING" | "FAIL",
            "issues": ["Issue 1", "Issue 2"],
            "suggestions": {
                "country": "Correct Country if any",
                "region": "Correct Region if any",
                "distillery": "Correct Distillery if any",
                "abv": "Correct ABV if any"
            },
            "confidence": 0.0 - 1.0,
            "reasoning": "Brief explanation"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        if (text.startsWith('```json')) text = text.slice(7);
        if (text.startsWith('```')) text = text.slice(3);
        if (text.endsWith('```')) text = text.slice(0, -3);

        const auditResult = JSON.parse(text.trim());

        return NextResponse.json(auditResult);
    } catch (error: any) {
        return NextResponse.json({ error: 'Audit failed', details: error.message }, { status: 500 });
    }
}
