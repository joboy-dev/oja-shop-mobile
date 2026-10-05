import { apiFetch } from "@/api/client";
import type { ProductSummary } from "@/lib/types/catalog";

export const fetchWishlistIds = () => apiFetch<string[]>("/wishlist/ids");
export const fetchWishlist = () => apiFetch<ProductSummary[]>("/wishlist");
export const toggleWishlist = (productId: string) =>
  apiFetch<{ wished: boolean }>("/wishlist/toggle", { method: "POST", body: { productId } });
