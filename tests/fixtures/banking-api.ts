import type { BankingFetch } from '../../src/api/banking-api';
import type { components, operations } from '../../src/api/generated/banking';

// Synthetic API 1.1.0 responses used only with the injected Jest transport.
export const ownedAccount = {
  accountId: '00000000-0000-4000-8000-000000000001',
  recipientReference: 'rcp_demo_alder',
  status: 'ACTIVE',
  currency: 'PHP',
  availableBalanceMinor: '9007199254740993',
} satisfies components['schemas']['Account'];

export const postedReceipt = {
  transferId: '00000000-0000-4000-8000-000000000002',
  sourceAccountId: ownedAccount.accountId,
  recipientReference: 'rcp_demo_birch',
  currency: 'PHP',
  amountMinor: '500000',
  status: 'POSTED',
  postedAt: '2026-11-18T02:30:00Z',
} satisfies components['schemas']['TransferReceipt'];

export const accountPage = {
  accounts: [ownedAccount],
  nextCursor: 'demo+/=&?',
} satisfies operations['listAccounts']['responses'][200]['content']['application/json'];

export const unauthorized = {
  type: 'urn:tiwalo:problem:unauthorized', title: 'Authentication required', status: 401, code: 'UNAUTHORIZED',
} satisfies operations['listAccounts']['responses'][401]['content']['application/problem+json'];

export const forbidden = {
  type: 'urn:tiwalo:problem:forbidden', title: 'Permission denied', status: 403, code: 'FORBIDDEN',
} satisfies operations['listAccounts']['responses'][403]['content']['application/problem+json'];

export const notFound = {
  type: 'urn:tiwalo:problem:not-found', title: 'Resource not found', status: 404, code: 'NOT_FOUND',
} satisfies operations['getAccount']['responses'][404]['content']['application/problem+json'];

export function rawResponse(body: string, status: number, mediaType: string, extraHeaders: Record<string, string> = {}) {
  const headers = { 'content-type': mediaType, ...extraHeaders };
  return {
    status,
    headers: { get: (name: string) => Object.entries(headers).find(([key]) => key === name.toLowerCase())?.[1] ?? null },
    text: async () => body,
  } satisfies Awaited<ReturnType<BankingFetch>>;
}

export function jsonResponse(value: unknown) {
  return rawResponse(JSON.stringify(value), 200, 'application/json; charset=utf-8');
}

export function problemResponse(problem: components['schemas']['Problem'], status = problem.status) {
  return rawResponse(JSON.stringify(problem), status, 'application/problem+json; charset=utf-8',
    status === 401 ? { 'www-authenticate': 'Bearer' } : {});
}
