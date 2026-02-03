import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function test() {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const match = envLocal.match(/GEMINI_API_KEY=(.*)/);
    if (!match) {
        console.error("No key found in .env.local");
        return;
    }
    const key = match[1].trim().replace(/['"]/g, '');
    console.log("Testing .env.local key (last 4):", key.substring(key.length - 4));

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
        const result = await model.generateContent("Hello?");
        console.log("Success! Response:", result.response.text());
    } catch (e: any) {
        console.error("Failed with .env.local key:", e.message);
    }
}
test();
