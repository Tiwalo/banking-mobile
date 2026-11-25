import { useEffect, useId, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { TiwaloText } from './tiwalo-text';
import { colors, radius, space, touchTarget, typography } from './tokens';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  inputMode?: TextInputProps['inputMode'];
  onBlur?: TextInputProps['onBlur'];
  onFocus?: TextInputProps['onFocus'];
};

export function TextField(props: TextFieldProps) {
  return <Field {...props} />;
}

export function MoneyInput(props: Omit<TextFieldProps, 'inputMode'>) {
  return <Field {...props} money inputMode="decimal" />;
}

function Field({
  label,
  value,
  onChangeText,
  hint,
  error,
  disabled = false,
  placeholder,
  inputMode,
  onBlur,
  onFocus,
  money = false,
}: TextFieldProps & { money?: boolean }) {
  const [focused, setFocused] = useState(false);
  const previousError = useRef(error);
  const fieldId = useId();
  const hintId = fieldId + '-hint';
  const errorId = fieldId + '-error';
  const webAccessibility = process.env.EXPO_OS === 'web' ? {
    'aria-describedby': [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined,
    'aria-invalid': Boolean(error),
  } : undefined;

  useEffect(() => {
    if (process.env.EXPO_OS === 'ios' && error && error !== previousError.current) {
      AccessibilityInfo.announceForAccessibility(error);
    }
    previousError.current = error;
  }, [error]);

  return (
    <View style={styles.field}>
      <TiwaloText variant="label">{label}</TiwaloText>
      <View style={[
        styles.control,
        disabled && styles.disabled,
        error && styles.invalid,
        focused && styles.focused,
      ]}>
        {money && <TiwaloText accessible={false} style={styles.prefix}>₱</TiwaloText>}
        <TextInput
          {...webAccessibility}
          accessibilityLabel={money ? label + ', in Philippine pesos' : label}
          accessibilityHint={error ?? hint}
          accessibilityState={{ disabled }}
          autoCorrect={money ? false : undefined}
          editable={!disabled}
          inputMode={inputMode}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={disabled ? colors.text.body : colors.text.mutedOnCard}
          value={value}
          style={[styles.input, money && styles.money]}
        />
      </View>
      {!!hint && <TiwaloText nativeID={hintId} variant="caption">{hint}</TiwaloText>}
      {!!error && (
        <TiwaloText nativeID={errorId} variant="caption" tone="error" accessibilityLiveRegion="polite" selectable>
          {error}
        </TiwaloText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: radius.control,
    borderColor: colors.border.control,
    backgroundColor: colors.surface.card,
  },
  focused: { outlineColor: colors.border.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' },
  invalid: { borderColor: colors.border.error },
  disabled: { backgroundColor: colors.surface.subtle, borderColor: colors.border.divider },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: touchTarget,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    color: colors.text.body,
  },
  prefix: { paddingLeft: space.sm },
  money: { fontVariant: ['tabular-nums'] },
});
