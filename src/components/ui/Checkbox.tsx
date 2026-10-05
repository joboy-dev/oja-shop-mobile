import { Check } from "lucide-react-native";
import { View } from "react-native";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}) {
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      scaleTo={0.98}
      haptic="select"
      onPress={() => onChange(!checked)}
      className={cn("min-h-11 flex-row items-start gap-3 py-1.5", className)}
    >
      <View
        className={cn(
          "mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2",
          checked ? "border-primary bg-primary" : "border-border-strong bg-surface",
        )}
      >
        {checked && <Icon as={Check} size={14} tone="on-primary" strokeWidth={3} />}
      </View>
      <View className="flex-1">
        <Text variant="label">{label}</Text>
        {description && (
          <Text variant="caption" tone="muted" className="mt-0.5">
            {description}
          </Text>
        )}
      </View>
    </PressableScale>
  );
}
