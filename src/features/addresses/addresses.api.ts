import { apiFetch } from "@/api/client";
import type { AddressDTO } from "@/lib/types/address";
import type { AddressInput } from "@/lib/validators/address";

export const fetchAddresses = () => apiFetch<AddressDTO[]>("/addresses");
export const createAddress = (address: AddressInput, makeDefault = false) =>
  apiFetch<AddressDTO>("/addresses", { method: "POST", body: { ...address, makeDefault } });
export const updateAddress = (id: string, address: AddressInput) =>
  apiFetch<AddressDTO>(`/addresses/${id}`, { method: "PATCH", body: address });
export const deleteAddress = (id: string) => apiFetch<void>(`/addresses/${id}`, { method: "DELETE" });
export const setDefaultAddress = (id: string) =>
  apiFetch<void>(`/addresses/${id}/default`, { method: "POST" });
