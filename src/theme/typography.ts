import { StyleSheet, Platform } from 'react-native';

const fontFamily = Platform.OS === 'ios' ? 'System' : 'sans-serif';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
    fontFamily,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily,
  },
  devanagari: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily,
  },
});
