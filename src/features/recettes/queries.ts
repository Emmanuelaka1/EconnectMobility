import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, del } from "../../core/api/client";

export type RecetteDto = {
  id?: number;
  date: string;
  carRef: string;
  montant: number;
  description?: string;
};

export function useRecettes(filters: { week?: string; car?: string; date?: string }) {
  return useQuery({
    queryKey: ["recettes", filters],
    queryFn: () => get<RecetteDto[]>("/recettes/getAllRecettes", filters),
    staleTime: 60_000,
  });
}

export function useSaveRecette() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecetteDto) => post<RecetteDto>("/recettes/saveRecette", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recettes"] }),
  });
}

export function useDeleteRecette() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del<void>(`/recettes/deleteRecette/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recettes"] }),
  });
}
