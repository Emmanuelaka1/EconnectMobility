import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../core/auth/auth.store";

// ✅ AppShell = Sidebar + Topbar (nouveau layout)
import AppShell from "../components/layout/AppShell";

// ✅ Tes pages
import LoginPage from "../features/auth/LoginPage";
import DashboardComposite from "../features/dashboard/pages/DashboardComposite";
import RecettesPage from "../features/recettes/pages/RecettesPage";
import VoituresPage from "../features/voitures/pages/VoituresPage";
import OperationsPage from "../features/operations/pages/OperationsPage";
import DocumentsPage from "../features/documents/pages/DocumentsPage";
import WeeksPage from "../features/weeks/pages/WeeksPage";

// Garde la protection pour les écrans qui nécessitent une session
const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRouter = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  // ⬇️ Topbar + Sidebar visibles pour tout le monde (invité inclus)
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: (
          <Protected>
            <DashboardComposite />
          </Protected>
        )
      },
      { path: "recettes", element: (
          <Protected>
            <RecettesPage />
          </Protected>
        )
      },
      { path: "voitures", element: (
          <Protected>
            <VoituresPage />
          </Protected>
        )
      },
      { path: "operations", element: (
          <Protected>
            <OperationsPage />
          </Protected>
        )
      },
      { path: "weeks", element: (
          <Protected>
            <WeeksPage />
          </Protected>
        )
      },
      { path: "documents", element: (
          <Protected>
            <DocumentsPage />
          </Protected>
        )
      },
    ],
  },

  { path: "*", element: <div>404</div> },
]);

export default AppRouter;
