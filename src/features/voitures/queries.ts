import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../core/api/client";
import { CarDto, ResponseDto } from "@/core/api/dataContratDto";



export function useVoitures() {
  return useQuery({
    queryKey: ["voitures"],
    queryFn: () => get<ResponseDto<CarDto[]>>("/cars/getAllCars"),
    staleTime: 300_000,
  });
}

export function useSaveVoiture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CarDto) => post<ResponseDto<CarDto>>("/cars/saveCar", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["voitures"] }),
  });
}

export function useUpdateVoiture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CarDto) => put<ResponseDto<CarDto>>("/cars/updateCar", payload),
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
