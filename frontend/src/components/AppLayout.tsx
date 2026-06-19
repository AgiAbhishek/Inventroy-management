import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {/* Main content — offset by sidebar width on lg */}
      <div className="flex-1 lg:pl-[240px] flex flex-col min-h-screen transition-all duration-200">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[hsl(var(--sidebar-background))] border-b border-[hsl(var(--sidebar-border))]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-sora font-bold text-sm text-white">StockFlow</span>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}