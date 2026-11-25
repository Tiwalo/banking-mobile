import { Stack } from 'expo-router';
import { createContext, type ComponentProps, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenContainer } from '@/ui/screen-container';
import { TiwaloText } from '@/ui/tiwalo-text';
import { colors, fontFamily, space } from '@/ui/tokens';

export const PreviewContext = createContext<{
  active: boolean;
  setActive: (active: boolean) => void;
} | null>(null);

export const stackOptions = {
  contentStyle: { backgroundColor: colors.surface.app },
  headerStyle: { backgroundColor: colors.surface.card },
  headerTintColor: colors.text.heading,
  headerTitleStyle: { fontFamily: fontFamily.semibold },
} as const;

export function TabStack({ title }: { title: string }) {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  );
}

const tabEdges = ['left', 'right'] as const;
const detailEdges = ['bottom', 'left', 'right'] as const;

export function CustomerScreen({ children, aboveTabs = false, scrollRef }: PropsWithChildren<{ aboveTabs?: boolean; scrollRef?: ComponentProps<typeof ScreenContainer>['scrollRef'] }>) {
  return (
    <ScreenContainer
      edges={aboveTabs ? detailEdges : tabEdges}
      scrollRef={scrollRef}
      header={(
        <TiwaloText variant="caption" style={styles.disclosure}>
          Simulated banking{__DEV__ ? ' · Navigation preview' : ''}
        </TiwaloText>
      )}
    >
      {children}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  disclosure: { backgroundColor: colors.surface.subtle, paddingHorizontal: space.md, paddingVertical: space.xs },
});
