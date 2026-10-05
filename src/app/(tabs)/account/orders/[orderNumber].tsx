import { useLocalSearchParams } from "expo-router";
import { PackageX } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { ApiError } from "@/api/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import { SignInPrompt, useSessionUser } from "@/features/auth";
import {
  OrderItemsList,
  OrderStatusBadge,
  OrderStatusTimeline,
  OrderTotals,
  PaymentInstructions,
  useBankDetails,
  useOrder,
} from "@/features/orders";
import { paymentMethods, shippingMethods } from "@/lib/config/shop";
import { useTheme } from "@/theme/ThemeProvider";
import { formatDateTime } from "@/utils/date";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3 rounded-card border border-border bg-surface p-4">
      <Text variant="h3" className="text-[18px]">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function OrderDetailScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const { colors } = useTheme();
  const { isAuthenticated } = useSessionUser();
  const { data: order, isPending, isError, error, refetch, isRefetching } = useOrder(orderNumber);
  const needsBank =
    order?.paymentMethod === "bank_transfer" &&
    order.paymentStatus === "unpaid" &&
    order.status !== "cancelled";
  const bank = useBankDetails(needsBank);

  if (!isAuthenticated)
    return (
      <SignInPrompt title="Sign in to see this order" description="Orders are private to your account." />
    );
  if (isPending)
    return (
      <View className="gap-3 p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-card" />
        ))}
      </View>
    );
  if (isError) {
    return error instanceof ApiError && error.status === 404 ? (
      <View className="p-4">
        <EmptyState
          icon={PackageX}
          title="We couldn't find that order"
          description="Check the order number, or sign in with the account that placed it."
        />
      </View>
    ) : (
      <ErrorState error={error} onRetry={() => void refetch()} />
    );
  }

  const a = order.shippingAddress;
  return (
    <ScrollView
      contentContainerClassName="gap-4 p-4 pb-10"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
          tintColor={colors.primary}
        />
      }
    >
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text variant="priceLg">{order.orderNumber}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <Text variant="caption" tone="muted">{`Placed ${formatDateTime(order.placedAt)}`}</Text>
      </View>

      {needsBank && (
        <PaymentInstructions bank={bank.data ?? null} orderNumber={order.orderNumber} total={order.total} />
      )}

      <Card title="Status">
        <OrderStatusTimeline status={order.status} events={order.events} />
      </Card>
      <Card title="Items">
        <OrderItemsList items={order.items} />
      </Card>
      <Card title="Totals">
        <OrderTotals
          subtotal={order.subtotal}
          shippingFee={order.shippingFee}
          discount={order.discount}
          total={order.total}
        />
      </Card>
      <Card title="Delivery">
        <View className="gap-0.5">
          <Text variant="label" className="text-[16px]">
            {a.fullName}
          </Text>
          <Text variant="bodySm" tone="muted">{`${a.line1}${a.line2 ? `, ${a.line2}` : ""}`}</Text>
          <Text variant="bodySm" tone="muted">{`${a.city}, ${a.state}`}</Text>
          <Text variant="bodySm" tone="muted">
            {a.phone}
          </Text>
        </View>
        <Text variant="caption" tone="muted">
          {shippingMethods[order.shippingMethod].label}
        </Text>
        {order.notes && <Text variant="bodySm">{`Note: ${order.notes}`}</Text>}
      </Card>
      <Card title="Payment">
        <Text variant="bodySm">{paymentMethods[order.paymentMethod].label}</Text>
        <Text variant="caption" tone="muted">
          {order.paymentStatus === "paid"
            ? "Paid"
            : order.paymentStatus === "refunded"
              ? "Refunded"
              : "Not yet paid"}
        </Text>
      </Card>
    </ScrollView>
  );
}
