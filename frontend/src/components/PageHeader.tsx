import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ breadcrumbs, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 bg-background/95 backdrop-blur-sm",
        "border-b border-border",
        "flex items-center justify-between px-4 md:px-6 h-12",
        className
      )}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs font-manrope">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            )}
            {crumb.href && i < breadcrumbs.length - 1 ? (
              <Link
                to={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={cn(
                  i === breadcrumbs.length - 1
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Action */}
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}