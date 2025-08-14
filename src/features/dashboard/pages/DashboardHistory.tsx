import React from "react";
import MonthTabs from "../components/MonthTabs";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../core/api/client";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";

type Car = { id?: number; ref?: string; referenceCar?: string; marque?: string; modele?: string; prixAchat?: number };
type Recette = { id?: number; date: string; carRef?: string; montant?: number };
type Operation = { id?: number; date: string; type?: string; amount?: number; carRef?: string };

function monthDateRange(year: number, monthIndex: number) {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));
  const toISO = (d: Date) => d.toISOString().slice(0,10);
  return { start: toISO(start), end: toISO(end) };
}

export default function DashboardHistory() {
  const now = new Date();
  const [month, setMonth] = React.useState(now.getMonth());
  const [year, setYear] = React.useState(now.getFullYear());
  const [selectedCar, setSelectedCar] = React.useState<string | "all">("all");

  const { start, end } = monthDateRange(year, month);

  const cars = useQuery({
    queryKey: ["cars"],
    queryFn: () => get<Car[]>("/cars/getAllCars"),
    staleTime: 300_000,
  });

  const recettes = useQuery({
    queryKey: ["recettes-month", start, end],
    queryFn: () => get<Recette[]>("/recettes/getAllRecettes", { dateStart: start, dateEnd: end }),
  });

  const operations = useQuery({
    queryKey: ["operations-month", start, end],
    queryFn: () => get<Operation[]>("/operations/getAllOperations", { dateStart: start, dateEnd: end }),
  });

  const carOptions = React.useMemo(() => {
    return [{ label: "Tous les véhicules", value: "all" as const }].concat(
      (cars.data ?? []).map(c => ({
        label: `${c.referenceCar || c.ref} — ${c.marque ?? ""} ${c.modele ?? ""}`.trim(),
        value: String(c.referenceCar || c.ref || c.id),
      }))
    );
  }, [cars.data]);

  // Aggregate
  type Bucket = { recettes: number; charges: number; reparations: number; gain: number; prixAchat?: number };
  const perCar: Record<string, Bucket> = {};

  const carKey = (r: {carRef?: string}) => String(r.carRef || "unknown");

  for (const r of (recettes.data ?? [])) {
    if (!r.montant) continue;
    const key = carKey(r);
    perCar[key] = perCar[key] || { recettes:0, charges:0, reparations:0, gain:0 };
    perCar[key].recettes += r.montant;
  }

  for (const op of (operations.data ?? [])) {
    if (!op.amount) continue;
    const key = carKey(op);
    perCar[key] = perCar[key] || { recettes:0, charges:0, reparations:0, gain:0 };
    const t = (op.type || "").toLowerCase();
    if (t.includes("repar") || t.includes("répar")) perCar[key].reparations += op.amount;
    else perCar[key].charges += op.amount;
  }

  // attach prixAchat if provided
  for (const c of (cars.data ?? [])) {
    const key = String(c.referenceCar || c.ref || c.id || "unknown");
    if (!perCar[key]) perCar[key] = { recettes:0, charges:0, reparations:0, gain:0 };
    perCar[key].prixAchat = c.prixAchat;
    perCar[key].gain = perCar[key].recettes - perCar[key].charges - perCar[key].reparations;
  }

  // Overall + filter by selectedCar
  const keys = Object.keys(perCar);
  const filteredKeys = selectedCar === "all" ? keys : keys.filter(k => k === selectedCar);

  const total = filteredKeys.reduce((acc, k) => {
    const b = perCar[k];
    acc.recettes += b.recettes; acc.charges += b.charges; acc.reparations += b.reparations; acc.gain += b.gain;
    return acc;
  }, { recettes:0, charges:0, reparations:0, gain:0 });

  const donutData = [
    { name: "Recettes", value: total.recettes },
    { name: "Charges", value: total.charges },
    { name: "Réparations", value: total.reparations },
  ];

  return (
    <section className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Historique mensuel</h2>

      <div className="flex items-center gap-3 flex-wrap">
        <MonthTabs value={month} onChange={setMonth} />
        <input
          type="number"
          className="border rounded px-3 py-1 w-24"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value || String(new Date().getFullYear())))}
        />
        <select
          className="border rounded px-3 py-1"
          value={selectedCar}
          onChange={(e) => setSelectedCar(e.target.value as any)}
        >
          {carOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="text-sm opacity-70">Période: {start} → {end}</div>
      </div>

      {/* Resume global */}
      <div className="rounded-xl border p-4">
        <div className="text-sm opacity-70">Tous les véhicules</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><div className="opacity-70 text-sm">Gain</div><div className="text-xl font-semibold">{(total.gain||0).toLocaleString()} FCFA</div></div>
          <div><div className="opacity-70 text-sm">Recettes</div><div className="text-xl font-semibold">{(total.recettes||0).toLocaleString()} FCFA</div></div>
          <div><div className="opacity-70 text-sm">Charges</div><div className="text-xl font-semibold">{(total.charges||0).toLocaleString()} FCFA</div></div>
          <div><div className="opacity-70 text-sm">Réparations</div><div className="text-xl font-semibold">{(total.reparations||0).toLocaleString()} FCFA</div></div>
        </div>
      </div>

      {/* Cards par voiture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredKeys.map((k) => {
          const car = (cars.data ?? []).find(c => String(c.referenceCar || c.ref || c.id) === k);
          const b = perCar[k];
          const reste = (b.prixAchat ?? 0) - (b.gain);
          const label = car ? (car.referenceCar || car.ref || "—") : k;
          return (
            <div key={k} className="rounded-xl border p-4">
              <div className="text-orange-600 font-semibold mb-1">{label}</div>
              {b.prixAchat != null && (
                <div className="text-sm">Achat <span className="font-semibold">{b.prixAchat.toLocaleString()} FCFA</span></div>
              )}
              <div className="text-sm">Gain <span className="font-semibold text-green-600">{b.gain.toLocaleString()} FCFA</span></div>
              <div className="text-sm">Reste <span className="font-semibold text-red-600">{reste.toLocaleString()} FCFA</span></div>
              <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: (b.prixAchat ? Math.min(100, (b.gain / b.prixAchat) * 100) : 0) + "%" }}></div>
              </div>
              <div className="text-xs opacity-70 mt-1">{b.prixAchat ? `${((b.gain / b.prixAchat) * 100).toFixed(1)}% remboursé` : "—"}</div>
            </div>
          );
        })}
      </div>

      {/* Donut */}
      <div className="rounded-xl border p-4 h-80">
        <div className="mb-2 font-medium">Répartition (mois)</div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} label>
              {donutData.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
