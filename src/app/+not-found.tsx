import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/layout/Screen";
import { LogoMark } from "@/components/brand/LogoMark";
import { Text } from "@/components/ui/Text";
import { CategoryChips } from "@/features/catalog";

/** Unknown route or stale deep link: say so kindly and offer the way back (web: not-found.tsx). */
export default function NotFound() {
  const router = useRouter();
  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 justify-center gap-6 px-6">
        <View className="items-center gap-4">
          <LogoMark size={56} />
          <Text variant="eyebrow" tone="muted">
            404
          </Text>
          <Text variant="h1" className="text-center">
            We can&apos;t find that page
          </Text>
          <Text tone="muted" className="text-center">
            The link may be old, or the piece may have sold out for good.
          </Text>
        </View>
        <CategoryChips />
        <Button size="lg" fullWidth onPress={() => router.replace("/")}>
          Back to home
        </Button>
        <Button size="lg" variant="outline" fullWidth onPress={() => router.replace("/search")}>
          Search the shop
        </Button>
      </View>
    </Screen>
  );
}
