import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ApiError } from "@/api/client";
import { maxPurchasable } from "@/lib/cart/merge";
import type { CartLine } from "@/lib/types/cart";
import {
  addCartItem,
  fetchCart,
  mergeGuestCart,
  removeCartItem,
  resolveGuestCart,
  setCartItemQuantity,
} from "./cart.api";

/** Everything the store needs to know about a product to add it without a round trip. */
export interface AddableProduct {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  imageAlt: string;
  price: number;
  stock: number;
}

interface CartState {
  lines: CartLine[];
  isAuthenticated: boolean;
  ready: boolean;
  /** Increments on every successful add so the tab badge can replay its bump animation. */
  bumpKey: number;

  init: (authenticated: boolean) => Promise<void>;
  add: (product: AddableProduct, quantity?: number) => Promise<boolean>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  /** After an order is placed the server has emptied the bag; mirror that here. */
  clearLocal: () => void;
  /** Re-read the saved bag (the server may have trimmed or removed lines). */
  refresh: () => Promise<void>;
  reset: () => void;
}

const messageOf = (err: unknown) =>
  err instanceof ApiError ? err.message : "Something went wrong with your bag.";

// Server calls run one at a time, in order, so rapid taps can't land out of sequence.
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T>(fn: () => Promise<T>): Promise<T> => {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
};

let initializedFor: boolean | null = null;

/**
 * Port of the web's cart store (components/cart/cart-store.ts). Guests keep their bag on the phone
 * (AsyncStorage); signed-in shoppers use the server bag. Changes are applied instantly, then confirmed
 * by the server, and rolled back with a toast if it says no.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      /** After a failed server call, trust the server over our optimistic guess. */
      const resync = async () => {
        try {
          set({ lines: await fetchCart() });
        } catch {
          /* keep the optimistic state; the next successful call corrects it */
        }
      };

      return {
        lines: [],
        isAuthenticated: false,
        ready: false,
        bumpKey: 0,

        init: async (authenticated) => {
          if (initializedFor === authenticated) return;
          initializedFor = authenticated;

          await useCartStore.persist.rehydrate();
          const guestItems = get().lines.map(({ productId, quantity }) => ({ productId, quantity }));

          try {
            if (authenticated) {
              const lines = guestItems.length ? await mergeGuestCart(guestItems) : await fetchCart();
              // Flip the flag only after the merge succeeds so a failure never wipes the guest bag.
              set({ lines, isAuthenticated: true });
              if (guestItems.length && lines.length) toast.success("Your bag was saved to your account");
            } else {
              set({ isAuthenticated: false });
              if (guestItems.length) set({ lines: await resolveGuestCart(guestItems) });
            }
          } catch (err) {
            initializedFor = null; // allow a retry on the next session change / app focus
            toast.error(
              authenticated
                ? "We couldn't load your saved bag. Showing what's on this phone."
                : messageOf(err),
            );
          } finally {
            set({ ready: true });
          }
        },

        add: async (product, quantity = 1) => {
          if (product.stock <= 0) {
            toast.error(`${product.name} is sold out.`);
            return false;
          }
          const cap = maxPurchasable(product.stock);
          const prev = get().lines;
          const existing = prev.find((l) => l.productId === product.id);
          if (existing && existing.quantity >= cap) {
            toast(`You already have all ${cap} of ${product.name} in your bag.`);
            return false;
          }
          const nextQty = Math.min((existing?.quantity ?? 0) + quantity, cap);

          const optimistic: CartLine[] = existing
            ? prev.map((l) => (l.productId === product.id ? { ...l, quantity: nextQty } : l))
            : [
                ...prev,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  imageAlt: product.imageAlt,
                  unitPrice: product.price,
                  quantity: nextQty,
                  stock: product.stock,
                  available: true,
                },
              ];
          set({ lines: optimistic, bumpKey: get().bumpKey + 1 });

          if (!get().isAuthenticated) return true;
          try {
            set({ lines: await enqueue(() => addCartItem({ productId: product.id, quantity })) });
            return true;
          } catch (err) {
            toast.error(messageOf(err));
            await resync();
            return false;
          }
        },

        setQuantity: async (productId, quantity) => {
          if (quantity <= 0) return get().remove(productId);
          const line = get().lines.find((l) => l.productId === productId);
          if (!line) return;
          const next = Math.min(quantity, maxPurchasable(line.stock));
          set({ lines: get().lines.map((l) => (l.productId === productId ? { ...l, quantity: next } : l)) });

          if (!get().isAuthenticated) return;
          try {
            set({ lines: await enqueue(() => setCartItemQuantity(productId, next)) });
          } catch (err) {
            toast.error(messageOf(err));
            await resync();
          }
        },

        remove: async (productId) => {
          const removed = get().lines.find((l) => l.productId === productId);
          if (!removed) return;
          set({ lines: get().lines.filter((l) => l.productId !== productId) });

          toast(`Removed ${removed.name}`, {
            action: {
              label: "Undo",
              onClick: () =>
                void get().add(
                  {
                    id: removed.productId,
                    slug: removed.slug,
                    name: removed.name,
                    imageUrl: removed.imageUrl,
                    imageAlt: removed.imageAlt,
                    price: removed.unitPrice,
                    stock: removed.stock,
                  },
                  removed.quantity,
                ),
            },
          });

          if (!get().isAuthenticated) return;
          try {
            set({ lines: await enqueue(() => removeCartItem(productId)) });
          } catch (err) {
            toast.error(messageOf(err));
            await resync();
          }
        },

        clearLocal: () => set({ lines: [] }),
        refresh: resync,

        /** Called on sign-out so the previous user's bag doesn't become a guest bag. */
        reset: () => {
          initializedFor = null;
          set({ lines: [], isAuthenticated: false, ready: false });
        },
      };
    },
    {
      name: "oja-cart",
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true, // rehydrated in init() so the first render doesn't flash stale data
      // The saved bag lives on the server for signed-in shoppers; only guests persist locally.
      partialize: (state) => ({ lines: state.isAuthenticated ? [] : state.lines }),
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => (l.available ? n + l.quantity : n), 0);
export const selectSubtotal = (s: CartState) =>
  s.lines.reduce((sum, l) => (l.available ? sum + l.unitPrice * l.quantity : sum), 0);
