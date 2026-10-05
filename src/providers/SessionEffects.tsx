import { useEffect, useRef } from "react";
import { queryClient } from "@/api/query-client";
import { useSessionUser } from "@/features/auth";
import { useCartStore } from "@/features/cart";

/**
 * When the session ends, forget everything that belonged to that user: cached orders, addresses and
 * favourites, and their bag (otherwise it would become the next person's guest bag).
 * Mounted before <CartSync/> so the reset happens before the guest bag is re-initialised.
 */
export function SessionEffects() {
  const { isAuthenticated, isPending } = useSessionUser();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (wasAuthenticated.current && !isAuthenticated) {
      queryClient.clear();
      useCartStore.getState().reset();
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, isPending]);

  return null;
}
