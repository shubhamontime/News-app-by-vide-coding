import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryTabs } from '@/components/CategoryTabs';
import { DateNavigator } from '@/components/DateNavigator';
import { EmptyState } from '@/components/EmptyState';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { HeaderBar } from '@/components/HeaderBar';
import { ModeBanner } from '@/components/ModeBanner';
import { NewsCard } from '@/components/NewsCard';
import { RetryCard } from '@/components/RetryCard';
import { SearchBar } from '@/components/SearchBar';
import { SkeletonCard } from '@/components/SkeletonCard';
import { DEMO_MODE } from '@/constants/config';
import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useNewsFeed } from '@/hooks/use-news-feed';
import { useAppStore } from '@/store/app-store';
import { useBookmarksStore } from '@/store/bookmarks-store';
import type { NewsArticle } from '@/types/news';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const activeCategory = useAppStore((state) => state.activeCategory);
  const dateOffset = useAppStore((state) => state.dateOffset);
  const language = useAppStore((state) => state.language);
  const setActiveCategory = useAppStore((state) => state.setActiveCategory);
  const stepDate = useAppStore((state) => state.stepDate);
  const resetDate = useAppStore((state) => state.resetDate);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue);
  const feed = useNewsFeed(activeCategory, debouncedSearch);
  const bookmarkIds = useMemo(() => new Set(Object.keys(bookmarks)), [bookmarks]);

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
      <LinearGradient
        colors={[`${theme.colors.primary}18`, `${theme.colors.background}`, theme.colors.background]}
        style={styles.gradient}
      />

      <FlatList
        contentContainerStyle={styles.content}
        data={feed.articles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => {
          if (feed.initialLoading) {
            return (
              <View style={styles.gap}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}
              </View>
            );
          }

          if (feed.error) {
            return <RetryCard message={feed.error} onRetry={feed.refresh} />;
          }

          return (
            <EmptyState
              detail={
                activeCategory === 'following'
                  ? t(language, 'noFollowing')
                  : searchValue
                    ? t(language, 'noSearch')
                    : t(language, 'noStories')
              }
              title={searchValue ? t(language, 'searchResults') : t(language, 'topStories')}
            />
          );
        }}
        ListFooterComponent={
          feed.loadingMore ? (
            <View style={styles.footerLoader}>
              <SkeletonCard />
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <HeaderBar />
            <SearchBar onChangeText={setSearchValue} value={searchValue} />

            <View style={styles.bannerRow}>
              <ModeBanner fromCache={feed.fromCache} isDemo={DEMO_MODE} language={language} />
              <Pressable
                onPress={() => router.push('/bookmarks')}
                style={[
                  styles.savedChip,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Text style={[styles.savedChipText, { color: theme.colors.text }]}>
                  {Object.keys(bookmarks).length} {t(language, 'bookmarks')}
                </Text>
              </Pressable>
            </View>

            <CategoryTabs
              activeCategory={activeCategory}
              language={language}
              onSelect={setActiveCategory}
            />

            <DateNavigator
              dateLabel={feed.selectedDate}
              dateOffset={dateOffset}
              language={language}
              onNext={() => stepDate(1)}
              onPrevious={() => stepDate(-1)}
              onToday={resetDate}
            />

            {activeCategory === 'showcase' && feed.articles.length ? (
              <View style={styles.showcaseBlock}>
                <FeaturedCarousel articles={feed.articles} language={language} onOpen={openArticle} />
              </View>
            ) : null}

            {activeCategory === 'for-you' && !searchValue ? (
              <Text style={[styles.hintText, { color: theme.colors.textSoft }]}>
                {t(language, 'personalizationHint')}
              </Text>
            ) : null}
          </View>
        }
        onEndReached={feed.loadMore}
        onEndReachedThreshold={0.55}
        refreshControl={
          <RefreshControl
            onRefresh={feed.refresh}
            refreshing={feed.refreshing}
            tintColor={theme.colors.primary}
          />
        }
        renderItem={({ item, index }) => (
          <NewsCard
            article={item}
            index={index}
            isBookmarked={bookmarkIds.has(item.id)}
            language={language}
            onBookmark={() => toggleBookmark(item)}
            onOpen={() => openArticle(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bannerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  content: {
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 18,
  },
  footerLoader: {
    marginTop: 4,
  },
  gap: {
    gap: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerArea: {
    gap: 16,
    paddingBottom: 10,
    paddingTop: 4,
  },
  hintText: {
    fontSize: 13,
    lineHeight: 20,
  },
  list: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  savedChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  savedChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  showcaseBlock: {
    marginTop: 4,
  },
});
