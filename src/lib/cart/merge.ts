// Synced from shop/lib/cart/merge.ts. Edit it there, then run `npm run sync:shared`.
import { shopConfig } from "@/lib/config/shop";
import type { CartItemInput } from "@/lib/types/cart";

/** Combine two item lists (e.g. guest cart + saved cart): quantities add up, capped per line. */
export function mergeCartItems(
  a: readonly CartItemInput[],
  b: readonly CartItemInput[],
  max: number = shopConfig.maxQuantityPerLine,
): CartItemInput[] {
  const totals = new Map<string, number>();
  for (const item of [...a, ...b]) {
    if (item.quantity < 1) continue;
    totals.set(item.productId, (totals.get(item.productId) ?? 0) + item.quantity);
  }
  return [...totals].map(([productId, quantity]) => ({ productId, quantity: Math.min(quantity, max) }));
}

/** Largest quantity a shopper may hold for a line, given stock. 0 means they cannot buy it. */
export function maxPurchasable(stock: number, max: number = shopConfig.maxQuantityPerLine): number {
  return Math.max(0, Math.min(stock, max));
}
