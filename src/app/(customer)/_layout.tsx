import { Stack } from 'expo-router';

import { stackOptions } from '@/navigation/shell';

export const unstable_settings = { anchor: '(tabs)' };

export default function CustomerLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="receipts/[transferRef]" options={{ title: 'Receipt' }} />
    </Stack>
  );
}
