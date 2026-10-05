import { apiFetch } from "@/api/client";
import type { CheckoutInput } from "@/lib/validators/checkout";

export const placeOrder = (input: CheckoutInput) =>
  apiFetch<{ orderNumber: string }>("/checkout", { method: "POST", body: input });
