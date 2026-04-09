import type { LanguageCode } from '@/types/news';

export function getDateByOffset(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function isFutureDate(dateString: string) {
  return dateString > getDateByOffset(0);
}

export function getDateRange(dateString: string) {
  const start = new Date(`${dateString}T00:00:00.000Z`);
  const end = new Date(`${dateString}T23:59:59.999Z`);
  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export function formatFeedDate(dateString: string, language: LanguageCode) {
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateString));
}

export function formatPublishedTime(dateString: string, language: LanguageCode) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
