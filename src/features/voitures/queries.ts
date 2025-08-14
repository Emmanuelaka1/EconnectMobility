import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../core/api/client";

export type CarDto = {
  id?: number;
  ref: string;
  marque: string;
  modele: string;
  plaque: string;
  actif?: boolean;
};

export function useVoitures() {
  return useQuery({
    queryKey: ["voitures"],
    queryFn: () => get<CarDto[]>("/cars/getAllCars"),
    staleTime: 60_000,
  });
}

export function useSaveVoiture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CarDto) => post<CarDto>("/cars/saveCar", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voitures"] }),
  });
}

export function useUpdateVoiture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CarDto) => put<CarDto>("/cars/updateCar", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voitures"] }),
  });
}

export function useDeleteVoiture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del<void>(`/cars/deleteCar/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voitures"] }),
  });
}
