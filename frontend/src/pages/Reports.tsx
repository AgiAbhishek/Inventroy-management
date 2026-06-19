import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { products, orders } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const stockData = products.map((p) => ({
  name: p.name.length > 16 ? p.name.substring(0, 14) + "…" : p.name,
  stock: p.stock,
  reorder: p.reorderPoint,
}));

const categoryData = (() => {
  const map: Record<string, number> = {};
  products.forEach((p) => {
    map[p.category] = (map[p.category] || 0) + p.stock * p.price;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
})();

const orderStatusData = [
  { name: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#f59e0b" },
  { name: "Shipped", value: orders.filter((o) => o.status === "shipped").length, color: "#3b82f6" },
  { name: "Delivered", value: orders.filter((o) => o.status === "delivered").length, color: "#10b981" },
  { name: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "#94a3b8" },
];

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6"];

const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
const totalItems = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0);
const avgOrderValue = totalRevenue / orders.length;

const kpis = [
  { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Orders Processed", value: String(orders.length), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Units Ordered", value: String(totalItems), icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg Order Value", value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
];

export default function Reports() {
  return (
    <AppLayout>
      <PageHeader
        breadcrumbs={[
          { label: "StockFlow", href: "/" },
          { label: "Reports" },
        ]}
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 space-y-6">
        <div>
          <h1 className="font-sora font-semibold text-base text-foreground">Reports</h1>
          <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">
            Analytics overview for current period
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-card border border-border rounded-md p-4 flex items-center gap-3">
                <div className={cn("p-2 rounded-md flex-shrink-0", kpi.bg)}>
                  <Icon className={cn("w-4 h-4", kpi.color)} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-manrope font-medium uppercase tracking-wide">{kpi.label}</p>
                  <p className="font-sora font-semibold text-xl text-foreground mt-0.5">{kpi.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stock Levels Chart */}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-sora font-semibold text-sm text-foreground">Stock Levels vs Reorder Point</h2>
              <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Current unit count per product</p>
            </div>
            <div className="p-4 h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData} barGap={2} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Manrope" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "Manrope" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, fontFamily: "Manrope", border: "1px solid #e2e8f0", borderRadius: 6 }}
                  />
                  <Bar dataKey="stock" fill="#4f46e5" radius={[3, 3, 0, 0]} name="Current Stock" />
                  <Bar dataKey="reorder" fill="#e2e8f0" radius={[3, 3, 0, 0]} name="Reorder Point" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-sora font-semibold text-sm text-foreground">Order Status Distribution</h2>
              <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Breakdown by fulfillment status</p>
            </div>
            <div className="p-4 h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, fontFamily: "Manrope", border: "1px solid #e2e8f0", borderRadius: 6 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "Manrope" }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inventory Value Table */}
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-sora font-semibold text-sm text-foreground">Inventory Value by Product</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-manrope">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Unit Price</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Total Value</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const val = p.price * p.stock;
                  const totalVal = products.reduce((s, pp) => s + pp.price * pp.stock, 0);
                  const pct = totalVal > 0 ? (val / totalVal) * 100 : 0;
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-2 text-right text-muted-foreground hidden sm:table-cell">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-foreground">{p.stock}</td>
                      <td className="px-4 py-2 text-right font-semibold text-foreground">${val.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-[10px] w-8 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}