import { useQuery } from "@tanstack/react-query";
import { get } from "../../core/api/client";
import { carService, recetteService } from "@/core/api/webService";
import type { CarDto, RecetteDto } from "@/core/api/dataContratDto";

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
    queryFn: async () => {
      const [carsRes, recettesRes] = await Promise.all([
        carService.getAllCars(),
        recetteService.getAllRecettes(),
      ]);
      const cars = (carsRes.data ?? []) as CarDto[];
      const recettes = (recettesRes.data ?? []) as RecetteDto[];
      const recettesByCar: Record<string, number> = {};
      recettes.forEach((r) => {
        const ref = r.car?.referenceCar;
        if (!ref) return;
        recettesByCar[ref] = (recettesByCar[ref] ?? 0) + (r.amount ?? 0);
      });
      return cars.map((car) => {
        const reference = car.referenceCar ?? "";
        const achat = car.prixAchat ?? 0;
        const gain = recettesByCar[reference] ?? 0;
        const reste = achat - gain;
        return { reference, achat, gain, reste } as VehicleStat;
      });
    },
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

