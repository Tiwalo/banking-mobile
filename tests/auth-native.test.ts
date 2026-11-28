import { fetch as expoFetch } from 'expo/fetch';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '../src/ui/tokens';

import { nativeDependencies } from '../src/auth/native';
import { AuthError, redirectUri, type Pending, type RecordData, type Recovery } from '../src/auth/protocol';
import { Session } from '../src/auth/session';

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }));
jest.mock('expo-file-system', () => ({ File: class {}, Paths: { cache: 'cache' } }));
jest.mock('expo-web-browser', () => ({ openAuthSessionAsync: jest.fn() }));
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' }, CryptoEncoding: { BASE64: 'base64' },
  getRandomBytesAsync: async (size: number) => new Uint8Array(size).fill(7),
  getRandomValues: (bytes: Uint8Array) => bytes.fill(23),
  digestStringAsync: async (_alg: string, input: string) => jest.requireActual('node:crypto').createHash('sha256').update(input).digest('base64'),
}));

const config = { issuer: 'https://id.example/realms/tiwalo', clientId: 'mobile', apiBase: 'https://bank.example/api/v1' };
const base = config.issuer + '/protocol/openid-connect';
const discovery = {
  issuer: config.issuer, authorization_endpoint: base + '/auth', token_endpoint: base + '/token',
  revocation_endpoint: base + '/revoke', authorization_response_iss_parameter_supported: true,
};
const fetch = jest.mocked(expoFetch);
function respond(body: unknown, status = 200) {
  return { status, headers: new Headers({ 'content-type': 'application/json' }), text: async () => JSON.stringify(body) } as Awaited<ReturnType<typeof expoFetch>>;
}
beforeEach(() => jest.clearAllMocks());

it('opens the system browser with S256 and redeems only the original verifier over a direct POST', async () => {
  const deps = nativeDependencies(config);
  const signal = new AbortController().signal;
  fetch.mockResolvedValueOnce(respond(discovery));
  const { url, pending } = await deps.prepare(signal);
  const params = new URL(url).searchParams;
  const { createHash } = jest.requireActual('node:crypto');
  expect(params.get('code_challenge')).toBe(createHash('sha256').update(pending.verifier).digest('base64url'));
  expect(params.get('code_challenge_method')).toBe('S256');
  expect(params.get('redirect_uri')).toBe(redirectUri);
  expect(params.get('response_type')).toBe('code');
  expect(params.get('prompt')).toBe('login');
  expect(params.get('scope')).toBe('openid');
  expect(params.get('state')).toBe(pending.state);
  expect(params.get('nonce')).toBe(pending.nonce);
  expect(params.has('code_verifier')).toBe(false);
  jest.mocked(WebBrowser.openAuthSessionAsync).mockResolvedValueOnce({ type: 'cancel' } as WebBrowser.WebBrowserAuthSessionResult);
  expect(await deps.browse(url)).toBeNull();
  expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(url, redirectUri, {
    toolbarColor: colors.surface.app,
    showTitle: true,
  });

  fetch.mockResolvedValueOnce(respond(discovery)).mockResolvedValueOnce(respond({ error: 'invalid_grant' }, 400));
  await expect(deps.exchange('single-code', pending, signal)).rejects.toThrow(AuthError);
  const [destination, options] = fetch.mock.calls.at(-1)!;
  expect(destination).toBe(base + '/token');
  expect(options).toMatchObject({ method: 'POST', redirect: 'error', credentials: 'omit' });
  const body = new URLSearchParams(String(options?.body));
  expect(body.get('code_verifier')).toBe(pending.verifier);
  expect(body.get('redirect_uri')).toBe(redirectUri);
  expect(body.has('client_secret')).toBe(false);
});

it('cancels a deferred discovery before it can POST credentials', async () => {
  const controller = new AbortController();
  fetch.mockImplementationOnce(async () => {
    controller.abort();
    return respond(discovery);
  });
  const pending: Pending = { kind: 'pending', state: 's', nonce: 'n', verifier: 'a'.repeat(43), deadline: 10_000, requireIssuer: true };
  await expect(nativeDependencies(config).exchange('code', pending, controller.signal)).rejects.toThrow('canceled');
  expect(fetch).toHaveBeenCalledTimes(1);
});

function restoringSession() {
  const record: Recovery = { kind: 'refresh', refresh: 'saved-refresh', subject: 'customer-a', nonce: 'saved-nonce' };
  const deps = nativeDependencies(config);
  const vault = {
    load: async () => record,
    invalidate: jest.fn(), erase: jest.fn(async () => {}),
    save: jest.fn(async (_record: RecordData) => {}), start: jest.fn(),
  };
  const session = new Session(config, { ...deps, vault, revoke: jest.fn(async () => {}) });
  return { session, vault, record };
}

it('preserves the saved session when discovery returns 408 and restores it on explicit retry', async () => {
  const { session, vault, record } = restoringSession();
  fetch.mockResolvedValueOnce(respond({}, 408));

  await session.initialize();
  expect(session.snapshot().status).toBe('retry');
  expect(vault.invalidate).not.toHaveBeenCalled();
  expect(vault.erase).not.toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][1]?.method).toBe('GET');

  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claims = { iss: config.issuer, sub: record.subject, aud: 'banking-core-api',
    typ: 'Bearer', exp: Math.floor(Date.now() / 1_000) + 300 };
  fetch.mockResolvedValueOnce(respond(discovery))
    .mockResolvedValueOnce(respond({ token_type: 'Bearer', access_token: `${encode({ alg: 'RS256' })}.${encode(claims)}.test`,
      refresh_token: 'rotated-refresh' }))
    .mockResolvedValueOnce(respond({ accounts: [] }));
  try {
    await session.retry();
    expect(session.snapshot().status).toBe('authenticated');
    expect(vault.save).toHaveBeenCalledWith({ ...record, refresh: 'rotated-refresh' });
    const refreshBody = new URLSearchParams(String(fetch.mock.calls[2][1]?.body));
    expect(refreshBody.get('refresh_token')).toBe(record.refresh);
  } finally {
    await session.signOut();
  }
});

it('erases an invalid refresh credential on restart before probing the banking API', async () => {
  const { session, vault } = restoringSession();
  fetch.mockResolvedValueOnce(respond(discovery)).mockResolvedValueOnce(respond({ error: 'invalid_grant' }, 400));

  await session.initialize();
  expect(session.snapshot().status).toBe('invalid');
  expect(vault.invalidate).toHaveBeenCalledTimes(1);
  expect(vault.erase).toHaveBeenCalledTimes(1);
  expect(vault.save).not.toHaveBeenCalled();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0]).toBe(base + '/token');
});

it('sends the access-token hint when revoking a memory-only grant', async () => {
  fetch.mockResolvedValueOnce(respond(discovery)).mockResolvedValueOnce(respond({}));

  await nativeDependencies(config).revoke('memory-only-access', 'access_token');
  const [destination, options] = fetch.mock.calls[1];
  expect(destination).toBe(base + '/revoke');
  const body = new URLSearchParams(String(options?.body));
  expect(body.get('token')).toBe('memory-only-access');
  expect(body.get('token_type_hint')).toBe('access_token');
});
