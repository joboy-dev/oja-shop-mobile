import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/api/query-keys";
import { useSessionUser } from "@/features/auth";
import type { AddressInput } from "@/lib/validators/address";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "./addresses.api";

export function useAddresses() {
  const { isAuthenticated } = useSessionUser();
  return useQuery({ queryKey: qk.addresses, queryFn: fetchAddresses, enabled: isAuthenticated });
}

/** One hook for every address change: they all end by refetching the list. */
export function useAddressMutations() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: qk.addresses });
  return {
    create: useMutation({
      mutationFn: (v: { address: AddressInput; makeDefault?: boolean }) =>
        createAddress(v.address, v.makeDefault),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: (v: { id: string; address: AddressInput }) => updateAddress(v.id, v.address),
      onSuccess: refresh,
    }),
    remove: useMutation({ mutationFn: (id: string) => deleteAddress(id), onSuccess: refresh }),
    makeDefault: useMutation({ mutationFn: (id: string) => setDefaultAddress(id), onSuccess: refresh }),
  };
}
