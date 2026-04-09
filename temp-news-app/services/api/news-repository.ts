import { getCategoryConfig } from '@/constants/categories';
import { DEMO_MODE } from '@/constants/config';
import { getCachedItem, setCachedItem } from '@/services/cache/cache-service';
import { fetchMockFeed } from '@/services/api/mock-news';
import { fetchTopHeadlines, hasLiveNewsApi, mapLiveArticles, searchArticles } from '@/services/api/news-api';
import type { CategoryKey, FeedRequest, FeedResponse, LanguageCode, NewsArticle } from '@/types/news';
import { getDateRange, getDateByOffset, isFutureDate } from '@/utils/date';
import { dedupeArticles } from '@/utils/text';

const topHeadlineMap: Record<
  Exclude<CategoryKey, 'home' | 'for-you' | 'following' | 'showcase'>,
  { category: string; country?: string }
> = {
  india: { category: 'general', country: 'in' },
  world: { category: 'world' },
  local: { category: 'nation', country: 'in' },
  business: { category: 'business', country: 'in' },
  technology: { category: 'technology' },
  entertainment: { category: 'entertainment', country: 'in' },
  sports: { category: 'sports', country: 'in' },
  science: { category: 'science' },
  health: { category: 'health', country: 'in' },
};

const searchTerms: Record<CategoryKey, Record<LanguageCode, string>> = {
  home: { en: 'India OR world headlines', hi: 'भारत OR दुनिया समाचार' },
  'for-you': { en: 'technology OR business OR India', hi: 'टेक OR बिज़नेस OR भारत' },
  following: { en: 'trusted news sources', hi: 'विश्वसनीय समाचार स्रोत' },
  showcase: { en: 'featured headlines', hi: 'चुनी हुई खबरें' },
  india: { en: 'India headlines', hi: 'भारत समाचार' },
  world: { en: 'world headlines', hi: 'विश्व समाचार' },
  local: { en: 'India nation local headlines', hi: 'भारत स्थानीय समाचार' },
  business: { en: 'business markets startups', hi: 'बिज़नेस बाज़ार स्टार्टअप' },
  technology: { en: 'technology AI innovation', hi: 'टेक एआई नवाचार' },
  entertainment: { en: 'entertainment cinema culture', hi: 'मनोरंजन सिनेमा संस्कृति' },
  sports: { en: 'sports cricket football tournament', hi: 'स्पोर्ट्स क्रिकेट फुटबॉल टूर्नामेंट' },
  science: { en: 'science research space climate', hi: 'विज्ञान रिसर्च अंतरिक्ष जलवायु' },
  health: { en: 'health wellness medicine', hi: 'स्वास्थ्य वेलनेस चिकित्सा' },
};

function buildCacheKey(request: FeedRequest) {
  return [
    'feed',
    request.category,
    request.language,
    request.date,
    request.page,
    request.searchQuery?.trim() || 'none',
    request.followedSources.join(',') || 'none',
    request.interestKeywords.join(',') || 'none',
  ].join(':');
}

function mergeArticles(primary: NewsArticle[], secondary: NewsArticle[]) {
  const merged: NewsArticle[] = [];
  const maxLength = Math.max(primary.length, secondary.length);
  for (let index = 0; index < maxLength; index += 1) {
    if (primary[index]) {
      merged.push(primary[index]);
    }
    if (secondary[index]) {
      merged.push(secondary[index]);
    }
  }
  return dedupeArticles(merged);
}

function buildSmartQuery(request: FeedRequest) {
  if (request.searchQuery?.trim()) {
    return request.searchQuery.trim();
  }

  if (request.category === 'following') {
    return request.followedSources.map((source) => `"${source}"`).join(' OR ');
  }

  if (request.category === 'for-you' && request.interestKeywords.length) {
    return request.interestKeywords.slice(0, 5).join(' OR ');
  }

  return searchTerms[request.category][request.language];
}

async function fetchLiveFeed(request: FeedRequest): Promise<FeedResponse> {
  if (isFutureDate(request.date)) {
    return { articles: [], totalArticles: 0, fromCache: false };
  }

  const today = getDateByOffset(0);

  if (request.category === 'following' && !request.followedSources.length) {
    return { articles: [], totalArticles: 0, fromCache: false };
  }

  if (request.category === 'home' && !request.searchQuery && request.date === today) {
    const [india, world] = await Promise.all([
      fetchTopHeadlines({
        category: 'general',
        country: 'in',
        language: request.language,
        page: request.page,
        pageSize: Math.ceil(request.pageSize / 2),
      }),
      fetchTopHeadlines({
        category: 'world',
        language: request.language,
        page: request.page,
        pageSize: Math.ceil(request.pageSize / 2),
      }),
    ]);

    const articles = mergeArticles(
      mapLiveArticles(india.articles, 'india', request.language),
      mapLiveArticles(world.articles, 'world', request.language)
    ).slice(0, request.pageSize);

    return {
      articles,
      totalArticles: india.totalArticles + world.totalArticles,
      fromCache: false,
    };
  }

  if (request.category === 'showcase' && !request.searchQuery && request.date === today) {
    const homeResult = await fetchLiveFeed({ ...request, category: 'home' });
    return {
      ...homeResult,
      articles: homeResult.articles,
    };
  }

  if (
    request.category !== 'for-you' &&
    request.category !== 'following' &&
    request.category !== 'showcase' &&
    request.category !== 'home' &&
    !request.searchQuery &&
    request.date === today
  ) {
    const config = topHeadlineMap[request.category];
    const result = await fetchTopHeadlines({
      category: config.category,
      country: config.country,
      language: request.language,
      page: request.page,
      pageSize: request.pageSize,
    });

    return {
      articles: mapLiveArticles(result.articles, request.category, request.language),
      totalArticles: result.totalArticles,
      fromCache: false,
    };
  }

  const query = buildSmartQuery(request);
  if (!query) {
    return { articles: [], totalArticles: 0, fromCache: false };
  }

  const range = getDateRange(request.date);
  const result = await searchArticles({
    query,
    page: request.page,
    pageSize: request.pageSize,
    language: request.language,
    from: range.from,
    to: range.to,
  });

  return {
    articles: mapLiveArticles(result.articles, request.category, request.language),
    totalArticles: result.totalArticles,
    fromCache: false,
  };
}

export async function getFeed(request: FeedRequest): Promise<FeedResponse> {
  const cacheKey = buildCacheKey(request);

  if (!request.forceRefresh) {
    const cached = await getCachedItem<FeedResponse>(cacheKey);
    if (cached) {
      return {
        ...cached.data,
        fromCache: true,
        cachedAt: cached.savedAt,
      };
    }
  }

  try {
    const result = !DEMO_MODE && hasLiveNewsApi() ? await fetchLiveFeed(request) : await fetchMockFeed(request);
    const normalized: FeedResponse = {
      ...result,
      articles: dedupeArticles(result.articles),
      fromCache: false,
    };
    await setCachedItem(cacheKey, normalized);
    return normalized;
  } catch (error) {
    if (!hasLiveNewsApi()) {
      return fetchMockFeed(request);
    }
    throw error;
  }
}

export function getFeedAccent(category: CategoryKey) {
  return getCategoryConfig(category).accent;
}
