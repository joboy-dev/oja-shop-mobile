import { apiFetch } from "@/api/client";
import type { BankDetails, OrderDetailDTO, OrderSummaryDTO } from "@/lib/types/order";

export const fetchOrders = () => apiFetch<OrderSummaryDTO[]>("/orders");
export const fetchOrder = (orderNumber: string) =>
  apiFetch<OrderDetailDTO>(`/orders/${encodeURIComponent(orderNumber)}`);
export const fetchBankDetails = () => apiFetch<BankDetails | null>("/payment/bank-details");
