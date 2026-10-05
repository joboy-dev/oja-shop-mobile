// Synced from shop/lib/validators/checkout.test.ts. Edit it there, then run `npm run sync:shared`.
import { describe, expect, it } from "@jest/globals";
import { checkoutSchema } from "./checkout";

const base = {
  phone: "08031234567",
  shippingMethod: "standard",
  paymentMethod: "pay_on_delivery",
  idempotencyKey: "a".repeat(20),
};

describe("checkoutSchema", () => {
  it("accepts a saved address", () => {
    const r = checkoutSchema.safeParse({ ...base, address: { mode: "saved", addressId: "3f1c9d2e-1b7a-4c1e-9d3b-2a5f6e7c8d90" } });
    expect(r.success).toBe(true);
  });
  it("accepts a new address and normalises the phone", () => {
    const r = checkoutSchema.safeParse({
      ...base,
      address: { mode: "new", fullName: "Ada O", phone: "0803 123 4567", line1: "1 Marina", city: "Lagos Island", state: "Lagos", save: true },
    });
    expect(r.success && r.data.phone).toBe("+2348031234567");
  });
  it("rejects an incomplete new address", () => {
    expect(checkoutSchema.safeParse({ ...base, address: { mode: "new", fullName: "A" } }).success).toBe(false);
  });
  it("rejects unknown delivery or payment methods", () => {
    const address = { mode: "saved", addressId: "3f1c9d2e-1b7a-4c1e-9d3b-2a5f6e7c8d90" };
    expect(checkoutSchema.safeParse({ ...base, address, shippingMethod: "drone" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, address, paymentMethod: "bitcoin" }).success).toBe(false);
  });
});
