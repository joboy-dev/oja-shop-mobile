import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import type { CartLine } from "@/lib/types/cart";
import type { Totals } from "@/lib/pricing/calculate-totals";
import { OrderTotals } from "@/features/orders";
import { formatMoney } from "@/utils/money";

/** Collapsible "Show order summary · ₦48,500" at the top of checkout (web: MobileSummary). */
export function OrderSummaryBar({ lines, totals }: { lines: CartLine[]; totals: Totals }) {
  const [open, setOpen] = useState(false);
  return (
    <Animated.View layout={LinearTransition.duration(240)}>
      <View className="overflow-hidden rounded-card border border-border bg-surface">
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          scaleTo={0.99}
          onPress={() => setOpen((o) => !o)}
          className="min-h-14 flex-row items-center justify-between px-4"
        >
          <View className="flex-row items-center gap-2">
            <Text variant="label" tone="primary">
              {open ? "Hide order summary" : "Show order summary"}
            </Text>
            <Icon as={ChevronDown} size={16} tone="primary" />
          </View>
          <Text variant="priceMd">{formatMoney(totals.total)}</Text>
        </PressableScale>
        {open && (
          <Animated.View entering={FadeIn.duration(200)}>
            <View className="gap-4 border-t border-border p-4">
              {lines.map((l) => (
                <View key={l.productId} className="flex-row items-center gap-3">
                  <View className="h-14 w-12 overflow-hidden rounded-control bg-surface-2">
                    {l.imageUrl && <Image source={{ uri: l.imageUrl }} className="h-full w-full" />}
                  </View>
                  <Text
                    variant="bodySm"
                    className="flex-1"
                    numberOfLines={2}
                  >{`${l.name} × ${l.quantity}`}</Text>
                  <Text variant="priceSm">{formatMoney(l.unitPrice * l.quantity)}</Text>
                </View>
              ))}
              <OrderTotals
                subtotal={totals.subtotal}
                shippingFee={totals.shippingFee}
                discount={totals.discount}
                total={totals.total}
              />
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
