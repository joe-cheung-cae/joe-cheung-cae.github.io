export type DateLocale = 'en' | 'zh';

const DATE_INTL: Record<DateLocale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
};

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Format a date for display
 * @param date - Date to format
 * @param locale - UI language (`en` or `zh`)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: DateLocale = 'en',
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(DATE_INTL[locale], options).format(d);
}

/**
 * Format a date for datetime attribute
 * @param date - Date to format
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string | number): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}
