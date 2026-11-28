export const redirectUri = 'com.tiwalo.banking.dev:/oauth2redirect/keycloak';
export const requestLifetime = 10 * 60_000;

export type AuthConfig = { issuer: string; clientId: string; apiBase: string };
export type Pending = {
  kind: 'pending'; state: string; nonce: string; verifier: string; deadline: number; requireIssuer: boolean;
};
export type Identity = { subject: string; nonce: string };
export type Recovery = Identity & { kind: 'refresh'; refresh: string };
export type RecordData = Pending | Recovery;
export type Grant = Identity & { access: string; expires: number; refresh?: string };

export class AuthError extends Error {
  constructor(readonly kind: 'invalid' | 'temporary' | 'storage' | 'canceled') {
    super(kind);
  }
}

export function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function trustedUrl(input: string) {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
      input.includes('\\') || /[\s?#]/.test(input) || url.href !== input) throw new AuthError('invalid');
  return url;
}

export function configuration(issuer?: string, clientId?: string, apiBase?: string): AuthConfig | undefined {
  if (!issuer || !clientId || !apiBase) return;
  try {
    const realm = trustedUrl(issuer);
    const api = trustedUrl(apiBase);
    if (!/^\/realms\/[\w.-]+$/.test(realm.pathname) || !/^[\w.-]+$/.test(clientId) ||
        api.pathname !== '/api/v1') return;
    return { issuer, clientId, apiBase };
  } catch {
    return;
  }
}

export function readDiscovery(value: unknown, config: AuthConfig) {
  if (!object(value) || value.issuer !== config.issuer) throw new AuthError('invalid');
  function endpoint(raw: unknown, suffix: string) {
    if (raw !== config.issuer + '/protocol/openid-connect/' + suffix) throw new AuthError('invalid');
    return String(raw);
  }
  return {
    authorize: endpoint(value.authorization_endpoint, 'auth'),
    token: endpoint(value.token_endpoint, 'token'),
    revoke: endpoint(value.revocation_endpoint, 'revoke'),
    requireIssuer: value.authorization_response_iss_parameter_supported === true,
  };
}

export function callbackCode(raw: string, pending: Pending, config: AuthConfig, now: number) {
  const question = raw.indexOf('?');
  if (question < 0 || raw.slice(0, question) !== redirectUri || raw.includes('#') ||
      pending.deadline <= now || pending.deadline > now + requestLifetime) throw new AuthError('invalid');
  const params = new URLSearchParams(raw.slice(question + 1));
  const seen = new Set<string>();
  for (const [key] of params) {
    if (seen.has(key) || !['code', 'state', 'iss', 'session_state', 'error', 'error_description', 'error_uri'].includes(key)) {
      throw new AuthError('invalid');
    }
    seen.add(key);
  }
  if (params.get('state') !== pending.state ||
      ((pending.requireIssuer || params.has('iss')) && params.get('iss') !== config.issuer) ||
      params.has('code') === params.has('error')) throw new AuthError('invalid');
  if (params.has('error')) throw new AuthError(params.get('error') === 'access_denied' ? 'canceled' : 'invalid');
  const code = params.get('code');
  if (!nonempty(code)) throw new AuthError('invalid');
  return code;
}

function jwt(raw: unknown) {
  if (!nonempty(raw)) throw new AuthError('invalid');
  const parts = raw.split('.');
  if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) throw new AuthError('invalid');
  function decode(part: string) {
    const bytes = Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const result: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!object(result)) throw new AuthError('invalid');
    return result;
  }
  try {
    if (decode(parts[0]).alg !== 'RS256') throw new AuthError('invalid');
    return decode(parts[1]);
  } catch {
    throw new AuthError('invalid');
  }
}

function validTime(exp: unknown, now: number): exp is number {
  return typeof exp === 'number' && Number.isSafeInteger(exp) && exp * 1000 > now;
}

// Only for the direct, authenticated TLS token response. Never accept tokens from a link or storage.
export function readGrant(body: unknown, config: AuthConfig, nonce: string, now: number, previous?: Identity): Grant {
  if (!object(body) || !nonempty(body.access_token) || typeof body.token_type !== 'string' || body.token_type.toLowerCase() !== 'bearer') {
    throw new AuthError('invalid');
  }
  const access = jwt(body.access_token);
  const audiences = Array.isArray(access.aud) ? access.aud : [access.aud];
  if (access.iss !== config.issuer || !nonempty(access.sub) || access.typ !== 'Bearer' ||
      !audiences.includes('banking-core-api') || !validTime(access.exp, now) ||
      (access.nbf !== undefined && !(typeof access.nbf === 'number' && access.nbf <= now / 1000)) ||
      (previous && previous.subject !== access.sub)) throw new AuthError('invalid');
  if (!previous || body.id_token !== undefined) {
    const id = jwt(body.id_token);
    const idAud = Array.isArray(id.aud) ? id.aud : [id.aud];
    if (id.iss !== config.issuer || id.sub !== access.sub || idAud.length !== 1 || idAud[0] !== config.clientId ||
        (id.azp !== undefined && id.azp !== config.clientId) || !validTime(id.exp, now) ||
        typeof id.iat !== 'number' || !Number.isSafeInteger(id.iat) || id.iat > now / 1000 + 60 || id.iat >= id.exp ||
        (id.nbf !== undefined && !(typeof id.nbf === 'number' && id.nbf <= now / 1000)) ||
        ((!previous || id.nonce !== undefined) && id.nonce !== nonce)) throw new AuthError('invalid');
  }
  if (body.refresh_token !== undefined && !nonempty(body.refresh_token)) throw new AuthError('invalid');
  if (body.expires_in !== undefined && !(typeof body.expires_in === 'number' && Number.isSafeInteger(body.expires_in) &&
      body.expires_in > 0)) throw new AuthError('invalid');
  return {
    access: body.access_token, subject: access.sub, nonce,
    expires: Math.min(access.exp * 1000, typeof body.expires_in === 'number' ? now + body.expires_in * 1000 : Infinity),
    refresh: body.refresh_token,
  };
}
