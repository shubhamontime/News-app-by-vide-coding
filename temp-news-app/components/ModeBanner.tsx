import { StyleSheet, Text, View } from 'react-native';

import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { LanguageCode } from '@/types/news';

type ModeBannerProps = {
  isDemo: boolean;
  language: LanguageCode;
  fromCache: boolean;
};

export function ModeBanner({ isDemo, language, fromCache }: ModeBannerProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: isDemo ? theme.colors.accent : theme.colors.success,
          },
        ]}
      />
      <Text style={[styles.text, { color: theme.colors.textMuted }]}>
        {isDemo ? t(language, 'demoMode') : t(language, 'liveMode')}
        {fromCache ? ' • cache' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 999,
    height: 9,
    width: 9,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  wrapper: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
