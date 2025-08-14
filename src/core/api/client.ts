// src/core/api/client.ts
import type { AxiosRequestConfig } from "axios";
import { http } from "./http"; // <- garde ce chemin : ton instance axios est dans src/core/api/http.ts

// Helpers renvoyant directement response.data
export async function get<T = unknown>(url: string, config?: AxiosRequestConfig) {
  const res = await http.get<T>(url, config);
  return res.data;
}

export async function post<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
  const res = await http.post<T>(url, body, config);
  return res.data;
}

export async function put<T = unknown, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) {
  const res = await http.put<T>(url, body, config);
  return res.data;
}

export async function del<T = unknown>(url: string, config?: AxiosRequestConfig) {
  const res = await http.delete<T>(url, config);
  return res.data;
}

// Optionnel : re-export de l'instance si besoin ailleurs
export { http as client } from "./http";
