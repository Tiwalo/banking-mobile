import { BankingApiError } from '@/api/problem';
import { createBankingQueryClient } from '@/api/query-client';
import type { Dependencies } from './native';
import { AuthError, callbackCode, type AuthConfig, type Grant, type Pending, type Recovery } from './protocol';

type Api = Dependencies['api'];
type ScopedApi = {
  listAccounts(query?: Parameters<Api['listAccounts']>[1], signal?: AbortSignal): ReturnType<Api['listAccounts']>;
  getAccount(id: string, signal?: AbortSignal): ReturnType<Api['getAccount']>;
  getTransferReceipt(id: string, signal?: AbortSignal): ReturnType<Api['getTransferReceipt']>;
};
export type SessionView = { status: 'unconfigured' | 'restoring' | 'signedOut' | 'authorizing' | 'interrupted' |
  'invalid' | 'retry' | 'denied' | 'cleanup' | 'signingOut' } |
  { status: 'authenticated'; reads: ScopedApi; queryClient: ReturnType<typeof createBankingQueryClient>['client'] };

export class Session {
  private view: SessionView = { status: 'restoring' };
  private listeners = new Set<() => void>();
  private generation = 0;
  private lifecycle = new AbortController();
  private tail: Promise<unknown> = Promise.resolve();
  private boot?: Promise<void>;
  private pending?: Pending;
  private recovery?: Recovery;
  private grant?: Grant;
  private scope?: { abort: AbortController; query: ReturnType<typeof createBankingQueryClient> };
  private expiry?: ReturnType<typeof setTimeout>;
  private refreshing?: Promise<void>;

  constructor(private config: AuthConfig, private deps: Dependencies) {}

  snapshot = () => this.view;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private publish(view: SessionView) {
    this.view = view;
    this.listeners.forEach(listener => listener());
  }

  // Serialize secure-record transitions, including cleanup after an interrupted write.
  private queue<T>(work: () => Promise<T>) {
    const task = this.tail.then(work);
    this.tail = task.catch(() => {});
    return task;
  }

  private check(generation: number) {
    if (generation !== this.generation) throw new AuthError('canceled');
  }

  private advanceGeneration() {
    this.lifecycle.abort();
    this.lifecycle = new AbortController();
    return ++this.generation;
  }

  private closeScope() {
    clearTimeout(this.expiry);
    this.scope?.abort.abort();
    void this.scope?.query.dispose();
    this.scope = undefined;
  }

  private forget() {
    this.closeScope();
    this.pending = undefined;
    this.recovery = undefined;
    this.grant = undefined;
    this.refreshing = undefined;
  }

  private async clean(generation: number, status: 'denied' | 'invalid' | 'signedOut') {
    this.forget();
    this.publish({ status: 'signingOut' });
    let failed = false;
    try { this.deps.vault.invalidate(); } catch { failed = true; }
    try { await this.deps.vault.erase(); } catch { failed = true; }
    if (generation === this.generation) this.publish({ status: failed ? 'cleanup' : status });
  }

  private async failed(generation: number, error: unknown) {
    if (generation !== this.generation) return;
    this.closeScope();
    const temporary = (error instanceof AuthError && error.kind === 'temporary') ||
      (error instanceof BankingApiError && ['network', 'timeout'].includes(error.kind)) ||
      (error instanceof BankingApiError && (error.status ?? 0) >= 500);
    if (temporary && (this.recovery || this.grant)) {
      this.publish({ status: 'retry' });
      return;
    }
    const denied = error instanceof BankingApiError && error.kind === 'forbidden';
    await this.clean(generation, denied ? 'denied' : error instanceof AuthError && error.kind === 'canceled' ? 'signedOut' : 'invalid');
  }

  initialize = () => {
    const generation = this.generation;
    return this.boot ??= this.queue(async () => {
      try {
        const record = await this.deps.vault.load();
        this.check(generation);
        if (record?.kind === 'refresh') {
          this.recovery = record;
          await this.rotate(generation);
          await this.admit(generation);
        } else if (record?.kind === 'pending' && record.deadline > this.deps.now()) {
          this.pending = record;
          this.publish({ status: 'interrupted' });
        } else {
          await this.clean(generation, 'signedOut');
        }
      } catch (error) { await this.failed(generation, error); }
    });
  };

  signIn = async () => {
    await this.initialize();
    if (!['signedOut', 'interrupted', 'denied', 'invalid'].includes(this.view.status)) return;
    const generation = this.advanceGeneration();
    const { signal } = this.lifecycle;
    this.publish({ status: 'authorizing' });
    try {
      const url = await this.queue(async () => {
        this.check(generation);
        this.pending = undefined;
        this.deps.vault.invalidate();
        await this.deps.vault.erase();
        const { url, pending } = await this.deps.prepare(signal);
        const marker = await this.deps.random();
        this.check(generation);
        this.deps.vault.start(marker);
        await this.deps.vault.save(pending);
        this.check(generation);
        this.pending = pending;
        return url;
      });
      this.check(generation);
      const result = await this.deps.browse(url);
      this.check(generation);
      if (result) await this.callback(result, true);
      else await this.queue(async () => {
        if (generation === this.generation && this.pending) await this.clean(generation, 'signedOut');
      });
    } catch (error) {
      await this.queue(async () => {
        if (this.view.status === 'authorizing') await this.failed(generation, error);
      });
    }
  };

  callback = async (raw: string, browserReturned = false) => {
    const generation = this.generation;
    await this.initialize();
    await this.queue(async () => {
      if (this.generation !== generation || !this.pending) return;
      try {
        const pending = this.pending;
        const states = new URLSearchParams(raw.slice(raw.indexOf('?') + 1)).getAll('state');
        if (states.length !== 1 || states[0] !== pending.state) {
          if (browserReturned) this.publish({ status: 'interrupted' });
          return;
        }
        const code = callbackCode(raw, pending, this.config, this.deps.now());
        this.pending = undefined;
        this.publish({ status: 'authorizing' });
        // A process death after this delete requires a new hosted sign-in.
        await this.deps.vault.erase();
        this.check(generation);
        await this.commit(generation, await this.deps.exchange(code, pending, this.lifecycle.signal));
        await this.admit(generation);
      } catch (error) { await this.failed(generation, error); }
    });
  };

  private async commit(generation: number, grant: Grant) {
    const record: Recovery | undefined = grant.refresh ? {
      kind: 'refresh', refresh: grant.refresh, subject: grant.subject, nonce: grant.nonce,
    } : undefined;
    try {
      this.check(generation);
      if (record) await this.deps.vault.save(record);
      this.check(generation);
    } catch (error) {
      // A rotation may arrive after local logout or fail to reach durable storage.
      if (record) void this.deps.revoke(record.refresh).catch(() => {});
      throw error;
    }
    this.recovery = record;
    this.grant = grant;
  }

  private async rotate(generation: number) {
    this.check(generation);
    const old = this.recovery;
    if (!old) throw new AuthError('invalid');
    const grant = await this.deps.refresh(old, this.lifecycle.signal);
    if (!grant.refresh || grant.refresh === old.refresh || grant.subject !== old.subject) throw new AuthError('invalid');
    await this.commit(generation, grant);
  }

  private async admit(generation: number) {
    this.check(generation);
    const { signal } = this.lifecycle;
    const probe = () => {
      this.check(generation);
      return this.deps.api.listAccounts({ accessToken: this.grant!.access, signal }, { limit: 1 });
    };
    try { await probe(); } catch (error) {
      if (!(error instanceof BankingApiError && error.kind === 'unauthenticated')) throw error;
      await this.rotate(generation);
      await probe();
    }
    this.check(generation);
    if (!this.grant || this.grant.expires <= this.deps.now()) throw new AuthError('invalid');
    const abort = new AbortController();
    const query = createBankingQueryClient();
    this.scope = { abort, query };
    const api = this.deps.api;
    const read = <T>(signal: AbortSignal | undefined, get: (token: string, signal: AbortSignal) => Promise<T>) =>
      this.read(generation, abort.signal, signal, get);
    this.publish({ status: 'authenticated', queryClient: query.client, reads: {
      listAccounts: (params, signal) => read(signal, (accessToken, signal) => api.listAccounts({ accessToken, signal }, params)),
      getAccount: (id, signal) => read(signal, (accessToken, signal) => api.getAccount(id, { accessToken, signal })),
      getTransferReceipt: (id, signal) => read(signal, (accessToken, signal) => api.getTransferReceipt(id, { accessToken, signal })),
    } });
    this.scheduleExpiry();
  }

  private scheduleExpiry() {
    clearTimeout(this.expiry);
    if (this.grant) this.expiry = setTimeout(this.foreground, Math.min(2_147_483_647, Math.max(0, this.grant.expires - this.deps.now())));
  }

  private refreshOnce(generation: number) {
    if (this.refreshing) return this.refreshing;
    const task = this.queue(async () => {
      try {
        await this.rotate(generation);
        if (this.scope) this.scheduleExpiry();
        else await this.admit(generation);
      } catch (error) { await this.failed(generation, error); }
    });
    this.refreshing = task;
    void task.finally(() => { if (this.refreshing === task) this.refreshing = undefined; });
    return task;
  }

  foreground = () => {
    if (!this.grant || this.view.status !== 'authenticated') return;
    if (this.grant.expires > this.deps.now()) { this.scheduleExpiry(); return; }
    this.closeScope();
    this.publish({ status: 'restoring' });
    void this.refreshOnce(this.generation);
  };

  retry = async () => {
    if (this.view.status !== 'retry') return;
    const generation = this.generation;
    this.publish({ status: 'restoring' });
    await this.queue(async () => {
      try {
        if (!this.grant || this.grant.expires <= this.deps.now()) await this.rotate(generation);
        await this.admit(generation);
      } catch (error) { await this.failed(generation, error); }
    });
  };

  private async read<T>(generation: number, scope: AbortSignal, signal: AbortSignal | undefined,
    get: (token: string, signal: AbortSignal) => Promise<T>): Promise<T> {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    const active = () => {
      if (scope.aborted || signal?.aborted || controller.signal.aborted) throw new BankingApiError('canceled');
      if (this.grant && this.grant.expires <= this.deps.now()) {
        this.foreground();
        throw new BankingApiError('canceled');
      }
    };
    active();
    scope.addEventListener('abort', cancel);
    signal?.addEventListener('abort', cancel);
    try {
      const original = this.grant;
      if (!original) throw new BankingApiError('unauthenticated');
      try {
        const result = await get(original.access, controller.signal);
        active();
        return result;
      } catch (error) {
        active();
        if (!(error instanceof BankingApiError && error.kind === 'unauthenticated')) throw error;
      }
      if (this.grant === original) await this.refreshOnce(generation);
      active();
      const result = await get(this.grant!.access, controller.signal);
      active();
      return result;
    } catch (error) {
      active();
      if (error instanceof BankingApiError && error.kind === 'unauthenticated') {
        await this.queue(async () => { if (!scope.aborted) await this.failed(generation, error); });
      }
      throw error;
    } finally {
      signal?.removeEventListener('abort', cancel);
      scope.removeEventListener('abort', cancel);
    }
  }

  signOut = () => {
    const generation = this.advanceGeneration();
    const refresh = this.recovery?.refresh;
    const access = this.grant?.access;
    this.forget();
    this.publish({ status: 'signingOut' });
    // Invalidate restoration now, even if a previous native write is still settling.
    try { this.deps.vault.invalidate(); } catch { /* clean retries both barriers */ }
    if (refresh) void this.deps.revoke(refresh).catch(() => {});
    else if (access) void this.deps.revoke(access, 'access_token').catch(() => {});
    return this.queue(async () => {
      if (generation === this.generation) await this.clean(generation, 'signedOut');
    });
  };

  switchAccount = async () => {
    await this.signOut();
    if (this.view.status === 'signedOut') await this.signIn();
  };
}
