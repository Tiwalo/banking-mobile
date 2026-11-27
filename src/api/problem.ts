import { isProblem } from './generated/validate.cjs';

const messages = {
  configuration: 'Configure the banking API base URL.',
  'invalid-request': 'Check the request parameters.',
  unauthenticated: 'Banking access requires authentication.',
  forbidden: 'Banking access was denied.',
  'not-found': 'The requested banking resource is unavailable.',
  http: 'The banking service could not fulfill the request.',
  'invalid-response': 'The banking service returned an unexpected response.',
  network: 'The banking service could not be reached.',
  timeout: 'The banking request timed out.',
  canceled: 'The banking request was canceled.',
} as const;

export class BankingApiError extends Error {
  constructor(
    readonly kind: keyof typeof messages,
    readonly status?: number,
  ) {
    super(messages[kind]);
    this.name = 'BankingApiError';
  }
}

export function readProblem(status: number, value: unknown, allowsNotFound: boolean): BankingApiError {
  if (isProblem(value) && value.status === status) {
    if (status === 400 && value.code === 'INVALID_REQUEST') return new BankingApiError('invalid-request', status);
    if (status === 401 && value.code === 'UNAUTHORIZED') return new BankingApiError('unauthenticated', status);
    if (status === 403 && value.code === 'FORBIDDEN') return new BankingApiError('forbidden', status);
    if (allowsNotFound && status === 404 && value.code === 'NOT_FOUND') return new BankingApiError('not-found', status);
  }

  return new BankingApiError('http', status);
}
