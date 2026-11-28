import { AuthRequest, CodeChallengeMethod, Prompt, ResponseType } from 'expo-auth-session';
import { getRandomBytesAsync } from 'expo-crypto';
import { File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { fetch as expoFetch } from 'expo/fetch';

import { createBankingApi } from '@/api/banking-api';
import { colors } from '@/ui/tokens';
import { AuthError, object, readDiscovery, readGrant, redirectUri, requestLifetime, type AuthConfig, type Pending, type Recovery } from './protocol';
import { createVault } from './vault';

async function random() {
  return Array.from(await getRandomBytesAsync(32), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function request(url: string, signal?: AbortSignal, params?: Record<string, string>, noContent = false): Promise<unknown> {
  if (signal?.aborted) throw new AuthError('canceled');
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel);
  const timeout = setTimeout(cancel, 15_000);
  try {
    const response = await expoFetch(url, {
      method: params ? 'POST' : 'GET', credentials: 'omit', redirect: 'error',
      headers: { Accept: 'application/json', 'Cache-Control': 'no-store',
        ...(params && { 'Content-Type': 'application/x-www-form-urlencoded' }) },
      body: params ? new URLSearchParams(params).toString() : undefined,
      signal: controller.signal,
    });
    if (response.status >= 500 || response.status === 408 || response.status === 429) throw new AuthError('temporary');
    if (response.status !== 200) throw new AuthError('invalid');
    if (noContent) return;
    if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new AuthError('invalid');
    const text = await response.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { throw new AuthError('invalid'); }
    if (!object(body)) throw new AuthError('invalid');
    return body;
  } catch (error) {
    throw error instanceof AuthError ? error : new AuthError('temporary');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}

export function nativeDependencies(config: AuthConfig) {
  const marker = new File(Paths.cache, 'tiwalo-session-v1');
  const key = 'tiwalo.session.v1';
  const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };
  const vault = createVault(config, {
    marker: () => marker.exists ? marker.textSync() : null,
    setMarker(value) { marker.create({ overwrite: true }); marker.writeSync(value); },
    removeMarker() { if (marker.exists) marker.delete(); },
    read: () => SecureStore.getItemAsync(key, options),
    write: value => SecureStore.setItemAsync(key, value, options),
    remove: () => SecureStore.deleteItemAsync(key, options),
  });
  const api = createBankingApi({ baseUrl: config.apiBase });
  async function discover(signal?: AbortSignal) {
    return readDiscovery(await request(config.issuer + '/.well-known/openid-configuration', signal), config);
  }
  async function tokens(parameters: Record<string, string>, nonce: string, signal: AbortSignal, previous?: Recovery) {
    const { token } = await discover(signal);
    const body = await request(token, signal, { ...parameters, client_id: config.clientId });
    return readGrant(body, config, nonce, Date.now(), previous);
  }
  return {
    vault, api, now: Date.now, random,
    async prepare(signal: AbortSignal) {
      const discovery = await discover(signal);
      const state = await random();
      const nonce = await random();
      const auth = new AuthRequest({
        clientId: config.clientId, redirectUri, responseType: ResponseType.Code, scopes: ['openid'],
        usePKCE: true, codeChallengeMethod: CodeChallengeMethod.S256, state, prompt: Prompt.Login, extraParams: { nonce },
      });
      const url = await auth.makeAuthUrlAsync({ authorizationEndpoint: discovery.authorize });
      if (!auth.codeVerifier) throw new AuthError('invalid');
      const pending: Pending = { kind: 'pending', state, nonce, verifier: auth.codeVerifier,
        requireIssuer: discovery.requireIssuer, deadline: Date.now() + requestLifetime };
      return { url, pending };
    },
    async browse(url: string) {
      const result = await WebBrowser.openAuthSessionAsync(url, redirectUri, {
        toolbarColor: colors.surface.app,
        showTitle: true,
      });
      return result.type === 'success' ? result.url : null;
    },
    exchange: (code: string, pending: Pending, signal: AbortSignal) => tokens({
      grant_type: 'authorization_code', code, code_verifier: pending.verifier, redirect_uri: redirectUri,
    }, pending.nonce, signal),
    refresh: (record: Recovery, signal: AbortSignal) => tokens({ grant_type: 'refresh_token', refresh_token: record.refresh }, record.nonce, signal, record),
    async revoke(token: string, hint: 'refresh_token' | 'access_token' = 'refresh_token') {
      const { revoke } = await discover();
      await request(revoke, undefined, { client_id: config.clientId, token, token_type_hint: hint }, true);
    },
  };
}
export type Dependencies = ReturnType<typeof nativeDependencies>;
