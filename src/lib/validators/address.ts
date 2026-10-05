// Synced from shop/lib/validators/address.ts. Edit it there, then run `npm run sync:shared`.
import { z } from "zod";
import { nigerianStates } from "@/lib/config/nigeria";

/** Accepts 0803…, +234803…, 234803…, with spaces or dashes. Normalises to +234XXXXXXXXXX. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => /^(\+?234|0)[789][01]\d{8}$/.test(v), "Enter a valid Nigerian phone number, like 0803 123 4567")
  .transform((v) => `+234${v.replace(/^(\+?234|0)/, "")}`);

export const addressFields = {
  fullName: z.string().trim().min(2, "Enter the recipient's full name").max(80),
  phone: phoneSchema,
  line1: z.string().trim().min(3, "Enter the street address").max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2, "Enter the city or town").max(60),
  state: z.enum(nigerianStates, { error: "Choose a state" }),
  postalCode: z.string().trim().max(10).optional(),
};

export const addressSchema = z.object(addressFields);
export type AddressInput = z.input<typeof addressSchema>;
export type AddressValues = z.output<typeof addressSchema>;

export const addressIdSchema = z.object({ addressId: z.uuid() });
export const updateAddressSchema = z.object({ addressId: z.uuid(), address: addressSchema });
