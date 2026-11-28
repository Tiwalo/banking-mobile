import { CustomerScreen } from '@/navigation/shell';
import { previewBuild } from '@/auth/runtime';
import { EmptyState } from '@/ui/feedback-states';

export default function Send() {
  if (__DEV__ && previewBuild()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip synthetic screen content from production bundles.
    const { SendPreview }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    return <SendPreview />;
  }

  return (
    <CustomerScreen>
      <EmptyState title="Sending is unavailable" description="Transfers are unavailable in this build." />
    </CustomerScreen>
  );
}
