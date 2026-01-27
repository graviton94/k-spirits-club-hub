/**
 * Bot Detection Utility
 * Detects search engine crawlers to bypass age verification for SEO purposes
 */

/**
 * List of known search engine bot patterns
 * Includes major search engines: Google, Bing, Naver, Yahoo, Yandex, etc.
 */
const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,              // Yahoo
  /duckduckbot/i,        // DuckDuckGo
  /baiduspider/i,        // Baidu
  /yandexbot/i,          // Yandex
  /yeti/i,               // Naver
  /facebookexternalhit/i, // Facebook
  /twitterbot/i,         // Twitter
  /whatsapp/i,           // WhatsApp
  /linkedinbot/i,        // LinkedIn
  /slackbot/i,           // Slack
  /telegrambot/i,        // Telegram
  /applebot/i,           // Apple
  /apis-google/i,        // Google APIs
];

/**
 * Checks if the provided user agent string matches known bot patterns
 * @param userAgent - User agent string from request headers
 * @returns true if user agent matches a known bot pattern
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
 * Client-side bot detection using navigator.userAgent
 * Note: This is less reliable than server-side detection
 * @returns true if current user agent matches a known bot pattern
 */
export function isBotClient(): boolean {
  if (typeof window === 'undefined') return false;
  
  return isBot(navigator.userAgent);
}
