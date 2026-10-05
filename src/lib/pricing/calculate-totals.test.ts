// Synced from shop/lib/pricing/calculate-totals.test.ts. Edit it there, then run `npm run sync:shared`.
import { describe, expect, it } from "@jest/globals";
import { calculateTotals } from "./calculate-totals";

describe("calculateTotals", () => {
  it("returns zeros for an empty cart", () => {
    expect(calculateTotals([])).toMatchObject({ subtotal: 0, shippingFee: 0, total: 0, amountToFreeShipping: 0 });
  });

  it("sums lines and adds standard shipping below the threshold", () => {
    const t = calculateTotals([
      { unitPrice: 1_000_000, quantity: 2 },
      { unitPrice: 250_000, quantity: 1 },
    ]);
    expect(t.subtotal).toBe(2_250_000);
    expect(t.shippingFee).toBe(350_000);
    expect(t.total).toBe(2_600_000);
    expect(t.freeShippingApplied).toBe(false);
    expect(t.amountToFreeShipping).toBe(7_750_000);
  });

  it("waives standard shipping exactly at the threshold", () => {
    const t = calculateTotals([{ unitPrice: 10_000_000, quantity: 1 }]);
    expect(t.shippingFee).toBe(0);
    expect(t.freeShippingApplied).toBe(true);
    expect(t.amountToFreeShipping).toBe(0);
  });

  it("never waives express shipping", () => {
    const t = calculateTotals([{ unitPrice: 20_000_000, quantity: 1 }], "express");
    expect(t.shippingFee).toBe(750_000);
    expect(t.freeShippingApplied).toBe(false);
  });

  it("clamps discount to the subtotal", () => {
    const t = calculateTotals([{ unitPrice: 100_000, quantity: 1 }], "standard", 999_999_999);
    expect(t.discount).toBe(100_000);
    expect(t.total).toBe(350_000);
  });
});
