import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../core/api/client";
import { useVoitures } from "../../features/voitures/queries";
import { useWeeks } from "../../features/weeks/queries";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

type Operation = { id?: number; date: string; type: string; amount: number; carRef?: string };
type Recette = { id?: number; date: string; montant: number; carRef: string };

function formatISO(d: Date) { return d.toISOString().slice(0,10); }
function toDate(s: string) { return new Date(s + "T00:00:00"); }

export default function DashboardAddons() {
  // default range: last 30 days
  const today = new Date();
  const startDefault = new Date(today); startDefault.setDate(today.getDate() - 30);
  const [selectedCarRef, setSelectedCarRef] = React.useState<string>("all");
  const [selectedWeekId, setSelectedWeekId] = React.useState<string | "all">("all");
  const [startDate, setStartDate] = React.useState(formatISO(startDefault));
  const [endDate, setEndDate] = React.useState(formatISO(today));

  // cars for filter
  const cars = useVoitures();

  // weeks for filter (load a wider window so dropdown is useful)
  const weeks = useWeeks({ startDate: formatISO(new Date(today.getFullYear(), today.getMonth()-3, 1)), endDate: formatISO(today) });

  // If a week is selected, override start/end
  React.useEffect(() => {
    if (selectedWeekId !== "all") {
      const w = (weeks.data ?? []).find(w => (w.id ?? `${w.weekNumber}-${w.year}`) === selectedWeekId);
      if (w) {
        setStartDate(w.startDate);
        setEndDate(w.endDate);
      }
    }
  }, [selectedWeekId, weeks.data]);

  // Fetch base datasets
  const recettes = useQuery({
    queryKey: ["addons-recettes"],
    queryFn: () => get<Recette[]>("/recettes/getAllRecettes"),
    staleTime: 60_000,
  });

  const operations = useQuery({
    queryKey: ["addons-operations"],
    queryFn: () => get<Operation[]>("/operations/findByType", {} as any).catch(async () => {
      // Fallback: try to get all operations if /findByType requires params or doesn't exist
      return get<Operation[]>("/operations/getAllOperations");
    }),
    staleTime: 60_000,
  });

  // Client-side filtering
  const inRange = React.useCallback((iso: string) => {
    const d = toDate(iso);
    return d >= toDate(startDate) && d <= toDate(endDate);
  }, [startDate, endDate]);

  const filteredRecettes = React.useMemo(() => {
    let list = recettes.data ?? [];
    if (selectedCarRef !== "all") list = list.filter(r => r.carRef === selectedCarRef);
    return list.filter(r => inRange(r.date));
  }, [recettes.data, selectedCarRef, inRange]);

  const filteredOps = React.useMemo(() => {
    let list = operations.data ?? [];
    if (selectedCarRef !== "all") list = list.filter(o => o.carRef === selectedCarRef);
    return list.filter(o => inRange(o.date));
  }, [operations.data, selectedCarRef, inRange]);

  // Aggregate ops by type for donut
  const donutData = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const o of filteredOps) {
      const key = o.type || "Autres";
      map.set(key, (map.get(key) ?? 0) + (o.amount ?? 0));
    }
    return Array.from(map.entries()).map(([type, total]) => ({ type, total }));
  }, [filteredOps]);

  // CSV helpers
  function downloadCSV(filename: string, rows: any[]) {
    const csv = [Object.keys(rows[0] ?? {}).join(","), ...rows.map(r => Object.values(r).map(v => typeof v === "string" ? `"${v.replace(/"/g,'"')}"` : v).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportRecettesCSV() {
    const rows = filteredRecettes.map(r => ({
      id: r.id ?? "",
      date: r.date,
      carRef: r.carRef,
      montant: r.montant,
    }));
    downloadCSV(`recettes_${startDate}_${endDate}${selectedCarRef!=="all" ? "_"+selectedCarRef : ""}.csv`, rows);
  }

  function exportOperationsCSV() {
    const rows = filteredOps.map(o => ({
      id: o.id ?? "",
      date: o.date,
      type: o.type,
      amount: o.amount,
      carRef: o.carRef ?? "",
    }));
    downloadCSV(`operations_${startDate}_${endDate}${selectedCarRef!=="all" ? "_"+selectedCarRef : ""}.csv`, rows);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm">Voiture</label>
          <select className="border rounded px-3 py-2 w-full" value={selectedCarRef} onChange={(e) => setSelectedCarRef(e.target.value)}>
            <option value="all">Toutes</option>
            {(cars.data ?? []).map(c => (
              <option key={c.id ?? c.ref} value={c.ref}>{c.ref} — {c.marque} {c.modele}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm">Semaine</label>
          <select className="border rounded px-3 py-2 w-full" value={selectedWeekId} onChange={(e) => setSelectedWeekId(e.target.value as any)}>
            <option value="all">Toutes (plage libre)</option>
            {(weeks.data ?? []).map((w) => (
              <option key={w.id ?? `${w.weekNumber}-${w.year}`} value={w.id ?? `${w.weekNumber}-${w.year}`}>
                S{w.weekNumber}-{w.year} ({w.startDate} → {w.endDate})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <div className="hidden md:block text-xs opacity-70">Plage</div>
          <input type="date" className="border rounded px-2 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>→</span>
          <input type="date" className="border rounded px-2 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <a href="/recettes" className="px-4 py-2 rounded-xl border">Mes recettes</a>
        <a href="/operations" className="px-4 py-2 rounded-xl border">Mes charges</a>
        <a href="/voitures" className="px-4 py-2 rounded-xl border">Mes véhicules</a>
        <a href="/documents" className="px-4 py-2 rounded-xl border">Documents</a>
        <a href="/weeks" className="px-4 py-2 rounded-xl border">Semaines</a>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={exportRecettesCSV} className="px-4 py-2 rounded bg-black text-white">Exporter Recettes (CSV)</button>
        <button onClick={exportOperationsCSV} className="px-4 py-2 rounded bg-black text-white">Exporter Opérations (CSV)</button>
      </div>

      {/* Donut chart */}
      <div className="rounded-xl border p-4 h-80">
        <div className="mb-2 font-medium">Répartition des dépenses (filtrée)</div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={donutData} dataKey="total" nameKey="type" outerRadius={120} label>
              {donutData.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
