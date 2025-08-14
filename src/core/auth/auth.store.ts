import { create } from "zustand";

export type User = {
  id?: number | string;
  name?: string;
  role?: string;
  permissions?: string[];
  username?: string;
};

interface AuthState {
  token?: string | null;
  refreshToken?: string | null;
  user?: User | null;
  setToken: (token?: string | null, refreshToken?: string | null) => void;
  setUser: (user?: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: undefined,
  refreshToken: undefined,
  user: undefined,
  setToken: (token, refreshToken) => set({ token, refreshToken }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, refreshToken: null, user: null }),
}));
