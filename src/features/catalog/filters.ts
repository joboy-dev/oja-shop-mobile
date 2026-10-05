import type { SortOption } from "@/lib/config/shop";

/** What the shopper has chosen on the Shop screen. Prices are integer kobo, like everywhere else. */
export interface ShopFilters {
  category?: string;
  q?: string;
  sort: SortOption;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export const defaultFilters: ShopFilters = { sort: "newest" };

/** Filters that appear as removable chips (sort is not a filter). */
export function countActiveFilters(f: ShopFilters) {
  return [f.category, f.q, f.minPrice, f.maxPrice, f.inStock].filter(
    (v) => v !== undefined && v !== "" && v !== false,
  ).length;
}

/** Translate to the /api/v1/products query. Same names as the web's /shop URL; min/max are naira there. */
export function toQuery(f: ShopFilters, page: number) {
  return {
    category: f.category,
    q: f.q?.trim() || undefined,
    sort: f.sort,
    min: f.minPrice != null ? String(f.minPrice / 100) : undefined,
    max: f.maxPrice != null ? String(f.maxPrice / 100) : undefined,
    stock: f.inStock ? "1" : undefined,
    page,
  };
}
