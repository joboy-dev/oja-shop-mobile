import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { ArrowUpDown, PackageSearch, Search, SlidersHorizontal } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { PressableScale } from "@/components/ui/PressableScale";
import { SelectSheet } from "@/components/ui/SelectSheet";
import type { SheetRef } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { Text } from "@/components/ui/Text";
import { sortOptions, type SortOption } from "@/lib/config/shop";
import type { ProductSummary } from "@/lib/types/catalog";
import { useCategories, useProducts } from "../catalog.queries";
import { countActiveFilters, defaultFilters, type ShopFilters } from "../filters";
import { ActiveFilters } from "./ActiveFilters";
import { FilterSheet } from "./FilterSheet";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

const sortChoices = Object.entries(sortOptions).map(([value, label]) => ({ value, label }));

/**
 * The product list: search entry, sort and filter buttons, removable filter chips and an endless
 * 2-column grid. Used for both /shop and /shop/[category] (web: shop-view.tsx).
 */
export function ShopView({ categorySlug, initialQuery }: { categorySlug?: string; initialQuery?: string }) {
  const router = useRouter();
  const categories = useCategories();
  const category = categorySlug ? categories.data?.find((c) => c.slug === categorySlug) : undefined;

  const [filters, setFilters] = useState<ShopFilters>({
    ...defaultFilters,
    category: categorySlug,
    q: initialQuery,
  });
  // Screens give this view a `key` of its context (category + search), so a new context remounts it fresh.

  const sortSheet = useRef<SheetRef>(null);
  const filterSheet = useRef<SheetRef>(null);

  const products = useProducts(filters);
  const items = useMemo(() => products.data?.pages.flatMap((p) => p.items) ?? [], [products.data]);
  const total = products.data?.pages[0]?.total ?? 0;
  const activeCount = countActiveFilters({
    ...filters,
    category: categorySlug ? undefined : filters.category,
  });
  const refreshing = products.isRefetching && !products.isFetchingNextPage;

  const resetFilters = () => setFilters({ ...defaultFilters, sort: filters.sort, category: categorySlug });

  const header = (
    <View className="gap-3 pb-3">
      {category ? (
        <View className="px-4 pt-2">
          {category.imageUrl && (
            <View className="mb-4 aspect-[16/9] overflow-hidden rounded-card bg-surface-2">
              <Image source={{ uri: category.imageUrl }} className="h-full w-full" />
            </View>
          )}
          <Text variant="eyebrow" tone="muted">
            Category
          </Text>
          <Text variant="h1" className="mt-1.5">
            {category.name}
          </Text>
          {category.description && (
            <Text tone="muted" className="mt-2">
              {category.description}
            </Text>
          )}
        </View>
      ) : (
        <View className="px-4 pt-2">
          <Text variant="h1">Shop</Text>
        </View>
      )}

      <PressableScale
        accessibilityRole="search"
        accessibilityLabel="Search products"
        scaleTo={0.99}
        onPress={() => router.push("/search")}
        className="mx-4 h-11 flex-row items-center gap-2.5 rounded-control border border-border-strong bg-surface px-3.5"
      >
        <Icon as={Search} size={18} tone="fg-muted" />
        <Text tone="muted" className="flex-1">
          {filters.q ? filters.q : "Search the shop"}
        </Text>
      </PressableScale>

      <View className="flex-row items-center justify-between px-4">
        <Text variant="mono" tone="muted" accessibilityLiveRegion="polite">
          {products.isPending ? " " : `${total} ${total === 1 ? "piece" : "pieces"}`}
        </Text>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={() => sortSheet.current?.present()}
            startIcon={<Icon as={ArrowUpDown} size={16} />}
            accessibilityLabel={`Sort: ${sortOptions[filters.sort]}`}
          >
            Sort
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={() => filterSheet.current?.present()}
            startIcon={<Icon as={SlidersHorizontal} size={16} />}
            accessibilityLabel={`Filters, ${activeCount} active`}
          >
            {activeCount > 0 ? `Filters · ${activeCount}` : "Filters"}
          </Button>
        </View>
      </View>

      <ActiveFilters
        filters={filters}
        categories={categories.data ?? []}
        lockCategory={!!categorySlug}
        onChange={setFilters}
      />
    </View>
  );

  return (
    <View className="flex-1">
      {header}

      {products.isPending ? (
        <ProductGridSkeleton />
      ) : products.isError && items.length === 0 ? (
        <ErrorState error={products.error} onRetry={() => void products.refetch()} />
      ) : (
        <FlashList<ProductSummary>
          data={items}
          numColumns={2}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View className="px-1.5 pb-6">
              <ProductCard product={item} />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 24 }}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            if (products.hasNextPage && !products.isFetchingNextPage) void products.fetchNextPage();
          }}
          refreshing={refreshing}
          onRefresh={() => void products.refetch()}
          ListEmptyComponent={
            <EmptyState
              icon={PackageSearch}
              title="Nothing matches that"
              description="Try removing a filter or searching for something else."
              action={
                <Button variant="outline" onPress={resetFilters}>
                  Clear filters
                </Button>
              }
              className="mx-1.5"
            />
          }
          ListFooterComponent={
            products.isFetchingNextPage ? (
              <View className="items-center py-6">
                <Spinner />
              </View>
            ) : null
          }
          // Dim results while a new filter loads, instead of flashing a skeleton.
          style={{ opacity: products.isPlaceholderData ? 0.5 : 1 }}
        />
      )}

      <SelectSheet
        ref={sortSheet}
        title="Sort by"
        options={sortChoices}
        value={filters.sort}
        onChange={(v) => setFilters({ ...filters, sort: v as SortOption })}
      />
      <FilterSheet
        ref={filterSheet}
        filters={filters}
        categories={categories.data ?? []}
        lockCategory={!!categorySlug}
        onApply={setFilters}
      />
    </View>
  );
}
