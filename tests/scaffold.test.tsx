import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Index from '../src/app/index';

jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));

it('renders the scaffold in production mode without exposing the gallery', async () => {
  const environment = globalThis as typeof globalThis & { __DEV__: boolean };
  const development = environment.__DEV__;
  environment.__DEV__ = false;
  try {
    await render(<Index />);
    expect(screen.getByText('Edit src/app/index.tsx to edit this screen.')).toBeOnTheScreen();
    expect(screen.queryByText('Simulated banking · synthetic examples')).toBeNull();
  } finally {
    environment.__DEV__ = development;
  }
});

it('shows the fixture-only gallery in development mode', async () => {
  await render(
    <SafeAreaProvider initialMetrics={{
      frame: { x: 0, y: 0, width: 320, height: 640 },
      insets: { top: 0, right: 0, bottom: 0, left: 0 },
    }}>
      <Index />
    </SafeAreaProvider>,
  );
  expect(screen.getByText('Simulated banking · synthetic examples')).toBeOnTheScreen();
  expect(screen.getByText('DEMO-RECEIPT-0101')).toBeOnTheScreen();
}, 15_000);
