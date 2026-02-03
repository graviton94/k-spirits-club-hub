import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API key found in .env.local");
        return;
    }
    console.log("API Key found (last 4):", key.substring(key.length - 4));
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
        const result = await model.generateContent("Hello, are you there?");
        console.log("Response:", result.response.text());
    } catch (e: any) {
        console.error("API Test Failed:", e.message);
    }
}
test();
