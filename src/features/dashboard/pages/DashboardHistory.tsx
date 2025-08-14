import React from "react";
import MonthTabs from "../components/MonthTabs";
import { useQuery } from "@tanstack/react-query";
// ⚠️ si l'alias "@" n'est pas configuré, remplace par: "../../../core/api/client"
import { get } from "@/core/api/client";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

// ---- Types API
type Car = {
  id?: number;
  ref?: string;
  referenceCar?: string;
  marque?: string;
  modele?: string;
  prixAchat?: number;
};
type Recette = { id?: number; date: string; carRef?: string; montant?: number };
type Operation = { id?: number; date: string; type?: string; amount?: number; carRef?: string };
type ResponseDto<T> = { statut: boolean; message: string; data: T };

// ---- Aide sécurisée pour extraire un array de ResponseDto
function unwrapArray<T>(resp: ResponseDto<T[]> | undefined): T[] {
  return Array.isArray(resp?.data) ? resp!.data : [];
}

// ---- Optionnel (ex. si tu veux des courbes)
type HistoryItem = { date: string; recettes: number; charges?: number; reparations?: number };
function toChart(items: HistoryItem[]) {
  const labels = items.map((i) => i.date);
  const recettes = items.map((i) => i.recettes ?? 0);
  const charges = items.map((i) => i.charges ?? 0);
  const reparations = items.map((i) => i.reparations ?? 0);
  return { labels, recettes, charges, reparations };
}

// ---- Outils de période
function monthDateRange(year: number, monthIndex: number) {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

export default function DashboardHistory() {
  const now = new Date();
  const [month, setMonth] = React.useState(now.getMonth());
  const [year, setYear] = React.useState(now.getFullYear());
  const [selectedCar, setSelectedCar] = React.useState<string | "all">("all");

  const { start, end } = monthDateRange(year, month);

  // ---- Queries (⚠️ on passe les query params dans "params")
  const carsQ = useQuery({
    queryKey: ["cars"],
    queryFn: () => get<ResponseDto<Car[]>>("/cars/getAllCars"),
    staleTime: 300_000,
  });

  const recettesQ = useQuery({
    queryKey: ["recettes-month", start, end],
    queryFn: () =>
      get<ResponseDto<Recette[]>>("/recettes/getAllRecettes", {
        params: { dateStart: start, dateEnd: end },
      }),
  });

  const operationsQ = useQuery({
    queryKey: ["operations-month", start, end],
    queryFn: () =>
      get<ResponseDto<Operation[]>>("/operations/getAllOperations", {
        params: { dateStart: start, dateEnd: end },
      }),
  });

  // ---- Données unwrap (évite "object is not iterable")
  const cars = unwrapArray<Car>(carsQ.data);
  const recettes = unwrapArray<Recette>(recettesQ.data);
  const operations = unwrapArray<Operation>(operationsQ.data);

  // ---- Options de sélection véhicule
  const carOptions = React.useMemo(() => {
    return [{ label: "Tous les véhicules", value: "all" as const }].concat(
      cars.map((c) => ({
        label: `${c.referenceCar || c.ref} — ${c.marque ?? ""} ${c.modele ?? ""}`.trim(),
        value: String(c.referenceCar || c.ref || c.id),
      }))
    );
  }, [cars]);

  // ---- Agrégation
  type Bucket = { recettes: number; charges: number; reparations: number; gain: number; prixAchat?: number };
  const perCar: Record<string, Bucket> = {};
  const carKey = (r: { carRef?: string }) => String(r.carRef || "unknown");

  for (const r of recettes) {
    if (!r.montant) continue;
    const key = carKey(r);
    perCar[key] = perCar[key] || { recettes: 0, charges: 0, reparations: 0, gain: 0 };
    perCar[key].recettes += r.montant;
  }

  for (const op of operations) {
    if (!op.amount) continue;
    const key = carKey(op);
    perCar[key] = perCar[key] || { recettes: 0, charges: 0, reparations: 0, gain: 0 };
    const t = (op.type || "").toLowerCase();
    if (t.includes("repar") || t.includes("répar")) perCar[key].reparations += op.amount;
    else perCar[key].charges += op.amount;
  }

  // prix d'achat + gain
  for (const c of cars) {
    const key = String(c.referenceCar || c.ref || c.id || "unknown");
    if (!perCar[key]) perCar[key] = { recettes: 0, charges: 0, reparations: 0, gain: 0 };
    perCar[key].prixAchat = c.prixAchat;
    perCar[key].gain = perCar[key].recettes - perCar[key].charges - perCar[key].reparations;
  }

  // ---- Totaux + filtre
  const keys = Object.keys(perCar);
  const filteredKeys = selectedCar === "all" ? keys : keys.filter((k) => k === selectedCar);

  const total = filteredKeys.reduce(
    (acc, k) => {
      const b = perCar[k];
      acc.recettes += b.recettes;
      acc.charges += b.charges;
      acc.reparations += b.reparations;
      acc.gain += b.gain;
      return acc;
    },
    { recettes: 0, charges: 0, reparations: 0, gain: 0 }
  );

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
          {carOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="text-sm opacity-70">
          Période: {start} → {end}
        </div>
      </div>

      {/* Résumé global */}
      <div className="rounded-xl border p-4">
        <div className="text-sm opacity-70">Tous les véhicules</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="opacity-70 text-sm">Gain</div>
            <div className="text-xl font-semibold">{(total.gain || 0).toLocaleString()} FCFA</div>
          </div>
          <div>
            <div className="opacity-70 text-sm">Recettes</div>
            <div className="text-xl font-semibold">{(total.recettes || 0).toLocaleString()} FCFA</div>
          </div>
          <div>
            <div className="opacity-70 text-sm">Charges</div>
            <div className="text-xl font-semibold">{(total.charges || 0).toLocaleString()} FCFA</div>
          </div>
          <div>
            <div className="opacity-70 text-sm">Réparations</div>
            <div className="text-xl font-semibold">{(total.reparations || 0).toLocaleString()} FCFA</div>
          </div>
        </div>
      </div>

      {/* Cards par voiture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredKeys.map((k) => {
          const car = cars.find((c) => String(c.referenceCar || c.ref || c.id) === k);
          const b = perCar[k];
          const reste = (b.prixAchat ?? 0) - b.gain;
          const label = car ? car.referenceCar || car.ref || "—" : k;

          const ratio = b.prixAchat ? Math.max(0, Math.min(100, (b.gain / b.prixAchat) * 100)) : 0;

          return (
            <div key={k} className="rounded-xl border p-4">
              <div className="text-orange-600 font-semibold mb-1">{label}</div>
              {b.prixAchat != null && (
                <div className="text-sm">
                  Achat <span className="font-semibold">{b.prixAchat.toLocaleString()} FCFA</span>
                </div>
              )}
              <div className="text-sm">
                Gain <span className="font-semibold text-green-600">{b.gain.toLocaleString()} FCFA</span>
              </div>
              <div className="text-sm">
                Reste <span className="font-semibold text-red-600">{reste.toLocaleString()} FCFA</span>
              </div>
              <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${ratio}%` }} />
              </div>
              <div className="text-xs opacity-70 mt-1">
                {b.prixAchat ? `${ratio.toFixed(1)}% remboursé` : "—"}
              </div>
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
              {donutData.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
