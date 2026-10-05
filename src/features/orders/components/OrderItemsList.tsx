import { View } from "react-native";
import { Image } from "@/components/ui/Image";
import { Separator } from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";
import type { OrderItemDTO } from "@/lib/types/order";
import { formatMoney } from "@/utils/money";

export function OrderItemsList({ items }: { items: OrderItemDTO[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={item.id}>
          {i > 0 && <Separator />}
          <View className="flex-row gap-3.5 py-3.5">
            <View className="h-[72px] w-14 overflow-hidden rounded-control bg-surface-2">
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} className="h-full w-full" />}
            </View>
            <View className="min-w-0 flex-1">
              <Text variant="label" className="text-[16px] leading-[21px]" numberOfLines={2}>
                {item.name}
              </Text>
              <Text
                variant="caption"
                tone="muted"
                className="mt-0.5"
              >{`${item.quantity} × ${formatMoney(item.unitPrice)}`}</Text>
            </View>
            <Text variant="priceSm">{formatMoney(item.lineTotal)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
