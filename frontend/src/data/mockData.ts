export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  lastUpdated: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Mechanical Keyboard",
    sku: "MK-001-BLK",
    category: "Peripherals",
    price: 149.99,
    stock: 42,
    reorderPoint: 10,
    supplier: "TechSource Inc.",
    lastUpdated: "2024-01-15",
  },
  {
    id: "p2",
    name: "USB-C Cable 2m",
    sku: "UC-002-2M",
    category: "Cables",
    price: 12.99,
    stock: 7,
    reorderPoint: 20,
    supplier: "CableWorks Ltd.",
    lastUpdated: "2024-01-14",
  },
  {
    id: "p3",
    name: "4K Monitor 27\"",
    sku: "MN-003-4K",
    category: "Displays",
    price: 429.99,
    stock: 18,
    reorderPoint: 5,
    supplier: "ViewTech Corp.",
    lastUpdated: "2024-01-13",
  },
  {
    id: "p4",
    name: "Wireless Mouse",
    sku: "WM-004-GRY",
    category: "Peripherals",
    price: 59.99,
    stock: 5,
    reorderPoint: 10,
    supplier: "TechSource Inc.",
    lastUpdated: "2024-01-12",
  },
  {
    id: "p5",
    name: "Laptop Stand",
    sku: "LS-005-ALU",
    category: "Accessories",
    price: 39.99,
    stock: 31,
    reorderPoint: 8,
    supplier: "ErgoCo.",
    lastUpdated: "2024-01-11",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    orderNumber: "ORD-2024-001",
    customer: "Acme Corporation",
    status: "delivered",
    items: [
      { productId: "p1", productName: "Mechanical Keyboard", quantity: 5, unitPrice: 149.99 },
      { productId: "p3", productName: '4K Monitor 27"', quantity: 2, unitPrice: 429.99 },
    ],
    total: 1609.93,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-14",
  },
  {
    id: "o2",
    orderNumber: "ORD-2024-002",
    customer: "Globex Solutions",
    status: "shipped",
    items: [
      { productId: "p2", productName: "USB-C Cable 2m", quantity: 20, unitPrice: 12.99 },
      { productId: "p4", productName: "Wireless Mouse", quantity: 8, unitPrice: 59.99 },
    ],
    total: 739.72,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-15",
  },
  {
    id: "o3",
    orderNumber: "ORD-2024-003",
    customer: "Initech Systems",
    status: "pending",
    items: [
      { productId: "p5", productName: "Laptop Stand", quantity: 10, unitPrice: 39.99 },
      { productId: "p1", productName: "Mechanical Keyboard", quantity: 3, unitPrice: 149.99 },
    ],
    total: 849.87,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];