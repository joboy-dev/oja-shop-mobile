import { WifiOff } from "lucide-react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

/** Slim banner while the phone has no connection; cached products still show underneath. */
export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const offline = isConnected === false || isInternetReachable === false;
  if (!offline) return null;
  return (
    <Animated.View entering={FadeInUp.duration(200)} exiting={FadeOutUp.duration(150)}>
      <View accessibilityRole="alert" className="flex-row items-center justify-center gap-2 bg-fg px-4 py-2">
        <Icon as={WifiOff} size={14} tone="background" />
        <Text variant="caption" className="text-background">
          You&apos;re offline. Showing what we saved earlier.
        </Text>
      </View>
    </Animated.View>
  );
}
