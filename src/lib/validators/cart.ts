// Synced from shop/lib/validators/cart.ts. Edit it there, then run `npm run sync:shared`.
import { z } from "zod";
import { shopConfig } from "@/lib/config/shop";

export const cartItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(1).max(shopConfig.maxQuantityPerLine),
});

export const setQuantitySchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(0).max(shopConfig.maxQuantityPerLine),
});

export const removeItemSchema = z.object({ productId: z.uuid() });

export const cartItemsSchema = z.object({ items: z.array(cartItemSchema).max(50) });

export const wishlistSchema = z.object({ productId: z.uuid() });
