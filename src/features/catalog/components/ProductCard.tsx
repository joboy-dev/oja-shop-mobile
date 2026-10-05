import { useRouter } from "expo-router";
import { View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Price, discountPercent } from "@/components/ui/Price";
import { Text } from "@/components/ui/Text";
import type { ProductSummary } from "@/lib/types/catalog";
import { QuickAddButton } from "./QuickAddButton";
import { WishlistButton } from "./WishlistButton";

/** 4:5 photo, sale / sold-out badge, heart, quick add, then category, name and price (web: ProductCard). */
export function ProductCard({ product }: { product: ProductSummary }) {
  const router = useRouter();
  const soldOut = product.stock <= 0;
  const percent = discountPercent(product.price, product.compareAtPrice);

  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={`${product.name}, ${soldOut ? "sold out" : ""}`}
      scaleTo={0.98}
      onPress={() => router.push({ pathname: "/product/[slug]", params: { slug: product.slug } })}
    >
      <View className="aspect-[4/5] overflow-hidden rounded-card bg-surface-2">
        {product.image && (
          <Image source={{ uri: product.image.url }} alt={product.image.alt} className="h-full w-full" />
        )}
        {soldOut && <View className="absolute inset-0 bg-background/40" />}

        <View className="absolute left-3 top-3">
          {soldOut ? (
            <Badge tone="neutral" className="bg-surface/90">
              Sold out
            </Badge>
          ) : percent > 0 ? (
            <Badge tone="accent">{`−${percent}%`}</Badge>
          ) : null}
        </View>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute right-2 top-2"
        />
        {!soldOut && <QuickAddButton product={product} className="absolute bottom-2 right-2" />}
      </View>

      <View className="mt-3 gap-1">
        <Text variant="eyebrow" tone="muted" numberOfLines={1}>
          {product.category.name}
        </Text>
        <Text variant="label" className="text-[16px] leading-[21px]" numberOfLines={2}>
          {product.name}
        </Text>
        <Price kobo={product.price} compareAt={product.compareAtPrice} size="sm" />
      </View>
    </PressableScale>
  );
}
