import React, { useEffect } from "react";
import { useAuthStore } from "./auth.store";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setTokens = useAuthStore((s) => s.setTokens);

  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    const r = localStorage.getItem("auth_refresh");
    if (t || r) setTokens(t, r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [token]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem("auth_refresh", refreshToken);
    else localStorage.removeItem("auth_refresh");
  }, [refreshToken]);

  return <>{children}</>;
};
