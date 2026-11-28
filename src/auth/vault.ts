import { AuthError, nonempty, object, redirectUri, type AuthConfig, type RecordData } from './protocol';

type Storage = {
  marker(): string | null;
  setMarker(value: string): void;
  removeMarker(): void;
  read(): Promise<string | null>;
  write(value: string): Promise<void>;
  remove(): Promise<void>;
};

function validData(data: unknown): data is RecordData {
  if (!object(data) || !nonempty(data.nonce)) return false;
  if (data.kind === 'refresh') return nonempty(data.refresh) && nonempty(data.subject);
  return data.kind === 'pending' && nonempty(data.state) && nonempty(data.verifier) &&
    /^[A-Za-z0-9._~-]{43,128}$/.test(data.verifier) && typeof data.deadline === 'number' &&
    Number.isSafeInteger(data.deadline) && typeof data.requireIssuer === 'boolean';
}

export function createVault(config: AuthConfig, storage: Storage) {
  const scope = JSON.stringify([config.issuer, config.clientId, config.apiBase, redirectUri]);
  let marker: string | null = null;
  return {
    start(id: string) {
      storage.setMarker(id);
      marker = id;
    },
    invalidate() {
      marker = null;
      storage.removeMarker();
    },
    erase: () => storage.remove(),
    async load(): Promise<RecordData | null> {
      marker = storage.marker();
      const raw = await storage.read();
      if (!raw) return null;
      let record: unknown;
      try { record = JSON.parse(raw); } catch { throw new AuthError('invalid'); }
      if (!marker || !object(record) || record.version !== 1 || record.scope !== scope ||
          record.marker !== marker || !validData(record.data)) throw new AuthError('invalid');
      return record.data;
    },
    async save(data: RecordData) {
      if (!marker || storage.marker() !== marker) throw new AuthError('storage');
      await storage.write(JSON.stringify({ version: 1, scope, marker, data }));
    },
  };
}
export type Vault = ReturnType<typeof createVault>;
