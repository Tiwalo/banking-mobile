import { type ComponentRef, type PropsWithChildren, type ReactNode, type Ref } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, space } from './tokens';

type ScreenContainerProps = PropsWithChildren<{ edges?: readonly Edge[]; header?: ReactNode; scrollRef?: Ref<ComponentRef<typeof ScrollView>> }>;

export function ScreenContainer({ children, edges, header, scrollRef }: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      {header}
      <ScrollView
        ref={scrollRef}
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.app },
  content: { padding: space.md, gap: space.lg },
});
