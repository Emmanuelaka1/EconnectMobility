import { useMemo } from "react";
import { MENU_CONFIG } from "./menu.config";
import type { MenuItem, PermissionKey } from "./types";
import { useAuthStore } from "@/core/auth/auth.store";

function hasPerm(userPerms: string[] | undefined, required?: PermissionKey[]) {
  if (!required || required.length === 0) return true;
  if (!userPerms) return false;
  return required.every((p) => userPerms.includes(p));
}

function hasRole(userRole: string | undefined, allowed?: string[]) {
  if (!allowed || allowed.length === 0) return true;
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export function useMenu() {
  const { role, permissions, token } = useAuthStore((s) => ({
    role: s.user?.role,
    permissions: [ "MENU_DASHBOARD", "MENU_VOITURES_READ",
      "MENU_RECETTES_READ","MENU_OPERATIONS_READ","MENU_SEMAINES_READ",
      "MENU_DOCUMENTS_READ","MENU_ANALYTICS_READ"],//s.user?.permissions,
    token: s.token,
  }));

  // Menu visible en mode invité (pas de filtrage)
  if (!token) return MENU_CONFIG;
  const items = useMemo<MenuItem[]>(() => {
    return MENU_CONFIG.filter((item) => hasPerm(permissions, item.permissions) && hasRole(role, item.roles));
  }, [role, permissions]);

  return items;
}
