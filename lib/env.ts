/**
 * Unified Environment Variable Accessor
 */
export function getEnv(key: string): string {
    let value = "";
    let source = "none";

    // 1. MUST try getRequestContext FIRST (This is where Cloudflare Secrets live)
    try {
        const { getRequestContext } = require("@opennextjs/cloudflare");
        const ctx = getRequestContext();
        if (ctx?.env && ctx.env[key]) {
            value = String(ctx.env[key]);
            source = "Cloudflare Context (Secret/Var)";
        }
    } catch (e) {
        // Not in Cloudflare request context or not supported
    }

    // 2. Try process.env (Next.js fallback / Local dev)
    if (!value && process.env[key]) {
        value = process.env[key] as string;
        source = "process.env";
    }

    // 3. Try globalThis (Last resort)
    if (!value && (globalThis as any)[key]) {
        value = String((globalThis as any)[key]);
        source = "globalThis";
    }

    if (value) {
        // Only log public keys or log existence to prevent leak in logs
        const isSecret = key.includes('KEY') || key.includes('SECRET') || key.includes('PRIVATE');
        console.log(`[Env] Found ${key} from ${source} ${isSecret ? '(Protected Value)' : `(${value})`}`);
    } else {
        console.warn(`[Env] ${key} NOT FOUND in any source!`);
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
