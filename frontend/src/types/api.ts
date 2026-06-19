// ─── Backend response shapes ──────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string | null;
  reorder_point: number;
  supplier: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiCustomer {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string | null;
  quantity: number;
  unit_price: number;
}

export interface ApiOrder {
  id: number;
  customer_id: number;
  customer_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  items: ApiOrderItem[];
}

export interface ApiDashboardSummary {
  total_products: number;
  total_customers: number;
  total_orders: number;
  low_stock_products: ApiProduct[];
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface ProductCreatePayload {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category?: string | null;
  reorder_point?: number;
  supplier?: string | null;
}

export interface ProductUpdatePayload extends Partial<ProductCreatePayload> {}

export interface CustomerCreatePayload {
  full_name: string;
  email: string;
  phone?: string | null;
}

export interface OrderCreatePayload {
  customer_id: number;
  items: { product_id: number; quantity: number }[];
}

// ─── UI-type mappers ──────────────────────────────────────────────────────────

import type { Product, Order } from "@/data/mockData";

export function toUiProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    sku: p.sku,
    category: p.category ?? "",
    price: Number(p.price),
    stock: p.quantity,
    reorderPoint: p.reorder_point,
    supplier: p.supplier ?? "",
    lastUpdated: p.updated_at.split("T")[0],
  };
}

export function toUiOrder(o: ApiOrder): Order {
  return {
    id: String(o.id),
    orderNumber: `ORD-${String(o.id).padStart(6, "0")}`,
    customer: o.customer_name ?? `Customer #${o.customer_id}`,
    status: o.status as Order["status"],
    total: Number(o.total_amount),
    createdAt: o.created_at.split("T")[0],
    updatedAt: o.created_at.split("T")[0],
    items: o.items.map((item) => ({
      productId: String(item.product_id),
      productName: item.product_name ?? `Product #${item.product_id}`,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
    })),
  };
}
