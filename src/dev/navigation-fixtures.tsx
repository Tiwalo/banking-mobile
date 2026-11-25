import { useFocusEffect, useRouter } from 'expo-router';
import { type PropsWithChildren, useCallback, useState } from 'react';
import { Keyboard, View } from 'react-native';

import { CustomerScreen } from '@/navigation/shell';
import { AccountCard, ReceiptCard } from '@/ui/banking-components';
import { Button } from '@/ui/button';
import { MoneyInput } from '@/ui/fields';
import { useAndroidFieldReveal } from '@/ui/use-android-field-reveal';

import { usePreviewDetailLink } from './use-preview-detail-link';

export const accountFixtureRef = 'demo-navigation-account';
export const transferFixtureRef = 'demo-navigation-receipt';

export function HomePreview({ children }: PropsWithChildren) {
  usePreviewDetailLink('linkedReceipt');
  return children;
}

export function AccountsPreview() {
  usePreviewDetailLink('linkedAccount');

  return (
    <CustomerScreen>
      <SampleAccount canOpen />
    </CustomerScreen>
  );
}

export function SampleAccount({ canOpen = false }: { canOpen?: boolean }) {
  const router = useRouter();

  return (
    <>
      <AccountCard
        label="Fictional savings"
        maskedReference="Demo account ending in 0203"
        balance={{ label: 'Sample balance', minor: '120050' }}
      />
      {canOpen && (
        <Button
          label="Open sample account"
          onPress={() => router.push({
            pathname: '/accounts/[accountRef]',
            params: { accountRef: accountFixtureRef },
          })}
        />
      )}
    </>
  );
}

export function SendPreview() {
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const { scrollRef, fieldRef, reveal, onFocus, onBlur } = useAndroidFieldReveal();

  useFocusEffect(useCallback(() => () => Keyboard.dismiss(), []));

  return (
    <CustomerScreen scrollRef={scrollRef}>
      <View ref={fieldRef} collapsable={false} onLayout={reveal}>
        <MoneyInput
          label="Sample amount"
          value={amount}
          onChangeText={setAmount}
          onFocus={onFocus}
          onBlur={onBlur}
          hint="Use this field to preview the decimal keyboard."
          placeholder="0.00"
        />
      </View>
      <Button
        label="Open sample receipt"
        variant="secondary"
        onPress={() => {
          Keyboard.dismiss();
          router.push({ pathname: '/receipts/[transferRef]', params: { transferRef: transferFixtureRef } });
        }}
      />
    </CustomerScreen>
  );
}

export function SampleReceipt() {
  return (
    <ReceiptCard
      title="Sample receipt"
      minor="12500"
      reference="DEMO-NAVIGATION-0203"
      timestampLabel="Illustrative date"
      status={{ label: 'Example only', tone: 'info' }}
    />
  );
}
