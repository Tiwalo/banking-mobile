import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Text } from 'react-native';
import { nativeSession, previewBuild } from '@/auth/runtime';
import { useSession } from '@/auth/use-session';

import { PreviewContext, stackOptions } from '@/navigation/shell';
import { ScreenContainer } from '@/ui/screen-container';
import { useTiwaloFonts } from '@/ui/use-tiwalo-fonts';

export default function RootLayout() {
  const [previewActive, setPreviewActive] = useState(false);
  const [fontsLoaded, fontError] = useTiwaloFonts();
  const canPreview = previewBuild() && previewActive;
  const { view } = useSession();
  useEffect(() => {
    const session = nativeSession();
    if (!session) return;
    void session.initialize();
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') session.foreground();
    });
    return () => listener.remove();
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <ScreenContainer>
        <Text accessibilityLiveRegion="polite">Loading Tiwalo…</Text>
      </ScreenContainer>
    );
  }

  return (
    <PreviewContext.Provider value={previewBuild() ? { active: canPreview, setActive: setPreviewActive } : null}>
      <StatusBar style="dark" />
      <Stack screenOptions={stackOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={view.status === 'authenticated' || canPreview} redirectTo="/">
          <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={previewBuild()} redirectTo="/">
          <Stack.Screen name="component-gallery" options={{ title: 'Component gallery' }} />
        </Stack.Protected>
      </Stack>
    </PreviewContext.Provider>
  );
}
