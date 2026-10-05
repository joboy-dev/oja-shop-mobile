import { Stack } from "expo-router";

export default function ShopLayout() {
  // Tab screens draw their own headers; the category screen keeps a native back button.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[category]" />
    </Stack>
  );
}
