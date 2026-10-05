import { useEffect } from "react";
import { useSessionUser } from "@/features/auth";
import { useCartStore } from "../cart.store";

/** Mount once at the root. Loads the guest bag, or merges it into the saved bag after sign-in. */
export function CartSync() {
  const { isAuthenticated, isPending } = useSessionUser();
  const init = useCartStore((s) => s.init);
  useEffect(() => {
    if (!isPending) void init(isAuthenticated);
  }, [isAuthenticated, isPending, init]);
  return null;
}
