import type { AddableProduct } from "@/features/cart";
import type { ProductDetail, ProductSummary } from "@/lib/types/catalog";

/** The fields the bag needs, from either a list item or a full product. */
export const toAddable = (p: ProductSummary | ProductDetail): AddableProduct => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  imageUrl: p.image?.url ?? null,
  imageAlt: p.image?.alt ?? p.name,
  price: p.price,
  stock: p.stock,
});
