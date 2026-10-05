import { useRouter } from "expo-router";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Gradient } from "@/components/ui/Gradient";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import type { CategoryDTO } from "@/lib/types/catalog";

/** Snap-scrolling category cards with the name and piece count over a dark scrim (web: CategoryRail). */
export function CategoryRail({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.68, 300);
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(c) => c.slug}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + 12}
      decelerationRate="fast"
      contentContainerClassName="px-4 gap-3"
      renderItem={({ item: c }) => (
        <PressableScale
          accessibilityRole="link"
          accessibilityLabel={`${c.name}, ${c.productCount} pieces`}
          scaleTo={0.98}
          onPress={() => router.push({ pathname: "/shop/[category]", params: { category: c.slug } })}
          style={{ width: cardWidth }}
        >
          <View className="aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
            {c.imageUrl && <Image source={{ uri: c.imageUrl }} className="h-full w-full" />}
            <Gradient
              className="absolute inset-0"
              colors={["transparent", "rgba(0,0,0,0.65)"]}
              locations={[0.3, 1]}
            />
            <View className="absolute inset-x-0 bottom-0 flex-row items-end justify-between p-4">
              <Text variant="h2" tone="white" className="text-[22px] leading-[24px]">
                {c.name}
              </Text>
              <Text variant="mono" tone="white" className="opacity-90">{`${c.productCount} pieces`}</Text>
            </View>
          </View>
        </PressableScale>
      )}
    />
  );
}
