import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
import { useCreateProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a valid price"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid stock count"),
  reorderPoint: z
    .string()
    .refine((v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0), "Must be valid"),
  supplier: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-[11px] text-red-500 font-manrope mt-0.5">{message}</p> : null;

const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs font-manrope font-medium text-foreground">{label}</Label>
    {children}
    <FieldError message={error} />
  </div>
);

export default function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
  const createProduct = useCreateProduct();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await createProduct.mutateAsync({
        name: data.name,
        sku: data.sku,
        price: Number(data.price),
        quantity: Number(data.stock),
        category: data.category || null,
        reorder_point: data.reorderPoint ? Number(data.reorderPoint) : 0,
        supplier: data.supplier || null,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? "Failed to add product.";
      toast({
        description: <span className="text-xs font-manrope text-red-500">{detail}</span>,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-card border border-border shadow-2xl rounded-lg p-0 overflow-hidden"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-sora font-semibold text-sm text-foreground">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <FormField label="Product Name" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="e.g. Mechanical Keyboard"
                  className={cn("h-8 text-xs font-manrope border", errors.name ? "border-red-500" : "border-input")}
                />
              </FormField>
            </div>

            <FormField label="SKU" error={errors.sku?.message}>
              <Input
                {...register("sku")}
                placeholder="e.g. MK-001"
                className={cn("h-8 text-xs font-manrope border", errors.sku ? "border-red-500" : "border-input")}
              />
            </FormField>

            <FormField label="Category (optional)" error={errors.category?.message}>
              <Input
                {...register("category")}
                placeholder="e.g. Peripherals"
                className="h-8 text-xs font-manrope border border-input"
              />
            </FormField>

            <FormField label="Price ($)" error={errors.price?.message}>
              <Input
                {...register("price")}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={cn("h-8 text-xs font-manrope border", errors.price ? "border-red-500" : "border-input")}
              />
            </FormField>

            <FormField label="Initial Stock" error={errors.stock?.message}>
              <Input
                {...register("stock")}
                type="number"
                placeholder="0"
                className={cn("h-8 text-xs font-manrope border", errors.stock ? "border-red-500" : "border-input")}
              />
            </FormField>

            <FormField label="Reorder Point" error={errors.reorderPoint?.message}>
              <Input
                {...register("reorderPoint")}
                type="number"
                placeholder="10"
                className="h-8 text-xs font-manrope border border-input"
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Supplier (optional)" error={errors.supplier?.message}>
                <Input
                  {...register("supplier")}
                  placeholder="e.g. TechSource Inc."
                  className="h-8 text-xs font-manrope border border-input"
                />
              </FormField>
            </div>
          </div>

          <DialogFooter className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs font-manrope h-8">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || createProduct.isPending}
              className="text-xs font-manrope h-8 bg-primary hover:bg-primary/90"
            >
              {isSubmitting || createProduct.isPending ? "Saving…" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
