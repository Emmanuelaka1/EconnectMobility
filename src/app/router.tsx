import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/core/auth/auth.store";

// ✅ AppShell = Sidebar + Topbar (nouveau layout)
import AppShell from "@/components/layout/AppShell";

// ✅ Tes pages
import Login from "@/features/auth/Login";
import Recettes from "@/features/recettes/pages/Recettes";
import Voitures from "@/features/voitures/pages/Voitures";
import Operations from "@/features/dashboard/pages/Operations";
import Documents from "@/features/dashboard/pages/Documents";
import Weeks from "@/features/dashboard/pages/Weeks";
import Dashboard from "@/features/dashboard/pages/Dashboard";


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
            <Dashboard />
          </Protected>
        )
      },
      { path: "recettes", element: (
          <Protected>
            <Recettes />
          </Protected>
        )
      },
      { path: "voitures", element: (
          <Protected>
            <Voitures />
          </Protected>
        )
      },
      { path: "operations", element: (
          <Protected>
            <Operations />
          </Protected>
        )
      },
      { path: "weeks", element: (
          <Protected>
            <Weeks />
          </Protected>
        )
      },
      { path: "documents", element: (
          <Protected>
            <Documents />
          </Protected>
        )
      },
    ],
  },

  { path: "*", element: <div>404</div> },
]);

export default AppRouter;