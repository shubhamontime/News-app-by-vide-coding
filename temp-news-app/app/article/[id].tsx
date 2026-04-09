import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/constants/translations';
import { explainArticle } from '@/services/ai/explain-service';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/app-store';
import { useAudioStore } from '@/store/audio-store';
import { useBookmarksStore } from '@/store/bookmarks-store';
import { type NewsArticle } from '@/types/news';
import { formatPublishedTime } from '@/utils/date';
import { shareArticle } from '@/utils/share';

export default function ArticleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const language = useAppStore((state) => state.language);
  const registry = useAppStore((state) => state.articleRegistry);
  const toggleFollowSource = useAppStore((state) => state.toggleFollowSource);
  const followedSources = useAppStore((state) => state.followedSources);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const {
    currentArticleId,
    isPaused,
    isPlaying,
    radioMode,
    togglePlayback,
    toggleRadioMode,
    stop,
  } = useAudioStore();
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const article = registry[params.id] || bookmarks[params.id];
  const relatedArticles = useMemo(
    () =>
      Object.values(registry)
        .filter((item) => item.id !== params.id)
        .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)),
    [params.id, registry]
  );

  async function handleExplain(currentArticle: NewsArticle) {
    setLoadingSummary(true);
    const nextSummary = await explainArticle(currentArticle, language);
    setSummary(nextSummary);
    setLoadingSummary(false);
  }

  if (!article) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.missingWrapper}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}>
            <Feather color={theme.colors.text} name="arrow-left" size={18} />
          </Pressable>
          <Text style={[styles.missingText, { color: theme.colors.text }]}>
            {t(language, 'unavailableArticle')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const followed = followedSources.includes(article.sourceName);
  const bookmarked = Boolean(bookmarks[article.id]);
  const activePlayback = currentArticleId === article.id && isPlaying;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image contentFit="cover" source={{ uri: article.imageUrl }} style={styles.heroImage} />
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.heroBack,
              { backgroundColor: theme.colors.overlay, borderColor: 'rgba(255,255,255,0.18)' },
            ]}>
            <Feather color="#FFFFFF" name="arrow-left" size={18} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.badges}>
            <View style={[styles.tag, { backgroundColor: theme.colors.primarySoft }]}>
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>{article.sourceName}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.tagText, { color: theme.colors.textMuted }]}>
                {formatPublishedTime(article.publishedAt, language)}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>{article.title}</Text>
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>
            {article.description}
          </Text>
          <Text style={[styles.contentText, { color: theme.colors.textMuted }]}>
            {article.content}
          </Text>

          <View style={styles.actionsGrid}>
            <Pressable
              onPress={() => toggleBookmark(article)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Ionicons
                color={bookmarked ? theme.colors.primary : theme.colors.text}
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
              />
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {bookmarked ? t(language, 'bookmarked') : t(language, 'bookmark')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => toggleFollowSource(article.sourceName)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Feather color={followed ? theme.colors.primary : theme.colors.text} name="user-plus" size={18} />
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {followed ? t(language, 'following') : t(language, 'follow')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => shareArticle(article)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Feather color={theme.colors.text} name="share-2" size={18} />
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {t(language, 'share')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => Linking.openURL(article.url)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Ionicons color={theme.colors.text} name="open-outline" size={18} />
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {t(language, 'readOriginal')}
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              {t(language, 'listen')}
            </Text>
            <Text style={[styles.featureText, { color: theme.colors.textMuted }]}>
              Play the article aloud and keep radio mode on to continue into the next headline.
            </Text>
            <View style={styles.audioRow}>
              <Pressable
                onPress={() => togglePlayback(article, relatedArticles, language)}
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.primaryButtonText}>
                  {activePlayback
                    ? isPaused
                      ? t(language, 'resume')
                      : t(language, 'pause')
                    : t(language, 'listen')}
                </Text>
              </Pressable>

              <Pressable
                onPress={toggleRadioMode}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: radioMode ? theme.colors.primarySoft : theme.colors.surfaceAlt,
                  },
                ]}>
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: radioMode ? theme.colors.primary : theme.colors.textMuted },
                  ]}>
                  {t(language, 'radioMode')}
                </Text>
              </Pressable>

              {activePlayback ? (
                <Pressable onPress={stop} style={styles.stopButton}>
                  <Ionicons color={theme.colors.textMuted} name="stop-circle-outline" size={24} />
                </Pressable>
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            ]}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              {t(language, 'aiSummary')}
            </Text>
            <Text style={[styles.featureText, { color: theme.colors.textMuted }]}>
              {summary || t(language, 'aiFallback')}
            </Text>
            <Pressable
              disabled={loadingSummary}
              onPress={() => handleExplain(article)}
              style={[styles.primaryButton, { alignSelf: 'flex-start', backgroundColor: theme.colors.accent }]}>
              <Text style={styles.primaryButtonText}>
                {loadingSummary ? `${t(language, 'loading')}` : t(language, 'explain')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minWidth: '47%',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  audioRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  body: {
    gap: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  content: {
    paddingBottom: 40,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  hero: {
    position: 'relative',
  },
  heroBack: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    left: 18,
    position: 'absolute',
    top: 18,
    width: 42,
  },
  heroImage: {
    height: 320,
    width: '100%',
  },
  missingText: {
    fontSize: 18,
    fontWeight: '700',
  },
  missingWrapper: {
    gap: 18,
    paddingHorizontal: 18,
  },
  primaryButton: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  safeArea: {
    flex: 1,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  stopButton: {
    padding: 4,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 36,
  },
});
