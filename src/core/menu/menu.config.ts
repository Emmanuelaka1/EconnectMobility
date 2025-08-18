import { Home, Car, DollarSign, CreditCard, Calendar, FileText } from "lucide-react";
import type { MenuItem } from "./types";

import Dashboard from "@/features/dashboard/pages/Dashboard";
import Voitures from "@/features/voitures/pages/Voitures";
import Recettes from "@/features/recettes/pages/Recettes";
import Operations from "@/features/dashboard/pages/Operations";
import Weeks from "@/features/dashboard/pages/Weeks";
import Documents from "@/features/dashboard/pages/Documents";


export const MENU_CONFIG: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/", component: Dashboard, permissions: ["MENU_DASHBOARD"] },
  { id: "voitures", label: "Voitures", icon: Car, path: "/voitures", component: Voitures, permissions: ["MENU_VOITURES_READ"] },
  { id: "recettes", label: "Recettes", icon: DollarSign, path: "/recettes", component: Recettes, permissions: ["MENU_RECETTES_READ"] },
  { id: "operations", label: "Opérations", icon: CreditCard, path: "/operations", component: Operations, permissions: ["MENU_OPERATIONS_READ"] },
  { id: "weeks", label: "Week", icon: Calendar, path: "/weeks", component: Weeks, permissions: ["MENU_SEMAINES_READ"] },
  { id: "documents", label: "Documents", icon: FileText, path: "/documents", component: Documents, permissions: ["MENU_DOCUMENTS_READ"] },
];
