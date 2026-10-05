import { Stack } from "expo-router";
import { useStackOptions } from "@/theme/useStackOptions";

export default function InfoLayout() {
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="faq" options={{ title: "FAQ" }} />
      <Stack.Screen name="contact" options={{ title: "Contact" }} />
      <Stack.Screen name="[page]" options={{ title: "" }} />
    </Stack>
  );
}
