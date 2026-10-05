import { useRouter } from "expo-router";
import { View } from "react-native";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import { useCategories } from "../catalog.queries";

/** Popular categories as quick links (used on the not-found screen). */
export function CategoryChips() {
  const router = useRouter();
  const { data } = useCategories();
  if (!data?.length) return null;
  return (
    <View className="flex-row flex-wrap justify-center gap-2">
      {data.map((c) => (
        <PressableScale
          key={c.slug}
          accessibilityRole="link"
          scaleTo={0.96}
          onPress={() => router.replace({ pathname: "/shop/[category]", params: { category: c.slug } })}
          className="min-h-10 justify-center rounded-full border border-border-strong bg-surface px-4"
        >
          <Text variant="label" className="text-[14px]">
            {c.name}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}
