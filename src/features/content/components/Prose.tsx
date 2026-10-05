import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import type { Block } from "../pages";

/** Long-form copy (web: .prose-content): muted body, ink headings and bold lead-ins. */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <View className="gap-4">
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <Text key={i} variant="h2" className="mt-6 text-[22px] leading-[25px]">
              {b.text}
            </Text>
          );
        }
        if (b.type === "p") {
          return (
            <Text key={i} variant="prose" tone="muted">
              {b.text}
            </Text>
          );
        }
        return (
          <View key={i} className="gap-2">
            {b.items.map((item, n) => {
              const [lead, rest] =
                item.includes(": ") && item.indexOf(": ") < 24
                  ? [item.slice(0, item.indexOf(": ")), item.slice(item.indexOf(": ") + 2)]
                  : [undefined, item];
              return (
                <View key={n} className="flex-row gap-3 pr-2">
                  <Text variant="prose" tone="muted" className="w-5 text-right">
                    {b.type === "ol" ? `${n + 1}.` : "•"}
                  </Text>
                  <Text variant="prose" tone="muted" className="flex-1">
                    {lead && <Text variant="prose" className="font-sans-semibold">{`${lead}: `}</Text>}
                    {rest}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
