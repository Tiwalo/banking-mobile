import { fetch as expoFetch } from 'expo/fetch';
import { Platform } from 'react-native';

import type { operations, paths } from './generated/banking';
import { isAccount, isAccountLimit, isAccountPage, isCursor, isId, isTransferReceipt } from './generated/validate.cjs';
import { BankingApiError, readProblem } from './problem';

type AccountQuery = NonNullable<operations['listAccounts']['parameters']['query']>;
type AccountId = operations['getAccount']['parameters']['path']['accountId'];
type TransferId = operations['getTransferReceipt']['parameters']['path']['transferId'];
type ReadResponse = Pick<Response, 'status' | 'text'> & { headers: Pick<Headers, 'get'> };
export type BankingFetch = (url: string, init: RequestInit) => Promise<ReadResponse>;

type RequestOptions = {
  accessToken: string;
  signal?: AbortSignal;
};

const REQUEST_TIMEOUT_MS = 15_000;

function resolveBaseUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value || !/^https?:\/\/[^/?#\\]+\/api\/v1\/?$/i.test(value)) {
    throw new BankingApiError('configuration');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new BankingApiError('configuration');
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  const androidHost = Platform.OS === 'android' && url.hostname === '10.0.2.2';
  const localHttp = __DEV__ && url.protocol === 'http:' && (loopback || androidHost);
  if ((!localHttp && url.protocol !== 'https:') || url.username || url.password ||
      url.search || url.hash || (url.pathname !== '/api/v1' && url.pathname !== '/api/v1/')) {
    throw new BankingApiError('configuration');
  }

  return url.href.replace(/\/$/, '');
}

async function withDeadline<T>(signal: AbortSignal | undefined, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  if (signal?.aborted) throw new BankingApiError('canceled');

  const controller = new AbortController();
  let cancel: () => void = () => {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  const interrupted = new Promise<never>((_resolve, reject) => {
    const interrupt = (kind: 'canceled' | 'timeout') => {
      reject(new BankingApiError(kind));
      controller.abort();
    };
    cancel = () => interrupt('canceled');
    timer = setTimeout(() => interrupt('timeout'), REQUEST_TIMEOUT_MS);
    signal?.addEventListener('abort', cancel, { once: true });
  });

  try {
    return await Promise.race([run(controller.signal), interrupted]);
  } catch (error) {
    if (!controller.signal.aborted) controller.abort();
    if (error instanceof BankingApiError) throw error;
    throw new BankingApiError('network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

export function createBankingApi(options: { baseUrl?: string; fetch?: BankingFetch } = {}) {
  const baseUrl = resolveBaseUrl(options.baseUrl ?? process.env.EXPO_PUBLIC_BANKING_API_BASE_URL);
  const fetch = options.fetch ?? expoFetch;

  function read<T>(
    path: string,
    { accessToken, signal }: RequestOptions,
    validate: (value: unknown) => value is T,
    allowsNotFound: boolean,
  ): Promise<T> {
    if (typeof accessToken !== 'string' || !/^[A-Za-z0-9._~+/-]+=*$/.test(accessToken)) {
      return Promise.reject(new BankingApiError('unauthenticated'));
    }

    return withDeadline(signal, async (requestSignal) => {
      const response = await fetch(baseUrl + path, {
        method: 'GET',
        headers: {
          Accept: 'application/json, application/problem+json',
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache, no-store',
        },
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'error',
        signal: requestSignal,
      });
      const status = response.status;
      const mediaType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
      if (status >= 400) {
        const problem = mediaType === 'application/problem+json' ? parseJson(await response.text()) : undefined;
        throw readProblem(status, problem, allowsNotFound);
      }
      if (status !== 200 || mediaType !== 'application/json') throw new BankingApiError('invalid-response', status);

      const data = parseJson(await response.text());
      if (!validate(data)) throw new BankingApiError('invalid-response', status);
      return data;
    });
  }

  return {
    async listAccounts(request: RequestOptions, query: AccountQuery = {}) {
      const { limit, cursor } = query;
      const params = new URLSearchParams();
      if (limit !== undefined) {
        if (!isAccountLimit(limit)) throw new BankingApiError('invalid-request');
        params.set('limit', String(limit));
      }
      if (cursor !== undefined) {
        if (!isCursor(cursor)) throw new BankingApiError('invalid-request');
        params.set('cursor', cursor);
      }

      const path: keyof paths = '/accounts';
      const search = params.toString();
      return read(search ? `${path}?${search}` : path, request, isAccountPage, false);
    },

    async getAccount(accountId: AccountId, request: RequestOptions) {
      if (!isId(accountId)) throw new BankingApiError('invalid-request');
      const path: keyof paths = '/accounts/{accountId}';
      const account = await read(path.replace('{accountId}', encodeURIComponent(accountId)), request, isAccount, true);
      if (account.accountId.toLowerCase() !== accountId.toLowerCase()) throw new BankingApiError('invalid-response', 200);
      return account;
    },

    async getTransferReceipt(transferId: TransferId, request: RequestOptions) {
      if (!isId(transferId)) throw new BankingApiError('invalid-request');
      const path: keyof paths = '/transfers/{transferId}';
      const receipt = await read(path.replace('{transferId}', encodeURIComponent(transferId)), request, isTransferReceipt, true);
      if (receipt.transferId.toLowerCase() !== transferId.toLowerCase()) throw new BankingApiError('invalid-response', 200);
      return receipt;
    },
  };
}
