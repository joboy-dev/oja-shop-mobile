// Synced from shop/lib/validators/checkout.ts. Edit it there, then run `npm run sync:shared`.
import { z } from "zod";
import { paymentMethodIds, shippingMethodIds } from "@/lib/config/shop";
import { addressFields, phoneSchema } from "./address";

export const checkoutSchema = z.object({
  phone: phoneSchema,
  address: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("saved"), addressId: z.uuid("Choose an address") }),
    z.object({ mode: z.literal("new"), ...addressFields, save: z.boolean() }),
  ]),
  shippingMethod: z.enum(shippingMethodIds, { error: "Choose a delivery option" }),
  paymentMethod: z.enum(paymentMethodIds, { error: "Choose how you'll pay" }),
  notes: z.string().trim().max(500, "Keep notes under 500 characters").optional(),
  /** Generated once per checkout session; makes a double-click create a single order. */
  idempotencyKey: z.string().min(16).max(64),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutValues = z.output<typeof checkoutSchema>;
