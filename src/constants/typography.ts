import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.select({ android: 'Roboto', default: 'System' }),
  medium: Platform.select({ android: 'Roboto', default: 'System' }),
  bold: Platform.select({ android: 'Roboto', default: 'System' }),
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 48,
  timer: 64,
};
