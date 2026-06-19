import api from "@/lib/axios";
import type { ApiCustomer, CustomerCreatePayload } from "@/types/api";

export const fetchCustomers = (): Promise<ApiCustomer[]> =>
  api.get<ApiCustomer[]>("/customers").then((r) => r.data);

export const fetchCustomer = (id: number): Promise<ApiCustomer> =>
  api.get<ApiCustomer>(`/customers/${id}`).then((r) => r.data);

export const createCustomer = (data: CustomerCreatePayload): Promise<ApiCustomer> =>
  api.post<ApiCustomer>("/customers", data).then((r) => r.data);

export const deleteCustomer = (id: number): Promise<void> =>
  api.delete(`/customers/${id}`).then(() => undefined);
