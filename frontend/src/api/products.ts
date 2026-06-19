import api from "@/lib/axios";
import type { ApiProduct, ProductCreatePayload, ProductUpdatePayload } from "@/types/api";

export const fetchProducts = (): Promise<ApiProduct[]> =>
  api.get<ApiProduct[]>("/products").then((r) => r.data);

export const fetchProduct = (id: number): Promise<ApiProduct> =>
  api.get<ApiProduct>(`/products/${id}`).then((r) => r.data);

export const createProduct = (data: ProductCreatePayload): Promise<ApiProduct> =>
  api.post<ApiProduct>("/products", data).then((r) => r.data);

export const updateProduct = (id: number, data: ProductUpdatePayload): Promise<ApiProduct> =>
  api.put<ApiProduct>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number): Promise<void> =>
  api.delete(`/products/${id}`).then(() => undefined);
