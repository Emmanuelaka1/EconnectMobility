import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MENU_CONFIG } from "@/core/menu/menu.config";
import Sidebar from "@/components/layout/Sidebar";
import Login from "@/features/auth/Login";

const Shell: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          {/* Titre dynamique optionnel */}
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            {MENU_CONFIG.map((m) => (
              <Route key={m.id} path={m.path} element={<m.component />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Shell />} />
    </Routes>
  );
};

export default AppRouter;
