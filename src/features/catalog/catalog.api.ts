import { apiFetch } from "@/api/client";
import type {
  CategoryDTO,
  Paginated,
  ProductDetail,
  ProductImageDTO,
  ProductSummary,
} from "@/lib/types/catalog";
import { toQuery, type ShopFilters } from "./filters";

export interface HomeData {
  categories: CategoryDTO[];
  featured: ProductSummary[];
  newest: ProductSummary[];
  heroImages: (ProductImageDTO | null)[];
  storyImageUrl: string | null;
}

export const fetchHome = (signal?: AbortSignal) => apiFetch<HomeData>("/home", { signal });

export const fetchCategories = (signal?: AbortSignal) => apiFetch<CategoryDTO[]>("/categories", { signal });

export const fetchProducts = (filters: ShopFilters, page: number, signal?: AbortSignal) =>
  apiFetch<Paginated<ProductSummary>>("/products", { query: toQuery(filters, page), signal });

export const fetchProduct = (slug: string, signal?: AbortSignal) =>
  apiFetch<{ product: ProductDetail; related: ProductSummary[] }>(`/products/${encodeURIComponent(slug)}`, {
    signal,
  });

export const searchProducts = (q: string, signal?: AbortSignal) =>
  apiFetch<ProductSummary[]>("/search", { query: { q }, signal });
