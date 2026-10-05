import { Redirect, Stack } from "expo-router";
import { useSessionUser } from "@/features/auth";
import { useStackOptions } from "@/theme/useStackOptions";

/** Checkout needs an account (a verified email for the confirmation, orders tied to a user). */
export default function CheckoutLayout() {
  const options = useStackOptions();
  const { isAuthenticated, isPending } = useSessionUser();

  if (!isPending && !isAuthenticated)
    return <Redirect href={{ pathname: "/login", params: { next: "/checkout" } }} />;

  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="index" options={{ title: "Secure checkout" }} />
      <Stack.Screen name="success/[orderNumber]" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
