const { execSync } = require('child_process');

const keysToDelete = [
    "ADMIN_PASSWORD", "CF_GATEWAY_URL", "CRON_SECRET", "ENV_BINDING_TEST",
    "FIREBASE_CLIENT_EMAIL", "FIREBASE_PROJECT_ID", "FOOD_SAFETY_API_KEY",
    "FOOD_SAFETY_KOREA_API_KEY", "FOOD_SAFETY_SERVICE_ID", "GEMINI_API_KEY",
    "GOOGLE_NEWS_API_KEY", "GOOGLE_NEWS_CX_ID", "NEXT_PUBLIC_ADSENSE_CLIENT",
    "NEXT_PUBLIC_ADSENSE_FOOTER_SLOT", "NEXT_PUBLIC_ADSENSE_INFEED_SLOT",
    "NEXT_PUBLIC_APP_ID", "NEXT_PUBLIC_BASE_URL", "NEXT_PUBLIC_CLARITY_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_CONFIG",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "TARGET_ALCOHOL_TYPES"
];

for (const key of keysToDelete) {
    console.log(`Deleting secret: ${key}`);
    try {
        execSync(`echo "y" | npx wrangler secret delete ${key}`, { stdio: 'inherit' });
    } catch (error) {
        console.warn(`Could not delete secret ${key} (maybe already gone or not a secret)`);
    }
}
