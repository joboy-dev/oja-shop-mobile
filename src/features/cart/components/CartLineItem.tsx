import { useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useRef } from "react";
import { View } from "react-native";
import ReanimatedSwipeable, { type SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Text } from "@/components/ui/Text";
import { maxPurchasable } from "@/lib/cart/merge";
import type { CartLine } from "@/lib/types/cart";
import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/money";
import { useCartStore } from "../cart.store";

/** One bag row. Swipe left (or tap the bin) to remove; an Undo toast appears (web: CartLineItem). */
export function CartLineItem({ line }: { line: CartLine }) {
  const router = useRouter();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const swipe = useRef<SwipeableMethods>(null);
  const max = maxPurchasable(line.stock);

  return (
    <ReanimatedSwipeable
      ref={swipe}
      friction={2}
      overshootRight={false}
      rightThreshold={48}
      renderRightActions={() => (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Remove ${line.name}`}
          scaleTo={0.96}
          haptic="medium"
          onPress={() => void remove(line.productId)}
          className="my-1 ml-2 w-20 items-center justify-center rounded-card bg-danger"
        >
          <Icon as={Trash2} size={22} color="#ffffff" />
        </PressableScale>
      )}
    >
      <View className={cn("flex-row gap-4 bg-background py-4", !line.available && "opacity-70")}>
        <PressableScale
          accessibilityRole="link"
          accessibilityLabel={`View ${line.name}`}
          scaleTo={0.97}
          onPress={() => router.push({ pathname: "/product/[slug]", params: { slug: line.slug } })}
          className="h-[100px] w-20 overflow-hidden rounded-control bg-surface-2"
        >
          {line.imageUrl && (
            <Image source={{ uri: line.imageUrl }} alt={line.imageAlt} className="h-full w-full" />
          )}
        </PressableScale>

        <View className="min-w-0 flex-1 justify-between">
          <View className="gap-1">
            <Text variant="label" className="text-[16px] leading-[21px]" numberOfLines={2}>
              {line.name}
            </Text>
            <Price kobo={line.unitPrice} size="sm" />
            {!line.available && <Badge tone="danger">No longer available</Badge>}
          </View>
          {line.available && (
            <View className="mt-2 flex-row items-center justify-between">
              <QuantityStepper
                size="sm"
                value={line.quantity}
                max={max}
                label={`Quantity of ${line.name}`}
                onChange={(n) => void setQuantity(line.productId, n)}
              />
              <Text variant="priceMd">{formatMoney(line.unitPrice * line.quantity)}</Text>
            </View>
          )}
        </View>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Remove ${line.name} from bag`}
          hitSlop={8}
          onPress={() => void remove(line.productId)}
          className="h-9 w-9 items-center justify-center self-start"
        >
          <Icon as={Trash2} size={18} tone="fg-muted" />
        </PressableScale>
      </View>
    </ReanimatedSwipeable>
  );
}
