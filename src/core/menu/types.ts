import React from "react";

export type PermissionKey =
  | "MENU_DASHBOARD"
  | "MENU_VOITURES_READ"
  | "MENU_RECETTES_READ"
  | "MENU_OPERATIONS_READ"
  | "MENU_SEMAINES_READ"
  | "MENU_DOCUMENTS_READ"
  | "MENU_ANALYTICS_READ";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  component: React.ComponentType;
  permissions?: PermissionKey[];
  roles?: string[];
}
