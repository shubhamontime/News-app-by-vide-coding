import { Stack } from 'expo-router';
import { StatusBar } from '@/node_modules/expo-status-bar/build/StatusBar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SystemUI from 'expo-system-ui';

import { FloatingThemeToggle } from '@/components/FloatingThemeToggle';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function RootLayout() {
  const { theme, isDark } = useAppTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="article/[id]" />
      </Stack>
      <FloatingThemeToggle />
    </GestureHandlerRootView>
  );
}
