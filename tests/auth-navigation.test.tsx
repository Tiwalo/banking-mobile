import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderRouter, screen, testRouter } from 'expo-router/testing-library';

import { BankingApiError } from '../src/api/problem';
import * as runtime from '../src/auth/runtime';
import { Session } from '../src/auth/session';
import { redirectUri, type Pending } from '../src/auth/protocol';
import { redirectSystemPath } from '../src/app/+native-intent';
import { accountPage, ownedAccount } from './fixtures/banking-api';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.setTimeout(45_000);

type ListAccounts = ConstructorParameters<typeof Session>[1]['api']['listAccounts'];

function createSession(listAccounts: ListAccounts) {
  const config = { issuer: 'https://identity.example/realms/test', clientId: 'mobile', apiBase: 'https://api.example/api/v1' };
  const pending: Pending = { kind: 'pending', state: 's', nonce: 'n', verifier: 'v'.repeat(43), deadline: Date.now() + 600_000, requireIssuer: false };
  const grant = { access: 'access-a', subject: 'a', nonce: 'n', expires: Date.now() + 300_000 };
  return new Session(config, {
    vault: { load: async () => null, start: jest.fn(), save: jest.fn(), erase: jest.fn(), invalidate: jest.fn() },
    api: { listAccounts, getAccount: jest.fn(), getTransferReceipt: jest.fn() },
    prepare: async () => ({ pending, url: 'https://identity.example/login' }),
    browse: async () => redirectUri + '?state=s&code=c', exchange: async () => grant,
    revoke: jest.fn(async () => {}), refresh: jest.fn(),
    random: async () => 'marker', now: Date.now,
  });
}

async function signIn() {
  await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).toBeOnTheScreen());
  await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  await waitFor(() => expect(screen).toHavePathname('/home'));
}

it('admits a verified session, excludes development fixtures and removes protected navigation on logout', async () => {
  const session = createSession(async () => ({ accounts: [] }));
  const live = jest.spyOn(runtime, 'nativeSession').mockReturnValue(session);
  try {
    await renderRouter('./src/app', { initialUrl: '/receipts/demo-navigation-receipt' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).toBeOnTheScreen());
    expect(screen).toHavePathname('/');
    await signIn();
    await testRouter.navigate('/accounts');
    await waitFor(() => expect(screen.getByText('No accounts yet')).toBeOnTheScreen());
    expect(screen.queryByText('Fictional savings')).toBeNull();
    await testRouter.navigate('/profile');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(screen).toHavePathname('/'));
    if (testRouter.canGoBack()) await testRouter.back();
    expect(screen).toHavePathname('/');
    await act(() => router.navigate('/receipts/demo-navigation-receipt'));
    await waitFor(() => expect(screen).toHavePathname('/'));
    expect(screen.queryByText('Sample receipt')).toBeNull();
  } finally {
    await act(() => session.signOut());
    live.mockRestore();
  }
});

it('shares the owned first page, masks references, and keeps a paginated total unavailable', async () => {
  const second = {
    ...ownedAccount,
    accountId: '00000000-0000-4000-8000-000000000002',
    status: 'FROZEN' as const,
    availableBalanceMinor: '0',
  };
  const listAccounts = jest.fn<ReturnType<ListAccounts>, Parameters<ListAccounts>>()
    .mockResolvedValueOnce({ accounts: [] })
    .mockResolvedValueOnce(accountPage)
    .mockRejectedValueOnce(new BankingApiError('timeout'))
    .mockResolvedValueOnce({ accounts: [second] })
    .mockResolvedValueOnce({ accounts: [second] });
  const session = createSession(listAccounts);
  const live = jest.spyOn(runtime, 'nativeSession').mockReturnValue(session);
  const apiBase = process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
  const verifiedBase = process.env.EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL;
  process.env.EXPO_PUBLIC_BANKING_API_BASE_URL = 'https://api.example/api/v1';
  process.env.EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL = 'https://api.example/api/v1';
  try {
    await renderRouter('./src/app');
    await signIn();
    await waitFor(() => expect(screen.getByText('Account ending in 0001')).toBeOnTheScreen());
    expect(screen.getByText('₱90,071,992,547,409.93')).toBeOnTheScreen();
    expect(screen.getByText('Total unavailable')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Send money', disabled: true })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'View activity', disabled: true })).toBeOnTheScreen();
    expect(screen.queryByText(ownedAccount.accountId)).toBeNull();
    expect(screen.queryByText(ownedAccount.recipientReference)).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'View accounts' }));
    expect(listAccounts).toHaveBeenCalledTimes(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Load more accounts' }));
    await waitFor(() => expect(screen.getByText('Couldn’t load more accounts')).toBeOnTheScreen());
    expect(screen.getByText('Account ending in 0001')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByText('Account ending in 0002')).toBeOnTheScreen());
    expect(listAccounts).toHaveBeenLastCalledWith(expect.anything(), { limit: 20, cursor: accountPage.nextCursor });
    await testRouter.navigate('/home');
    expect(screen.getByText('Total unavailable')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Refresh accounts' }));
    await waitFor(() => expect(screen.getAllByText('₱0.00')).toHaveLength(2));
    expect(screen.queryByText('Account ending in 0001')).toBeNull();
    expect(listAccounts).toHaveBeenLastCalledWith(expect.anything(), { limit: 20, cursor: undefined });
  } finally {
    await act(() => session.signOut());
    live.mockRestore();
    if (apiBase === undefined) delete process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
    else process.env.EXPO_PUBLIC_BANKING_API_BASE_URL = apiBase;
    if (verifiedBase === undefined) delete process.env.EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL;
    else process.env.EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL = verifiedBase;
  }
});

it('restarts an invalid cursor and hides already loaded accounts on access denial', async () => {
  const listAccounts = jest.fn<ReturnType<ListAccounts>, Parameters<ListAccounts>>()
    .mockResolvedValueOnce({ accounts: [] })
    .mockResolvedValueOnce(accountPage)
    .mockRejectedValueOnce(new BankingApiError('invalid-request', 400))
    .mockResolvedValueOnce(accountPage)
    .mockRejectedValueOnce(new BankingApiError('forbidden', 403));
  const session = createSession(listAccounts);
  const live = jest.spyOn(runtime, 'nativeSession').mockReturnValue(session);
  try {
    await renderRouter('./src/app');
    await signIn();
    await waitFor(() => expect(screen.getByText('Account ending in 0001')).toBeOnTheScreen());
    expect(screen.queryByText('₱90,071,992,547,409.93')).toBeNull();
    await testRouter.navigate('/accounts');
    await fireEvent.press(screen.getByRole('button', { name: 'Load more accounts' }));
    await waitFor(() => expect(listAccounts).toHaveBeenCalledTimes(4));
    expect(listAccounts).toHaveBeenLastCalledWith(expect.anything(), { limit: 20, cursor: undefined });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Load more accounts' })).toBeOnTheScreen());
    await fireEvent.press(screen.getByRole('button', { name: 'Load more accounts' }));
    await waitFor(() => expect(screen.getByText('Account access denied')).toBeOnTheScreen());
    expect(screen.queryByText('Account ending in 0001')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  } finally {
    await act(() => session.signOut());
    live.mockRestore();
  }
});

it('waits for an explicit retry after a first-page failure when opening Accounts', async () => {
  const listAccounts = jest.fn<ReturnType<ListAccounts>, Parameters<ListAccounts>>()
    .mockResolvedValueOnce({ accounts: [] })
    .mockRejectedValueOnce(new BankingApiError('invalid-response', 200))
    .mockResolvedValueOnce({ accounts: [ownedAccount] });
  const session = createSession(listAccounts);
  const live = jest.spyOn(runtime, 'nativeSession').mockReturnValue(session);
  try {
    await renderRouter('./src/app');
    await signIn();
    await waitFor(() => expect(screen.getByText('Couldn’t load accounts')).toBeOnTheScreen());
    await fireEvent.press(screen.getByRole('button', { name: 'View accounts' }));
    expect(screen.getByText('Couldn’t load accounts')).toBeOnTheScreen();
    expect(listAccounts).toHaveBeenCalledTimes(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByText('Account ending in 0001')).toBeOnTheScreen());
    expect(listAccounts).toHaveBeenCalledTimes(3);
  } finally {
    await act(() => session.signOut());
    live.mockRestore();
  }
});

it('strips callback credentials before routing and never exposes preview when service config is present', () => {
  const raw = redirectUri + '?code=opaque&state=s';
  expect(redirectSystemPath({ path: raw, initial: true })).toBe('/');
  expect(redirectSystemPath({ path: '/home?access_token=opaque', initial: false })).toBe('/');
  expect(redirectSystemPath({ path: '/home?%61ccess_token=opaque', initial: false })).toBe('/home');
  process.env.EXPO_PUBLIC_NAVIGATION_PREVIEW = '1';
  process.env.EXPO_PUBLIC_OIDC_CLIENT_ID = 'mobile';
  try { expect(runtime.previewBuild()).toBe(false); }
  finally { delete process.env.EXPO_PUBLIC_NAVIGATION_PREVIEW; delete process.env.EXPO_PUBLIC_OIDC_CLIENT_ID; }
});
