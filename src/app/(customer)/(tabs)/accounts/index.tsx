import { CustomerScreen } from '@/navigation/shell';
import { previewBuild } from '@/auth/runtime';
import { useSession } from '@/auth/use-session';
import { AccountSummary } from '@/dashboard/account-summary';
import { AccountsFeedback } from '@/dashboard/accounts-feedback';
import { ledgerBalancesEnabled, useOwnedAccounts, type CustomerSession } from '@/dashboard/owned-accounts';
import { Button } from '@/ui/button';
import { ErrorState } from '@/ui/feedback-states';

export default function Accounts() {
  const { view } = useSession();
  if (view.status === 'authenticated') return <AuthenticatedAccounts session={view} />;

  if (__DEV__ && previewBuild()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip synthetic screen content from production bundles.
    const { AccountsPreview }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    return <AccountsPreview />;
  }

  return null;
}

function AuthenticatedAccounts({ session }: { session: CustomerSession }) {
  const owned = useOwnedAccounts(session);
  const { accounts, accessDenied, canceled, query, firstPage, refresh, loadMore } = owned;
  const showBalances = ledgerBalancesEnabled();
  const canLoadMore = !accessDenied && query.hasNextPage;

  return (
    <CustomerScreen>
      <AccountsFeedback {...owned} />
      {accounts.map(account => (
        <AccountSummary key={account.accountId} account={account} showBalance={showBalances} />
      ))}
      {canLoadMore && (query.isFetchNextPageError && !canceled
        ? <ErrorState title="Couldn’t load more accounts" onRetry={() => void loadMore()} />
        : <Button label="Load more accounts" busyLabel="Loading more accounts…" busy={query.isFetchingNextPage}
            variant="secondary" onPress={() => void loadMore()} />)}
      {firstPage && (
        <Button label="Refresh accounts" variant="secondary" onPress={refresh} disabled={query.isFetching} />
      )}
    </CustomerScreen>
  );
}
