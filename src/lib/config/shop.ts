// Synced from shop/lib/config/shop.ts. Edit it there, then run `npm run sync:shared`.
/** All money values are integer kobo. ₦3,500 = 350_000. */
export const shopConfig = {
  currency: "NGN",
  /** Standard delivery becomes free at or above this subtotal (₦100,000). */
  freeShippingThreshold: 10_000_000,
  maxQuantityPerLine: 20,
  lowStockThreshold: 5,
  pageSize: 12,
} as const;

export const shippingMethods = {
  standard: {
    id: "standard",
    label: "Standard delivery",
    description: "3–5 working days nationwide, 1–2 in Lagos",
    fee: 350_000,
    freeEligible: true,
  },
  express: {
    id: "express",
    label: "Express delivery",
    description: "Next working day in Lagos, 2 days elsewhere",
    fee: 750_000,
    freeEligible: false,
  },
} as const;

export type ShippingMethodId = keyof typeof shippingMethods;
export const shippingMethodIds = Object.keys(shippingMethods) as [ShippingMethodId, ...ShippingMethodId[]];

export const paymentMethods = {
  pay_on_delivery: {
    id: "pay_on_delivery",
    label: "Pay on delivery",
    description: "Pay in cash or by transfer when your order arrives.",
  },
  bank_transfer: {
    id: "bank_transfer",
    label: "Bank transfer",
    description: "We email our account details; we ship once payment lands.",
  },
} as const;

export type PaymentMethodId = keyof typeof paymentMethods;
export const paymentMethodIds = Object.keys(paymentMethods) as [PaymentMethodId, ...PaymentMethodId[]];

export const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Preparing",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const paymentStatuses = ["unpaid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const sortOptions = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
} as const;
export type SortOption = keyof typeof sortOptions;
export const sortOptionIds = Object.keys(sortOptions) as [SortOption, ...SortOption[]];
