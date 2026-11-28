import { AccountCard } from '@/ui/banking-components';

import type { OwnedAccount } from './owned-accounts';

const statuses = {
  ACTIVE: { label: 'Active', tone: 'success' },
  FROZEN: { label: 'Frozen', tone: 'warning' },
  CLOSED: { label: 'Closed', tone: 'info' },
} as const;

export function AccountSummary({ account, showBalance }: { account: OwnedAccount; showBalance: boolean }) {
  return (
    <AccountCard
      label="Deposit account"
      maskedReference={`Account ending in ${account.accountId.slice(-4)}`}
      status={statuses[account.status]}
      balance={showBalance
        ? { label: 'Available balance', minor: account.availableBalanceMinor }
        : { label: 'Available balance', amountState: 'Balance unavailable' }}
    />
  );
}
