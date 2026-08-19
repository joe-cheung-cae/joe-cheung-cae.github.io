import { countWords } from '../lib/word-count';

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
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}
