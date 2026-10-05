import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Text } from "@/components/ui/Text";
import type { AddableProduct } from "@/features/cart";
import { maxPurchasable } from "@/lib/cart/merge";
import { AddToBagButton } from "./AddToBagButton";

/** Pinned to the bottom of the product screen: price, quantity and the add button are always one tap away. */
export function StickyBuyBar({
  product,
  compareAt,
  quantity,
  onQuantityChange,
}: {
  product: AddableProduct;
  compareAt: number | null;
  quantity: number;
  onQuantityChange: (n: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const max = maxPurchasable(product.stock);
  return (
    <View
      className="absolute inset-x-0 bottom-0 border-t border-border bg-background px-4 pt-3"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View className="flex-row items-center justify-between pb-2.5">
        <Text variant="label" numberOfLines={1} className="mr-3 flex-1">
          {product.name}
        </Text>
        <Price kobo={product.price} compareAt={compareAt} size="sm" />
      </View>
      <View className="flex-row items-center gap-3">
        {max > 0 && (
          <QuantityStepper
            value={quantity}
            onChange={onQuantityChange}
            max={max}
            label={`Quantity of ${product.name}`}
          />
        )}
        <AddToBagButton product={product} quantity={quantity} className="flex-1 self-stretch" />
      </View>
    </View>
  );
}
