/**
 * Unit tests for bot detection utility
 * Tests detection of various search engine crawlers
 */

import { isBot } from '../bot-detection';

describe('Bot Detection', () => {
  describe('isBot', () => {
    it('should detect Googlebot', () => {
      const userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should detect Bingbot', () => {
      const userAgent = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should detect Naverbot (Yeti)', () => {
      const userAgent = 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should detect DuckDuckBot', () => {
      const userAgent = 'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should detect Baiduspider', () => {
      const userAgent = 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should detect Yandexbot', () => {
      const userAgent = 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)';
      expect(isBot(userAgent)).toBe(true);
    });

    it('should NOT detect regular Chrome browser', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      expect(isBot(userAgent)).toBe(false);
    });

    it('should NOT detect regular Safari browser', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
      expect(isBot(userAgent)).toBe(false);
    });

    it('should NOT detect regular Firefox browser', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
      expect(isBot(userAgent)).toBe(false);
    });

    it('should handle null user agent', () => {
      expect(isBot(null)).toBe(false);
    });

    it('should handle undefined user agent', () => {
      expect(isBot(undefined)).toBe(false);
    });

    it('should handle empty string user agent', () => {
      expect(isBot('')).toBe(false);
    });

    it('should be case insensitive for Googlebot', () => {
      const userAgent = 'GOOGLEBOT/2.1';
      expect(isBot(userAgent)).toBe(true);
    });
  });
});
