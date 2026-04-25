/**
 * Unified Environment Variable Accessor
 */
export function getEnvDetail(key: string): { value: string, source: string } {
    let value = "";
    let source = "missing";

    // 1. Cloudflare Context
    try {
        const { getRequestContext } = require("@opennextjs/cloudflare");
        const ctx = getRequestContext();
        if (ctx?.env && ctx.env[key]) {
            value = String(ctx.env[key]);
            source = "Cloudflare Context (Secret/Var)";
            return { value, source };
        }
    } catch (e) {}

    // 2. process.env
    if (process.env[key]) {
        value = process.env[key] as string;
        source = "process.env";
        return { value, source };
    }

    // 3. globalThis
    if ((globalThis as any)[key]) {
        value = String((globalThis as any)[key]);
        source = "globalThis";
        return { value, source };
    }

    return { value: "", source: "missing" };
}

export function getEnv(key: string): string {
    const { value, source } = getEnvDetail(key);
    
    if (value) {
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
