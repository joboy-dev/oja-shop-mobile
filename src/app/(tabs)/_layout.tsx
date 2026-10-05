import { Tabs } from "expo-router/js-tabs";
import { Heart, Home, ShoppingBag, Store, User } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { selectCount, useCartStore } from "@/features/cart";
import { useTheme } from "@/theme/ThemeProvider";

/** Bag icon with a count badge that "bumps" whenever something is added (web: cart badge `bump` keyframe). */
function BagTabIcon({ color }: { color: string }) {
  const count = useCartStore(selectCount);
  const bumpKey = useCartStore((s) => s.bumpKey);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (bumpKey === 0) return;
    scale.value = withSequence(
      withTiming(1.35, { duration: 120 }),
      withSpring(1, { duration: 300, dampingRatio: 0.6 }),
    );
  }, [bumpKey, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View>
      <ShoppingBag size={24} color={color} strokeWidth={2} />
      {count > 0 && (
        <Animated.View style={[{ position: "absolute", right: -10, top: -6 }, style]}>
          <View className="min-w-[18px] items-center rounded-full bg-accent px-1">
            <Text
              variant="badge"
              tone="on-accent"
              className="text-[11px] leading-[16px]"
              accessibilityLabel={`${count} items in bag`}
            >
              {count > 99 ? "99+" : String(count)}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors["fg-muted"],
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: "InstrumentSans_600SemiBold", fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icon as={Home} color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <Icon as={Store} color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => <Icon as={Heart} color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bag"
        options={{ title: "Bag", tabBarIcon: ({ color }) => <BagTabIcon color={String(color)} /> }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <Icon as={User} color={String(color)} size={24} />,
        }}
      />
    </Tabs>
  );
}
