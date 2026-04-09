import { Feather, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { getCategoryConfig } from '@/constants/categories';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { LanguageCode, NewsArticle } from '@/types/news';
import { formatPublishedTime } from '@/utils/date';

type NewsCardProps = {
  article: NewsArticle;
  index: number;
  isBookmarked: boolean;
  language: LanguageCode;
  onOpen: () => void;
  onBookmark: () => void;
};

export function NewsCard({
  article,
  index,
  isBookmarked,
  language,
  onOpen,
  onBookmark,
}: NewsCardProps) {
  const { theme } = useAppTheme();
  const accent = getCategoryConfig(article.category).accent;

  return (
    <Animated.View entering={FadeInDown.delay(index * 35).duration(350)}>
      <Pressable
        onPress={onOpen}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
          },
        ]}>
        <Image contentFit="cover" source={{ uri: article.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: `${accent}22` }]}>
              <Text style={[styles.badgeText, { color: accent }]}>{article.sourceName}</Text>
            </View>
            <Text style={[styles.metaText, { color: theme.colors.textSoft }]}>
              {formatPublishedTime(article.publishedAt, language)}
            </Text>
          </View>

          <Text numberOfLines={2} style={[styles.title, { color: theme.colors.text }]}>
            {article.title}
          </Text>

          <Text numberOfLines={3} style={[styles.description, { color: theme.colors.textMuted }]}>
            {article.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Feather color={theme.colors.textSoft} name="globe" size={14} />
              <Text style={[styles.metaText, { color: theme.colors.textSoft }]}>
                {article.region === 'india' ? 'India' : 'World'}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              onPress={onBookmark}
              style={[
                styles.bookmarkButton,
                {
                  backgroundColor: isBookmarked ? theme.colors.primarySoft : theme.colors.surfaceAlt,
                },
              ]}>
              <Ionicons
                color={isBookmarked ? theme.colors.primary : theme.colors.textMuted}
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bookmarkButton: {
    alignItems: 'center',
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  content: {
    gap: 12,
    padding: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  image: {
    height: 204,
    width: '100%',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
});
