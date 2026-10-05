// Synced from shop/lib/types/catalog.ts. Edit it there, then run `npm run sync:shared`.
import type { SortOption } from "@/lib/config/shop";

export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface CategoryDTO extends CategoryRef {
  id: string;
  description: string | null;
  imageUrl: string | null;
  /** Active products in this category. */
  productCount: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  /** Integer kobo. */
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isFeatured: boolean;
  category: CategoryRef;
  image: ProductImageDTO | null;
  hoverImage: ProductImageDTO | null;
  createdAt: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  materials: string | null;
  care: string | null;
  isActive: boolean;
  images: ProductImageDTO[];
}

export interface ProductFilters {
  category?: string;
  q?: string;
  /** Kobo. */
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
