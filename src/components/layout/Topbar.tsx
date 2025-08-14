import React from "react";
import ConnectionBadge from "@/components/topbar/ConnectionBadge";
import UserMenu from "@/components/topbar/UserMenu";
export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-900 border border-white/10 px-3 py-2">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input placeholder="Search properties, clientsâ€¦" className="bg-transparent placeholder-slate-500 text-slate-200 outline-none w-full" />
            </div>
          </div>
          <div className="hidden sm:block"><ConnectionBadge /></div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5"><span aria-hidden>ðŸ””</span><span className="sr-only">Notifications</span></button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
