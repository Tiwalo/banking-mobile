import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { colors } from './tokens';

const icons = {
  incoming: require('../../assets/icons/arrow-down-left.svg'),
  outgoing: require('../../assets/icons/arrow-up-right.svg'),
  error: require('../../assets/icons/circle-alert.svg'),
  success: require('../../assets/icons/circle-check.svg'),
  pending: require('../../assets/icons/clock.svg'),
  info: require('../../assets/icons/info.svg'),
  warning: require('../../assets/icons/triangle-alert.svg'),
  inbox: require('../../assets/icons/inbox.svg'),
  wallet: require('../../assets/icons/wallet.svg'),
  receipt: require('../../assets/icons/receipt-text.svg'),
};

type IconProps = {
  name: keyof typeof icons;
  color?: string;
};

export function Icon({ name, color = colors.text.heading }: IconProps) {
  return (
    <Image
      accessible={false}
      accessibilityLabel=""
      source={icons[name]}
      contentFit="contain"
      tintColor={color}
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: { width: 20, height: 20, flexShrink: 0 },
});
