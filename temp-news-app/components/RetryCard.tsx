import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/app-store';

type RetryCardProps = {
  message: string;
  onRetry: () => void;
};

export function RetryCard({ message, onRetry }: RetryCardProps) {
  const { theme } = useAppTheme();
  const language = useAppStore((state) => state.language);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <Text style={[styles.message, { color: theme.colors.textMuted }]}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.buttonText}>{t(language, 'tryAgain')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
});
