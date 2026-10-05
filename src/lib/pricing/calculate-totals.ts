// Synced from shop/lib/pricing/calculate-totals.ts. Edit it there, then run `npm run sync:shared`.
import { shippingMethods, shopConfig, type ShippingMethodId } from "@/lib/config/shop";

export interface PricedLine {
  unitPrice: number; // kobo
  quantity: number;
}

export interface Totals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  /** True when standard delivery was waived by the free-shipping threshold. */
  freeShippingApplied: boolean;
  /** Kobo still needed to unlock free standard delivery (0 once reached or if cart empty). */
  amountToFreeShipping: number;
}

/**
 * Single source of truth for order maths. Pure: used for display on the client and
 * authoritatively on the server at checkout (with prices read from the database).
 */
export function calculateTotals(
  lines: readonly PricedLine[],
  shippingMethod: ShippingMethodId = "standard",
  discount = 0,
): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const method = shippingMethods[shippingMethod];
  const hasItems = lines.length > 0;

  const qualifiesForFree = hasItems && method.freeEligible && subtotal >= shopConfig.freeShippingThreshold;
  const shippingFee = !hasItems || qualifiesForFree ? 0 : method.fee;
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);

  return {
    subtotal,
    shippingFee,
    discount: safeDiscount,
    total: subtotal + shippingFee - safeDiscount,
    freeShippingApplied: qualifiesForFree,
    amountToFreeShipping: hasItems ? Math.max(shopConfig.freeShippingThreshold - subtotal, 0) : 0,
  };
}
