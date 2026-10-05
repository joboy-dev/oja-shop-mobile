import { X } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { PressableScale } from "@/components/ui/PressableScale";
import { Text } from "@/components/ui/Text";
import type { CategoryDTO } from "@/lib/types/catalog";
import { formatMoney } from "@/utils/money";
import type { ShopFilters } from "../filters";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Remove filter: ${label}`}
      scaleTo={0.95}
      haptic="select"
      onPress={onRemove}
      className="min-h-9 flex-row items-center gap-1.5 rounded-full bg-primary-soft pl-3.5 pr-2.5"
    >
      <Text variant="label" tone="primary" className="text-[13px]">
        {label}
      </Text>
      <Icon as={X} size={14} tone="primary" strokeWidth={2.5} />
    </PressableScale>
  );
}

/** Removable chips for whatever is filtering the list (web: ActiveFilters). */
export function ActiveFilters({
  filters,
  categories,
  onChange,
  lockCategory,
}: {
  filters: ShopFilters;
  categories: CategoryDTO[];
  onChange: (next: ShopFilters) => void;
  lockCategory?: boolean;
}) {
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (!lockCategory && filters.category) {
    chips.push({
      key: "category",
      label: categories.find((c) => c.slug === filters.category)?.name ?? filters.category,
      remove: () => onChange({ ...filters, category: undefined }),
    });
  }
  if (filters.q)
    chips.push({ key: "q", label: `“${filters.q}”`, remove: () => onChange({ ...filters, q: undefined }) });
  if (filters.minPrice != null || filters.maxPrice != null) {
    const label =
      filters.minPrice != null && filters.maxPrice != null
        ? `${formatMoney(filters.minPrice)} – ${formatMoney(filters.maxPrice)}`
        : filters.minPrice != null
          ? `From ${formatMoney(filters.minPrice)}`
          : `Up to ${formatMoney(filters.maxPrice!)}`;
    chips.push({
      key: "price",
      label,
      remove: () => onChange({ ...filters, minPrice: undefined, maxPrice: undefined }),
    });
  }
  if (filters.inStock)
    chips.push({
      key: "stock",
      label: "In stock",
      remove: () => onChange({ ...filters, inStock: undefined }),
    });

  if (chips.length === 0) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4 pb-3">
      {chips.map((c) => (
        <Chip key={c.key} label={c.label} onRemove={c.remove} />
      ))}
    </ScrollView>
  );
}
