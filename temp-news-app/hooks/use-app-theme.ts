import { darkTheme, lightTheme } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

export function useAppTheme() {
  const themePreference = useAppStore((state) => state.themePreference);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = themePreference === 'dark' ? darkTheme : lightTheme;

  return {
    theme,
    isDark: theme.dark,
    toggleTheme,
  };
}
