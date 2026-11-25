import { CustomerScreen } from '@/navigation/shell';
import { EmptyState } from '@/ui/feedback-states';

export default function Activity() {
  return (
    <CustomerScreen>
      <EmptyState title="Activity unavailable" description="Transaction history is unavailable in this app." />
    </CustomerScreen>
  );
}
