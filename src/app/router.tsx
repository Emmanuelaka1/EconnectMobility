import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "../core/auth/auth.store";
import RecettesPage from "../features/recettes/pages/RecettesPage";
import VoituresPage from "../features/voitures/pages/VoituresPage";
import OperationsPage from "../features/operations/pages/OperationsPage";
import DocumentsPage from "../features/documents/pages/DocumentsPage";
import DashboardComposite from "../features/dashboard/pages/DashboardComposite";
import WeeksPage from "../features/weeks/pages/WeeksPage";
import LoginPage from "../features/auth/LoginPage";

const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-4 p-4 border-b">
        <h1 className="font-semibold">EconnectMobility</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/">Dashboard</Link>
          <Link to="/recettes">Recettes</Link>
          <Link to="/voitures">Voitures</Link>
          <Link to="/operations">Opérations</Link>
          <Link to="/weeks">Semaines</Link>
          <Link to="/documents">Documents</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

const AppRouter = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <Protected>
        <Layout><DashboardComposite /></Layout>
      </Protected>
    ),
  },
  {
    path: "/recettes",
    element: (
      <Protected>
        <Layout><RecettesPage /></Layout>
      </Protected>
    ),
  },
  {
    path: "/voitures",
    element: (
      <Protected>
        <Layout><VoituresPage /></Layout>
      </Protected>
    ),
  },
{
  path: "/weeks",
  element: (
    <Protected>
      <Layout><WeeksPage /></Layout>
    </Protected>
  ),
},
  {
    path: "/operations",
    element: (
      <Protected>
        <Layout><OperationsPage /></Layout>
      </Protected>
    ),
  },
,{
  path: "/documents",
  element: (
    <Protected>
      <Layout><DocumentsPage /></Layout>
    </Protected>
  ),
}
]);
export default AppRouter;