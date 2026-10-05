import { describe, expect, it } from "@jest/globals";
import { countActiveFilters, defaultFilters, toQuery } from "./filters";

describe("shop filters", () => {
  it("counts only real filters (sort doesn't count)", () => {
    expect(countActiveFilters(defaultFilters)).toBe(0);
    expect(countActiveFilters({ ...defaultFilters, sort: "price-asc" })).toBe(0);
    expect(
      countActiveFilters({ ...defaultFilters, category: "textiles", inStock: true, minPrice: 100 }),
    ).toBe(3);
    expect(countActiveFilters({ ...defaultFilters, inStock: false, q: "" })).toBe(0);
  });

  it("maps to the API query the website's /shop uses (naira, stock=1)", () => {
    expect(
      toQuery(
        {
          ...defaultFilters,
          category: "baskets",
          q: " bowl ",
          sort: "price-desc",
          minPrice: 500_000,
          maxPrice: 2_000_050,
          inStock: true,
        },
        3,
      ),
    ).toEqual({
      category: "baskets",
      q: "bowl",
      sort: "price-desc",
      min: "5000",
      max: "20000.5",
      stock: "1",
      page: 3,
    });
  });

  it("omits unset filters", () => {
    expect(toQuery(defaultFilters, 1)).toEqual({
      category: undefined,
      q: undefined,
      sort: "newest",
      min: undefined,
      max: undefined,
      stock: undefined,
      page: 1,
    });
  });
});
