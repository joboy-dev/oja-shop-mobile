// Synced from shop/lib/cart/merge.test.ts. Edit it there, then run `npm run sync:shared`.
import { describe, expect, it } from "@jest/globals";
import { maxPurchasable, mergeCartItems } from "./merge";

describe("mergeCartItems", () => {
  it("sums quantities for the same product", () => {
    expect(mergeCartItems([{ productId: "a", quantity: 2 }], [{ productId: "a", quantity: 3 }, { productId: "b", quantity: 1 }])).toEqual([
      { productId: "a", quantity: 5 },
      { productId: "b", quantity: 1 },
    ]);
  });
  it("caps each line", () => {
    expect(mergeCartItems([{ productId: "a", quantity: 15 }], [{ productId: "a", quantity: 15 }])).toEqual([{ productId: "a", quantity: 20 }]);
  });
  it("drops non-positive quantities", () => {
    expect(mergeCartItems([{ productId: "a", quantity: 0 }], [])).toEqual([]);
  });
});

describe("maxPurchasable", () => {
  it("is limited by stock and by the per-line cap", () => {
    expect(maxPurchasable(3)).toBe(3);
    expect(maxPurchasable(99)).toBe(20);
    expect(maxPurchasable(0)).toBe(0);
    expect(maxPurchasable(-2)).toBe(0);
  });
});
