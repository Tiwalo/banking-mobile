import { useLocalSearchParams } from 'expo-router';

import { CustomerScreen } from '@/navigation/shell';
import { EmptyState } from '@/ui/feedback-states';

export default function AccountDetails() {
  const { accountRef } = useLocalSearchParams<{ accountRef: string }>();

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip synthetic screen content from production bundles.
    const { accountFixtureRef, SampleAccount }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    if (accountRef === accountFixtureRef) {
      return <CustomerScreen><SampleAccount /></CustomerScreen>;
    }
  }

  return (
    <CustomerScreen>
      <EmptyState title="Account unavailable" description="Go back to Accounts to view available entries." />
    </CustomerScreen>
  );
}
