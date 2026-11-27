import { createBankingApi, type BankingFetch } from '../src/api/banking-api';
import { createBankingQueryClient } from '../src/api/query-client';
import { accountPage, jsonResponse } from './fixtures/banking-api';

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }));

const queryKey = ['accounts'] as const;

test('a new session or API environment has a separate empty cache', async () => {
  const initial = createBankingQueryClient();
  const switchedActor = createBankingQueryClient();
  const switchedEnvironment = createBankingQueryClient();
  try {
    await initial.client.fetchQuery({ queryKey, queryFn: async () => accountPage });
    expect(initial.client.getQueryData(queryKey)).toEqual(accountPage);
    expect(switchedActor.client.getQueryData(queryKey)).toBeUndefined();
    expect(switchedEnvironment.client.getQueryData(queryKey)).toBeUndefined();
    await initial.dispose();
    expect(initial.client.getQueryData(queryKey)).toBeUndefined();
  } finally {
    await Promise.all([initial.dispose(), switchedActor.dispose(), switchedEnvironment.dispose()]);
  }
});

test('disposing the session aborts pending network work and discards late replies', async () => {
  const { client, dispose } = createBankingQueryClient();
  const fetch = jest.fn<ReturnType<BankingFetch>, Parameters<BankingFetch>>();
  let resolveResponse: (response: ReturnType<typeof jsonResponse>) => void = () => {};
  fetch.mockReturnValue(new Promise((resolve) => { resolveResponse = resolve; }));
  const api = createBankingApi({ baseUrl: 'https://banking.example.invalid/api/v1', fetch });

  const canceled = expect(client.fetchQuery({
    queryKey,
    queryFn: ({ signal }) => api.listAccounts({ accessToken: 'synthetic', signal }),
  })).rejects.toBeDefined();
  await dispose();
  await canceled;
  expect(fetch.mock.calls[0][1].signal?.aborted).toBe(true);

  resolveResponse(jsonResponse(accountPage));
  await Promise.resolve();
  expect(client.getQueryCache().getAll()).toEqual([]);
});

test('failed reads do not retry or pause for reconnect', async () => {
  const { client, dispose } = createBankingQueryClient();
  const queryFn = jest.fn().mockRejectedValue(new Error('Synthetic network error'));
  try {
    expect(client.getDefaultOptions().queries).toMatchObject({
      retry: false,
      networkMode: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
    await expect(client.fetchQuery({ queryKey, queryFn })).rejects.toThrow('Synthetic network error');
    expect(queryFn).toHaveBeenCalledTimes(1);
  } finally {
    await dispose();
  }
});
