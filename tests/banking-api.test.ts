import { createBankingApi, type BankingFetch } from '../src/api/banking-api';
import { accountPage, forbidden, jsonResponse, notFound, ownedAccount, postedReceipt, problemResponse, rawResponse, unauthorized } from './fixtures/banking-api';

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }));

const baseUrl = 'https://banking.example.invalid/api/v1';
const request = { accessToken: 'synthetic.token.value' };

function setup() {
  const fetch = jest.fn<ReturnType<BankingFetch>, Parameters<BankingFetch>>();
  return { api: createBankingApi({ baseUrl: `${baseUrl}/`, fetch }), fetch };
}

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

test('the default transport uses Expo fetch and Expo public configuration', async () => {
  const env = process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
  process.env.EXPO_PUBLIC_BANKING_API_BASE_URL = baseUrl;
  const { fetch: transport } = jest.requireMock<{ fetch: jest.MockedFunction<BankingFetch> }>('expo/fetch');
  transport.mockResolvedValue(jsonResponse({ accounts: [] }));
  try {
    await expect(createBankingApi().listAccounts(request)).resolves.toEqual({ accounts: [] });
    expect(transport).toHaveBeenCalledWith(`${baseUrl}/accounts`, expect.objectContaining({ method: 'GET' }));
  } finally {
    if (env === undefined) delete process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
    else process.env.EXPO_PUBLIC_BANKING_API_BASE_URL = env;
  }
});

test('missing configuration is reported when constructing the client', () => {
  const env = process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
  delete process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
  try {
    expect(() => createBankingApi()).toThrow('Configure the banking API base URL.');
  } finally {
    if (env !== undefined) process.env.EXPO_PUBLIC_BANKING_API_BASE_URL = env;
  }
});

test.each([
  '', '/api/v1', 'https://banking.example.invalid', 'https://banking.example.invalid/api/v2',
  'http://banking.example.invalid/api/v1', 'https://user:secret@banking.example.invalid/api/v1',
  `${baseUrl}?`, `${baseUrl}#`, `${baseUrl}/accounts`,
])('rejects invalid base URL %s', (invalid) => {
  expect(() => createBankingApi({ baseUrl: invalid })).toThrow('Configure the banking API base URL.');
});

test('allows loopback HTTP only in development', () => {
  const wasDev = __DEV__;
  try {
    Reflect.set(globalThis, '__DEV__', true);
    expect(() => createBankingApi({ baseUrl: 'http://localhost:8081/api/v1' })).not.toThrow();
    Reflect.set(globalThis, '__DEV__', false);
    expect(() => createBankingApi({ baseUrl: 'http://localhost:8081/api/v1' })).toThrow();
  } finally {
    Reflect.set(globalThis, '__DEV__', wasDev);
  }
});

test('lists owned accounts, preserves the opaque cursor, and returns an empty final page', async () => {
  const { api, fetch } = setup();
  fetch.mockResolvedValueOnce(jsonResponse(accountPage)).mockResolvedValueOnce(jsonResponse({ accounts: [] }));

  const page = await api.listAccounts(request, { limit: 1 });
  expect(page).toEqual(accountPage);
  const balanceMinor: string = page.accounts[0].availableBalanceMinor;
  expect(balanceMinor).toBe('9007199254740993');
  await expect(api.listAccounts(request, { cursor: page.nextCursor })).resolves.toEqual({ accounts: [] });
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenNthCalledWith(1, `${baseUrl}/accounts?limit=1`, expect.objectContaining({
    method: 'GET',
    credentials: 'omit',
    redirect: 'error',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${request.accessToken}`,
      Accept: 'application/json, application/problem+json',
      'Cache-Control': 'no-cache, no-store',
    },
  }));
  expect(fetch.mock.calls[1][0]).toBe(`${baseUrl}/accounts?cursor=demo%2B%2F%3D%26%3F`);
});

test('reads only the requested account and known receipt', async () => {
  const { api, fetch } = setup();
  fetch.mockResolvedValueOnce(jsonResponse(ownedAccount)).mockResolvedValueOnce(jsonResponse(postedReceipt));

  await expect(api.getAccount(ownedAccount.accountId, request)).resolves.toEqual(ownedAccount);
  await expect(api.getTransferReceipt(postedReceipt.transferId, request)).resolves.toEqual(postedReceipt);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    `${baseUrl}/accounts/${ownedAccount.accountId}`, `${baseUrl}/transfers/${postedReceipt.transferId}`,
  ]);
  expect(Object.keys(api).sort()).toEqual(['getAccount', 'getTransferReceipt', 'listAccounts']);
});

test('rejects invalid IDs, pagination and absent bearer before dispatch', async () => {
  const { api, fetch } = setup();
  await expect(api.getAccount('../operations', request)).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.getAccount(`urn:uuid:${ownedAccount.accountId}`, request)).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.getTransferReceipt('no-id', request)).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.listAccounts(request, { limit: 101 })).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.listAccounts(request, { limit: 1.5 })).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.listAccounts(request, { cursor: '' })).rejects.toMatchObject({ kind: 'invalid-request' });
  await expect(api.listAccounts({ accessToken: '' })).rejects.toMatchObject({ kind: 'unauthenticated' });
  expect(fetch).not.toHaveBeenCalled();
});

test.each([
  [400, { type: 'urn:tiwalo:problem:invalid-request', title: 'Invalid request', status: 400, code: 'INVALID_REQUEST' }, 'invalid-request'],
  [401, unauthorized, 'unauthenticated'],
  [403, forbidden, 'forbidden'],
] as const)('maps contracted status %d without retaining server text', async (status, problem, kind) => {
  const { api, fetch } = setup();
  const privateDetail = 'private server detail';
  fetch.mockResolvedValue(problemResponse({ ...problem, detail: privateDetail, instance: '/private/ref' }));
  const error: unknown = await api.listAccounts(request).catch((failure: unknown) => failure);
  expect(error).toMatchObject({ kind, status });
  expect(String(error)).not.toContain(privateDetail);
  expect(JSON.stringify(error)).not.toContain('/private/ref');
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('absent and unowned resources yield the same safe 404 failure', async () => {
  const { api, fetch } = setup();
  fetch.mockResolvedValue(problemResponse(notFound));
  const notFoundError = { kind: 'not-found', status: 404, message: 'The requested banking resource is unavailable.' };
  await expect(api.getAccount(ownedAccount.accountId, request)).rejects.toMatchObject(notFoundError);
  await expect(api.getAccount('00000000-0000-4000-8000-000000000003', request)).rejects.toMatchObject(notFoundError);
  await expect(api.getTransferReceipt(postedReceipt.transferId, request)).rejects.toMatchObject(notFoundError);
  await expect(api.listAccounts(request)).rejects.toMatchObject({ kind: 'http', status: 404 });
});

test.each([
  problemResponse(unauthorized, 403),
  problemResponse({ ...forbidden, code: 'NEW_PROBLEM_CODE' }),
  rawResponse('{', 403, 'application/problem+json'),
  rawResponse(JSON.stringify(forbidden), 403, 'application/json'),
  rawResponse('{"status":403}', 403, 'application/problem+json'),
])('falls back safely for unknown or malformed HTTP problems', async (response) => {
  const { api, fetch } = setup();
  fetch.mockResolvedValue(response);
  await expect(api.listAccounts(request)).rejects.toMatchObject({ kind: 'http', status: 403 });
});

test.each([
  jsonResponse({ ...ownedAccount, availableBalanceMinor: 12 }),
  jsonResponse({ ...ownedAccount, availableBalanceMinor: '9223372036854775808' }),
  jsonResponse({ ...ownedAccount, status: 'OTHER' }),
  jsonResponse({ ...ownedAccount, accountId: postedReceipt.transferId }),
  rawResponse('{', 200, 'application/json'),
  rawResponse(JSON.stringify(ownedAccount), 200, 'text/html'),
  rawResponse('', 302, 'text/html'),
  rawResponse(JSON.stringify(ownedAccount), 201, 'application/json'),
])('rejects unexpected account replies', async (response) => {
  const { api, fetch } = setup();
  fetch.mockResolvedValue(response);
  await expect(api.getAccount(ownedAccount.accountId, request)).rejects.toMatchObject({ kind: 'invalid-response' });
  expect(fetch).toHaveBeenCalledTimes(1);
});

test.each(['0', '9223372036854775807'])('preserves valid balance boundary %s', async (availableBalanceMinor) => {
  const { api, fetch } = setup();
  fetch.mockResolvedValue(jsonResponse({ ...ownedAccount, availableBalanceMinor }));
  await expect(api.getAccount(ownedAccount.accountId, request)).resolves.toMatchObject({ availableBalanceMinor });
});

test('rejects an account page containing an ID in URN form', async () => {
  const { api, fetch } = setup();
  fetch.mockResolvedValue(jsonResponse({ accounts: [{ ...ownedAccount, accountId: `urn:uuid:${ownedAccount.accountId}` }] }));
  await expect(api.listAccounts(request)).rejects.toMatchObject({ kind: 'invalid-response' });
});

test('rejects receipts for a different transfer or a zero amount', async () => {
  const { api, fetch } = setup();
  fetch.mockResolvedValueOnce(jsonResponse({ ...postedReceipt, transferId: ownedAccount.accountId }))
    .mockResolvedValueOnce(jsonResponse({ ...postedReceipt, amountMinor: '0' }));
  await expect(api.getTransferReceipt(postedReceipt.transferId, request)).rejects.toMatchObject({ kind: 'invalid-response' });
  await expect(api.getTransferReceipt(postedReceipt.transferId, request)).rejects.toMatchObject({ kind: 'invalid-response' });
});

test.each(['headers', 'body'])('times out waiting for %s and aborts transport', async (stage) => {
  jest.useFakeTimers();
  const { api, fetch } = setup();
  const stall = new Promise<never>(() => {});
  if (stage === 'headers') fetch.mockReturnValue(stall);
  else fetch.mockResolvedValue({ ...jsonResponse(accountPage), text: () => stall });

  const result = expect(api.listAccounts(request)).rejects.toMatchObject({ kind: 'timeout' });
  await jest.advanceTimersByTimeAsync(15_000);
  await result;
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1].signal?.aborted).toBe(true);
});

test('handles in-flight and pre-dispatch cancellation', async () => {
  const { api, fetch } = setup();
  fetch.mockReturnValue(new Promise(() => {}));
  const controller = new AbortController();
  const options = { ...request, signal: controller.signal };
  const result = expect(api.listAccounts(options)).rejects.toMatchObject({ kind: 'canceled' });
  controller.abort();
  await result;
  await expect(api.listAccounts(options)).rejects.toMatchObject({ kind: 'canceled' });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1].signal?.aborted).toBe(true);
});

test.each(['headers', 'body'])('sanitizes network failures while reading %s', async (stage) => {
  const { api, fetch } = setup();
  const cause = new Error('private transport detail');
  if (stage === 'headers') fetch.mockRejectedValue(cause);
  else fetch.mockResolvedValue({ ...jsonResponse(accountPage), text: async () => { throw cause; } });
  await expect(api.listAccounts(request)).rejects.toMatchObject({
    kind: 'network', message: 'The banking service could not be reached.',
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});
