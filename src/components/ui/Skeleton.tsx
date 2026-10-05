import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { withAlpha } from "@/theme/colors";
import { useTheme } from "@/theme/ThemeProvider";
import { cn } from "@/utils/cn";
import { Gradient } from "./Gradient";

/** Placeholder block with a light sweep (web: .skeleton shimmer). Size it like the content it stands in for. */
export function Skeleton({ className }: { className?: string }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), -1, false);
  }, [progress, reduceMotion]);

  const sweep = useAnimatedStyle(() => ({
    transform: [{ translateX: -width + progress.value * width * 2 }],
  }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={cn("overflow-hidden bg-surface-2", className)}
    >
      {!reduceMotion && width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", top: 0, bottom: 0, left: 0, width: "100%" }, sweep]}
        >
          <Gradient
            className="flex-1"
            colors={["transparent", withAlpha(colors.border, 0.9), "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      )}
    </View>
  );
}
