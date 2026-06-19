import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Building2, Bell, Shield, Database } from "lucide-react";

const sections = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "data", label: "Data & Export", icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("company");
  const [companyName, setCompanyName] = useState("StockFlow Corp.");
  const [email, setEmail] = useState("admin@stockflow.io");
  const [reorderAlert, setReorderAlert] = useState(true);
  const [orderAlert, setOrderAlert] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      description: (
        <div className="flex items-center gap-2 font-manrope text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>Settings saved successfully</span>
        </div>
      ),
      className: "border border-emerald-200 bg-white shadow-lg",
    });
  };

  return (
    <AppLayout>
      <PageHeader
        breadcrumbs={[
          { label: "StockFlow", href: "/" },
          { label: "Settings" },
        ]}
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5">
        <div className="mb-5">
          <h1 className="font-sora font-semibold text-base text-foreground">Settings</h1>
          <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">
            Manage workspace configuration
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Section Nav */}
          <nav className="md:w-44 flex-shrink-0">
            <div className="bg-card border border-border rounded-md overflow-hidden">
              {sections.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-manrope font-medium transition-colors text-left",
                      i < sections.length - 1 && "border-b border-border",
                      activeSection === s.id
                        ? "bg-accent text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 bg-card border border-border rounded-md overflow-hidden">
            {activeSection === "company" && (
              <div>
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="font-sora font-semibold text-sm text-foreground">Company Information</h2>
                  <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Basic workspace details</p>
                </div>
                <div className="px-5 py-4 space-y-4 max-w-md">
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Company Name</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-8 text-xs font-manrope"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Admin Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 text-xs font-manrope"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Currency</Label>
                    <Input value="USD ($)" readOnly className="h-8 text-xs font-manrope text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Timezone</Label>
                    <Input value="UTC-5 (Eastern Time)" readOnly className="h-8 text-xs font-manrope text-muted-foreground" />
                  </div>
                  <Button onClick={handleSave} size="sm" className="h-7 text-xs font-manrope bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div>
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="font-sora font-semibold text-sm text-foreground">Notification Preferences</h2>
                  <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Configure alert triggers</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label: "Low Stock Alerts", desc: "Trigger when stock falls below reorder point", value: reorderAlert, setter: setReorderAlert },
                    { label: "New Order Notifications", desc: "Notify when a new order is created", value: orderAlert, setter: setOrderAlert },
                    { label: "Daily Digest Email", desc: "Summary of inventory activity", value: false, setter: () => {} },
                    { label: "Overdue Order Alerts", desc: "Notify for orders pending > 3 days", value: true, setter: () => {} },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-manrope font-medium text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground font-manrope">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={cn(
                          "w-9 h-5 rounded-full transition-colors relative flex-shrink-0",
                          item.value ? "bg-primary" : "bg-border"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
                            item.value ? "left-[18px]" : "left-0.5"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                  <Button onClick={handleSave} size="sm" className="mt-2 h-7 text-xs font-manrope bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div>
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="font-sora font-semibold text-sm text-foreground">Security</h2>
                  <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Access control and authentication</p>
                </div>
                <div className="px-5 py-4 space-y-4 max-w-md">
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Current Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-8 text-xs font-manrope" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-8 text-xs font-manrope" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-manrope font-medium">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-8 text-xs font-manrope" />
                  </div>
                  <Button onClick={handleSave} size="sm" className="h-7 text-xs font-manrope bg-primary hover:bg-primary/90">
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "data" && (
              <div>
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="font-sora font-semibold text-sm text-foreground">Data & Export</h2>
                  <p className="text-[11px] text-muted-foreground font-manrope mt-0.5">Export and manage workspace data</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label: "Export Inventory as CSV", desc: "Download all product records" },
                    { label: "Export Orders as CSV", desc: "Download complete order history" },
                    { label: "Full Data Backup", desc: "Export all workspace data as JSON" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-manrope font-medium text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground font-manrope">{item.desc}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs font-manrope flex-shrink-0">
                        Export
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}