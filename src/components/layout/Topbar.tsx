import ConnectionBadge from "@/components/topbar/ConnectionBadge";
import UserMenu from "@/components/topbar/UserMenu";
import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <label htmlFor="global-search" className="sr-only">Search</label>
            <div className="hidden md:flex items-center gap-2 rounded-lg
                            bg-gray-800/70 ring-1 ring-white/10 px-3 py-2">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input id="global-search" type="search" placeholder="Search"
                className="bg-transparent placeholder-slate-500 text-slate-200 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <ConnectionBadge />
          <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
