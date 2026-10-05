import { Stack, useLocalSearchParams } from "expo-router";
import { PackageX, RotateCcw, Share2, Truck } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Share, View } from "react-native";
import { API_URL } from "@/api/env";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Icon } from "@/components/ui/Icon";
import { Price, discountPercent } from "@/components/ui/Price";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text } from "@/components/ui/Text";
import {
  ProductGallery,
  ProductShelf,
  StickyBuyBar,
  StockBadge,
  WishlistButton,
  toAddable,
  useProduct,
} from "@/features/catalog";
import { ApiError } from "@/api/client";
import { shippingMethods, shopConfig } from "@/lib/config/shop";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/money";

type TabId = "details" | "care" | "delivery";
const tabs = [
  { value: "details", label: "Details" },
  { value: "care", label: "Care" },
  { value: "delivery", label: "Delivery" },
] as const;

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const { data, isPending, isError, error, refetch } = useProduct(slug);
  const [tab, setTab] = useState<TabId>("details");
  const [quantity, setQuantity] = useState(1);

  if (isPending) {
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ title: "" }} />
        <Skeleton className="aspect-[4/5] w-full" />
        <View className="gap-3 p-4">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-9 w-3/4 rounded-control" />
          <Skeleton className="h-8 w-40 rounded-control" />
        </View>
      </View>
    );
  }

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    return notFound ? (
      <View className="flex-1 justify-center bg-background px-4">
        <EmptyState
          icon={PackageX}
          title="We couldn't find that piece"
          description="It may have sold out for good, or the link is old."
        />
      </View>
    ) : (
      <View className="flex-1 justify-center bg-background">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </View>
    );
  }

  const { product, related } = data;
  const percent = discountPercent(product.price, product.compareAtPrice);
  const standard = shippingMethods.standard;
  const express = shippingMethods.express;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <View className="flex-row items-center">
              <IconButton
                label={`Share ${product.name}`}
                onPress={() =>
                  void Share.share({
                    message: `${product.name} on Ọjà`,
                    url: `${API_URL}/products/${product.slug}`,
                  })
                }
              >
                <Icon as={Share2} size={20} />
              </IconButton>
              <WishlistButton productId={product.id} productName={product.name} className="bg-transparent" />
            </View>
          ),
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 + insets.bottom }}
      >
        <ProductGallery images={product.images} name={product.name} />

        <View className="gap-4 px-4 pt-5">
          <View className="gap-2">
            <Text variant="eyebrow" tone="muted">
              {product.category.name}
            </Text>
            <Text variant="h1">{product.name}</Text>
          </View>

          <View className="flex-row flex-wrap items-center gap-3">
            <Price kobo={product.price} compareAt={product.compareAtPrice} size="xl" />
            {percent > 0 && <Badge tone="accent">{`Save ${percent}%`}</Badge>}
            <StockBadge stock={product.stock} />
          </View>

          <Text variant="bodyLg" tone="muted">
            {product.shortDescription}
          </Text>

          <View className="gap-3 rounded-card border border-border bg-surface p-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5">
                <Icon as={Truck} size={20} tone="primary" />
              </View>
              <Text variant="bodySm" className="flex-1">
                <Text variant="bodySm" className="font-sans-semibold">
                  Delivery across Nigeria.{" "}
                </Text>
                <Text
                  variant="bodySm"
                  tone="muted"
                >{`${standard.description}. Free standard delivery over ${formatMoney(shopConfig.freeShippingThreshold)}.`}</Text>
              </Text>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5">
                <Icon as={RotateCcw} size={20} tone="primary" />
              </View>
              <Text variant="bodySm" className="flex-1">
                <Text variant="bodySm" className="font-sans-semibold">
                  7-day returns.{" "}
                </Text>
                <Text variant="bodySm" tone="muted">
                  If it&apos;s unused and in its packaging, we&apos;ll take it back.
                </Text>
              </Text>
            </View>
          </View>

          <View className="mt-4 gap-4">
            <SegmentedTabs options={tabs} value={tab} onChange={setTab} />
            {tab === "details" && <Text tone="muted">{product.description}</Text>}
            {tab === "care" && (
              <View className="gap-4">
                {product.materials && (
                  <View>
                    <Text variant="label">Materials</Text>
                    <Text tone="muted">{product.materials}</Text>
                  </View>
                )}
                {product.care && (
                  <View>
                    <Text variant="label">Care</Text>
                    <Text tone="muted">{product.care}</Text>
                  </View>
                )}
                {!product.materials && !product.care && (
                  <Text tone="muted">No care notes for this piece.</Text>
                )}
              </View>
            )}
            {tab === "delivery" && (
              <View className="gap-3">
                <Text tone="muted">{`Standard: ${standard.description} (${formatMoney(standard.fee)}).`}</Text>
                <Text tone="muted">{`Express: ${express.description} (${formatMoney(express.fee)}).`}</Text>
                <Text tone="muted">
                  Return unused items within 7 days of delivery for a refund or exchange.
                </Text>
              </View>
            )}
          </View>
        </View>

        {related.length > 0 && (
          <View className="mt-12 gap-5">
            <Text variant="h2" className="px-4">
              You may also like
            </Text>
            <ProductShelf products={related} />
          </View>
        )}
      </ScrollView>

      <StickyBuyBar
        product={toAddable(product)}
        compareAt={product.compareAtPrice}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
    </View>
  );
}
