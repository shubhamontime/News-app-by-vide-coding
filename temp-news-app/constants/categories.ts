import type { CategoryKey, LanguageCode } from '@/types/news';

type CategoryConfig = {
  key: CategoryKey;
  label: Record<LanguageCode, string>;
  hint: Record<LanguageCode, string>;
  accent: string;
};

export const CATEGORY_TABS: CategoryConfig[] = [
  {
    key: 'home',
    label: { en: 'Home', hi: 'होम' },
    hint: { en: 'Blended headlines', hi: 'मिश्रित खबरें' },
    accent: '#2AAE9B',
  },
  {
    key: 'for-you',
    label: { en: 'For You', hi: 'आपके लिए' },
    hint: { en: 'Personalised mix', hi: 'पसंदीदा मिश्रण' },
    accent: '#FF8B3D',
  },
  {
    key: 'following',
    label: { en: 'Following', hi: 'फॉलोइंग' },
    hint: { en: 'Sources you follow', hi: 'आपके स्रोत' },
    accent: '#A56CFF',
  },
  {
    key: 'showcase',
    label: { en: 'News Showcase', hi: 'न्यूज़ शोकेस' },
    hint: { en: 'Featured stories', hi: 'चुनी हुई खबरें' },
    accent: '#FF5C5C',
  },
  {
    key: 'india',
    label: { en: 'India', hi: 'भारत' },
    hint: { en: 'National headlines', hi: 'राष्ट्रीय खबरें' },
    accent: '#1E88E5',
  },
  {
    key: 'world',
    label: { en: 'World', hi: 'विश्व' },
    hint: { en: 'Global stories', hi: 'वैश्विक खबरें' },
    accent: '#00ACC1',
  },
  {
    key: 'local',
    label: { en: 'Local', hi: 'लोकल' },
    hint: { en: 'Closer to home', hi: 'आपके आसपास' },
    accent: '#43A047',
  },
  {
    key: 'business',
    label: { en: 'Business', hi: 'बिज़नेस' },
    hint: { en: 'Markets & startups', hi: 'बाज़ार और स्टार्टअप' },
    accent: '#FF7043',
  },
  {
    key: 'technology',
    label: { en: 'Technology', hi: 'टेक' },
    hint: { en: 'Innovation & AI', hi: 'इनोवेशन और एआई' },
    accent: '#5C6BC0',
  },
  {
    key: 'entertainment',
    label: { en: 'Entertainment', hi: 'मनोरंजन' },
    hint: { en: 'Cinema & culture', hi: 'सिनेमा और संस्कृति' },
    accent: '#EC407A',
  },
  {
    key: 'sports',
    label: { en: 'Sports', hi: 'स्पोर्ट्स' },
    hint: { en: 'Games & scores', hi: 'खेल और स्कोर' },
    accent: '#7CB342',
  },
  {
    key: 'science',
    label: { en: 'Science', hi: 'विज्ञान' },
    hint: { en: 'Research & space', hi: 'रिसर्च और अंतरिक्ष' },
    accent: '#26A69A',
  },
  {
    key: 'health',
    label: { en: 'Health', hi: 'हेल्थ' },
    hint: { en: 'Wellness & medicine', hi: 'स्वास्थ्य और चिकित्सा' },
    accent: '#EF5350',
  },
];

export const categoryLabels = Object.fromEntries(
  CATEGORY_TABS.map((item) => [item.key, item.label])
) as Record<CategoryKey, Record<LanguageCode, string>>;

export function getCategoryConfig(category: CategoryKey) {
  return CATEGORY_TABS.find((item) => item.key === category) ?? CATEGORY_TABS[0];
}
