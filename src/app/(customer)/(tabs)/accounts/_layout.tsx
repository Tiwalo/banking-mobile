import { Stack } from 'expo-router';

import { stackOptions } from '@/navigation/shell';

export const unstable_settings = { anchor: 'index' };

export default function AccountsLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" options={{ title: 'Accounts' }} />
      <Stack.Screen name="[accountRef]" options={{ title: 'Account details' }} />
    </Stack>
  );
}
