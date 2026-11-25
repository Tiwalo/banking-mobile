import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { stackOptions } from '@/navigation/shell';
import { Icon } from '@/ui/icon';
import { colors, fontFamily, radius, space, touchTarget } from '@/ui/tokens';

export const unstable_settings = { anchor: 'home' };

const tabItems = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'accounts', title: 'Accounts', icon: 'wallet' },
  { name: 'send', title: 'Send', icon: 'outgoing' },
  { name: 'activity', title: 'Activity', icon: 'pending' },
  { name: 'profile', title: 'Profile', icon: 'profile' },
] as const;

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      backBehavior="initialRoute"
      screenOptions={{
        sceneStyle: stackOptions.contentStyle,
        headerShown: false,
        tabBarActiveTintColor: colors.text.heading,
        tabBarInactiveTintColor: colors.text.mutedOnCard,
        tabBarActiveBackgroundColor: colors.surface.subtle,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surface.card,
          borderTopColor: colors.border.divider,
          height: touchTarget + space.md + bottom,
        },
      }}
    >
      {tabItems.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarAccessibilityLabel: title,
            tabBarIcon: ({ focused }) => (
              <View style={styles.icon}>
                <Icon name={icon} color={focused ? colors.text.heading : colors.text.mutedOnCard} />
                {focused && <View style={styles.selection} />}
              </View>
            ),
            tabBarLabel: ({ color, focused }) => (
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.label, { color, fontFamily: focused ? fontFamily.semibold : fontFamily.regular }]}
              >
                {title}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', gap: space.xs },
  selection: {
    width: space.md,
    height: 2,
    borderRadius: radius.badge,
    backgroundColor: colors.text.heading,
  },
  label: { fontSize: 12, textAlign: 'center', maxWidth: '100%', paddingHorizontal: 1 },
});
