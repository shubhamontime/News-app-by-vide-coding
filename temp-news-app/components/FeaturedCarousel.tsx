import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import { Image } from 'expo-image';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { LanguageCode, NewsArticle } from '@/types/news';
import { formatPublishedTime } from '@/utils/date';

type FeaturedCarouselProps = {
  articles: NewsArticle[];
  language: LanguageCode;
  onOpen: (article: NewsArticle) => void;
};

export function FeaturedCarousel({ articles, language, onOpen }: FeaturedCarouselProps) {
  const { theme } = useAppTheme();
  const featured = articles.slice(0, 5);

  return (
    <View>
      <FlatList
        data={featured}
        horizontal
        keyExtractor={(item) => item.id}
        pagingEnabled
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpen(item)}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}>
            <Image contentFit="cover" source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.source}>{item.sourceName}</Text>
              <Text numberOfLines={3} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.meta}>{formatPublishedTime(item.publishedAt, language)}</Text>
            </View>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    height: 260,
    marginRight: 14,
    overflow: 'hidden',
    width: 310,
  },
  content: {
    bottom: 0,
    left: 0,
    padding: 18,
    position: 'absolute',
    right: 0,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  meta: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 12,
    marginTop: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 13, 20, 0.34)',
  },
  source: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
});
