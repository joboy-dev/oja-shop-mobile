import { View } from "react-native";
import { Separator } from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";
import { formatMoney } from "@/utils/money";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View className="flex-row items-baseline justify-between">
      <Text
        variant={strong ? "label" : "bodySm"}
        tone={strong ? "default" : "muted"}
        className={strong ? "text-[17px]" : undefined}
      >
        {label}
      </Text>
      <Text variant={strong ? "priceLg" : "priceSm"}>{value}</Text>
    </View>
  );
}

export function OrderTotals({
  subtotal,
  shippingFee,
  discount = 0,
  total,
}: {
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
}) {
  return (
    <View className="gap-2.5">
      <Row label="Subtotal" value={formatMoney(subtotal)} />
      <Row label="Delivery" value={shippingFee === 0 ? "Free" : formatMoney(shippingFee)} />
      {discount > 0 && <Row label="Discount" value={`−${formatMoney(discount)}`} />}
      <Separator className="my-1" />
      <Row label="Total" value={formatMoney(total)} strong />
    </View>
  );
}
