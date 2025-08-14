import { create } from "zustand";

export type User = {
  id?: number | string;
  name?: string;
  role?: string;
  permissions?: string[];
  username?: string | null;
};

interface AuthState {
  token?: string | null;
  refreshToken?: string | null;
  user?: User | null;
  username?: string | null;
  setToken: (token?: string | null, refreshToken?: string | null) => void;
  setUser: (user?: User | null) => void;
  setUsername: (username?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: undefined,
  refreshToken: undefined,
  user: undefined,
  username: undefined,
  setToken: (token, refreshToken) => set({ token, refreshToken }),
  setUser: (user) => set({ user }),
  setUsername: (username) => set({ username }),
  logout: () => set({ token: null, refreshToken: null, user: null }),
}));
