import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../auth/auth.store";
import { refreshToken as apiRefresh } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const apiKey = import.meta.env.VITE_API_KEY;

export const http = axios.create({ baseURL });

// Attach tokens on every request
http.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  if (apiKey) {
    config.headers = config.headers ?? {};
    (config.headers as any)["API_KEY"] = apiKey;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  pendingRequests.push(cb);
}

function onRefreshed(newToken: string | null) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { logout, refreshToken: rToken, setTokens } = useAuthStore.getState();
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });

    // Only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (!rToken) {
        logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue request until refresh done
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(error);
            } else {
              if (originalRequest.headers) (originalRequest.headers as any)["Authorization"] = `Bearer ${newToken}`;
              originalRequest._retry = true;
              resolve(http(originalRequest));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const resp = await apiRefresh(rToken);
        setTokens(resp.token, resp.refreshToken);
        onRefreshed(resp.token);
        if (originalRequest.headers) (originalRequest.headers as any)["Authorization"] = `Bearer ${resp.token}`;
        return http(originalRequest);
      } catch (e) {
        onRefreshed(null);
        logout();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
