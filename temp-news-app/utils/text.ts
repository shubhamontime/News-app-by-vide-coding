import { DEFAULT_IMAGE } from '@/constants/config';
import type { LanguageCode, NewsArticle } from '@/types/news';

export function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function sanitizeArticleText(article: Partial<NewsArticle>) {
  return normalizeWhitespace(
    [article.title, article.description, article.content].filter(Boolean).join('. ')
  );
}

export function buildNarrationText(article: NewsArticle, language: LanguageCode) {
  const prefix =
    language === 'hi'
      ? `आप सुन रहे हैं: ${article.title}.`
      : `Now playing: ${article.title}.`;
  return normalizeWhitespace(`${prefix} ${sanitizeArticleText(article)}`);
}

export function localExplain(article: NewsArticle, language: LanguageCode) {
  const input = sanitizeArticleText(article);
  const sentences =
    input
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean) || [];

  const condensed = sentences.slice(0, 4).join(' ');
  const words = condensed.split(/\s+/).filter(Boolean);
  const trimmed = words.slice(0, 58).join(' ');
  const fallbackPrefix =
    language === 'hi'
      ? 'इस खबर का सार: '
      : 'In short: ';

  return `${fallbackPrefix}${trimmed || input.slice(0, 240)}${trimmed.endsWith('.') ? '' : '.'}`;
}

export function getInterestKeywords(articles: NewsArticle[], recentSearches: string[]) {
  const words = [
    ...recentSearches,
    ...articles.flatMap((article) =>
      `${article.title} ${article.description}`.split(/\s+/).filter((word) => word.length > 5)
    ),
  ];

  return Array.from(new Set(words.map((word) => word.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase())))
    .filter(Boolean)
    .slice(0, 8);
}

export function dedupeArticles(articles: NewsArticle[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.url || `${article.title}-${article.publishedAt}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function getArticleImage(imageUrl?: string | null) {
  return imageUrl || DEFAULT_IMAGE;
}
