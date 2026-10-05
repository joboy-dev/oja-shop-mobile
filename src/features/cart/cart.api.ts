import { apiFetch } from "@/api/client";
import type { CartItemInput, CartLine } from "@/lib/types/cart";

export const fetchCart = () => apiFetch<CartLine[]>("/cart");
export const addCartItem = (item: CartItemInput) =>
  apiFetch<CartLine[]>("/cart/items", { method: "POST", body: item });
export const setCartItemQuantity = (productId: string, quantity: number) =>
  apiFetch<CartLine[]>(`/cart/items/${productId}`, { method: "PATCH", body: { quantity } });
export const removeCartItem = (productId: string) =>
  apiFetch<CartLine[]>(`/cart/items/${productId}`, { method: "DELETE" });
export const mergeGuestCart = (items: CartItemInput[]) =>
  apiFetch<CartLine[]>("/cart/merge", { method: "POST", body: { items } });
export const resolveGuestCart = (items: CartItemInput[]) =>
  apiFetch<CartLine[]>("/cart/resolve", { method: "POST", body: { items } });
