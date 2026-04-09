import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { NewsArticle } from '@/types/news';

type BookmarksState = {
  bookmarks: Record<string, NewsArticle>;
  toggleBookmark: (article: NewsArticle) => void;
  isBookmarked: (articleId: string) => boolean;
};

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: {},
      toggleBookmark: (article) =>
        set((state) => {
          const next = { ...state.bookmarks };
          if (next[article.id]) {
            delete next[article.id];
          } else {
            next[article.id] = article;
          }
          return { bookmarks: next };
        }),
      isBookmarked: (articleId) => Boolean(get().bookmarks[articleId]),
    }),
    {
      name: 'pulsewire-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
