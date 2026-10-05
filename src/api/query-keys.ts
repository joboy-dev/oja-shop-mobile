/** Every cache key in one place, so invalidation never depends on a typo. */
export const qk = {
  home: ["home"] as const,
  categories: ["categories"] as const,
  products: {
    all: ["products"] as const,
    list: (filters: object) => ["products", "list", filters] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
  },
  search: (q: string) => ["search", q] as const,
  wishlist: {
    ids: ["wishlist", "ids"] as const,
    products: ["wishlist", "products"] as const,
  },
  addresses: ["addresses"] as const,
  orders: {
    all: ["orders"] as const,
    detail: (orderNumber: string) => ["orders", orderNumber] as const,
  },
  bankDetails: ["bank-details"] as const,
};
