import { render, screen } from '@testing-library/react-native';

import Index from '../src/app/index';

it('renders the scaffold entry without banking configuration', async () => {
  await render(<Index />);
  expect(screen.getByText('Edit src/app/index.tsx to edit this screen.')).toBeOnTheScreen();
});
