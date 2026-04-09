import { create } from 'zustand';

import { speakText, pauseSpeech, resumeSpeech, stopSpeech } from '@/services/audio/speech-service';
import type { LanguageCode, NewsArticle } from '@/types/news';
import { buildNarrationText } from '@/utils/text';

type AudioState = {
  currentArticleId?: string;
  isPaused: boolean;
  isPlaying: boolean;
  queue: NewsArticle[];
  radioMode: boolean;
  language: LanguageCode;
  playArticle: (article: NewsArticle, queue: NewsArticle[], language: LanguageCode) => void;
  togglePlayback: (article: NewsArticle, queue: NewsArticle[], language: LanguageCode) => void;
  toggleRadioMode: () => void;
  stop: () => void;
};

export const useAudioStore = create<AudioState>()((set, get) => ({
  currentArticleId: undefined,
  isPaused: false,
  isPlaying: false,
  queue: [],
  radioMode: true,
  language: 'en',
  playArticle: (article, queue, language) => {
    set({
      currentArticleId: article.id,
      isPaused: false,
      isPlaying: true,
      queue: queue.filter((item) => item.id !== article.id),
      language,
    });

    speakText(buildNarrationText(article, language), language, () => {
      const state = get();
      if (state.radioMode && state.queue.length > 0) {
        const [nextArticle, ...rest] = state.queue;
        set({ queue: rest });
        get().playArticle(nextArticle, rest, state.language);
        return;
      }

      set({
        currentArticleId: undefined,
        isPaused: false,
        isPlaying: false,
      });
    });
  },
  togglePlayback: (article, queue, language) => {
    const state = get();
    if (state.currentArticleId !== article.id || !state.isPlaying) {
      get().playArticle(article, queue, language);
      return;
    }

    if (!state.isPaused) {
      const paused = pauseSpeech();
      set({
        isPaused: true,
        isPlaying: paused,
        ...(paused ? {} : { currentArticleId: undefined }),
      });
      return;
    }

    const resumed = resumeSpeech();
    if (!resumed) {
      get().playArticle(article, queue, language);
      return;
    }

    set({
      isPaused: false,
      isPlaying: true,
    });
  },
  toggleRadioMode: () =>
    set((state) => ({
      radioMode: !state.radioMode,
    })),
  stop: () => {
    stopSpeech();
    set({
      currentArticleId: undefined,
      isPaused: false,
      isPlaying: false,
      queue: [],
    });
  },
}));
