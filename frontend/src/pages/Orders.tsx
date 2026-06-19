import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import CreateOrderModal from "@/components/CreateOrderModal";
import { useOrders, useDeleteOrder } from "@/hooks/useOrders";
import { toUiOrder } from "@/types/api";
import type { Order } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const { data: apiOrders, isLoading } = useOrders();
  const deleteOrder = useDeleteOrder();
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { toast } = useToast();

  const orders: Order[] = (apiOrders ?? []).map(toUiOrder);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuccess = () => {
    toast({
      description: (
        <div className="flex items-center gap-2 font-manrope text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>Order created successfully</span>
        </div>
      ),
      className: "border border-emerald-200 bg-white shadow-lg",
    });
  };

  const handleCancel = (id: string) => {
    deleteOrder.mutate(Number(id), {
      onSuccess: () =>
        toast({ description: <span className="text-xs font-manrope">Order cancelled.</span> }),
      onError: (err: any) =>
        toast({
          description: (
            <span className="text-xs font-manrope text-red-500">
              {err?.response?.data?.detail ?? "Failed to cancel order."}
            </span>
          ),
        }),
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <AppLayout>
      <PageHeader
        breadcrumbs={[{ label: "StockFlow", href: "/" }, { label: "Orders" }]}
        action={
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-7 text-xs font-manrope bg-primary hover:bg-primary/90 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Order
          </Button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-sora font-semibold text-base text-foreground">Orders</h1>
            <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">
              {orders.length} orders total
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-8 h-7 text-xs font-manrope border-input"
              />
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["pending", "shipped", "delivered", "cancelled"] as const).map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <div key={status} className="bg-card border border-border rounded-md px-3 py-2 flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="font-sora font-semibold text-sm text-foreground">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-manrope">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Order #</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Items</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2 w-16" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">Loading…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">No orders found.</td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className={cn(
                          "border-b border-border hover:bg-muted/20 transition-colors",
                          expandedOrder === order.id ? "bg-accent/30" : ""
                        )}
                      >
                        <td className="px-4 py-2 font-mono font-semibold text-[11px] text-foreground">{order.orderNumber}</td>
                        <td className="px-4 py-2 font-medium text-foreground">{order.customer}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden sm:table-cell">{order.createdAt}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-foreground">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-2"><StatusBadge status={order.status} /></td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => toggleExpand(order.id)}
                              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
                            >
                              {expandedOrder === order.id ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem
                                  className="text-xs font-manrope gap-2 text-red-500 focus:text-red-500"
                                  onClick={() => handleCancel(order.id)}
                                >
                                  <X className="w-3 h-3" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr key={`${order.id}-expand`} className="bg-muted/10">
                          <td colSpan={7} className="px-6 py-3">
                            <div className="bg-card border border-border rounded-md overflow-hidden">
                              <div className="px-3 py-2 border-b border-border bg-muted/30">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Line Items</p>
                              </div>
                              <table className="w-full text-xs font-manrope">
                                <thead>
                                  <tr className="border-b border-border">
                                    <th className="text-left px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">Product</th>
                                    <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">Qty</th>
                                    <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">Unit Price</th>
                                    <th className="text-right px-3 py-1.5 text-[10px] font-semibold text-muted-foreground">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, i) => (
                                    <tr key={i} className="border-b border-border last:border-0">
                                      <td className="px-3 py-1.5 text-foreground font-medium">{item.productName}</td>
                                      <td className="px-3 py-1.5 text-right text-muted-foreground">{item.quantity}</td>
                                      <td className="px-3 py-1.5 text-right text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                                      <td className="px-3 py-1.5 text-right font-semibold text-foreground">
                                        ${(item.unitPrice * item.quantity).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="border-t-2 border-border bg-muted/20">
                                    <td colSpan={3} className="px-3 py-1.5 text-right font-semibold text-foreground text-[11px] uppercase tracking-wide">Total</td>
                                    <td className="px-3 py-1.5 text-right font-bold text-primary font-sora text-sm">
                                      ${order.total.toFixed(2)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-manrope">
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>

      <CreateOrderModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </AppLayout>
  );
}
