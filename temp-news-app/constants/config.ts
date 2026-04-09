export const APP_NAME = 'PulseWire';
export const PAGE_SIZE = 10;
export const CACHE_TTL_MS = 1000 * 60 * 15;
export const CACHE_VERSION = 'v1';
export const GNEWS_BASE_URL = 'https://gnews.io/api/v4';
export const GNEWS_API_KEY = process.env.EXPO_PUBLIC_GNEWS_API_KEY?.trim() ?? '';
export const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '';
export const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim() || 'gpt-5-mini';
export const DEMO_MODE = process.env.EXPO_PUBLIC_USE_DEMO_DATA === 'true' || !GNEWS_API_KEY;
export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
