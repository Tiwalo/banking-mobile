import { AuthError, callbackCode, configuration, readDiscovery, readGrant, redirectUri, type Pending } from '../src/auth/protocol';
import { createVault } from '../src/auth/vault';

const config = { issuer: 'https://id.example/realms/tiwalo', clientId: 'mobile', apiBase: 'https://api.example/api/v1' };
const pending: Pending = { kind: 'pending', verifier: 'v'.repeat(43), nonce: 'nonce', state: 'state', deadline: 10_000, requireIssuer: true };
const query = '?state=state&code=short&iss=' + encodeURIComponent(config.issuer);
const metadata = {
  issuer: config.issuer,
  authorization_endpoint: config.issuer + '/protocol/openid-connect/auth',
  token_endpoint: config.issuer + '/protocol/openid-connect/token',
  revocation_endpoint: config.issuer + '/protocol/openid-connect/revoke',
};

it('restricts the configured realm, API and credential-bearing endpoints', () => {
  expect(configuration(config.issuer, config.clientId, config.apiBase)).toEqual(config);
  for (const issuer of ['http://id.example/realms/tiwalo', config.issuer + '?', config.issuer + '#', 'https://id.example/realms/a/../tiwalo']) {
    expect(configuration(issuer, config.clientId, config.apiBase)).toBeUndefined();
  }
  expect(configuration(config.issuer, 'mobile', 'http://localhost/api/v1')).toBeUndefined();
  expect(readDiscovery(metadata, config).token).toBe(metadata.token_endpoint);
  for (const key of Object.keys(metadata)) expect(() => readDiscovery({ ...metadata, [key]: 'https://other.example' }, config)).toThrow(AuthError);
});

it('accepts only the exact, live, state-bound callback', () => {
  expect(callbackCode(redirectUri + query, pending, config, 100)).toBe('short');
  for (const raw of [
    redirectUri.replace(':/', '://') + query, redirectUri + '/' + query, redirectUri + query + '#',
    redirectUri + query + '&code=second', redirectUri + query + '&access_token=value',
    redirectUri + query + '&error=error', redirectUri + '?state=state&code=short',
    redirectUri + query.replace('state=state', 'state=other'), redirectUri + query.replace('tiwalo', 'other'),
  ]) expect(() => callbackCode(raw, pending, config, 100)).toThrow(AuthError);
  expect(() => callbackCode(redirectUri + query, pending, config, 10_000)).toThrow(AuthError);
  expect(() => callbackCode(redirectUri + query.replace('code=short', 'error=access_denied'), pending, config, 100)).toThrow('canceled');
});

function jwt(claims: object, alg = 'RS256') {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return [encode({ alg }), encode(claims), 'test'].join('.');
}
const claims = { iss: config.issuer, sub: 'actor-a', aud: 'mobile', azp: 'mobile', exp: 300, iat: 4, nonce: 'nonce' };
const access = { ...claims, aud: ['banking-core-api'], typ: 'Bearer' };
const response = { id_token: jwt(claims), access_token: jwt(access), refresh_token: 'rotation', token_type: 'Bearer', expires_in: 100 };
it('binds the directly issued access and ID tokens to the initiating customer', () => {
  const grant = readGrant(response, config, 'nonce', 5000);
  expect(grant.expires).toBe(105_000);
  for (const change of [{ iss: 'other' }, { aud: 'other' }, { azp: 'other' }, { sub: 'other' }, { nonce: 'other' },
    { exp: 4 }, { iat: 200 }, { aud: ['mobile', 'unexpected'] }]) {
    expect(() => readGrant({ ...response, id_token: jwt({ ...claims, ...change }) }, config, 'nonce', 5000)).toThrow(AuthError);
  }
  for (const change of [{ aud: 'mobile' }, { typ: 'ID' }, { exp: 4 }, { nbf: 200 }]) {
    expect(() => readGrant({ ...response, access_token: jwt({ ...access, ...change }) }, config, 'nonce', 5000)).toThrow(AuthError);
  }
  expect(() => readGrant({ ...response, id_token: jwt(claims, 'none') }, config, 'nonce', 5000)).toThrow(AuthError);
  expect(() => readGrant({ ...response, id_token: undefined }, config, 'nonce', 5000)).toThrow(AuthError);
  expect(readGrant({ ...response, id_token: undefined }, config, 'nonce', 5000, grant).subject).toBe(grant.subject);
  expect(() => readGrant({ ...response, id_token: undefined }, config, 'nonce', 5000, { ...grant, subject: 'actor-b' })).toThrow(AuthError);
});

it('requires a matching environment and install marker on restart and after interrupted logout', async () => {
  let marker: string | null = null;
  let raw: string | null = null;
  const storage = {
    marker: () => marker, setMarker: (id: string) => { marker = id; }, removeMarker: () => { marker = null; },
    read: async () => raw, write: async (value: string) => { raw = value; }, remove: async () => { raw = null; },
  };
  const vault = createVault(config, storage);
  vault.start('installation');
  await vault.save(pending);
  expect(raw).toContain(redirectUri);
  expect(await createVault(config, storage).load()).toEqual(pending);
  await expect(createVault({ ...config, clientId: 'other' }, storage).load()).rejects.toThrow(AuthError);
  vault.invalidate();
  await expect(createVault(config, storage).load()).rejects.toThrow(AuthError);
  await expect(vault.save(pending)).rejects.toThrow(AuthError);
  await vault.erase();
  expect(raw).toBeNull();
});
