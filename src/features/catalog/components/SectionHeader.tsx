import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import type { Href } from "expo-router";

/** Eyebrow + heading with an optional "see all" link (web: section headers on the home page). */
export function SectionHeader({
  eyebrow,
  title,
  href,
  hrefLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  href?: Href;
  hrefLabel?: string;
}) {
  return (
    <View className="mb-5 flex-row items-end justify-between gap-4 px-4">
      <View className="flex-1">
        {eyebrow && (
          <Text variant="eyebrow" tone="muted">
            {eyebrow}
          </Text>
        )}
        <Text variant="h2" className="mt-1.5">
          {title}
        </Text>
      </View>
      {href && (
        <Button variant="ghost" size="sm" href={href} className="-mr-2">
          <Text variant="label" tone="primary" className="text-[14px]">
            {hrefLabel}
          </Text>
        </Button>
      )}
    </View>
  );
}
