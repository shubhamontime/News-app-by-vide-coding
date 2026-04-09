import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { LanguageCode } from '@/types/news';
import { formatFeedDate } from '@/utils/date';

type DateNavigatorProps = {
  dateLabel: string;
  dateOffset: number;
  language: LanguageCode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function DateNavigator({
  dateLabel,
  dateOffset,
  language,
  onPrevious,
  onNext,
  onToday,
}: DateNavigatorProps) {
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
      <Pressable onPress={onPrevious} style={styles.action}>
        <Ionicons color={theme.colors.text} name="chevron-back" size={18} />
        <Text style={[styles.actionLabel, { color: theme.colors.textMuted }]}>
          {t(language, 'previous')}
        </Text>
      </Pressable>

      <Pressable onPress={onToday} style={styles.center}>
        <Text style={[styles.centerLabel, { color: theme.colors.text }]}>
          {formatFeedDate(dateLabel, language)}
        </Text>
        <Text style={[styles.centerHint, { color: theme.colors.textSoft }]}>
          {dateOffset === 0 ? t(language, 'today') : t(language, 'latestRefresh')}
        </Text>
      </Pressable>

      <Pressable disabled={dateOffset >= 1} onPress={onNext} style={styles.action}>
        <Text
          style={[
            styles.actionLabel,
            { color: dateOffset >= 1 ? theme.colors.textSoft : theme.colors.textMuted },
          ]}>
          {t(language, 'next')}
        </Text>
        <Ionicons
          color={dateOffset >= 1 ? theme.colors.textSoft : theme.colors.text}
          name="chevron-forward"
          size={18}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  centerHint: {
    fontSize: 11,
    marginTop: 2,
  },
  centerLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
