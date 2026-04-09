import * as Speech from 'expo-speech';

import type { LanguageCode } from '@/types/news';

const languageMap: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
};

type SpeechModule = typeof Speech & {
  pause?: () => void;
  resume?: () => void;
};

const speechModule = Speech as SpeechModule;

export function speakText(text: string, language: LanguageCode, onDone: () => void) {
  Speech.stop();
  Speech.speak(text, {
    language: languageMap[language],
    pitch: 1,
    rate: 0.95,
    onDone,
    onStopped: onDone,
  });
}

export function pauseSpeech() {
  if (speechModule.pause) {
    speechModule.pause();
    return true;
  }

  Speech.stop();
  return false;
}

export function resumeSpeech() {
  if (speechModule.resume) {
    speechModule.resume();
    return true;
  }

  return false;
}

export function stopSpeech() {
  Speech.stop();
}
