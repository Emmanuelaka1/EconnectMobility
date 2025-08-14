import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../core/api/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useWeeks } from "../../weeks/queries";

type SeriePoint = { label: string; value: number };

function formatISO(date: Date) { return date.toISOString().slice(0,10); }

export default function DashboardPage() {
  // Fetch weeks in the last ~2 months by default
  const today = new Date();
  const start = new Date(today); start.setMonth(today.getMonth() - 2);
  const [startDate] = React.useState(formatISO(start));
  const [endDate] = React.useState(formatISO(today));

  const weeks = useWeeks({ startDate, endDate });
  const [selectedWeekId, setSelectedWeekId] = React.useState<string | "all">("all");

  // Raw API data
  const kpis = useQuery({
    queryKey: ["kpis"],
    queryFn: () => get<{ recettesTotal: number; operationsTotal: number; voituresActives: number }>("/dashboard/kpis"),
    staleTime: 60_000,
  });

  const recettesByWeek = useQuery({
    queryKey: ["recettesByWeek"],
    queryFn: () => get<SeriePoint[]>("/dashboard/recettesByWeek"),
    staleTime: 60_000,
  });

  const operationsByType = useQuery({
    queryKey: ["operationsByType"],
    queryFn: () => get<{ type: string; total: number; weekId?: string }[]>("/dashboard/operationsByType"),
    staleTime: 60_000,
  });

  // Client-side filtering if a specific week is selected
  const weekMap = new Map((weeks.data ?? []).map(w => [w.id, w]));
  const selectedWeek = selectedWeekId !== "all" ? weekMap.get(selectedWeekId as string) : null;

  const filteredSeries = React.useMemo(() => {
    const data = recettesByWeek.data ?? [];
    if (!selectedWeek) return data;
    // try to match by label containing the week number/year or an optional weekId field if present
    const labelA = `S${selectedWeek.weekNumber}-${selectedWeek.year}`;
    return data.filter(p => p.label?.includes(String(selectedWeek.weekNumber)) || p.label?.includes(labelA));
  }, [recettesByWeek.data, selectedWeek]);

  const filteredCosts = React.useMemo(() => {
    const data = operationsByType.data ?? [];
    if (!selectedWeek) return data;
    // if weekId is provided by API, filter by it; else return as-is (no-op)
    return data.filter(d => !d.weekId || d.weekId === selectedWeek.id);
  }, [operationsByType.data, selectedWeek]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Week Filter */}
      <div className="p-4 rounded-xl border flex items-end gap-3">
        <div>
          <label className="block text-sm">Semaine</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedWeekId}
            onChange={(e) => setSelectedWeekId(e.target.value as any)}
          >
            <option value="all">Toutes</option>
            {(weeks.data ?? []).map((w) => (
              <option key={w.id ?? `${w.weekNumber}-${w.year}`} value={w.id ?? `${w.weekNumber}-${w.year}`}>
                S{w.weekNumber}-{w.year} ({w.startDate} → {w.endDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs (pas filtrés — côté API agrégés) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">Recettes (mois)</div>
          <div className="text-2xl font-semibold">{kpis.data?.recettesTotal?.toLocaleString() ?? "—"} FCFA</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">Dépenses (mois)</div>
          <div className="text-2xl font-semibold">{kpis.data?.operationsTotal?.toLocaleString() ?? "—"} FCFA</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm opacity-70">Voitures actives</div>
          <div className="text-2xl font-semibold">{kpis.data?.voituresActives ?? "—"}</div>
        </div>
      </div>

      {/* Line Chart (filtered client-side) */}
      <div className="rounded-xl border p-4 h-80">
        <div className="mb-2 font-medium">Recettes par semaine</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name="Recettes" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart (filtered client-side) */}
      <div className="rounded-xl border p-4 h-80">
        <div className="mb-2 font-medium">Dépenses par type</div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filteredCosts} dataKey="total" nameKey="type" outerRadius={120} label>
              {(filteredCosts ?? []).map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
