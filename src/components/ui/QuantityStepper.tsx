import { Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { AccessibilityInfo, TextInput, View } from "react-native";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** −/＋ with 44pt targets and a typeable count that clamps to stock (web: QuantityStepper). */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled,
  label = "Quantity",
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Accessible name, e.g. "Quantity of Adire Eleko Throw". */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  // Re-sync the typed draft when the value changes from outside (buttons, server clamp).
  const [seenValue, setSeenValue] = useState(value);
  if (value !== seenValue) {
    setSeenValue(value);
    setDraft(String(value));
  }

  const change = (next: number) => {
    const clamped = clamp(next, min, max);
    if (clamped === value) return;
    onChange(clamped);
    AccessibilityInfo.announceForAccessibility(`${label}: ${clamped}`);
  };

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const next = Number.isNaN(parsed) ? value : clamp(parsed, min, max);
    setDraft(String(next));
    change(next);
  };

  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <View
      className={cn(
        "flex-row items-center self-start overflow-hidden rounded-control border border-border-strong bg-surface",
        className,
      )}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={disabled || value <= min}
        haptic="select"
        scaleTo={0.88}
        onPress={() => change(value - 1)}
        className={cn("items-center justify-center", dim, (disabled || value <= min) && "opacity-40")}
      >
        <Icon as={Minus} size={16} />
      </PressableScale>
      <TextInput
        accessibilityLabel={label}
        keyboardType="number-pad"
        editable={!disabled}
        value={draft}
        maxLength={2}
        selectTextOnFocus
        onChangeText={(t) => setDraft(t.replace(/\D/g, ""))}
        onBlur={() => commit(draft)}
        onSubmitEditing={() => commit(draft)}
        className={cn(
          "w-10 py-0 text-center font-mono-medium text-[15px] tabular-nums text-fg",
          size === "sm" ? "h-9" : "h-11",
        )}
      />
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={disabled || value >= max}
        haptic="select"
        scaleTo={0.88}
        onPress={() => change(value + 1)}
        className={cn("items-center justify-center", dim, (disabled || value >= max) && "opacity-40")}
      >
        <Icon as={Plus} size={16} />
      </PressableScale>
    </View>
  );
}
