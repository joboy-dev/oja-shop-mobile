import { Heart } from "lucide-react-native";
import { RefreshControl, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Text } from "@/components/ui/Text";
import { SignInPrompt, useSessionUser } from "@/features/auth";
import { ProductCard, ProductGridSkeleton } from "@/features/catalog";
import { useWishlistProducts } from "@/features/wishlist";
import type { ProductSummary } from "@/lib/types/catalog";
import { useTheme } from "@/theme/ThemeProvider";

export default function WishlistScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, isPending: sessionPending } = useSessionUser();
  const { data, isPending, isError, error, refetch, isRefetching } = useWishlistProducts();

  return (
    <Screen>
      <View className="px-4 pb-3 pt-2">
        <Text variant="h1">Wishlist</Text>
      </View>
      {sessionPending ? (
        <ProductGridSkeleton count={4} />
      ) : !isAuthenticated ? (
        <SignInPrompt
          title="Save the pieces you love"
          description="Sign in to keep a wishlist you can open on your phone and the website."
        />
      ) : isPending ? (
        <ProductGridSkeleton count={4} />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <FlashList<ProductSummary>
          data={data}
          numColumns={2}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View className="px-1.5 pb-6">
              <ProductCard product={item} />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={Heart}
              title="Nothing saved yet"
              description="Tap the heart on any piece to keep it here."
              action={
                <Button size="lg" href="/shop">
                  Browse the shop
                </Button>
              }
              className="mx-1.5"
            />
          }
        />
      )}
    </Screen>
  );
}
