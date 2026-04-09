import { useEffect, useMemo, useRef, useState } from 'react';

import { PAGE_SIZE } from '@/constants/config';
import { getFeed } from '@/services/api/news-repository';
import { useAppStore } from '@/store/app-store';
import { useBookmarksStore } from '@/store/bookmarks-store';
import type { CategoryKey, FeedResponse, NewsArticle } from '@/types/news';
import { getDateByOffset } from '@/utils/date';
import { getInterestKeywords } from '@/utils/text';

type FeedState = {
  articles: NewsArticle[];
  error: string | null;
  hasMore: boolean;
  initialLoading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  totalArticles: number;
  cachedAt?: string;
  fromCache: boolean;
};

const initialState: FeedState = {
  articles: [],
  error: null,
  hasMore: true,
  initialLoading: true,
  loadingMore: false,
  refreshing: false,
  totalArticles: 0,
  cachedAt: undefined,
  fromCache: false,
};

export function useNewsFeed(category: CategoryKey, searchQuery: string) {
  const language = useAppStore((state) => state.language);
  const dateOffset = useAppStore((state) => state.dateOffset);
  const followedSources = useAppStore((state) => state.followedSources);
  const recentSearches = useAppStore((state) => state.recentSearches);
  const addRecentSearch = useAppStore((state) => state.addRecentSearch);
  const registerArticles = useAppStore((state) => state.registerArticles);
  const bookmarksMap = useBookmarksStore((state) => state.bookmarks);
  const bookmarks = useMemo(() => Object.values(bookmarksMap), [bookmarksMap]);
  const selectedDate = getDateByOffset(dateOffset);
  const interestKeywords = useMemo(
    () => getInterestKeywords(bookmarks, recentSearches),
    [bookmarks, recentSearches]
  );
  const followedSourcesKey = useMemo(() => followedSources.join('|'), [followedSources]);
  const interestKeywordsKey = useMemo(() => interestKeywords.join('|'), [interestKeywords]);
  const lastSavedSearchRef = useRef('');
  const [state, setState] = useState<FeedState>(initialState);
  const [page, setPage] = useState(1);

  async function loadFeed(nextPage: number, options?: { append?: boolean; refresh?: boolean; force?: boolean }) {
    setState((current) => ({
      ...current,
      error: null,
      initialLoading: nextPage === 1 && !options?.refresh,
      refreshing: Boolean(options?.refresh),
      loadingMore: nextPage > 1,
    }));

    try {
      const response: FeedResponse = await getFeed({
        category,
        date: selectedDate,
        language,
        page: nextPage,
        pageSize: PAGE_SIZE,
        searchQuery: searchQuery || undefined,
        followedSources,
        interestKeywords,
        forceRefresh: options?.force,
      });

      const trimmedSearch = searchQuery.trim();
      if (trimmedSearch && lastSavedSearchRef.current !== trimmedSearch) {
        addRecentSearch(trimmedSearch);
        lastSavedSearchRef.current = trimmedSearch;
      }

      registerArticles(response.articles);
      setPage(nextPage);
      setState((current) => {
        const articles = options?.append
          ? [...current.articles, ...response.articles]
          : response.articles;

        return {
          articles,
          error: null,
          hasMore: articles.length < response.totalArticles && response.articles.length > 0,
          initialLoading: false,
          loadingMore: false,
          refreshing: false,
          totalArticles: response.totalArticles,
          cachedAt: response.cachedAt,
          fromCache: response.fromCache,
        };
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : 'Unable to fetch articles right now.',
        initialLoading: false,
        loadingMore: false,
        refreshing: false,
      }));
    }
  }

  useEffect(() => {
    setPage(1);
    setState(initialState);
    void loadFeed(1);
  }, [category, selectedDate, language, searchQuery, followedSourcesKey, interestKeywordsKey]);

  return {
    ...state,
    refresh: () => loadFeed(1, { refresh: true, force: true }),
    loadMore: () => {
      if (!state.hasMore || state.loadingMore || state.initialLoading) {
        return;
      }
      void loadFeed(page + 1, { append: true, force: true });
    },
    selectedDate,
  };
}
