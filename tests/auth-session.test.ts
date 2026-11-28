import { BankingApiError } from '../src/api/problem';
import { AuthError, redirectUri, type Grant, type Pending, type RecordData } from '../src/auth/protocol';
import { Session } from '../src/auth/session';

const config = { issuer: 'https://issuer.example/realms/tiwalo', clientId: 'mobile', apiBase: 'https://api.example/api/v1' };
const pending: Pending = { kind: 'pending', state: 'abc', nonce: 'n', verifier: 't'.repeat(43), deadline: 60_000, requireIssuer: false };
const link = redirectUri + '?code=c&state=abc';
const initial: Grant = { access: 'access-a', refresh: 'refresh-a', subject: 'user-a', expires: 30_000, nonce: 'n' };
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

function setup(record: RecordData | null = null) {
  let saved = record;
  let time = 1000;
  const deps = {
    now: () => time, random: async () => 'marker',
    vault: {
      start: jest.fn(), invalidate: jest.fn(), erase: jest.fn(async () => { saved = null; }),
      load: jest.fn(async () => saved), save: jest.fn(async (data: RecordData) => { saved = data; }),
    },
    api: { listAccounts: jest.fn(async () => ({ accounts: [] })), getAccount: jest.fn(), getTransferReceipt: jest.fn() },
    prepare: jest.fn(async () => ({ url: 'https://issuer.example/login', pending })),
    browse: jest.fn<Promise<string | null>, [string]>(async () => link),
    exchange: jest.fn(async () => initial),
    refresh: jest.fn(async () => ({ ...initial, refresh: 'rotated', access: 'renewed', expires: 90_000 })),
    revoke: jest.fn(async () => {}),
  };
  const session = new Session(config, deps);
  function active() {
    const view = session.snapshot();
    if (view.status !== 'authenticated') throw Error('Expected authenticated view');
    return view;
  }
  return { session, deps, active, saved: () => saved, advance: (now: number) => { time = now; } };
}

afterEach(() => jest.useRealTimers());
beforeEach(() => jest.useFakeTimers());

it('persists before browser launch, consumes before exchange, and probes before mounting', async () => {
  const { session, deps, saved, active } = setup();
  deps.browse.mockImplementationOnce(async () => {
    expect(saved()).toEqual(pending);
    expect(session.snapshot().status).toBe('authorizing');
    return link;
  });
  deps.exchange.mockImplementationOnce(async () => {
    expect(saved()).toBeNull();
    return initial;
  });
  await session.signIn();
  expect(deps.api.listAccounts).toHaveBeenCalledWith(expect.objectContaining({ accessToken: initial.access }), { limit: 1 });
  expect(saved()).toEqual({ kind: 'refresh', subject: 'user-a', nonce: 'n', refresh: 'refresh-a' });
  expect(JSON.stringify(session.snapshot())).not.toContain(initial.access);
  expect(active().reads).toBeDefined();
  await session.callback(link);
  expect(deps.exchange).toHaveBeenCalledTimes(1);
  await session.signOut();
  expect(saved()).toBeNull();
});

it('restores a live pending callback once and discards a canceled browser request', async () => {
  const cold = setup(pending);
  await Promise.all([cold.session.callback(link), cold.session.callback(link)]);
  expect(cold.active()).toBeDefined();
  expect(cold.deps.exchange).toHaveBeenCalledTimes(1);
  await cold.session.signOut();
  cold.deps.browse.mockResolvedValueOnce(null);
  await cold.session.signIn();
  expect(cold.session.snapshot().status).toBe('signedOut');
  await cold.session.callback(link);
  expect(cold.deps.exchange).toHaveBeenCalledTimes(1);
});

it('discards a canceled attempt’s late callback while a fresh request is pending', async () => {
  const { deps, session, saved, active } = setup();
  deps.browse.mockResolvedValueOnce(null);
  await session.signIn();
  const fresh = { ...pending, state: 'fresh' };
  deps.prepare.mockResolvedValueOnce({ url: 'https://issuer.example/login', pending: fresh });
  const opened = deferred<void>();
  const browser = deferred<string>();
  deps.browse.mockImplementationOnce(() => { opened.resolve(); return browser.promise; });
  const login = session.signIn();
  await opened.promise;
  await session.callback(link);
  expect(saved()).toEqual(fresh);
  expect(deps.exchange).not.toHaveBeenCalled();
  browser.resolve(redirectUri + '?state=fresh&code=new');
  await login;
  expect(active()).toBeDefined();
  await session.signOut();
});

it('restores with rotation and customer admission, and rejects a change of actor', async () => {
  const recovery = { kind: 'refresh' as const, subject: 'user-a', refresh: 'old', nonce: 'n' };
  const restored = setup(recovery);
  await restored.session.initialize();
  expect(restored.active()).toBeDefined();
  expect(restored.saved()).toEqual({ ...recovery, refresh: 'rotated' });
  await restored.session.signOut();
  const wrong = setup(recovery);
  wrong.deps.refresh.mockResolvedValueOnce({ ...initial, subject: 'user-b', refresh: 'new', access: 'new' });
  await wrong.session.initialize();
  expect(wrong.session.snapshot().status).toBe('invalid');
  expect(wrong.deps.api.listAccounts).not.toHaveBeenCalled();
});

it('serializes concurrent 401 refreshes and retries each GET at most once', async () => {
  const { deps, session, active } = setup();
  await session.signIn();
  deps.api.listAccounts.mockRejectedValueOnce(new BankingApiError('unauthenticated', 401))
    .mockRejectedValueOnce(new BankingApiError('unauthenticated', 401));
  await Promise.all([active().reads.listAccounts(), active().reads.listAccounts()]);
  expect(deps.refresh).toHaveBeenCalledTimes(1);
  expect(deps.api.listAccounts).toHaveBeenCalledTimes(5);
  deps.refresh.mockResolvedValueOnce({ ...initial, refresh: 'next', access: 'next' });
  deps.api.listAccounts.mockRejectedValue(new BankingApiError('unauthenticated', 401));
  await expect(active().reads.listAccounts()).rejects.toBeInstanceOf(BankingApiError);
  expect(deps.api.listAccounts).toHaveBeenCalledTimes(7);
  expect(session.snapshot().status).toBe('invalid');
});

it('preserves ownership-safe 404 and keeps a receipt denial local to that operation', async () => {
  const { deps, session, active } = setup();
  await session.signIn();
  deps.api.getAccount.mockRejectedValueOnce(new BankingApiError('not-found', 404));
  await expect(active().reads.getAccount('missing')).rejects.toMatchObject({ kind: 'not-found' });
  const admitted = active();
  deps.api.getTransferReceipt.mockRejectedValueOnce(new BankingApiError('forbidden', 403));
  await expect(admitted.reads.getTransferReceipt('known')).rejects.toMatchObject({ kind: 'forbidden' });
  expect(active()).toBe(admitted);
  await expect(admitted.reads.listAccounts()).resolves.toEqual({ accounts: [] });
  expect(deps.refresh).not.toHaveBeenCalled();
  await session.signOut();
});

it('denies a customer on a 403 from the initial admission probe', async () => {
  const { deps, session, saved } = setup();
  deps.api.listAccounts.mockRejectedValueOnce(new BankingApiError('forbidden', 403));

  await session.signIn();
  expect(session.snapshot()).toEqual({ status: 'denied' });
  expect(saved()).toBeNull();
  expect(deps.refresh).not.toHaveBeenCalled();
});

it.each(['online', 'offline'])('attempts to revoke a memory-only token during %s sign-out', async connectivity => {
  const { deps, session, active } = setup();
  deps.exchange.mockResolvedValueOnce({ ...initial, refresh: undefined });
  if (connectivity === 'offline') deps.revoke.mockRejectedValueOnce(new Error('offline'));
  await session.signIn();
  const old = active();

  await session.signOut();
  expect(deps.revoke).toHaveBeenCalledWith(initial.access, 'access_token');
  expect(session.snapshot().status).toBe('signedOut');
  await expect(old.reads.listAccounts()).rejects.toMatchObject({ kind: 'canceled' });
});

it('closes an expired session offline and rechecks customer admission on retry', async () => {
  const { deps, session, active, advance } = setup();
  await session.signIn();
  const old = active();
  advance(initial.expires);
  deps.refresh.mockRejectedValueOnce(new AuthError('temporary'));
  session.foreground();
  expect(session.snapshot().status).toBe('restoring');
  await jest.advanceTimersByTimeAsync(0);
  expect(session.snapshot().status).toBe('retry');
  await expect(old.reads.listAccounts()).rejects.toMatchObject({ kind: 'canceled' });
  await session.retry();
  expect(active().queryClient).not.toBe(old.queryClient);
  await session.signOut();
});

it('discards late responses and cached data across account switching', async () => {
  const { deps, session, active } = setup();
  await session.signIn();
  const old = active();
  old.queryClient.setQueryData(['account'], 'only-A');
  const result = deferred<{ accounts: never[] }>();
  deps.api.listAccounts.mockImplementationOnce(() => result.promise);
  const read = old.reads.listAccounts();
  deps.exchange.mockResolvedValueOnce({ ...initial, subject: 'user-b', access: 'access-b', refresh: 'refresh-b' });
  deps.revoke.mockRejectedValueOnce(new Error('offline'));
  await session.switchAccount();
  result.resolve({ accounts: [] });
  await expect(read).rejects.toMatchObject({ kind: 'canceled' });
  expect(old.queryClient.getQueryData(['account'])).toBeUndefined();
  expect(active().queryClient).not.toBe(old.queryClient);
  expect(active().queryClient.getQueryData(['account'])).toBeUndefined();
  await session.signOut();
});

it('fences an in-flight rotation immediately on sign-out', async () => {
  const { deps, session, active, saved } = setup();
  await session.signIn();
  const began = deferred<void>();
  const rotation = deferred<ReturnType<typeof deps.refresh> extends Promise<infer T> ? T : never>();
  deps.refresh.mockImplementationOnce(() => { began.resolve(); return rotation.promise; });
  deps.api.getAccount.mockRejectedValueOnce(new BankingApiError('unauthenticated', 401));
  const read = active().reads.getAccount('known').catch(e => e);
  await began.promise;
  const logout = session.signOut();
  expect(session.snapshot().status).toBe('signingOut');
  rotation.resolve({ ...initial, access: 'late', refresh: 'late' });
  await logout;
  expect(await read).toMatchObject({ kind: 'canceled' });
  expect(saved()).toBeNull();
});

it('aborts the admission GET during logout and drops its late result', async () => {
  const { deps, session } = setup();
  const entered = deferred<void>();
  const response = deferred<{ accounts: never[] }>();
  let signal: AbortSignal | undefined;
  deps.api.listAccounts.mockImplementationOnce((...args: unknown[]) => {
    signal = (args[0] as { signal: AbortSignal }).signal;
    entered.resolve();
    return response.promise;
  });
  const login = session.signIn();
  await entered.promise;
  const logout = session.signOut();
  expect(signal?.aborted).toBe(true);
  response.resolve({ accounts: [] });
  await Promise.all([login, logout]);
  expect(session.snapshot().status).toBe('signedOut');
});

it('invalidates restoration when a rotated credential cannot be saved', async () => {
  const { session, deps, active, saved } = setup();
  await session.signIn();
  deps.vault.save.mockRejectedValueOnce(new Error('storage unavailable'));
  deps.api.getAccount.mockRejectedValueOnce(new BankingApiError('unauthenticated', 401));
  await expect(active().reads.getAccount('known')).rejects.toMatchObject({ kind: 'canceled' });
  expect(deps.revoke).toHaveBeenCalledWith('rotated');
  expect(session.snapshot().status).toBe('invalid');
  expect(saved()).toBeNull();
});

it('blocks failed credential writes, retries cleanup, and expires memory-only grants', async () => {
  const { deps, session, active, advance } = setup();
  deps.vault.save.mockRejectedValueOnce(new Error());
  await session.signIn();
  expect(deps.browse).not.toHaveBeenCalled();
  expect(session.snapshot().status).toBe('invalid');
  deps.exchange.mockResolvedValueOnce({ ...initial, refresh: undefined });
  await session.signIn();
  expect(active()).toBeDefined();
  advance(initial.expires);
  session.foreground();
  await jest.advanceTimersByTimeAsync(0);
  expect(session.snapshot().status).toBe('invalid');
  deps.vault.erase.mockRejectedValueOnce(new Error());
  await session.signOut();
  expect(session.snapshot().status).toBe('cleanup');
  await session.signOut();
  expect(session.snapshot().status).toBe('signedOut');
});
