import { useLocalSearchParams } from 'expo-router';

import { CustomerScreen } from '@/navigation/shell';
import { previewBuild } from '@/auth/runtime';
import { EmptyState } from '@/ui/feedback-states';

export default function Receipt() {
  const { transferRef } = useLocalSearchParams<{ transferRef: string }>();

  if (__DEV__ && previewBuild()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip synthetic screen content from production bundles.
    const { transferFixtureRef, SampleReceipt }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    if (transferRef === transferFixtureRef) {
      return <CustomerScreen aboveTabs><SampleReceipt /></CustomerScreen>;
    }
  }

  return (
    <CustomerScreen aboveTabs>
      <EmptyState title="Receipt unavailable" description="Go back to return to the previous screen." />
    </CustomerScreen>
  );
}
