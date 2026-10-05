import { forwardRef, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PressableScale } from "@/components/ui/PressableScale";
import { Sheet, type SheetRef } from "@/components/ui/Sheet";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import type { CategoryDTO } from "@/lib/types/catalog";
import { cn } from "@/utils/cn";
import { nairaToKobo } from "@/utils/money";
import { defaultFilters, type ShopFilters } from "../filters";

const toNairaText = (kobo?: number) => (kobo != null ? String(kobo / 100) : "");

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      scaleTo={0.96}
      haptic="select"
      onPress={onPress}
      className={cn(
        "min-h-10 justify-center rounded-full border px-4",
        selected ? "border-primary bg-primary-soft" : "border-border-strong bg-surface",
      )}
    >
      <Text variant="label" className={cn("text-[14px]", selected ? "text-primary" : "text-fg")}>
        {label}
      </Text>
    </PressableScale>
  );
}

interface FilterSheetProps {
  filters: ShopFilters;
  categories: CategoryDTO[];
  lockCategory?: boolean;
  onApply: (next: ShopFilters) => void;
}

/** The form itself. It mounts each time the sheet opens, so its draft always starts from the applied filters. */
function FilterForm({
  filters,
  categories,
  lockCategory,
  onApply,
  onClose,
}: FilterSheetProps & { onClose: () => void }) {
  const [category, setCategory] = useState(filters.category);
  const [min, setMin] = useState(toNairaText(filters.minPrice));
  const [max, setMax] = useState(toNairaText(filters.maxPrice));
  const [inStock, setInStock] = useState(!!filters.inStock);
  const parse = (v: string) => (v.trim() === "" ? undefined : (nairaToKobo(v) ?? undefined));

  return (
    <View className="gap-7 px-5 pb-4 pt-2">
      {!lockCategory && (
        <View className="gap-3">
          <Text variant="label">Category</Text>
          <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
            <Chip label="All" selected={!category} onPress={() => setCategory(undefined)} />
            {categories.map((c) => (
              <Chip
                key={c.slug}
                label={c.name}
                selected={category === c.slug}
                onPress={() => setCategory(c.slug)}
              />
            ))}
          </View>
        </View>
      )}

      <View className="gap-3">
        <Text variant="label">Price (₦)</Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              value={min}
              onChangeText={setMin}
              keyboardType="decimal-pad"
              placeholder="Min"
              accessibilityLabel="Minimum price in naira"
            />
          </View>
          <Text tone="muted">to</Text>
          <View className="flex-1">
            <Input
              value={max}
              onChangeText={setMax}
              keyboardType="decimal-pad"
              placeholder="Max"
              accessibilityLabel="Maximum price in naira"
            />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text variant="label">In stock only</Text>
          <Text variant="caption" tone="muted">
            Hide sold-out pieces
          </Text>
        </View>
        <Switch label="In stock only" value={inStock} onValueChange={setInStock} />
      </View>

      <View className="flex-row gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onPress={() => {
            onApply({
              ...defaultFilters,
              sort: filters.sort,
              q: filters.q,
              category: lockCategory ? filters.category : undefined,
            });
            onClose();
          }}
        >
          Reset
        </Button>
        <Button
          size="lg"
          className="flex-[2]"
          onPress={() => {
            onApply({
              ...filters,
              category,
              minPrice: parse(min),
              maxPrice: parse(max),
              inStock: inStock || undefined,
            });
            onClose();
          }}
        >
          Show results
        </Button>
      </View>
    </View>
  );
}

/** Category, price range and availability (web: FilterSheet / FilterPanel). Changes apply on "Show results". */
export const FilterSheet = forwardRef<SheetRef, FilterSheetProps>(function FilterSheet(props, ref) {
  return (
    <Sheet ref={ref} title="Filters" scrollable>
      <FilterForm {...props} onClose={() => (ref as React.RefObject<SheetRef | null>)?.current?.dismiss()} />
    </Sheet>
  );
});
