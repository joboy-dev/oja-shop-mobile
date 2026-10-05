import { useQuery } from "@tanstack/react-query";
import { qk } from "@/api/query-keys";
import { useSessionUser } from "@/features/auth";
import { fetchBankDetails, fetchOrder, fetchOrders } from "./orders.api";

export function useOrders() {
  const { isAuthenticated } = useSessionUser();
  return useQuery({ queryKey: qk.orders.all, queryFn: fetchOrders, enabled: isAuthenticated, staleTime: 0 });
}

export function useOrder(orderNumber: string) {
  const { isAuthenticated } = useSessionUser();
  return useQuery({
    queryKey: qk.orders.detail(orderNumber),
    queryFn: () => fetchOrder(orderNumber),
    enabled: isAuthenticated,
    staleTime: 0,
  });
}

export function useBankDetails(enabled = true) {
  const { isAuthenticated } = useSessionUser();
  return useQuery({
    queryKey: qk.bankDetails,
    queryFn: fetchBankDetails,
    enabled: enabled && isAuthenticated,
    staleTime: 10 * 60_000,
  });
}
