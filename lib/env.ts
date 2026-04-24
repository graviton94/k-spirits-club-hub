/**
 * Unified Environment Variable Accessor
 */
export function getEnv(key: string): string {
    let value = "";
    let source = "none";

    // 1. Try process.env
    if (process.env[key]) {
        value = process.env[key] as string;
        source = "process.env";
    }

    // 2. Try getRequestContext (OpenNext / Cloudflare)
    if (!value) {
        try {
            // Using a more standard ESM-safe approach for OpenNext
            const { getRequestContext } = require("@opennextjs/cloudflare");
            const ctx = getRequestContext();
            if (ctx?.env && ctx.env[key]) {
                value = String(ctx.env[key]);
                source = "getRequestContext().env";
            }
        } catch (e) {
            // Context not available
        }
    }

    // 3. Try globalThis
    if (!value && (globalThis as any)[key]) {
        value = String((globalThis as any)[key]);
        source = "globalThis";
    }

    if (value) {
        // Helpful for production log auditing without leaking values
        console.log(`[Env] Found ${key} from ${source}`);
    } else {
        console.warn(`[Env] ${key} NOT found in any source (checked process.env, ctx.env, globalThis)`);
    }

    return value;
}

/**
 * Checks for mandatory environment variables and throws descriptive error if missing.
 */
export function ensureEnv(key: string, source?: string): string {
    const val = getEnv(key);
    if (!val) {
        throw new Error(`[Env] Missing mandatory variable: ${key}${source ? ` (Source: ${source})` : ''}. Please check Cloudflare Secrets/Vars.`);
    }
    return val;
}
