export type LanguageCode = 'en' | 'hi';

export type ThemePreference = 'light' | 'dark';

export type CategoryKey =
  | 'home'
  | 'for-you'
  | 'following'
  | 'showcase'
  | 'india'
  | 'world'
  | 'local'
  | 'business'
  | 'technology'
  | 'entertainment'
  | 'sports'
  | 'science'
  | 'health';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  url: string;
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  category: CategoryKey;
  region: 'india' | 'world';
  language: LanguageCode;
  author?: string;
}

export interface FeedRequest {
  category: CategoryKey;
  date: string;
  language: LanguageCode;
  page: number;
  pageSize: number;
  searchQuery?: string;
  forceRefresh?: boolean;
  followedSources: string[];
  interestKeywords: string[];
}

export interface FeedResponse {
  articles: NewsArticle[];
  totalArticles: number;
  fromCache: boolean;
  cachedAt?: string;
}

export interface CachedValue<T> {
  savedAt: string;
  data: T;
}

export interface AppTheme {
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textSoft: string;
    primary: string;
    primarySoft: string;
    accent: string;
    success: string;
    danger: string;
    shadow: string;
    skeleton: string;
    overlay: string;
  };
}
