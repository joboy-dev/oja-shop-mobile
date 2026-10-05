import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { ease } from "@/theme/motion";
import { useTheme } from "@/theme/ThemeProvider";
import { haptic } from "@/utils/haptics";

/** A stamp that thumps onto the page: adire rings around a check mark (web: SuccessSeal, `stamp` keyframe). */
export function SuccessSeal({ size = 112 }: { size?: number }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(reduceMotion ? 1 : 1.6);
  const rotate = useSharedValue(reduceMotion ? 0 : -14);

  useEffect(() => {
    const t = { duration: 420, easing: ease.snap };
    opacity.value = withTiming(1, { duration: reduceMotion ? 150 : 280 });
    if (!reduceMotion) {
      scale.value = withSequence(withTiming(0.94, t), withTiming(1, { duration: 280, easing: ease.snap }));
      rotate.value = withSequence(withTiming(2, t), withTiming(0, { duration: 280, easing: ease.snap }));
      haptic("success");
    }
  }, [opacity, scale, rotate, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Order confirmed"
      style={[{ width: size, height: size }, style]}
    >
      <Svg width={size} height={size} viewBox="0 0 112 112" fill="none">
        <Circle cx="56" cy="56" r="53" stroke={colors.primary} strokeWidth="2.5" />
        <Circle
          cx="56"
          cy="56"
          r="44"
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeDasharray="2 5"
          strokeLinecap="round"
        />
        <Circle cx="56" cy="56" r="34" fill={colors.primary} />
        <Path
          d="M42 57l10 10 19-21"
          stroke={colors["on-primary"]}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}
