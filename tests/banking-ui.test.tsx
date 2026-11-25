import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

import { ReceiptCard, StatusBadge } from '../src/ui/banking-components';
import { Button } from '../src/ui/button';
import { EmptyState, ErrorState, LoadingState } from '../src/ui/feedback-states';
import { MoneyInput } from '../src/ui/fields';
import { MoneyText } from '../src/ui/money-text';

it('exposes button states and ignores disabled and busy presses', async () => {
  const onPress = jest.fn();
  const user = userEvent.setup();
  await render(
    <>
      <Button label="Available" onPress={onPress} />
      <Button label="Disabled" disabled onPress={onPress} />
      <Button label="Submit preview" busy busyLabel="Working…" onPress={onPress} />
    </>,
  );

  const disabled = screen.getByRole('button', { name: 'Disabled', disabled: true });
  const busy = screen.getByRole('button', { name: 'Working…', busy: true, disabled: true });

  await user.press(disabled);
  await user.press(busy);
  expect(onPress).not.toHaveBeenCalled();

  await user.press(screen.getByRole('button', { name: 'Available' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('keeps the money draft editable and exposes its label and error', async () => {
  const onChangeText = jest.fn();
  await render(
    <MoneyInput
      label="Amount"
      value="1."
      onChangeText={onChangeText}
      error="Enter a valid peso amount."
    />,
  );

  const input = screen.getByLabelText('Amount, in Philippine pesos');
  expect(input).toHaveDisplayValue('1.');
  expect(input).toHaveProp('inputMode', 'decimal');
  expect(input).toHaveProp('accessibilityHint', 'Enter a valid peso amount.');
  expect(screen.getByText('Enter a valid peso amount.')).toBeOnTheScreen();
  await fireEvent.changeText(input, '1.20');
  expect(onChangeText).toHaveBeenCalledWith('1.20');
});

it('renders readable status text and a selectable receipt reference', async () => {
  await render(
    <>
      <StatusBadge label="Example outcome unknown" tone="warning" />
      <ReceiptCard
        title="Simulated receipt"
        minor="120"
        reference="DEMO-REF"
        timestampLabel="Demo date"
        status={{ label: 'Example confirmed', tone: 'success' }}
      />
      <MoneyText minor="invalid" />
    </>,
  );

  expect(screen.getByText('Example outcome unknown')).toBeOnTheScreen();
  expect(screen.getByText('Example confirmed')).toBeOnTheScreen();
  expect(screen.getByText('DEMO-REF')).toHaveProp('selectable', true);
  expect(screen.getByText('₱1.20')).toBeOnTheScreen();
  expect(screen.getByText('Amount unavailable')).toBeOnTheScreen();
});

it('renders feedback text and delegates an explicit retry to its caller', async () => {
  const onRetry = jest.fn();
  const user = userEvent.setup();
  await render(
    <>
      <LoadingState title="Loading sample" />
      <EmptyState title="No sample records" />
      <ErrorState title="Sample unavailable" onRetry={onRetry} />
    </>,
  );
  expect(screen.getByText('Loading sample')).toBeOnTheScreen();
  expect(screen.getByText('No sample records')).toBeOnTheScreen();
  expect(screen.getByText('Sample unavailable')).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'Try again' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});
