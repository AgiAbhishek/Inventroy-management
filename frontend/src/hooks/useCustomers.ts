import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, createCustomer, deleteCustomer } from "@/api/customers";
import type { CustomerCreatePayload } from "@/types/api";

export const CUSTOMERS_KEY = ["customers"] as const;

export function useCustomers() {
  return useQuery({ queryKey: CUSTOMERS_KEY, queryFn: fetchCustomers });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomerCreatePayload) => createCustomer(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
