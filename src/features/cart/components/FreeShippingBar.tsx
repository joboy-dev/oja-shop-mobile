import { Truck } from "lucide-react-native";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from "react-native-reanimated";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { shopConfig } from "@/lib/config/shop";
import { ease } from "@/theme/motion";
import { formatMoney } from "@/utils/money";

/** Progress toward free standard delivery (web: FreeShippingBar). */
export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = shopConfig.freeShippingThreshold;
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min(subtotal / threshold, 1);
  const unlocked = remaining === 0 && subtotal > 0;
  const reduceMotion = useReducedMotion();
  const fill = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: reduceMotion ? 0 : 500, easing: ease.snap }),
  }));

  return (
    <View className="rounded-card bg-primary-soft p-3.5">
      <View className="flex-row items-center gap-2">
        <Icon as={Truck} size={16} tone="primary" />
        <Text variant="label" className="flex-1 text-[14px]">
          {unlocked
            ? "You've unlocked free standard delivery"
            : `Add ${formatMoney(remaining)} more for free standard delivery`}
        </Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Progress to free delivery"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface"
      >
        <Animated.View style={[{ height: "100%" }, fill]}>
          <View className="flex-1 rounded-full bg-primary" />
        </Animated.View>
      </View>
    </View>
  );
}
