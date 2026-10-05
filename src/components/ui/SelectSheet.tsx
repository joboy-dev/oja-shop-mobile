import { Check, ChevronDown } from "lucide-react-native";
import { forwardRef } from "react";
import { View } from "react-native";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Sheet, type SheetRef } from "./Sheet";
import { Text } from "./Text";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

/** A list of choices in a bottom sheet: sort order, Nigerian state, etc. (web: Select). */
export const SelectSheet = forwardRef<
  SheetRef,
  {
    title: string;
    options: readonly SelectOption<string>[];
    value?: string;
    onChange: (value: string) => void;
  }
>(function SelectSheet({ title, options, value, onChange }, ref) {
  return (
    <Sheet ref={ref} title={title} scrollable>
      <View className="px-3 pb-2" accessibilityRole="radiogroup">
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <PressableScale
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={o.label}
              scaleTo={0.99}
              haptic="select"
              onPress={() => {
                onChange(o.value);
                (ref as React.RefObject<SheetRef | null>)?.current?.dismiss();
              }}
              className={cn(
                "min-h-12 flex-row items-center justify-between rounded-control px-3 py-2.5",
                selected && "bg-primary-soft",
              )}
            >
              <View className="flex-1 pr-3">
                <Text variant="label" className="text-[16px] leading-[21px]">
                  {o.label}
                </Text>
                {o.description && (
                  <Text variant="caption" tone="muted">
                    {o.description}
                  </Text>
                )}
              </View>
              {selected && <Icon as={Check} size={20} tone="primary" />}
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
});

/** Looks like an Input, opens a SelectSheet. Use inside <Field> so it gets its label and error. */
export function SelectField({
  value,
  placeholder = "Choose…",
  onPress,
  invalid,
  accessibilityLabel,
}: {
  value?: string;
  placeholder?: string;
  onPress: () => void;
  invalid?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel ?? "Select"}: ${value ?? "none chosen"}`}
      scaleTo={0.99}
      onPress={onPress}
      className={cn(
        "h-11 flex-row items-center justify-between rounded-control border bg-surface px-3.5",
        invalid ? "border-danger" : "border-border-strong",
      )}
    >
      <Text className={cn("text-[16px]", !value && "text-fg-muted")} numberOfLines={1}>
        {value ?? placeholder}
      </Text>
      <Icon as={ChevronDown} size={18} tone="fg-muted" />
    </PressableScale>
  );
}
