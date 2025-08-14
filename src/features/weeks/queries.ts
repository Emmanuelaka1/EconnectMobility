import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../core/api/client";

export type WeekDto = {
  id?: string;
  weekNumber: number;
  year: number;
  startDate: string; // ISO string (yyyy-MM-dd)
  endDate: string;   // ISO string (yyyy-MM-dd)
};

export function useWeeks(params: { startDate: string; endDate: string }) {
  return useQuery({
    queryKey: ["weeks", params],
    queryFn: () => get<WeekDto[]>("/weeks/findByDate", params),
    staleTime: 60_000,
  });
}

export function useSaveWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WeekDto) => post<WeekDto>("/weeks/saveWeek", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeks"] }),
  });
}

export function useUpdateWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WeekDto) => put<WeekDto>("/weeks/updateWeek", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeks"] }),
  });
}

export function useDeleteWeek() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del<void>(`/weeks/deleteWeek/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeks"] }),
  });
}
