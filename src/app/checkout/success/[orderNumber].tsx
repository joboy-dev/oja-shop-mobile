import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, ScrollView, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { SuccessSeal } from "@/components/brand/SuccessSeal";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { useSessionUser } from "@/features/auth";
import {
  OrderItemsList,
  OrderTotals,
  PaymentInstructions,
  useBankDetails,
  useOrder,
} from "@/features/orders";
import { shippingMethods } from "@/lib/config/shop";

export default function OrderSuccessScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const router = useRouter();
  const { user } = useSessionUser();
  const { data: order, isPending, isError, error, refetch } = useOrder(orderNumber);
  const transfer = order?.paymentMethod === "bank_transfer";
  const bank = useBankDetails(!!transfer);

  // Android back should leave checkout for good, not step back into a finished order form.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/");
      return true;
    });
    return () => sub.remove();
  }, [router]);

  if (isError)
    return (
      <Screen>
        <ErrorState error={error} onRetry={() => void refetch()} />
      </Screen>
    );

  return (
    <Screen edges={["top", "bottom"]}>
      <ScrollView
        contentContainerClassName="items-stretch gap-6 px-4 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-4">
          <SuccessSeal />
          <Text variant="h1" className="text-center">
            Thank you!
          </Text>
          <Text variant="mono" className="font-mono-medium">
            {orderNumber}
          </Text>
          <Text
            tone="muted"
            className="text-center"
          >{`We've emailed a confirmation to ${user?.email ?? "you"}.`}</Text>
        </View>

        {isPending ? (
          <Skeleton className="h-64 w-full rounded-card" />
        ) : (
          <>
            {transfer && (
              <PaymentInstructions
                bank={bank.data ?? null}
                orderNumber={order.orderNumber}
                total={order.total}
              />
            )}
            <View className="gap-3 rounded-card border border-border bg-surface p-4">
              <Text variant="h3" className="text-[18px]">
                Your order
              </Text>
              <OrderItemsList items={order.items} />
              <OrderTotals
                subtotal={order.subtotal}
                shippingFee={order.shippingFee}
                discount={order.discount}
                total={order.total}
              />
            </View>
            <View className="gap-1.5 rounded-card border border-border bg-surface p-4">
              <Text variant="label">{`Delivering to ${order.shippingAddress.fullName}`}</Text>
              <Text
                variant="bodySm"
                tone="muted"
              >{`${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`}</Text>
              <Text
                variant="caption"
                tone="muted"
              >{`${shippingMethods[order.shippingMethod].label}: ${shippingMethods[order.shippingMethod].description}`}</Text>
            </View>
          </>
        )}

        <View className="gap-3">
          <Button
            size="lg"
            fullWidth
            onPress={() =>
              router.replace({ pathname: "/account/orders/[orderNumber]", params: { orderNumber } })
            }
          >
            View order
          </Button>
          <Button size="lg" variant="outline" fullWidth onPress={() => router.replace("/shop")}>
            Continue shopping
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
