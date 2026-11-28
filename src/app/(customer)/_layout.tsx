import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useSession } from '@/auth/use-session';

import { stackOptions } from '@/navigation/shell';

export const unstable_settings = { anchor: '(tabs)' };

export default function CustomerLayout() {
  const { view } = useSession();
  const stack = (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="receipts/[transferRef]" options={{ title: 'Receipt' }} />
    </Stack>
  );
  return view.status === 'authenticated' ? <QueryClientProvider client={view.queryClient}>{stack}</QueryClientProvider> : stack;
}
