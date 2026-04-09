import type { AppTheme } from '@/types/news';

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
};

export const lightTheme: AppTheme = {
  dark: false,
  colors: {
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceAlt: '#EAF1F7',
    card: '#FFFFFF',
    border: '#D9E3ED',
    text: '#0C1823',
    textMuted: '#4D6273',
    textSoft: '#708597',
    primary: '#00796B',
    primarySoft: '#D2F3EB',
    accent: '#F97316',
    success: '#2E7D32',
    danger: '#D32F2F',
    shadow: 'rgba(12, 24, 35, 0.12)',
    skeleton: '#D9E3ED',
    overlay: 'rgba(4, 12, 18, 0.08)',
  },
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: {
    background: '#07141A',
    surface: '#0D1E26',
    surfaceAlt: '#102630',
    card: '#122934',
    border: '#1E3A47',
    text: '#F4F8FA',
    textMuted: '#C0CFD7',
    textSoft: '#91A5B1',
    primary: '#28C3A7',
    primarySoft: '#0E3934',
    accent: '#FF9F5A',
    success: '#6DD38A',
    danger: '#FF8E8E',
    shadow: 'rgba(0, 0, 0, 0.35)',
    skeleton: '#1E3742',
    overlay: 'rgba(0, 0, 0, 0.25)',
  },
};
