import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { getEnv } from '@/lib/env';

const DEFAULT_MODEL_CANDIDATES = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash'
];

const UNSUPPORTED_MODEL_PATTERNS = [
    'is not found',
    'not found for api version',
    'unsupported model',
    'model not found',
    'invalid model',
    'unknown model',
    '404'
];

export function getGeminiModelCandidates(): string[] {
    const fromEnv = getEnv('GEMINI_MODEL_CANDIDATES');
    if (!fromEnv) return DEFAULT_MODEL_CANDIDATES;

    const parsed = fromEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (parsed.length === 0) return DEFAULT_MODEL_CANDIDATES;

    return Array.from(new Set(parsed));
}

export function isUnsupportedModelError(error: unknown): boolean {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    return UNSUPPORTED_MODEL_PATTERNS.some((pattern) => message.includes(pattern));
}

export async function runWithGeminiModelFallback<T>(args: {
    genAI: GoogleGenerativeAI;
    modelIds?: string[];
    createModel: (genAI: GoogleGenerativeAI, modelId: string) => GenerativeModel;
    run: (model: GenerativeModel, modelId: string) => Promise<T>;
    onModelSelected?: (modelId: string) => void;
}): Promise<T> {
    const modelIds = (args.modelIds && args.modelIds.length > 0)
        ? args.modelIds
        : getGeminiModelCandidates();

    let lastError: unknown;

    for (const modelId of modelIds) {
        try {
            const model = args.createModel(args.genAI, modelId);
            const result = await args.run(model, modelId);
            args.onModelSelected?.(modelId);
            return result;
        } catch (error) {
            lastError = error;
            if (isUnsupportedModelError(error)) {
                continue;
            }
            throw error;
        }
    }

    throw lastError instanceof Error ? lastError : new Error('No supported Gemini model is available');
}
