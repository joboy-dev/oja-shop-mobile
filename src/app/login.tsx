import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, PackageCheck, X } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { LogoMark } from "@/components/brand/LogoMark";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Screen } from "@/components/layout/Screen";
import { Button, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { GoogleSignInButton, useSessionUser } from "@/features/auth";
import { safeNext } from "@/lib/utils/safe-redirect";

const reasons = [
  { icon: PackageCheck, text: "Track every order from confirmed to delivered" },
  { icon: MapPin, text: "Save addresses so checkout takes seconds" },
];

/** Google sign-in as a modal; returns you to where you were headed (`next`) once the session arrives. */
export default function LoginScreen() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { isAuthenticated } = useSessionUser();
  const done = useRef(false);

  // The session arrives asynchronously after the browser returns; follow it as soon as it does.
  useEffect(() => {
    if (!isAuthenticated || done.current) return;
    done.current = true;
    const target = safeNext(next, "/");
    router.replace(target as never);
  }, [isAuthenticated, next, router]);

  return (
    <Screen edges={["top", "bottom"]}>
      <View className="absolute inset-0">
        <AdirePattern opacity={0.05} />
      </View>
      <View className="items-end px-3 pt-1">
        <IconButton label="Close" onPress={() => router.back()}>
          <Icon as={X} size={22} />
        </IconButton>
      </View>
      <View className="flex-1 justify-center gap-8 px-6">
        <View className="items-center gap-4">
          <LogoMark size={56} />
          <Text variant="h1" className="text-center">
            Welcome to Ọjà
          </Text>
          <Text variant="bodyLg" tone="muted" className="text-center">
            Sign in with Google to check out and keep track of your orders.
          </Text>
        </View>
        <View className="gap-4 rounded-sheet border border-border bg-surface p-5">
          {reasons.map(({ icon, text }) => (
            <View key={text} className="flex-row items-center gap-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
                <Icon as={icon} size={18} tone="primary" />
              </View>
              <Text variant="bodySm" className="flex-1">
                {text}
              </Text>
            </View>
          ))}
        </View>
        <View className="gap-3">
          <GoogleSignInButton />
          <Button variant="ghost" onPress={() => router.back()} fullWidth>
            Not now
          </Button>
          <Text variant="caption" tone="muted" className="text-center">
            We only receive your name, email and profile photo.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
