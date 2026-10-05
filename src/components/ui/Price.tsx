import { View } from "react-native";
import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/money";
import { Text } from "./Text";

const sizes = { sm: "priceSm", md: "priceMd", lg: "priceLg", xl: "priceXl" } as const;

/** Geist Mono tabular figures; a struck-through compare-at price when the item is on sale. */
export function Price({
  kobo,
  compareAt,
  size = "md",
  className,
}: {
  kobo: number;
  compareAt?: number | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const onSale = compareAt != null && compareAt > kobo;
  return (
    <View
      className={cn("flex-row flex-wrap items-baseline gap-x-2", className)}
      accessible
      accessibilityLabel={onSale ? `${formatMoney(kobo)}, was ${formatMoney(compareAt)}` : formatMoney(kobo)}
    >
      <Text variant={sizes[size]}>{formatMoney(kobo)}</Text>
      {onSale && (
        <Text variant="priceSm" tone="muted" className="line-through">
          {formatMoney(compareAt)}
        </Text>
      )}
    </View>
  );
}

export function discountPercent(kobo: number, compareAt?: number | null) {
  return compareAt && compareAt > kobo ? Math.round((1 - kobo / compareAt) * 100) : 0;
}
