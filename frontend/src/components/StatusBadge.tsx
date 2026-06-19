import { cn } from "@/lib/utils";

type StatusType =
  | "pending"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "low_stock"
  | "in_stock"
  | "out_of_stock";

const statusConfig: Record<
  StatusType,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
  },
  low_stock: {
    label: "Low Stock",
    className: "bg-[#fee2e2] text-[#991b1b] border border-red-200",
  },
  in_stock: {
    label: "In Stock",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold font-manrope tracking-wide uppercase",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}