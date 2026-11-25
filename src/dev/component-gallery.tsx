import { StatusBar } from 'expo-status-bar';
import { type ComponentRef, type PropsWithChildren, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Keyboard, type ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountCard, BalanceCard, BrandWordmark, ReceiptCard, StatusBadge, TransactionRow } from '@/ui/banking-components';
import { Button } from '@/ui/button';
import { EmptyState, ErrorState, LoadingState } from '@/ui/feedback-states';
import { MoneyInput, TextField } from '@/ui/fields';
import { MoneyText } from '@/ui/money-text';
import { parsePesoDraft } from '@/ui/php-money';
import { ScreenContainer } from '@/ui/screen-container';
import { TiwaloText } from '@/ui/tiwalo-text';
import { colors, radius, space } from '@/ui/tokens';
import { useTiwaloFonts } from '@/ui/use-tiwalo-fonts';

const account = {
  label: 'Demo savings',
  maskedReference: 'Demo account ending in 0101',
  balance: { label: 'Illustrated available balance', minor: '162543' },
};

const galleryEdges = ['bottom', 'left', 'right'] as const;
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ComponentGallery() {
  const [fontsLoaded, fontError] = useTiwaloFonts();
  // Allocate field IDs after web hydration because the route tree differs on the server.
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  if (!hydrated || !fontsLoaded || fontError) {
    return (
      <ScreenContainer edges={galleryEdges}>
        <Text accessibilityLiveRegion="polite" style={styles.fontStatus}>
          {fontError ? 'Inter could not load. Reopen the gallery to try again.' : 'Loading Inter…'}
        </Text>
      </ScreenContainer>
    );
  }

  return <GalleryExamples />;
}

function GalleryExamples() {
  const [actionSelected, setActionSelected] = useState(false);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [amountTouched, setAmountTouched] = useState(false);
  const [retried, setRetried] = useState(false);
  const parsedAmount = parsePesoDraft(amount);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const amountField = useRef<ComponentRef<typeof View>>(null);
  const amountFocused = useRef(false);
  const { top } = useSafeAreaInsets();

  const revealAmountField = useCallback(() => {
    if (process.env.EXPO_OS !== 'android' || !amountFocused.current) return;

    const keyboard = Keyboard.metrics();
    const scroll = scrollRef.current;
    const viewport = scroll?.getNativeScrollRef();
    const content = scroll?.getInnerViewRef();
    const field = amountField.current;
    if (!keyboard || !scroll || !viewport || !content || !field) return;

    viewport.measureInWindow((_x, viewportTop, _width, viewportHeight) => {
      field.measureInWindow((_fieldX, fieldTop, _fieldWidth, fieldHeight) => {
        // Keyboard coordinates include the system bar. Window measurements can exclude it.
        const visibleBottom = Math.min(viewportTop + viewportHeight, keyboard.screenY - top);
        const overlap = fieldTop + fieldHeight + space.sm - visibleBottom;
        if (overlap <= 0) return;

        content.measureInWindow((_contentX, contentTop) => {
          if (amountFocused.current && Keyboard.isVisible()) {
            scroll.scrollTo({ y: viewportTop - contentTop + overlap, animated: false });
          }
        });
      });
    });
  }, [top]);

  useEffect(() => {
    if (process.env.EXPO_OS !== 'android') return;
    const subscription = Keyboard.addListener('keyboardDidShow', revealAmountField);
    return () => subscription.remove();
  }, [revealAmountField]);

  return (
    <ScreenContainer
      edges={galleryEdges}
      scrollRef={scrollRef}
      header={
        <View style={styles.banner}>
          <TiwaloText variant="caption" tone="heading">
            Simulated banking · synthetic examples
          </TiwaloText>
        </View>
      }
    >
      <StatusBar style="dark" />
      <View style={styles.intro}>
        <BrandWordmark />
        <TiwaloText variant="caption">Temporary wordmark</TiwaloText>
      </View>

      <GallerySection title="Buttons">
        <Button
          label={actionSelected ? 'Preview action selected' : 'Primary action'}
          onPress={() => setActionSelected(true)}
        />
        <Button label="Reset preview action" variant="secondary" onPress={() => setActionSelected(false)} />
        <Button label="Disabled action" onPress={() => setActionSelected(true)} disabled />
        <Button label="Busy action" busyLabel="Working…" onPress={() => setActionSelected(true)} busy />
      </GallerySection>

      <GallerySection title="Fields and money">
        <TextField
          label="Example label"
          value={text}
          onChangeText={setText}
          placeholder="Enter sample text"
        />
        <TextField label="Read-only example" value="Demo entry" onChangeText={setText} disabled />
        <View ref={amountField} collapsable={false} onLayout={revealAmountField}>
          <MoneyInput
            label="Demo amount"
            value={amount}
            onChangeText={setAmount}
            onFocus={() => {
              amountFocused.current = true;
              requestAnimationFrame(revealAmountField);
            }}
            onBlur={() => {
              amountFocused.current = false;
              setAmountTouched(true);
            }}
            hint="Enter pesos with up to two decimal places."
            error={amountTouched && parsedAmount === null ? 'Enter a valid peso amount within range.' : undefined}
            placeholder="0.00"
          />
        </View>
        {parsedAmount !== null && <MoneyText minor={parsedAmount} />}
        <MoneyText minor="0" />
        <MoneyText minor="9223372036854775807" />
      </GallerySection>

      <GallerySection title="Balances and accounts">
        <BalanceCard label="Demo balance" minor="162543" description="Illustrated in Philippine pesos" />
        <AccountCard {...account} status={{ label: 'Example account status', tone: 'info' }} />
      </GallerySection>

      <GallerySection title="Transactions and statuses">
        <TransactionRow
          label="Demo credit"
          direction="incoming"
          minor="25300"
          timestampLabel="Demo date"
          status={{ label: 'Example confirmed', tone: 'success' }}
        />
        <TransactionRow
          label="Demo debit"
          direction="outgoing"
          minor="-18250"
          timestampLabel="Demo date"
        />
        <View style={styles.statuses}>
          <StatusBadge label="Example information" tone="info" />
          <StatusBadge label="Example processing" tone="pending" />
          <StatusBadge label="Example outcome unknown" tone="warning" />
          <StatusBadge label="Example declined" tone="error" />
        </View>
      </GallerySection>

      <GallerySection title="Receipts">
        <ReceiptCard
          title="Simulated receipt"
          minor="25300"
          reference="DEMO-RECEIPT-0101"
          timestampLabel="1 November 2026, 10:30 AM"
          status={{ label: 'Example confirmed', tone: 'success' }}
          details={[{ label: 'Account', value: 'Demo account ending in 0101' }]}
        />
      </GallerySection>

      <GallerySection title="Loading, empty, and error">
        <LoadingState title="Loading demo activity" />
        <EmptyState title="No demo activity" description="Example transactions would appear here." />
        {retried ? (
          <EmptyState title="Demo retry complete" />
        ) : (
          <ErrorState
            title="Demo activity unavailable"
            description="Try the gallery action again."
            onRetry={() => setRetried(true)}
          />
        )}
      </GallerySection>
    </ScreenContainer>
  );
}

function GallerySection({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <TiwaloText accessibilityRole="header" variant="heading" tone="heading">{title}</TiwaloText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.surface.subtle,
  },
  intro: {
    gap: space.xs,
    padding: space.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.subtle,
  },
  fontStatus: { color: colors.text.body },
  section: { gap: space.sm },
  statuses: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
});
