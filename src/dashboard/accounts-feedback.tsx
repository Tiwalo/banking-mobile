import { EmptyState, ErrorState, LoadingState } from '@/ui/feedback-states';

import type { useOwnedAccounts } from './owned-accounts';

type Props = Pick<ReturnType<typeof useOwnedAccounts>, 'query' | 'firstPage' | 'accessDenied' | 'canceled' | 'refresh' | 'accounts'>;

export function AccountsFeedback({ query, firstPage, accessDenied, canceled, refresh, accounts }: Props) {
  if (accessDenied) return <ErrorState title="Account access denied" />;
  if (firstPage) {
    if (accounts.length === 0 && !query.hasNextPage) {
      return <EmptyState title="No accounts yet" />;
    }
    return null;
  }
  if (canceled) return null;
  if (query.isPending) return <LoadingState title="Loading accounts…" />;
  return <ErrorState title="Couldn’t load accounts" onRetry={refresh} />;
}
