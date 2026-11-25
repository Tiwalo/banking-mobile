import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text } from 'react-native';

import { PreviewContext, stackOptions } from '@/navigation/shell';
import { ScreenContainer } from '@/ui/screen-container';
import { useTiwaloFonts } from '@/ui/use-tiwalo-fonts';

export default function RootLayout() {
  const [previewActive, setPreviewActive] = useState(false);
  const [fontsLoaded, fontError] = useTiwaloFonts();
  const canPreview = __DEV__ && previewActive;

  if (!fontsLoaded && !fontError) {
    return (
      <ScreenContainer>
        <Text accessibilityLiveRegion="polite">Loading Tiwalo…</Text>
      </ScreenContainer>
    );
  }

  return (
    <PreviewContext.Provider value={__DEV__ ? { active: canPreview, setActive: setPreviewActive } : null}>
      <StatusBar style="dark" />
      <Stack screenOptions={stackOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={canPreview} redirectTo="/">
          <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={__DEV__} redirectTo="/">
          <Stack.Screen name="component-gallery" options={{ title: 'Component gallery' }} />
        </Stack.Protected>
      </Stack>
    </PreviewContext.Provider>
  );
}
