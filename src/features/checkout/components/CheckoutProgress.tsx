import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { cn } from "@/utils/cn";

const labels = ["Contact", "Address", "Delivery", "Review"];

export function CheckoutProgress({ step }: { step: number }) {
  return (
    <View accessible accessibilityLabel={`Step ${step} of 4: ${labels[step - 1]}`} className="gap-2">
      <View className="flex-row gap-1.5">
        {labels.map((l, i) => (
          <View key={l} className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-border")} />
        ))}
      </View>
      <Text variant="eyebrow" tone="muted">{`Step ${step} of 4 · ${labels[step - 1]}`}</Text>
    </View>
  );
}
