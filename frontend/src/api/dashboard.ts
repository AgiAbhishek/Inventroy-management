import api from "@/lib/axios";
import type { ApiDashboardSummary } from "@/types/api";

export const fetchDashboardSummary = (): Promise<ApiDashboardSummary> =>
  api.get<ApiDashboardSummary>("/dashboard/summary").then((r) => r.data);
