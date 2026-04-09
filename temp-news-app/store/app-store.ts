import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CategoryKey, LanguageCode, NewsArticle, ThemePreference } from '@/types/news';

type AppState = {
  activeCategory: CategoryKey;
  dateOffset: number;
  followedSources: string[];
  language: LanguageCode;
  recentSearches: string[];
  themePreference: ThemePreference;
  articleRegistry: Record<string, NewsArticle>;
  hydrated: boolean;
  markHydrated: () => void;
  setActiveCategory: (category: CategoryKey) => void;
  stepDate: (direction: -1 | 1) => void;
  resetDate: () => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  toggleFollowSource: (sourceName: string) => void;
  addRecentSearch: (value: string) => void;
  registerArticles: (articles: NewsArticle[]) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeCategory: 'home',
      dateOffset: 0,
      followedSources: [],
      language: 'en',
      recentSearches: [],
      themePreference: 'dark',
      articleRegistry: {},
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      stepDate: (direction) =>
        set((state) => ({
          dateOffset: Math.max(-7, Math.min(1, state.dateOffset + direction)),
        })),
      resetDate: () => set({ dateOffset: 0 }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === 'en' ? 'hi' : 'en',
        })),
      toggleTheme: () =>
        set((state) => ({
          themePreference: state.themePreference === 'dark' ? 'light' : 'dark',
        })),
      toggleFollowSource: (sourceName) =>
        set((state) => ({
          followedSources: state.followedSources.includes(sourceName)
            ? state.followedSources.filter((item) => item !== sourceName)
            : [...state.followedSources, sourceName],
        })),
      addRecentSearch: (value) =>
        set((state) => {
          const normalizedValue = value.trim();
          if (!normalizedValue) {
            return state;
          }

          const nextRecentSearches = Array.from(
            new Set([normalizedValue, ...state.recentSearches])
          ).slice(0, 6);

          if (nextRecentSearches.join('|') === state.recentSearches.join('|')) {
            return state;
          }

          return {
            recentSearches: nextRecentSearches,
          };
        }),
      registerArticles: (articles) =>
        set((state) => {
          let changed = false;
          const nextRegistry = { ...state.articleRegistry };

          for (const article of articles) {
            const previous = nextRegistry[article.id];
            if (
              !previous ||
              previous.publishedAt !== article.publishedAt ||
              previous.title !== article.title ||
              previous.description !== article.description
            ) {
              nextRegistry[article.id] = article;
              changed = true;
            }
          }

          if (!changed) {
            return state;
          }

          return {
            articleRegistry: nextRegistry,
          };
        }),
    }),
    {
      name: 'pulsewire-app',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        dateOffset: state.dateOffset,
        followedSources: state.followedSources,
        language: state.language,
        recentSearches: state.recentSearches,
        themePreference: state.themePreference,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);
