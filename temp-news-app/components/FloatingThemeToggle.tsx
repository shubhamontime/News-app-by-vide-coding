import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';

export function FloatingThemeToggle() {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          top: insets.top + 10,
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle theme"
        onPress={toggleTheme}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
          },
        ]}>
        <Ionicons
          color={theme.colors.text}
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={18}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 18,
    zIndex: 100,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    width: 46,
  },
});
