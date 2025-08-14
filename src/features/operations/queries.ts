import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../core/api/client";

export type OperationDto = {
  id?: number;
  date: string;
  type: string;
  amount: number;
  carRef?: string;
  reference?: string;
  description?: string;
};

export function useOperations(filters: { type?: string; car?: string; dateStart?: string; dateEnd?: string }) {
  return useQuery({
    queryKey: ["operations", filters],
    queryFn: () => get<OperationDto[]>("/operations/findByType", filters),
    staleTime: 60_000,
  });
}

export function useSaveOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OperationDto) => post<OperationDto>("/operations/saveOperation", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operations"] }),
  });
}

export function useUpdateOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OperationDto) => put<OperationDto>("/operations/updateOperation", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operations"] }),
  });
}

export function useDeleteOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => del<void>(`/operations/deleteOperation/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operations"] }),
  });
}
