import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
// import LoginPage from "@/features/auth/LoginPage";
// import DashboardPage from "@/features/dashboard/pages/DashboardPage";
// import RecettesPage from "@/features/recettes/pages/RecettesPage";
export const router = createBrowserRouter([
  // { path: "/login", element: <LoginPage /> },
  { path: "/", element: <AppShell />, children: [
    // { index: true, element: <DashboardPage /> },
    // { path: "recettes", element: <RecettesPage /> },
  ]},
  { path: "*", element: <div>404</div> },
]);
export default router;
