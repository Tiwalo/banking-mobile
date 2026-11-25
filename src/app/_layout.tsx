import { Stack } from "expo-router";

export default function RootLayout() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Keep gallery header styling out of the production entry.
    const { colors }: typeof import("@/ui/tokens") = require("@/ui/tokens");
    return (
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Component gallery",
            headerStyle: { backgroundColor: colors.surface.card },
            headerTintColor: colors.text.heading,
          }}
        />
      </Stack>
    );
  }

  return <Stack />;
}
