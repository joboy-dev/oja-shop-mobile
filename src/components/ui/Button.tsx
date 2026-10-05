import { useRouter, type Href } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import type { ColorToken } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { PressableScale, type PressableScaleProps } from "./PressableScale";
import { Spinner } from "./Spinner";
import { Text } from "./Text";

/** Same variants as the web Button. (No hover colours: touch screens have no hover, pressing scales instead.) */
const variants = {
  primary: { box: "bg-primary", text: "text-on-primary", spinner: "on-primary" },
  secondary: { box: "bg-surface-2", text: "text-fg", spinner: "fg" },
  outline: { box: "border border-border-strong bg-transparent", text: "text-fg", spinner: "fg" },
  ghost: { box: "bg-transparent", text: "text-fg", spinner: "fg" },
  accent: { box: "bg-accent", text: "text-on-accent", spinner: "on-accent" },
  danger: { box: "bg-danger", text: "text-white", spinner: "on-primary" },
} as const satisfies Record<string, { box: string; text: string; spinner: ColorToken }>;

/** Web sizes: sm 40 · md 44 · lg 52 · icon 44×44. */
const sizes = {
  sm: { box: "h-10 px-3.5", gap: "gap-1.5", text: "text-[14px]" },
  md: { box: "h-11 px-5", gap: "gap-2", text: "text-[15px]" },
  lg: { box: "h-[52px] px-7", gap: "gap-2.5", text: "text-[16px]" },
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends Omit<PressableScaleProps, "children" | "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Navigate instead of (or as well as) calling onPress. */
  href?: Href;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  startIcon,
  endIcon,
  href,
  fullWidth,
  className,
  disabled,
  onPress,
  children,
  ...props
}: ButtonProps) {
  const router = useRouter();
  const v = variants[variant];
  const s = sizes[size];

  return (
    <PressableScale
      accessibilityRole={href ? "link" : "button"}
      accessibilityLabel={typeof children === "string" ? children : undefined}
      disabled={disabled || isLoading}
      accessibilityState={{ busy: isLoading }}
      onPress={(e) => {
        onPress?.(e);
        if (href) router.push(href);
      }}
      className={cn(
        "items-center justify-center self-start rounded-control",
        v.box,
        s.box,
        fullWidth && "self-stretch",
        (disabled || isLoading) && "opacity-50",
        className,
      )}
      {...props}
    >
      {/* Label stays in layout while loading so the button never changes width. */}
      <View className={cn("flex-row items-center justify-center", s.gap, isLoading && "opacity-0")}>
        {startIcon}
        {typeof children === "string" ? (
          <Text variant="label" className={cn(s.text, v.text)}>
            {children}
          </Text>
        ) : (
          children
        )}
        {endIcon}
      </View>
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center">
          <Spinner tone={v.spinner} />
        </View>
      )}
    </PressableScale>
  );
}

export interface IconButtonProps extends Omit<PressableScaleProps, "children" | "className"> {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  variant?: "ghost" | "secondary" | "outline" | "primary" | "surface";
  className?: string;
  children: ReactNode;
}

const iconVariants = {
  ghost: "bg-transparent",
  secondary: "bg-surface-2",
  outline: "border border-border-strong bg-transparent",
  primary: "bg-primary",
  surface: "bg-surface/90",
} as const;

/** 44×44 icon-only button. */
export function IconButton({
  label,
  variant = "ghost",
  className,
  disabled,
  children,
  ...props
}: IconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={4}
      className={cn(
        "h-11 w-11 items-center justify-center rounded-control",
        iconVariants[variant],
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </PressableScale>
  );
}
