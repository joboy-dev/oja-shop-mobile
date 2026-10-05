// Synced from shop/lib/types/order.ts. Edit it there, then run `npm run sync:shared`.
import type { OrderStatus, PaymentMethodId, PaymentStatus, ShippingMethodId } from "@/lib/config/shop";
import type { ShippingAddress } from "./address";

export interface OrderItemDTO {
  id: string;
  productId: string | null;
  name: string;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderEventDTO {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

export interface OrderSummaryDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodId;
  total: number;
  itemCount: number;
  placedAt: string;
  thumbnails: string[];
}

export interface OrderDetailDTO extends OrderSummaryDTO {
  email: string;
  phone: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  shippingMethod: ShippingMethodId;
  shippingAddress: ShippingAddress;
  notes: string | null;
  items: OrderItemDTO[];
  events: OrderEventDTO[];
}

export interface BankDetails {
  bank: string;
  accountName: string;
  accountNumber: string;
}
