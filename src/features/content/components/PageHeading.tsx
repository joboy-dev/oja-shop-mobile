import { View } from "react-native";
import { Text } from "@/components/ui/Text";

export function PageHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <View className="gap-3">
      {eyebrow && (
        <Text variant="eyebrow" tone="muted">
          {eyebrow}
        </Text>
      )}
      <Text variant="h1">{title}</Text>
      {intro && (
        <Text variant="bodyLg" tone="muted">
          {intro}
        </Text>
      )}
    </View>
  );
}
