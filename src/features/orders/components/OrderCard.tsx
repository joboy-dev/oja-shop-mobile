import { useRouter } from "expo-router";
import { View } from "react-native";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import type { OrderSummaryDTO } from "@/lib/types/order";
import { formatDate } from "@/utils/date";
import { formatMoney } from "@/utils/money";
import { OrderStatusBadge } from "./OrderStatusBadge";

/** One row in the order list: number, date, status pill, total and photo thumbnails (web: OrderCard). */
export function OrderCard({ order }: { order: OrderSummaryDTO }) {
  const router = useRouter();
  return (
    <PressableScale
      accessibilityRole="link"
      accessibilityLabel={`Order ${order.orderNumber}, ${order.itemCount} items, ${formatMoney(order.total)}`}
      scaleTo={0.98}
      onPress={() =>
        router.push({ pathname: "/account/orders/[orderNumber]", params: { orderNumber: order.orderNumber } })
      }
      className="gap-4 rounded-card border border-border bg-surface p-4"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View>
          <Text variant="mono" className="font-mono-medium">
            {order.orderNumber}
          </Text>
          <Text variant="caption" tone="muted">
            {formatDate(order.placedAt)}
          </Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row">
          {order.thumbnails.map((url, i) => (
            <View
              key={`${url}-${i}`}
              className="-mr-3 h-12 w-12 overflow-hidden rounded-full border-2 border-surface bg-surface-2"
            >
              <Image source={{ uri: url }} className="h-full w-full" />
            </View>
          ))}
        </View>
        <View className="items-end">
          <Text variant="priceMd">{formatMoney(order.total)}</Text>
          <Text
            variant="caption"
            tone="muted"
          >{`${order.itemCount} ${order.itemCount === 1 ? "item" : "items"}`}</Text>
        </View>
      </View>
    </PressableScale>
  );
}
