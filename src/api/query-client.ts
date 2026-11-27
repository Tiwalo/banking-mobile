import { QueryClient } from '@tanstack/react-query';

/** Create a fresh client for each authenticated session and API environment. */
export function createBankingQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        networkMode: 'always',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 5 * 60_000,
      },
      mutations: { retry: false, networkMode: 'always' },
    },
  });

  return {
    client,
    dispose() {
      const canceled = client.cancelQueries();
      client.clear();
      return canceled;
    },
  };
}
