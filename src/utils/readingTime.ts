import { countWords } from '../lib/word-count.ts';

/**
 * Calculate reading time for a given text
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = countWords(content);
  if (wordCount === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @param locale - UI language (`en` or `zh`)
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number, locale: 'en' | 'zh' = 'en'): string {
  if (locale === 'zh') {
    return `${minutes} 分钟阅读`;
  }
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}
