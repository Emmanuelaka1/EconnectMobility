import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
export default function AppShell() {
  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main><Outlet /></main>
      </div>
    </div>
  );
}
