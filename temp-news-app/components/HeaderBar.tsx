import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { APP_NAME } from '@/constants/config';
import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/app-store';

export function HeaderBar() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);

  return (
    <View style={styles.container}>
      <View style={styles.copyBlock}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{APP_NAME}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {t(language, 'appTagline')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={toggleLanguage}
          style={[
            styles.langButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={[styles.langText, { color: theme.colors.text }]}>
            {language.toUpperCase()}
          </Text>
          <Feather color={theme.colors.textMuted} name="repeat" size={14} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(language, 'openBookmarks')}
          onPress={() => router.push('/bookmarks')}
          style={[
            styles.bookmarksButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Ionicons color={theme.colors.text} name="bookmark-outline" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  bookmarksButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 64,
  },
  copyBlock: {
    flex: 1,
    paddingRight: 14,
  },
  langButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 42,
    paddingHorizontal: 14,
  },
  langText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
});
