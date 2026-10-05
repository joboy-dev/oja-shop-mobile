import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { ease } from "@/theme/motion";

/**
 * Fade-and-rise on first mount (web: Reveal / `pop-in`). Under reduced motion it just appears.
 * The animated wrapper carries no classes (NativeWind can't style Reanimated components on a device);
 * the plain View inside it takes `className`.
 */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(600)
              .delay(index * 60)
              .easing(ease.snap)
      }
    >
      <View className={className}>{children}</View>
    </Animated.View>
  );
}
