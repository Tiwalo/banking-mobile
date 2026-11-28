import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CustomerScreen } from '@/navigation/shell';
import { previewBuild } from '@/auth/runtime';
import { useSession } from '@/auth/use-session';
import { AccountSummary } from '@/dashboard/account-summary';
import { AccountsFeedback } from '@/dashboard/accounts-feedback';
import { ledgerBalancesEnabled, totalAvailableMinor, useOwnedAccounts, type CustomerSession } from '@/dashboard/owned-accounts';
import { BalanceCard, BrandWordmark } from '@/ui/banking-components';
import { Button } from '@/ui/button';
import { TiwaloText } from '@/ui/tiwalo-text';
import { space } from '@/ui/tokens';

export default function Home() {
  const { view } = useSession();
  if (view.status === 'authenticated') return <AuthenticatedHome session={view} />;

  if (__DEV__ && previewBuild()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip preview link handling from production bundles.
    const { HomePreview }: typeof import('@/dev/navigation-fixtures') = require('@/dev/navigation-fixtures');
    return (
      <HomePreview>
        <CustomerScreen>
          <HomeHeader />
          <BalanceCard label="Total available balance" amountState="Total unavailable" />
          <QuickActions />
        </CustomerScreen>
      </HomePreview>
    );
  }

  return null;
}

function AuthenticatedHome({ session }: { session: CustomerSession }) {
  const accounts = useOwnedAccounts(session);
  const { query, firstPage, refresh } = accounts;
  const showBalances = ledgerBalancesEnabled();
  const total = showBalances && firstPage && !query.isPending ? totalAvailableMinor(firstPage) : null;

  return (
    <CustomerScreen>
      <HomeHeader />
      {total !== null
        ? <BalanceCard label="Total available balance" minor={total} />
        : <BalanceCard
            label="Total available balance"
            amountState={query.isPending ? 'Loading balance…' : 'Total unavailable'}
            description={showBalances && firstPage?.nextCursor !== undefined ? 'View individual balances in Accounts.' : undefined}
          />}
      <QuickActions />
      <View style={styles.group}>
        <TiwaloText accessibilityRole="header" variant="heading">My accounts</TiwaloText>
        <AccountsFeedback {...accounts} />
        {firstPage?.accounts.slice(0, 3).map(account => (
          <AccountSummary key={account.accountId} account={account} showBalance={showBalances} />
        ))}
        {firstPage?.accounts.length === 0 && query.hasNextPage && (
          <TiwaloText>Open Accounts to view more.</TiwaloText>
        )}
        {firstPage && (
          <Button label="Refresh accounts" variant="secondary" onPress={refresh} disabled={query.isFetching} />
        )}
      </View>
    </CustomerScreen>
  );
}

function HomeHeader() {
  return (
    <View style={styles.group}>
      <BrandWordmark />
      <TiwaloText accessibilityRole="header" variant="heading">Welcome</TiwaloText>
    </View>
  );
}

function QuickActions() {
  const router = useRouter();
  return (
    <View style={styles.group}>
      <TiwaloText accessibilityRole="header" variant="heading">Quick actions</TiwaloText>
      <Button label="View accounts" onPress={() => router.navigate('/accounts')} />
      <Button label="Send money" variant="secondary" disabled />
      <TiwaloText>Transfers are unavailable in this build.</TiwaloText>
      <Button label="View activity" variant="secondary" disabled />
      <TiwaloText>Transaction history is unavailable.</TiwaloText>
    </View>
  );
}

const styles = StyleSheet.create({ group: { gap: space.sm } });
