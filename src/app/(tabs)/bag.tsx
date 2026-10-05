import { useRouter } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { useSessionUser } from "@/features/auth";
import { CartLineItem, FreeShippingBar, selectCount, useCartStore } from "@/features/cart";
import { OrderTotals } from "@/features/orders";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import { formatMoney } from "@/utils/money";

export default function BagScreen() {
  const router = useRouter();
  const { isAuthenticated } = useSessionUser();
  const ready = useCartStore((s) => s.ready);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);

  const buyable = lines.filter((l) => l.available);
  const totals = calculateTotals(
    buyable.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })),
    "standard",
  );

  const checkout = () =>
    isAuthenticated
      ? router.push("/checkout")
      : router.push({ pathname: "/login", params: { next: "/checkout" } });

  return (
    <Screen>
      <View className="flex-row items-baseline justify-between px-4 pb-3 pt-2">
        <Text variant="h1">Your bag</Text>
        {count > 0 && <Text variant="mono" tone="muted">{`${count} ${count === 1 ? "item" : "items"}`}</Text>}
      </View>

      {!ready ? (
        <View className="gap-4 px-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-card" />
          ))}
        </View>
      ) : lines.length === 0 ? (
        <View className="px-4 pt-2">
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Start with our new adire throws."
            action={
              <Button size="lg" href="/shop">
                Shop new arrivals
              </Button>
            }
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerClassName="px-4 pb-6" showsVerticalScrollIndicator={false}>
            <FreeShippingBar subtotal={totals.subtotal} />
            <View className="mt-2">
              {lines.map((line) => (
                <CartLineItem key={line.productId} line={line} />
              ))}
            </View>
            <View className="mt-2 rounded-card border border-border bg-surface p-4">
              <OrderTotals subtotal={totals.subtotal} shippingFee={totals.shippingFee} total={totals.total} />
              <Text variant="caption" tone="muted" className="mt-3">
                Standard delivery shown. Choose express or add your address at checkout.
              </Text>
            </View>
          </ScrollView>

          <View className="border-t border-border bg-background px-4 py-3">
            <Button size="lg" fullWidth disabled={buyable.length === 0} onPress={checkout} haptic="medium">
              {isAuthenticated ? `Checkout · ${formatMoney(totals.total)}` : "Sign in to check out"}
            </Button>
          </View>
        </>
      )}
    </Screen>
  );
}
