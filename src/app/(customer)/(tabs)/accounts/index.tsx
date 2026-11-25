import { CustomerScreen } from '@/navigation/shell';
import { EmptyState } from '@/ui/feedback-states';

export default function Accounts() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip synthetic screen content from production bundles.
    const { AccountsPreview }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    return <AccountsPreview />;
  }

  return (
    <CustomerScreen>
      <EmptyState title="Accounts unavailable" description="Sign in to view your accounts when available." />
    </CustomerScreen>
  );
}
