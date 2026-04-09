import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type EmptyStateProps = {
  title: string;
  detail: string;
};

export function EmptyState({ title, detail }: EmptyStateProps) {
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
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons color={theme.colors.primary} name="newspaper-outline" size={22} />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.detail, { color: theme.colors.textMuted }]}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
});
