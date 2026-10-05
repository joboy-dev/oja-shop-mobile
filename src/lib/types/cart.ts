// Synced from shop/lib/types/cart.ts. Edit it there, then run `npm run sync:shared`.
export interface CartItemInput {
  productId: string;
  quantity: number;
}

/** A cart row ready to render. Prices are for display; checkout always re-reads them from the database. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  imageAlt: string;
  /** Integer kobo. */
  unitPrice: number;
  quantity: number;
  stock: number;
  /** False when the product is sold out or no longer for sale. */
  available: boolean;
}
