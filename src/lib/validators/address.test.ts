// Synced from shop/lib/validators/address.test.ts. Edit it there, then run `npm run sync:shared`.
import { describe, expect, it } from "@jest/globals";
import { addressSchema, phoneSchema } from "./address";

describe("phoneSchema", () => {
  it.each(["08031234567", "0803 123 4567", "+2348031234567", "2348031234567", "0803-123-4567"])("accepts %s", (v) => {
    expect(phoneSchema.parse(v)).toBe("+2348031234567");
  });
  it.each(["12345", "0603123456", "080312345678", "abc", ""])("rejects %s", (v) => {
    expect(phoneSchema.safeParse(v).success).toBe(false);
  });
});

describe("addressSchema", () => {
  const valid = { fullName: "Adaeze Okafor", phone: "08031234567", line1: "12 Admiralty Way", city: "Lekki", state: "Lagos" };
  it("accepts a valid address", () => {
    expect(addressSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects an unknown state", () => {
    expect(addressSchema.safeParse({ ...valid, state: "Atlantis" }).success).toBe(false);
  });
});
