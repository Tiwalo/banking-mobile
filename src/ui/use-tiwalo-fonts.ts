import { useFonts } from 'expo-font';

import { fontFamily } from './tokens';

const fonts = {
  [fontFamily.regular]: require('../../assets/fonts/Inter-Regular.ttf'),
  [fontFamily.semibold]: require('../../assets/fonts/Inter-SemiBold.ttf'),
};

export function useTiwaloFonts() {
  return useFonts(fonts);
}
