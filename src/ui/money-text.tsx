import { StyleSheet } from 'react-native';

import { formatPesoMinor } from './php-money';
import { TiwaloText } from './tiwalo-text';

type MoneyTextProps = {
  minor: string;
  variant?: 'body' | 'label' | 'display';
  onPrimary?: boolean;
};

export function MoneyText({ minor, variant = 'label', onPrimary = false }: MoneyTextProps) {
  return (
    <TiwaloText
      selectable
      variant={variant}
      tone={onPrimary ? 'onPrimary' : 'body'}
      style={styles.amount}
    >
      {formatPesoMinor(minor) ?? 'Amount unavailable'}
    </TiwaloText>
  );
}

const styles = StyleSheet.create({
  amount: { fontVariant: ['tabular-nums'] },
});
