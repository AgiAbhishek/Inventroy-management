import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import AddProductModal from "@/components/AddProductModal";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { toUiProduct } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const { data: apiProducts, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { toast } = useToast();

  const products = (apiProducts ?? []).map(toUiProduct);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
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
          <span>Product added successfully</span>
        </div>
      ),
      className: "border border-emerald-200 bg-white shadow-lg",
    });
  };

  const handleDelete = (id: string) => {
    deleteProduct.mutate(Number(id), {
      onSuccess: () =>
        toast({
          description: <span className="text-xs font-manrope">Product deleted.</span>,
        }),
      onError: (err: any) =>
        toast({
          description: (
            <span className="text-xs font-manrope text-red-500">
              {err?.response?.data?.detail ?? "Failed to delete product."}
            </span>
          ),
        }),
    });
  };

  const lowStockCount = products.filter((p) => p.stock < p.reorderPoint).length;

  return (
    <AppLayout>
      <PageHeader
        breadcrumbs={[{ label: "StockFlow", href: "/" }, { label: "Inventory" }]}
        action={
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="h-7 text-xs font-manrope bg-primary hover:bg-primary/90 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-sora font-semibold text-base text-foreground">Inventory</h1>
            <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">
              {products.length} products total
              {lowStockCount > 0 && (
                <span className="text-[#991b1b] font-semibold ml-1">· {lowStockCount} low stock</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-8 h-7 text-xs font-manrope border-input"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-manrope">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">SKU</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Reorder At</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Supplier</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2 w-8" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground">Loading…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const isLow = product.stock < product.reorderPoint;
                    return (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2">
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground sm:hidden">{product.sku}</p>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground hidden sm:table-cell font-mono text-[11px]">{product.sku}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">{product.category}</td>
                        <td className="px-4 py-2 text-right font-medium text-foreground">${product.price.toFixed(2)}</td>
                        <td className={cn("px-4 py-2 text-right font-semibold", isLow ? "text-[#991b1b]" : "text-foreground")}>
                          {product.stock}
                        </td>
                        <td className="px-4 py-2 text-right text-muted-foreground hidden sm:table-cell">{product.reorderPoint}</td>
                        <td className="px-4 py-2 text-muted-foreground hidden lg:table-cell">{product.supplier}</td>
                        <td className="px-4 py-2"><StatusBadge status={isLow ? "low_stock" : "in_stock"} /></td>
                        <td className="px-4 py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                className="text-xs font-manrope gap-2 text-red-500 focus:text-red-500"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground font-manrope">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </AppLayout>
  );
}
