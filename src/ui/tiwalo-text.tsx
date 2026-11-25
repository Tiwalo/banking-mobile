import { Text, type TextProps } from 'react-native';

import { colors, typography } from './tokens';

type TextTone = keyof typeof colors.text;

type TiwaloTextProps = TextProps & {
  variant?: keyof typeof typography;
  tone?: TextTone;
};

export function TiwaloText({
  variant = 'body',
  tone = 'body',
  style,
  ...props
}: TiwaloTextProps) {
  return <Text {...props} style={[typography[variant], { color: colors.text[tone] }, style]} />;
}
