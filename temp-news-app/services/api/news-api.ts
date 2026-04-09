import axios from 'axios';

import { GNEWS_API_KEY, GNEWS_BASE_URL } from '@/constants/config';
import { getArticleImage, hashString } from '@/utils/text';
import type { CategoryKey, LanguageCode, NewsArticle } from '@/types/news';

type GNewsItem = {
  title: string;
  description: string;
  content: string;
  image?: string | null;
  url: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
};

type GNewsResponse = {
  totalArticles: number;
  articles: GNewsItem[];
};

const client = axios.create({
  baseURL: GNEWS_BASE_URL,
  timeout: 12000,
});

export function hasLiveNewsApi() {
  return Boolean(GNEWS_API_KEY);
}

function normalizeGNewsArticle(item: GNewsItem, category: CategoryKey, language: LanguageCode): NewsArticle {
  return {
    id: hashString(`${item.url}-${item.publishedAt}`),
    title: item.title,
    description: item.description || 'No summary available.',
    content: item.content || item.description || item.title,
    imageUrl: getArticleImage(item.image),
    url: item.url,
    sourceName: item.source.name,
    sourceUrl: item.source.url,
    publishedAt: item.publishedAt,
    category,
    region: category === 'india' || category === 'local' ? 'india' : 'world',
    language,
  };
}

export async function fetchTopHeadlines(params: {
  category: string;
  page: number;
  pageSize: number;
  language: LanguageCode;
  country?: string;
}) {
  const response = await client.get<GNewsResponse>('/top-headlines', {
    params: {
      apikey: GNEWS_API_KEY,
      category: params.category,
      page: params.page,
      max: params.pageSize,
      lang: params.language,
      ...(params.country ? { country: params.country } : {}),
    },
  });

  return response.data;
}

export async function searchArticles(params: {
  query: string;
  page: number;
  pageSize: number;
  language: LanguageCode;
  from: string;
  to: string;
}) {
  const response = await client.get<GNewsResponse>('/search', {
    params: {
      apikey: GNEWS_API_KEY,
      q: params.query,
      page: params.page,
      max: params.pageSize,
      lang: params.language,
      from: params.from,
      to: params.to,
      sortby: 'publishedAt',
      nullable: 'image,content,description',
    },
  });

  return response.data;
}

export function mapLiveArticles(
  items: GNewsItem[],
  category: CategoryKey,
  language: LanguageCode
) {
  return items.map((item) => normalizeGNewsArticle(item, category, language));
}
