import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { NewsCard } from '@/components/NewsCard';
import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/app-store';
import { useBookmarksStore } from '@/store/bookmarks-store';
import type { NewsArticle } from '@/types/news';

export default function BookmarksScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const language = useAppStore((state) => state.language);
  const bookmarks = useBookmarksStore((state) => Object.values(state.bookmarks));
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);

  function openArticle(article: NewsArticle) {
    router.push({
      pathname: '/article/[id]',
      params: { id: article.id },
    });
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}>
            <Feather color={theme.colors.text} name="arrow-left" size={18} />
          </Pressable>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>{t(language, 'bookmarks')}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {t(language, 'savedStories')}
            </Text>
          </View>
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={bookmarks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState detail={t(language, 'noBookmarks')} title={t(language, 'bookmarks')} />
          }
          renderItem={({ item, index }) => (
            <NewsCard
              article={item}
              index={index}
              isBookmarked
              language={language}
              onBookmark={() => toggleBookmark(item)}
              onOpen={() => openArticle(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  container: {
    flex: 1,
    gap: 18,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  listContent: {
    gap: 16,
    paddingBottom: 32,
  },
  safeArea: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
});
