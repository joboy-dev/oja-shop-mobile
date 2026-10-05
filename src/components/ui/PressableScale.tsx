import type { ReactNode } from "react";
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/utils/cn";
import { haptic } from "@/utils/haptics";

/**
 * Press feedback via NativeWind's `active:` variant: the whole box shrinks while a finger is down (web:
 * active:scale-[0.97]). Tailwind needs literal class names, hence the lookup table.
 *
 * Why not Reanimated here? NativeWind can't map `className` onto Reanimated components on a real device
 * (it worked in the web preview, which hid the bug), so every animated button lost its layout and styling.
 * A plain Pressable always honours `className`.
 */
const SCALE = {
  0.88: "active:scale-[0.88]",
  0.9: "active:scale-[0.9]",
  0.95: "active:scale-[0.95]",
  0.96: "active:scale-[0.96]",
  0.97: "active:scale-[0.97]",
  0.98: "active:scale-[0.98]",
  0.99: "active:scale-[0.99]",
  0.995: "active:scale-[0.995]",
} as const satisfies Record<number, string>;

export interface PressableScaleProps extends Omit<PressableProps, "children" | "style"> {
  children?: ReactNode;
  className?: string;
  /** Only for values that must be computed at runtime (e.g. a width from the window size). */
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed (one of the values in SCALE). Default 0.97. */
  scaleTo?: keyof typeof SCALE;
  /** Haptic fired on a completed press. */
  haptic?: "light" | "medium" | "select" | "success";
}

/** Every tappable thing in the app builds on this. */
export function PressableScale({
  children,
  className,
  style,
  scaleTo = 0.97,
  haptic: hapticKind,
  disabled,
  onPress,
  ...props
}: PressableScaleProps) {
  return (
    <Pressable
      accessibilityState={{ disabled: !!disabled, ...props.accessibilityState }}
      disabled={disabled}
      className={cn(SCALE[scaleTo], className)}
      style={style}
      onPress={(e: GestureResponderEvent) => {
        if (hapticKind) haptic(hapticKind);
        onPress?.(e);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}
