import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { ApiError } from "@/api/client";
import { qk } from "@/api/query-keys";
import { useSessionUser } from "@/features/auth";
import { haptic } from "@/utils/haptics";
import { fetchWishlist, fetchWishlistIds, toggleWishlist } from "./wishlist.api";

export function useWishlistIds() {
  const { isAuthenticated } = useSessionUser();
  return useQuery({
    queryKey: qk.wishlist.ids,
    queryFn: fetchWishlistIds,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

export function useWishlistProducts() {
  const { isAuthenticated } = useSessionUser();
  return useQuery({ queryKey: qk.wishlist.products, queryFn: fetchWishlist, enabled: isAuthenticated });
}

/** Heart toggle: the id list flips instantly and rolls back with a toast if the server refuses. */
export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { productId: string; name: string }) => toggleWishlist(vars.productId),
    onMutate: async ({ productId }) => {
      await qc.cancelQueries({ queryKey: qk.wishlist.ids });
      const previous = qc.getQueryData<string[]>(qk.wishlist.ids) ?? [];
      qc.setQueryData<string[]>(
        qk.wishlist.ids,
        previous.includes(productId) ? previous.filter((id) => id !== productId) : [...previous, productId],
      );
      haptic("light");
      return { previous };
    },
    onSuccess: ({ wished }, { name }) => toast(wished ? `Saved ${name}` : `Removed ${name} from favourites`),
    onError: (err, _vars, ctx) => {
      qc.setQueryData(qk.wishlist.ids, ctx?.previous);
      toast.error(err instanceof ApiError ? err.message : "Couldn't update your favourites. Try again.");
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: qk.wishlist.ids });
      void qc.invalidateQueries({ queryKey: qk.wishlist.products });
    },
  });
}
