import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_TABS } from '@/constants/categories';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { CategoryKey } from '@/types/news';

type CategoryTabsProps = {
  activeCategory: CategoryKey;
  language: 'en' | 'hi';
  onSelect: (category: CategoryKey) => void;
};

export function CategoryTabs({ activeCategory, language, onSelect }: CategoryTabsProps) {
  const { theme } = useAppTheme();

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {CATEGORY_TABS.map((item) => {
            const active = item.key === activeCategory;
            return (
              <Pressable
                key={item.key}
                onPress={() => onSelect(item.key)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? item.accent : theme.colors.surface,
                    borderColor: active ? item.accent : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: active ? '#FFFFFF' : theme.colors.text,
                    },
                  ]}>
                  {item.label[language]}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabHint,
                    {
                      color: active ? 'rgba(255,255,255,0.82)' : theme.colors.textSoft,
                    },
                  ]}>
                  {item.hint[language]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  tab: {
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 116,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tabHint: {
    fontSize: 11,
    marginTop: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});
