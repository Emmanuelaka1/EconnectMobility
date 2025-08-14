import { Home, Car, DollarSign, CreditCard, Calendar, FileText, BarChart3 } from "lucide-react";
import type { MenuItem } from "./types";

import DashboardVTC from "@/components/VTC/DashboardVTC";
import VTCVoitures from "@/components/VTC/VTCVoitures";
import VTCRecettes from "@/components/VTC/VTCRecettes";
import VTCOperations from "@/components/VTC/VTCOperations";
import VTCWeeks from "@/components/VTC/VTCWeeks";
import Weeks from "@/components/Emobility/Weeks";
import VTCDocuments from "@/components/VTC/VTCDocuments";
import Charts from "@/components/Charts";
import Recettes from "@/components/Emobility/Recettes";

export const MENU_CONFIG: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/", component: DashboardVTC, permissions: ["MENU_DASHBOARD"] },
  { id: "voitures", label: "Voitures", icon: Car, path: "/voitures", component: VTCVoitures, permissions: ["MENU_VOITURES_READ"] },
  { id: "recettes", label: "Recettes", icon: DollarSign, path: "/recettes", component: VTCRecettes, permissions: ["MENU_RECETTES_READ"] },
  { id: "recettesNew", label: "RecettesNew", icon: DollarSign, path: "/recettes-new", component: Recettes, permissions: ["MENU_RECETTES_READ"] },
  { id: "operations", label: "Opérations", icon: CreditCard, path: "/operations", component: VTCOperations, permissions: ["MENU_OPERATIONS_READ"] },
  { id: "semaines", label: "Semaines", icon: Calendar, path: "/semaines", component: VTCWeeks, permissions: ["MENU_SEMAINES_READ"] },
  { id: "week", label: "Week", icon: Calendar, path: "/week", component: Weeks, permissions: ["MENU_SEMAINES_READ"] },
  { id: "documents", label: "Documents", icon: FileText, path: "/documents", component: VTCDocuments, permissions: ["MENU_DOCUMENTS_READ"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics", component: Charts, permissions: ["MENU_ANALYTICS_READ"] },
];
