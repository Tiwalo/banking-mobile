import { StyleSheet, View } from 'react-native';

import { Icon } from './icon';
import { MoneyText } from './money-text';
import { TiwaloText } from './tiwalo-text';
import { colors, radius, space } from './tokens';

type StatusProps = {
  label: string;
  tone: keyof typeof colors.status;
};

export function StatusBadge({ label, tone }: StatusProps) {
  const { background, foreground } = colors.status[tone];
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Icon name={tone} color={foreground} />
      <TiwaloText variant="caption" style={[styles.badgeLabel, { color: foreground }]}>
        {label}
      </TiwaloText>
    </View>
  );
}

export function BrandWordmark() {
  return (
    <TiwaloText accessibilityRole="header" variant="title" tone="heading">
      Tiwalo Digital Bank
    </TiwaloText>
  );
}

type BalanceCardProps = {
  label: string;
  description?: string;
} & ({ minor: string; amountState?: never } | { minor?: never; amountState: string });

export function BalanceCard({ label, minor, amountState, description }: BalanceCardProps) {
  return (
    <View style={[styles.card, styles.balance]}>
      <TiwaloText variant="label" tone="onPrimary">{label}</TiwaloText>
      {minor !== undefined
        ? <MoneyText minor={minor} variant="display" onPrimary />
        : <TiwaloText variant="heading" tone="onPrimary" accessibilityLiveRegion="polite">{amountState}</TiwaloText>}
      {!!description && (
        <TiwaloText variant="caption" tone="onPrimary">{description}</TiwaloText>
      )}
    </View>
  );
}

type AccountCardProps = {
  label: string;
  maskedReference: string;
  balance: BalanceCardProps;
  status?: StatusProps;
};

export function AccountCard({ label, maskedReference, balance, status }: AccountCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Icon name="wallet" />
        <View style={styles.rowContent}>
          <TiwaloText variant="label" tone="heading">{label}</TiwaloText>
          <TiwaloText variant="caption" tone="mutedOnCard">{maskedReference}</TiwaloText>
        </View>
      </View>
      <TiwaloText variant="caption" tone="mutedOnCard">{balance.label}</TiwaloText>
      {balance.minor !== undefined
        ? <MoneyText minor={balance.minor} />
        : <TiwaloText>{balance.amountState}</TiwaloText>}
      {!!balance.description && (
        <TiwaloText variant="caption" tone="mutedOnCard">{balance.description}</TiwaloText>
      )}
      {status && <StatusBadge {...status} />}
    </View>
  );
}

type TransactionRowProps = {
  label: string;
  timestampLabel: string;
  direction: 'incoming' | 'outgoing';
  minor: string;
  status?: StatusProps;
};

export function TransactionRow({ label, timestampLabel, direction, minor, status }: TransactionRowProps) {
  return (
    <View style={[styles.card, styles.row]}>
      <Icon name={direction} />
      <View style={styles.rowContent}>
        <TiwaloText variant="label" tone="heading">{label}</TiwaloText>
        <TiwaloText variant="caption" tone="mutedOnCard">
          {direction === 'incoming' ? 'Incoming' : 'Outgoing'} · {timestampLabel}
        </TiwaloText>
        <MoneyText minor={minor} />
        {status && <StatusBadge {...status} />}
      </View>
    </View>
  );
}

type ReceiptCardProps = {
  title: string;
  minor: string;
  reference: string;
  timestampLabel: string;
  status: StatusProps;
  details?: readonly { label: string; value: string }[];
};

export function ReceiptCard({ title, minor, reference, timestampLabel, status, details }: ReceiptCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Icon name="receipt" />
        <TiwaloText accessibilityRole="header" variant="heading" style={styles.rowContent}>
          {title}
        </TiwaloText>
      </View>
      <MoneyText minor={minor} />
      <StatusBadge {...status} />
      <View style={styles.receiptDetails}>
        <ReceiptDetail label="Reference" value={reference} selectable />
        <ReceiptDetail label="Date and time" value={timestampLabel} />
        {details?.map(({ label, value }) => <ReceiptDetail key={label} label={label} value={value} />)}
      </View>
    </View>
  );
}

function ReceiptDetail({ label, value, selectable }: { label: string; value: string; selectable?: boolean }) {
  return (
    <View>
      <TiwaloText variant="caption" tone="mutedOnCard">{label}</TiwaloText>
      <TiwaloText selectable={selectable}>{value}</TiwaloText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space.md,
    gap: space.sm,
    borderColor: colors.border.divider,
    borderWidth: 1,
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
  },
  balance: { backgroundColor: colors.surface.balance, borderColor: colors.surface.balance },
  badge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    borderRadius: radius.badge,
  },
  badgeLabel: { flexShrink: 1 },
  row: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  rowContent: { flex: 1, gap: space.xs },
  receiptDetails: {
    gap: space.sm,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.divider,
  },
});
