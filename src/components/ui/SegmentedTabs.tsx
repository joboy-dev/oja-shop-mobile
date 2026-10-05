import { useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { spring } from "@/theme/motion";
import { cn } from "@/utils/cn";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

const PADDING = 4;

/** Equal-width segmented control with a sliding indicator (web: Tabs with layoutId indicator). */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const segment = width > 0 ? (width - PADDING * 2) / options.length : 0;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const indicator = useAnimatedStyle(() => {
    const x = PADDING + index * segment;
    return {
      width: segment,
      transform: [{ translateX: reduceMotion ? withTiming(x, { duration: 150 }) : withSpring(x, spring) }],
    };
  });

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={cn("flex-row rounded-control bg-surface-2 p-1", className)}
    >
      {segment > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", top: PADDING, bottom: PADDING, left: 0 }, indicator]}
        >
          <View className="flex-1 rounded-[9px] bg-surface" />
        </Animated.View>
      )}
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <PressableScale
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            scaleTo={0.98}
            haptic="select"
            onPress={() => onChange(o.value)}
            className="min-h-10 flex-1 items-center justify-center px-2"
          >
            <Text
              variant="label"
              className={cn("text-center text-[14px]", selected ? "text-fg" : "text-fg-muted")}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
