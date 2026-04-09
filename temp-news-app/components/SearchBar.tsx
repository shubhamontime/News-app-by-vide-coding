import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { t } from '@/constants/translations';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppStore } from '@/store/app-store';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
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
      <Ionicons color={theme.colors.textMuted} name="search-outline" size={18} />
      <TextInput
        onChangeText={onChangeText}
        placeholder={t(language, 'searchPlaceholder')}
        placeholderTextColor={theme.colors.textSoft}
        style={[styles.input, { color: theme.colors.text }]}
        value={value}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')}>
          <Ionicons color={theme.colors.textMuted} name="close-circle" size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 15,
    minHeight: 22,
  },
  wrapper: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
  },
});
