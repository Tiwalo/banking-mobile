import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { router, type Href } from 'expo-router';
import { renderRouter, screen, testRouter } from 'expo-router/testing-library';

import { Platform } from 'react-native';

import { redirectSystemPath } from '../src/app/+native-intent';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

jest.setTimeout(45_000);

const appDir = './src/app';
const tabRole = Platform.OS === 'ios' ? 'button' : 'tab';
const environment = globalThis as typeof globalThis & { __DEV__: boolean };
const development = environment.__DEV__;

beforeEach(() => { process.env.EXPO_PUBLIC_NAVIGATION_PREVIEW = '1'; });

afterEach(() => {
  delete process.env.EXPO_PUBLIC_NAVIGATION_PREVIEW;
  environment.__DEV__ = development;
});

async function pressButton(name: string) {
  await fireEvent.press(screen.getByRole('button', { name }));
}

async function openPreview() {
  await renderRouter(appDir);
  await pressButton('Open navigation preview');
  await waitFor(() => expect(screen).toHavePathname('/home'));
}

it.each([
  '/',
  '/home',
  '/accounts/demo-navigation-account',
  '/send',
  '/activity',
  '/profile',
  '/receipts/demo-navigation-receipt',
  '/component-gallery',
])('shows only public entry at production launch from %s', async (initialUrl) => {
  environment.__DEV__ = false;
  await renderRouter(appDir, { initialUrl });

  await waitFor(() => expect(screen).toHavePathname('/'));
  expect(screen.getByText('Simulated banking')).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: /Open.*(?:preview|gallery)/i })).toBeNull();
  expect(screen.queryByText('Fictional savings')).toBeNull();
  expect(screen.queryByText('Sample receipt')).toBeNull();
});

it('keeps gallery access separate from customer preview in development', async () => {
  await renderRouter(appDir, { initialUrl: '/receipts/demo-navigation-receipt' });
  await waitFor(() => expect(screen).toHavePathname('/'));

  await pressButton('Open component gallery');
  expect(screen).toHavePathname('/component-gallery');
  expect(screen.getByText('DEMO-RECEIPT-0101')).toBeOnTheScreen();

  await testRouter.back();
  await act(() => router.push('/accounts/demo-navigation-account'));
  await waitFor(() => expect(screen).toHavePathname('/'));
});

it('shows five labeled tabs and selects each in order', async () => {
  await openPreview();
  const titles = ['Home', 'Accounts', 'Send', 'Activity', 'Profile'];
  expect(screen.getAllByRole(tabRole, { name: /^(Home|Accounts|Send|Activity|Profile)$/ }).map((tab) => tab.props.accessibilityLabel ?? tab.props['aria-label'])).toEqual(titles);

  for (const title of titles) {
    await fireEvent.press(screen.getByRole(tabRole, { name: title }));
    expect(screen).toHavePathname('/' + title.toLowerCase());
    expect(screen.getByRole(tabRole, { name: title, selected: true })).toBeOnTheScreen();
  }

  await testRouter.back();
  expect(screen).toHavePathname('/home');
});

it('pops account details to Accounts and a sample receipt to Send', async () => {
  await openPreview();
  await pressButton('View accounts');
  expect(screen).toHavePathname('/accounts');

  await pressButton('Open sample account');
  expect(screen).toHavePathname('/accounts/demo-navigation-account');
  expect(screen.getByText('Fictional savings')).toBeOnTheScreen();
  await testRouter.back();
  expect(screen).toHavePathname('/accounts');

  await fireEvent.press(screen.getByRole(tabRole, { name: 'Send' }));
  await pressButton('Open sample receipt');
  expect(screen).toHavePathname('/receipts/demo-navigation-receipt');
  expect(screen.getByText('Example only')).toBeOnTheScreen();
  await testRouter.back();
  expect(screen).toHavePathname('/send');
});

it('reports unknown references without echoing them and closes preview access on exit', async () => {
  await openPreview();
  await testRouter.navigate('/accounts');
  await testRouter.push('/accounts/unknown-reference');
  expect(screen.getByText('Account unavailable')).toBeOnTheScreen();
  expect(screen.queryByText('unknown-reference')).toBeNull();
  await testRouter.back();
  expect(screen).toHavePathname('/accounts');

  await testRouter.push('/receipts/unknown-reference');
  expect(screen.getByText('Receipt unavailable')).toBeOnTheScreen();
  await testRouter.back();

  await fireEvent.press(screen.getByRole(tabRole, { name: 'Profile' }));
  await pressButton('Exit preview');
  await waitFor(() => expect(screen).toHavePathname('/'));
  if (testRouter.canGoBack()) await testRouter.back();
  expect(screen).toHavePathname('/');

  await act(() => router.push('/receipts/demo-navigation-receipt'));
  await waitFor(() => expect(screen).toHavePathname('/'));
  await pressButton('Open navigation preview');
  await waitFor(() => expect(screen).toHavePathname('/home'));
});

it('establishes the correct back destinations for warm native detail links', async () => {
  await openPreview();
  const accountLink = redirectSystemPath({ path: 'bankingmobile://accounts/demo-navigation-account', initial: false });
  await act(() => router.navigate(accountLink as Href));
  await waitFor(() => expect(screen).toHavePathname('/accounts/demo-navigation-account'));
  await testRouter.back();
  expect(screen).toHavePathname('/accounts');

  const receiptLink = redirectSystemPath({ path: 'exp://127.0.0.1:8089/--/receipts/demo-navigation-receipt', initial: false });
  await act(() => router.navigate(receiptLink as Href));
  await waitFor(() => expect(screen).toHavePathname('/receipts/demo-navigation-receipt'));
  await act(() => router.navigate(receiptLink as Href));
  await waitFor(() => expect(screen).toHavePathname('/receipts/demo-navigation-receipt'));
  await testRouter.back();
  expect(screen).toHavePathname('/home');
});


it('preserves an opaque warm-link reference as a single query value', () => {
  const path = '/accounts/unknown&linkedAccount=demo-navigation-account';
  expect(redirectSystemPath({ path, initial: false })).toBe(
    '/accounts?linkedAccount=unknown%26linkedAccount%3Ddemo-navigation-account',
  );
});
