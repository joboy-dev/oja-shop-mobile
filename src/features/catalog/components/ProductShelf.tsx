import { FlatList, View, useWindowDimensions } from "react-native";
import type { ProductSummary } from "@/lib/types/catalog";
import { ProductCard } from "./ProductCard";

/** Horizontal, snapping row of product cards (web: ProductShelf on phones). */
export function ProductShelf({ products }: { products: ProductSummary[] }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.44, 220);
  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(p) => p.id}
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + 12}
      decelerationRate="fast"
      contentContainerClassName="px-4 gap-3"
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <ProductCard product={item} />
        </View>
      )}
    />
  );
}
