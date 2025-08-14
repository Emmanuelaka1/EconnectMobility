import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/auth/auth.store"; // si pas d'alias "@", remplace par "../../core/auth/auth.store"
import UserAvatar from "./UserAvatar";

export default function UserMenu() {
  const { user, token, logout } = useAuthStore();
  const isAuth = Boolean(token);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };
console.log("UserMenu rendered", useAuthStore());
  const fullName = user?.username ?? "Invité";
  const role = user?.role ?? "Guest";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-white/5 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserAvatar name={fullName} url={user?.avatarUrl ?? undefined} size={32} />
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-slate-100 leading-4">{fullName}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
        <svg
          className={`h-4 w-4 text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.14l3.71-3.91a.75.75 0 111.08 1.04l-4.25 4.48a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 backdrop-blur border border-white/10 shadow-2xl p-2 z-50"
        >
          <div className="px-3 py-2 text-sm text-slate-200 border-b border-white/10">
            <div className="font-semibold">Welcome {fullName.split(" ")[0]}!</div>
          </div>

          <div className="py-1">
            <Link
              to="/recettes"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <span className="inline-block h-5 w-5">📊</span>
              Suivi Recette
            </Link>

            {!isAuth && (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                <span className="inline-block h-5 w-5">🔐</span>
                Se connecter
              </Link>
            )}

            {isAuth && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-rose-300 hover:bg-rose-500/10"
              >
                <span className="inline-block h-5 w-5">↩️</span>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
