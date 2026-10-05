import type { ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/utils/cn";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

/** A whole-card radio option, used for addresses, delivery and payment choices (web: RadioCard). */
export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  aside,
  disabled,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  /** Right-aligned text, typically a price. */
  aside?: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={[title, description, aside].filter(Boolean).join(". ")}
      disabled={disabled}
      scaleTo={0.99}
      haptic="select"
      onPress={onSelect}
      className={cn(
        "flex-row items-start gap-3.5 rounded-card border p-4",
        selected ? "border-primary bg-primary-soft" : "border-border-strong bg-surface",
        disabled && "opacity-50",
      )}
    >
      <View
        className={cn(
          "mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2 bg-surface",
          selected ? "border-primary" : "border-border-strong",
        )}
      >
        {selected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </View>
      <View className="min-w-0 flex-1">
        <Text variant="label" className="text-[16px] leading-[21px]">
          {title}
        </Text>
        {description && (
          <Text variant="caption" tone="muted" className="mt-0.5">
            {description}
          </Text>
        )}
        {children}
      </View>
      {aside && <Text variant="priceSm">{aside}</Text>}
    </PressableScale>
  );
}

export function RadioCardGroup({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} className="gap-3">
      {children}
    </View>
  );
}
