import AsyncStorage from '@react-native-async-storage/async-storage';

import { CACHE_TTL_MS, CACHE_VERSION } from '@/constants/config';
import type { CachedValue } from '@/types/news';

export async function getCachedItem<T>(key: string) {
  const raw = await AsyncStorage.getItem(`${CACHE_VERSION}:${key}`);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as CachedValue<T>;
  const age = Date.now() - new Date(parsed.savedAt).getTime();

  if (age > CACHE_TTL_MS) {
    await AsyncStorage.removeItem(`${CACHE_VERSION}:${key}`);
    return null;
  }

  return parsed;
}

export async function setCachedItem<T>(key: string, data: T) {
  const payload: CachedValue<T> = {
    savedAt: new Date().toISOString(),
    data,
  };

  await AsyncStorage.setItem(`${CACHE_VERSION}:${key}`, JSON.stringify(payload));
}
