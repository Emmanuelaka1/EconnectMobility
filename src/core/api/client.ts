import { http } from "./http";

export interface ResponseDto<T = any> {
  statut: boolean;
  message: string;
  data?: T;
}

export async function get<T>(url: string, params?: Record<string, any>) {
  const res = await http.get<ResponseDto<T>>(url, { params });
  if (!res.data.statut) throw new Error(res.data.message || "Erreur API");
  return res.data.data as T;
}

export async function post<T>(url: string, body?: any) {
  const res = await http.post<ResponseDto<T>>(url, body);
  if (!res.data.statut) throw new Error(res.data.message || "Erreur API");
  return res.data.data as T;
}

export async function put<T>(url: string, body?: any) {
  const res = await http.put<ResponseDto<T>>(url, body);
  if (!res.data.statut) throw new Error(res.data.message || "Erreur API");
  return res.data.data as T;
}

export async function del<T>(url: string) {
  const res = await http.delete<ResponseDto<T>>(url);
  if (!res.data.statut) throw new Error(res.data.message || "Erreur API");
  return res.data.data as T;
}
