import { describe, expect, it } from "@jest/globals";
import { formatMoney, nairaToKobo } from "./money";

// Mirrors shop/lib/utils/money.test.ts: the phone must print exactly what the website prints.
describe("money", () => {
  it("formats whole naira without decimals", () => {
    expect(formatMoney(1_250_000)).toBe("₦12,500");
  });
  it("keeps kobo when present", () => {
    expect(formatMoney(1_250_050)).toBe("₦12,500.50");
    expect(formatMoney(5)).toBe("₦0.05");
  });
  it("groups thousands and millions", () => {
    expect(formatMoney(10_000_000)).toBe("₦100,000");
    expect(formatMoney(123_456_789_00)).toBe("₦123,456,789");
    expect(formatMoney(0)).toBe("₦0");
  });
  it("parses typed naira to kobo", () => {
    expect(nairaToKobo("12,500.50")).toBe(1_250_050);
    expect(nairaToKobo("₦ 100")).toBe(10_000);
    expect(nairaToKobo("abc")).toBeNull();
    expect(nairaToKobo(-5)).toBeNull();
  });
});
