import { useRouter } from 'expo-router';

import { CustomerScreen } from '@/navigation/shell';
import { BrandWordmark } from '@/ui/banking-components';
import { Button } from '@/ui/button';
import { TiwaloText } from '@/ui/tiwalo-text';

export default function Home() {
  const router = useRouter();

  const content = (
    <CustomerScreen>
      <BrandWordmark />
      <TiwaloText>Balances are unavailable in this preview.</TiwaloText>
      <Button label="View accounts" onPress={() => router.navigate('/accounts')} />
      <Button label="Open Send" variant="secondary" onPress={() => router.navigate('/send')} />
      <Button label="View activity" variant="secondary" onPress={() => router.navigate('/activity')} />
    </CustomerScreen>
  );

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip preview link handling from production bundles.
    const { HomePreview }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    return <HomePreview>{content}</HomePreview>;
  }

  return content;
}
