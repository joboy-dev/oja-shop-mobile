import { FlatList, RefreshControl, View } from "react-native";
import { PackageOpen } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SignInPrompt, useSessionUser } from "@/features/auth";
import { OrderCard, useOrders } from "@/features/orders";
import { useTheme } from "@/theme/ThemeProvider";

export default function OrdersScreen() {
  const { colors } = useTheme();
  const { isAuthenticated } = useSessionUser();
  const { data, isPending, isError, error, refetch, isRefetching } = useOrders();

  if (!isAuthenticated)
    return (
      <SignInPrompt
        title="Sign in to see your orders"
        description="Your order history lives with your account."
      />
    );
  if (isPending) {
    return (
      <View className="gap-3 p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-card" />
        ))}
      </View>
    );
  }
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <FlatList
      data={data}
      keyExtractor={(o) => o.id}
      contentContainerClassName="gap-3 p-4"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          icon={PackageOpen}
          title="No orders yet"
          description="When you place an order it will show up here."
          action={
            <Button size="lg" href="/shop">
              Start shopping
            </Button>
          }
        />
      }
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}
