import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Keep fixture imports out of production bundles.
    const { ComponentGallery }: typeof import("@/dev/component-gallery") = require("@/dev/component-gallery");
    return <ComponentGallery />;
  }

  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
