import api from "@/lib/axios";
import type { ApiOrder, OrderCreatePayload } from "@/types/api";

export const fetchOrders = (): Promise<ApiOrder[]> =>
  api.get<ApiOrder[]>("/orders").then((r) => r.data);

export const fetchOrder = (id: number): Promise<ApiOrder> =>
  api.get<ApiOrder>(`/orders/${id}`).then((r) => r.data);

export const createOrder = (data: OrderCreatePayload): Promise<ApiOrder> =>
  api.post<ApiOrder>("/orders", data).then((r) => r.data);

export const deleteOrder = (id: number): Promise<void> =>
  api.delete(`/orders/${id}`).then(() => undefined);
