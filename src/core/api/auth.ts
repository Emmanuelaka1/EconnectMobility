import { post } from "./client";

export type AuthResponse = {
  token: string;
  refreshToken: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export function authenticate(payload: LoginPayload) {
  return post<AuthResponse>("/users/authenticate", payload);
}

export function refreshToken(refreshToken: string) {
  return post<AuthResponse>("/users/refreshToken", { refreshToken });
}
