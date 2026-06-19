import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyLine = (): LineItem => ({ productId: "", productName: "", unitPrice: 0, quantity: 1 });

export default function CreateOrderModal({ open, onClose, onSuccess }: CreateOrderModalProps) {
  const { data: apiProducts } = useProducts();
  const { data: apiCustomers } = useCustomers();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const [customerId, setCustomerId] = useState("");
  const [customerError, setCustomerError] = useState("");
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [lineErrors, setLineErrors] = useState<string[]>([""]);

  useEffect(() => {
    if (open) {
      setCustomerId("");
      setCustomerError("");
      setLines([emptyLine()]);
      setLineErrors([""]);
    }
  }, [open]);

  const grandTotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const handleSelectProduct = (index: number, productId: string) => {
    const product = (apiProducts ?? []).find((p) => String(p.id) === productId);
    if (!product) return;
    const updated = [...lines];
    updated[index] = { ...updated[index], productId, productName: product.name, unitPrice: Number(product.price) };
    setLines(updated);
    const errs = [...lineErrors];
    errs[index] = "";
    setLineErrors(errs);
  };

  const handleQtyChange = (index: number, qty: string) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], quantity: Math.max(1, parseInt(qty) || 1) };
    setLines(updated);
  };

  const addLine = () => {
    setLines([...lines, emptyLine()]);
    setLineErrors([...lineErrors, ""]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
    setLineErrors(lineErrors.filter((_, i) => i !== index));
  };

  const validate = () => {
    let valid = true;
    if (!customerId) {
      setCustomerError("Please select a customer");
      valid = false;
    } else {
      setCustomerError("");
    }
    const errs = lines.map((line) => {
      if (!line.productId) { valid = false; return "Please select a product"; }
      return "";
    });
    setLineErrors(errs);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createOrder.mutateAsync({
        customer_id: Number(customerId),
        items: lines.map((l) => ({ product_id: Number(l.productId), quantity: l.quantity })),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? "Failed to create order.";
      toast({
        description: <span className="text-xs font-manrope text-red-500">{detail}</span>,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-2xl bg-card border border-border shadow-2xl rounded-lg p-0 overflow-hidden max-h-[90vh] flex flex-col"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
          <DialogTitle className="font-sora font-semibold text-sm text-foreground">
            Create New Order
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Customer */}
          <div className="space-y-1">
            <Label className="text-xs font-manrope font-medium text-foreground">Customer</Label>
            <Select value={customerId} onValueChange={(v) => { setCustomerId(v); setCustomerError(""); }}>
              <SelectTrigger className={cn("h-8 text-xs font-manrope border", customerError ? "border-red-500" : "border-input")}>
                <SelectValue placeholder="Select customer…" />
              </SelectTrigger>
              <SelectContent>
                {(apiCustomers ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-xs font-manrope">
                    {c.full_name} — {c.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {customerError && <p className="text-[11px] text-red-500 font-manrope">{customerError}</p>}
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-manrope font-medium text-foreground">Order Items</Label>
              <button
                type="button"
                onClick={addLine}
                className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-12 gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-t-md text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1" />
            </div>

            <div className="border border-t-0 border-border rounded-b-md overflow-hidden">
              {lines.map((line, index) => (
                <div key={index}>
                  <div className="grid grid-cols-12 gap-2 px-2 py-2 items-center border-t border-border first:border-t-0">
                    <div className="col-span-5">
                      <Select value={line.productId} onValueChange={(v) => handleSelectProduct(index, v)}>
                        <SelectTrigger className={cn("h-7 text-xs font-manrope border", lineErrors[index] ? "border-red-500" : "border-input")}>
                          <SelectValue placeholder="Select product…" />
                        </SelectTrigger>
                        <SelectContent>
                          {(apiProducts ?? []).map((p) => (
                            <SelectItem key={p.id} value={String(p.id)} className="text-xs font-manrope">
                              {p.name} (stock: {p.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 text-right text-xs font-manrope text-muted-foreground">
                      ${line.unitPrice.toFixed(2)}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => handleQtyChange(index, e.target.value)}
                        className="h-7 text-xs font-manrope text-right border-input"
                      />
                    </div>
                    <div className="col-span-2 text-right text-xs font-semibold font-manrope text-foreground">
                      ${(line.unitPrice * line.quantity).toFixed(2)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                        className="p-1 rounded text-muted-foreground hover:text-red-500 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {lineErrors[index] && (
                    <p className="px-2 pb-1.5 text-[11px] text-red-500 font-manrope">{lineErrors[index]}</p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-12 gap-2 px-2 py-2.5 border-t-2 border-border bg-muted/30">
                <div className="col-span-9 text-right text-xs font-semibold font-manrope text-foreground uppercase tracking-wide">
                  Grand Total
                </div>
                <div className="col-span-2 text-right text-sm font-bold font-sora text-primary">
                  ${grandTotal.toFixed(2)}
                </div>
                <div className="col-span-1" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-5 py-4 border-t border-border flex-shrink-0 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs font-manrope h-8">
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={createOrder.isPending}
            className="text-xs font-manrope h-8 bg-primary hover:bg-primary/90"
          >
            {createOrder.isPending ? "Creating…" : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
