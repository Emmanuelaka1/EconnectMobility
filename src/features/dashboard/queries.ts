import { useQuery } from "@tanstack/react-query";
import { get } from "../../core/api/client";

export type WeeklyStat = {
  label: string;
  gain: number;
  recettes: number;
  charges: number;
  reparations: number;
};

export type VehicleStat = {
  reference: string;
  achat: number;
  gain: number;
  reste: number;
};

export type MonthlyHistory = {
  tousVehicules: {
    gain: number;
    recettes: number;
    charges: number;
    reparations: number;
  };
  parVehicule: Record<
    string,
    {
      gain: number;
      recettes: number;
      charges: number;
      reparations: number;
    }
  >;
};

export function useDashboardWeekly(params: Record<string, unknown>) {
  return useQuery({
    queryKey: ["dashboardWeekly", params],
    queryFn: () => get<WeeklyStat[]>("/dashboard/weekly", params),
    staleTime: 60_000,
  });
}

export function useDashboardVehicles() {
  return useQuery({
    queryKey: ["dashboardVehicles"],
    queryFn: () => get<VehicleStat[]>("/dashboard/vehicles"),
    staleTime: 60_000,
  });
}

export function useDashboardMonthly(month: string) {
  return useQuery({
    queryKey: ["dashboardMonthly", month],
    queryFn: () => get<MonthlyHistory>(`/dashboard/history?month=${month}`),
    staleTime: 60_000,
  });
}

