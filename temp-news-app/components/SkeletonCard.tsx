import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

export function SkeletonCard() {
  const { theme } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          opacity,
        },
      ]}>
      <View style={[styles.image, { backgroundColor: theme.colors.skeleton }]} />
      <View style={styles.body}>
        <View style={[styles.lineLong, { backgroundColor: theme.colors.skeleton }]} />
        <View style={[styles.lineMedium, { backgroundColor: theme.colors.skeleton }]} />
        <View style={[styles.lineShort, { backgroundColor: theme.colors.skeleton }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 10,
    padding: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    height: 188,
  },
  lineLong: {
    borderRadius: 999,
    height: 16,
    width: '86%',
  },
  lineMedium: {
    borderRadius: 999,
    height: 14,
    width: '65%',
  },
  lineShort: {
    borderRadius: 999,
    height: 12,
    marginTop: 6,
    width: '34%',
  },
});
