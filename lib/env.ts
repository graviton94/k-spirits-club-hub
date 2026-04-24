/**
 * Unified Environment Variable Accessor
 * 
 * Specifically designed for Cloudflare Workers (OpenNext) environments 
 * where secrets might not be on process.env but in the Request Context.
 */

export function getEnv(key: string): string {
    // 1. Try Next.js process.env (Development / Build / Some Worker configs)
    if (process.env[key]) {
        return process.env[key] as string;
    }

    // 2. Try globalThis (Injected by Cloudflare in some runtimes)
    const globalVal = (globalThis as any)[key];
    if (globalVal && typeof globalVal === 'string') {
        return globalVal;
    }

    // 3. Try getRequestContext (OpenNext specific)
    try {
        // Dynamic import to avoid errors in environments that don't support it
        // Or if running in a context where it's not needed.
        // However, OpenNext usually makes this available.
        const { getRequestContext } = require("@opennextjs/cloudflare");
        const ctx = getRequestContext();
        if (ctx?.env && ctx.env[key]) {
            return String(ctx.env[key]);
        }
    } catch (e) {
        // Not on Cloudflare or getRequestContext failed
    }

    return "";
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
