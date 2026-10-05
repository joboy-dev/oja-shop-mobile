import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { qk } from "@/api/query-keys";
import { fetchCategories, fetchHome, fetchProduct, fetchProducts, searchProducts } from "./catalog.api";
import type { ShopFilters } from "./filters";

export const useHome = () => useQuery({ queryKey: qk.home, queryFn: ({ signal }) => fetchHome(signal) });

export const useCategories = () =>
  useQuery({
    queryKey: qk.categories,
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: 5 * 60_000,
  });

/** Infinite list: the grid asks for the next page when you scroll near the end. */
export function useProducts(filters: ShopFilters) {
  return useInfiniteQuery({
    queryKey: qk.products.list(filters),
    queryFn: ({ pageParam, signal }) => fetchProducts(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    // Keep the old results on screen (dimmed) while a new filter loads, instead of flashing a skeleton.
    placeholderData: keepPreviousData,
  });
}

export const useProduct = (slug: string) =>
  useQuery({ queryKey: qk.products.detail(slug), queryFn: ({ signal }) => fetchProduct(slug, signal) });

export const useProductSearch = (q: string) =>
  useQuery({
    queryKey: qk.search(q),
    queryFn: ({ signal }) => searchProducts(q, signal),
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
  });
