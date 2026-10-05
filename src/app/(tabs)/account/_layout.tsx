import { Stack } from "expo-router";
import { useStackOptions } from "@/theme/useStackOptions";

export default function AccountLayout() {
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="orders/index" options={{ title: "Orders" }} />
      <Stack.Screen name="orders/[orderNumber]" options={{ title: "Order" }} />
      <Stack.Screen name="addresses" options={{ title: "Addresses" }} />
      <Stack.Screen name="address/[id]" options={{ title: "Address", presentation: "modal" }} />
    </Stack>
  );
}
