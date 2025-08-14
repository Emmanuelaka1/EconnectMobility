import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/core/auth/auth.store";

// ✅ AppShell = Sidebar + Topbar (nouveau layout)
import AppShell from "@/components/layout/AppShell";

// ✅ Tes pages
import DashboardComposite from "@/features/dashboard/pages/DashboardComposite";
import Login from "@/features/auth/Login";
import RecettesPage from "@/components/VTC/VTCRecettes";
import VoituresPage from "@/components/VTC/VTCVoitures";
import OperationsPage from "@/components/VTC/VTCOperations";
import DocumentsPage from "@/components/VTC/VTCDocuments";
import WeeksPage from "@/components/VTC/VTCWeeks";


// Garde la protection pour les écrans qui nécessitent une session
const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },

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