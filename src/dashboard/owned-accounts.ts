import { useInfiniteQuery } from '@tanstack/react-query';

import type { components, operations } from '@/api/generated/banking';
import { BankingApiError } from '@/api/problem';
import type { SessionView } from '@/auth/session';
import { parsePhpMinor } from '@/ui/php-money';

export type CustomerSession = Extract<SessionView, { status: 'authenticated' }>;
export type OwnedAccount = components['schemas']['Account'];
type AccountPage = operations['listAccounts']['responses'][200]['content']['application/json'];

const queryKey = ['owned-accounts', { limit: 20 }] as const;

export function useOwnedAccounts({ reads, queryClient }: CustomerSession) {
  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => reads.listAccounts({ limit: queryKey[1].limit, cursor: pageParam }, signal),
    getNextPageParam: page => page.nextCursor,
    refetchOnMount: false,
    retryOnMount: false,
  });

  const accessDenied = query.error instanceof BankingApiError && query.error.status === 403;
  const canceled = query.error instanceof BankingApiError && query.error.kind === 'canceled';
  const firstPage = accessDenied ? undefined : query.data?.pages[0];

  function refresh() {
    if (queryClient.getQueryState(queryKey)?.fetchStatus === 'fetching') return;
    void queryClient.resetQueries({ queryKey, exact: true });
  }

  async function loadMore() {
    if (!query.hasNextPage || accessDenied || queryClient.getQueryState(queryKey)?.fetchStatus === 'fetching') return;
    try {
      await query.fetchNextPage({ cancelRefetch: false, throwOnError: true });
    } catch (error) {
      if (error instanceof BankingApiError && error.kind === 'invalid-request' && error.status === 400) {
        refresh();
      }
      // Other failures stay in the query state so the customer can retry the page.
    }
  }

  return {
    query, firstPage, accessDenied, canceled, refresh, loadMore,
    accounts: accessDenied ? [] : query.data?.pages.flatMap(page => page.accounts) ?? [],
  };
}

export function ledgerBalancesEnabled() {
  const apiBase = process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
  return Boolean(apiBase && apiBase === process.env.EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL);
}

export function totalAvailableMinor(page: AccountPage): string | null {
  if (page.nextCursor !== undefined || page.accounts.length === 0) return null;
  const accountIds = new Set<string>();
  let total = 0n;
  for (const account of page.accounts) {
    const minor = parsePhpMinor(account.availableBalanceMinor);
    const id = account.accountId.toLowerCase();
    if (account.currency !== 'PHP' || minor === null || accountIds.has(id)) return null;
    accountIds.add(id);
    total += BigInt(minor);
  }
  return parsePhpMinor(total.toString());
}
