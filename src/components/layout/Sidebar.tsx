import React, { useEffect, useState } from "react";
import { ChevronRight, Menu as MenuIcon, X, LogIn, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "@/core/menu/useMenu";
import { useAuthStore } from "@/core/auth/auth.store";

const Sidebar: React.FC = () => {
  const menuItems = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(() => localStorage.getItem("sidebarOpen") !== "false");
  const activePath = location.pathname;

  const { token, logout } = useAuthStore();

  useEffect(() => { localStorage.setItem("sidebarOpen", String(isOpen)); }, [isOpen]);

  return (
    <div className={`${isOpen ? "w-64" : "w-16"} bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">VTC Manager</h1>}
        <button onClick={() => setIsOpen((v) => !v)} className="p-2 rounded-lg hover:bg-gray-700" aria-label="Basculer la barre latérale">
          {isOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4" aria-label="Navigation principale">
      
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon as any;
            const isActive = activePath === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full group flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                    ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        {token ? (
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4"/> Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4"/> Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
