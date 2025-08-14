import React, { useEffect, useState } from "react";
import { ChevronRight, Menu as MenuIcon, X, LogIn, LogOut, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMenu } from "@/core/menu/useMenu";
import { useAuthStore } from "@/core/auth/auth.store";

const Sidebar: React.FC = () => {
  const menuItems = useMenu();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState<boolean>(() => localStorage.getItem("sidebarOpen") !== "false");
  const { token, logout } = useAuthStore();

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(isOpen));
  }, [isOpen]);

  const activePath = location.pathname;
  const isActive = (path: string) => activePath === path || activePath.startsWith(path + "/");

  return (
    <aside
      role="navigation"
      aria-label="Navigation principale"
      className={`${isOpen ? "w-64" : "w-16"}
                  sticky top-0 h-screen shrink-0
                  bg-gray-900 text-white border-r border-gray-800
                  transition-[width] duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="h-14 px-3 border-b border-gray-800 flex items-center justify-between">
        {isOpen && <h1 className="text-lg font-bold truncate">VTC Manager</h1>}
        <button
          onClick={() => setIsOpen(v => !v)}
          className="p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Basculer la barre latérale"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu scrollable */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon: React.ElementType = item.icon ?? ChevronRight;
            const active = isActive(item.path);

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  title={!isOpen ? item.label : undefined}
                  className={[
                    "w-full group flex items-center gap-3 px-3 py-2 rounded-md",
                    "transition-colors duration-200 text-left",
                    active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.locked && !token && (
                        <Lock className="w-4 h-4 text-amber-300/80" aria-label="Accès restreint" />
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        {token ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Login
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
