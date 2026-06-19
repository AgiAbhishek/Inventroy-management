import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useOrders } from "@/hooks/useOrders";
import { toUiProduct, toUiOrder } from "@/types/api";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: apiOrders, isLoading: ordersLoading } = useOrders();

  const lowStockItems = (summary?.low_stock_products ?? []).map(toUiProduct);
  const recentOrders = (apiOrders ?? [])
    .map(toUiOrder)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Products",
      value: summaryLoading ? "…" : String(summary?.total_products ?? 0),
      sub: "In inventory",
      trend: "up" as const,
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Active Orders",
      value: summaryLoading ? "…" : String(summary?.total_orders ?? 0),
      sub: "All time",
      trend: "neutral" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Low Stock Items",
      value: summaryLoading ? "…" : String(lowStockItems.length),
      sub: "Need replenishment",
      trend: lowStockItems.length > 0 ? ("down" as const) : ("up" as const),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Total Customers",
      value: summaryLoading ? "…" : String(summary?.total_customers ?? 0),
      sub: "Registered",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <AppLayout>
      <PageHeader breadcrumbs={[{ label: "StockFlow" }, { label: "Dashboard" }]} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-card border border-border rounded-md p-4 flex items-start gap-3"
              >
                <div className={cn("p-2 rounded-md flex-shrink-0", card.bg)}>
                  <Icon className={cn("w-4 h-4", card.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground font-manrope font-medium uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="font-sora font-semibold text-xl text-foreground mt-0.5 leading-tight">
                    {card.value}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] mt-1 font-manrope flex items-center gap-0.5",
                      card.trend === "up"
                        ? "text-emerald-600"
                        : card.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {card.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                    {card.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                    {card.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Low Stock Alert */}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-sora font-semibold text-sm text-foreground flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                Low Stock Alerts
              </h2>
              <Link to="/inventory" className="text-[11px] text-primary font-medium hover:underline">
                View all
              </Link>
            </div>
            <div>
              {summaryLoading ? (
                <p className="px-4 py-6 text-xs text-muted-foreground text-center">Loading…</p>
              ) : lowStockItems.length === 0 ? (
                <p className="px-4 py-6 text-xs text-muted-foreground text-center">
                  All items are adequately stocked.
                </p>
              ) : (
                lowStockItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 text-xs font-manrope",
                      i < lowStockItems.length - 1 && "border-b border-border"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground text-[11px]">SKU: {item.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {item.stock} / {item.reorderPoint} units
                      </span>
                      <StatusBadge status="low_stock" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-sora font-semibold text-sm text-foreground flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                Recent Orders
              </h2>
              <Link to="/orders" className="text-[11px] text-primary font-medium hover:underline">
                View all
              </Link>
            </div>
            <div>
              {ordersLoading ? (
                <p className="px-4 py-6 text-xs text-muted-foreground text-center">Loading…</p>
              ) : recentOrders.length === 0 ? (
                <p className="px-4 py-6 text-xs text-muted-foreground text-center">No orders yet.</p>
              ) : (
                recentOrders.map((order, i) => (
                  <div
                    key={order.id}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 text-xs font-manrope",
                      i < recentOrders.length - 1 && "border-b border-border"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{order.orderNumber}</p>
                      <p className="text-muted-foreground text-[11px]">{order.customer}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Inventory Overview Table */}
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-sora font-semibold text-sm text-foreground">Inventory Overview</h2>
            <Link to="/inventory" className="text-[11px] text-primary font-medium hover:underline">
              Manage inventory →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-manrope">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">SKU</th>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                  <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Price</th>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {summaryLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">Loading…</td>
                  </tr>
                ) : lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">No low stock items.</td>
                  </tr>
                ) : (
                  lowStockItems.map((product) => {
                    const isLow = product.stock < product.reorderPoint;
                    return (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2 font-medium text-foreground">{product.name}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden sm:table-cell">{product.sku}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">{product.category}</td>
                        <td className="px-4 py-2 text-right font-medium text-foreground">{product.stock}</td>
                        <td className="px-4 py-2 text-right text-muted-foreground hidden sm:table-cell">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-2"><StatusBadge status={isLow ? "low_stock" : "in_stock"} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
