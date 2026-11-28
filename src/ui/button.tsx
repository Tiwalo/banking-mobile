import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from './icon';
import { TiwaloText } from './tiwalo-text';
import { colors, radius, space, touchTarget } from './tokens';

type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  busy?: boolean;
  busyLabel?: string;
} & ({ onPress: () => void; disabled?: boolean } | { onPress?: never; disabled: true });

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  busy = false,
  busyLabel,
}: ButtonProps) {
  const [focused, setFocused] = useState(false);
  const unavailable = disabled || busy;
  const onPrimary = variant === 'primary' && !disabled;
  const visibleLabel = busy ? (busyLabel ?? label) : label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy }}
      disabled={unavailable}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.button,
        onPrimary && styles.primary,
        onPrimary && pressed && styles.primaryPressed,
        variant === 'secondary' && pressed && styles.secondaryPressed,
        disabled && styles.disabled,
        focused && !disabled && styles.focused,
      ]}
    >
      {busy && (
        <Icon name="pending" color={onPrimary ? colors.text.onPrimary : colors.text.heading} />
      )}
      <TiwaloText variant="label" tone={onPrimary ? 'onPrimary' : 'heading'} style={styles.label}>
        {visibleLabel}
      </TiwaloText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: space.sm,
    minWidth: touchTarget,
    minHeight: touchTarget,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderColor: colors.border.control,
    borderRadius: radius.control,
    borderWidth: 2,
    backgroundColor: colors.surface.card,
  },
  primary: { backgroundColor: colors.action.primary },
  primaryPressed: { backgroundColor: colors.action.pressed, borderColor: colors.action.pressed },
  secondaryPressed: { backgroundColor: colors.surface.subtle },
  disabled: { backgroundColor: colors.action.disabled, borderColor: colors.border.divider },
  focused: { outlineColor: colors.border.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' },
  label: { flexShrink: 1, textAlign: 'center' },
});
